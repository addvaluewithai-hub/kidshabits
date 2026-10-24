#!/usr/bin/env node
/**
 * Future immersive-world Session 01 browser acceptance.
 * DOES NOT RUN on docs-only branch. It should FAIL a boxed/top-down/blank app
 * rather than declare a false gameplay or quality pass.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const baseUrl=process.env.ISLAND_PREVIEW_URL||'http://127.0.0.1:4173';
const out=join(process.cwd(),'artifacts','immersive');
await mkdir(out,{recursive:true});
const layouts=[
  {id:'phone-360x740',width:360,height:740,isMobile:true},
  {id:'phone-390x844',width:390,height:844,isMobile:true},
  {id:'desktop-1280x800',width:1280,height:800,isMobile:false},
];
const report={time:new Date().toISOString(),commit:process.env.GITHUB_SHA||'local',checks:[],screenshots:[],status:'RUNNING'};
let browser,hasFailure=false;

async function required(page,id) {
  const el=page.locator('[data-testid="'+id+'"]');
  await el.first().waitFor({state:'visible',timeout:20000});
  if(await el.count()!==1)throw Error('Expected exactly one '+id);
  return el;
}
async function camera(page,expected) {
  const el=await required(page,'camera-debug');
  await page.waitForFunction((rig)=>{
    const node=document.querySelector('[data-testid="camera-debug"]');
    return node?.getAttribute('data-camera-mode')==='perspective' &&
      node?.getAttribute('data-camera-rig')===rig &&
      node?.getAttribute('data-camera-settled')==='true';
  },expected,{timeout:16000});
  const y=Number(await el.getAttribute('data-camera-height'));
  if(!Number.isFinite(y)||y<.8||y>2.2)throw Error('Camera not at a plausible child-view height: '+y);
}
async function sceneSnapshot(page){
  // Test-only observer; never a command surface. Read true scene mesh/camera state.
  return page.evaluate(()=>{
    const bridge=window.__KH_CI__;
    if(!bridge||typeof bridge.snapshot!=='function')return null;
    return bridge.snapshot();
  });
}
async function canvasProof(page){
  const el=(await required(page,'world-canvas')).locator('canvas').first();
  await el.waitFor({state:'visible',timeout:20000});
  const actual=await el.screenshot({animations:'disabled',timeout:20000});
  const png=PNG.sync.read(actual);
  let opaque=0;const colors=new Set();
  for(let y=3;y<png.height;y+=9)for(let x=3;x<png.width;x+=9){
    const i=4*(y*png.width+x);
    if(png.data[i+3]>60) {
      opaque++;
      colors.add([png.data[i]>>4,png.data[i+1]>>4,png.data[i+2]>>4].join(','));
    }
  }
  if(opaque<80||colors.size<15)throw Error('Three canvas blank/flat '+JSON.stringify({opaque,colors:colors.size}));
  const gl=await page.evaluate(()=>{
    const c=document.querySelector('[data-testid="world-canvas"] canvas');
    const ctx=c?.getContext('webgl2');
    return ctx?{version:String(ctx.getParameter(ctx.VERSION))}:null;
  });
  if(!gl)throw Error('No active Three WebGL2 canvas');
  return {opaque,sampledColors:colors.size,gl};
}
async function fullscreen(page,viewport){
 const box=await (await required(page,'world-viewport')).boundingBox();
 if(!box||Math.abs(box.x)>3||Math.abs(box.y)>3||
  Math.abs(box.width-viewport.width)>4||Math.abs(box.height-viewport.height)>4) {
  throw Error('World is not truly fullscreen: '+JSON.stringify(box));
 }
 const scroll=await page.evaluate(()=>({
  x:document.documentElement.scrollWidth-innerWidth,
  y:document.documentElement.scrollHeight-innerHeight
 }));
 if(scroll.x>3||scroll.y>3)throw Error('Unexpected page scroll in child world: '+JSON.stringify(scroll));
}
async function photo(page,name){
 await page.screenshot({path:join(out,name),animations:'disabled',fullPage:false});
 report.screenshots.push(name);
}
async function change(page,kind,before){
 const label=await required(page,kind+'-change');
 if(!(await label.getAttribute('data-state')) && !(await label.innerText()).trim())throw Error('No '+kind+' feedback');
 const after=await sceneSnapshot(page);
 if(!before||!after||!before.objects||!after.objects)throw Error('Missing read-only scene object evidence');
 if(JSON.stringify(before.objects[kind])===JSON.stringify(after.objects[kind]))throw Error('Only UI changed; actual '+kind+' Three scene did not');
 if((await required(page,'nova-actor')).getAttribute('data-focus')!==kind) {
  const focus=await (await required(page,'nova-actor')).getAttribute('data-focus');
  if(focus!==kind)throw Error('Nova not focused on '+kind);
 }
 return after;
}
try{
 browser=await chromium.launch({headless:true,...(process.env.CI?{channel:'chrome'}:{})});
 for(const viewport of layouts){
  const context=await browser.newContext({
    viewport:{width:viewport.width,height:viewport.height},
    isMobile:viewport.isMobile,hasTouch:viewport.isMobile,
    deviceScaleFactor:1,reducedMotion:'reduce',locale:'ar-EG'
  });
  const page=await context.newPage();
  page.setDefaultTimeout(17000);
  const check={viewport:viewport.id,ok:false,stage:'load'};
  report.checks.push(check);
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e.stack||e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  try {
    const res=await page.goto(baseUrl+'/?ci=1',{waitUntil:'domcontentloaded',timeout:35000});
    if(!res?.ok())throw Error('Failed HTTP '+res?.status());
    await fullscreen(page,viewport);
    await camera(page,'arrival_path');
    check.canvas=await canvasProof(page);
    await required(page,'nova-actor');
    await photo(page,viewport.id+'-arrival.png');
    check.stage='cottage';
    const before=await sceneSnapshot(page);
    await (await required(page,'cottage-hotspot')).click();
    await camera(page,'cottage_front');
    const afterCottage=await change(page,'cottage',before);
    await photo(page,viewport.id+'-cottage.png');
    check.stage='garden';
    await (await required(page,'garden-hotspot')).click();
    await camera(page,'garden_edge');
    await change(page,'garden',afterCottage);
    await photo(page,viewport.id+'-garden.png');
    check.stage='reload';
    await page.reload({waitUntil:'domcontentloaded'});
    await fullscreen(page,viewport);
    await camera(page,'arrival_path');
    await required(page,'cottage-change');
    await required(page,'garden-change');
    const speech=(await (await required(page,'nova-dialogue')).innerText()).trim();
    if(!speech||speech.includes('أخيرًا وصلنا'))throw Error('Nova did not remember persisted world');
    await canvasProof(page);
    await photo(page,viewport.id+'-reload.png');
    if(errors.length)throw Error('Browser errors: '+JSON.stringify(errors));
    check.stage='complete';check.ok=true;
  }catch(e){
    hasFailure=true;
    check.error=String(e.stack||e);check.browserErrors=errors;
    console.error('FAIL '+viewport.id+' '+check.stage,check.error,errors);
    try{await photo(page,viewport.id+'-failure.png')}catch{}
  }finally{await context.close()}
 }
}catch(e){hasFailure=true;report.setupError=String(e.stack||e)}
finally{
 report.status=hasFailure?'FAIL':'PASS';
 await writeFile(join(out,'ci-result.json'),JSON.stringify(report,null,2));
 if(browser)await browser.close();
}
if(hasFailure)process.exitCode=1;
