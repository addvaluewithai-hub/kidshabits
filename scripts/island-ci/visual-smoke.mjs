#!/usr/bin/env node
/**
 * Compare real built Phaser and Three.js apps on phone and desktop.
 * Every shot comes from the executing canvas. Never use a fixture screenshot.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const output=join(process.cwd(),'artifacts','island');
const baseUrl=process.env.ISLAND_PREVIEW_URL||'http://127.0.0.1:4173';
await mkdir(output,{recursive:true});
const viewports=[
 {id:'phone-390x844',width:390,height:844,isMobile:true,deviceScaleFactor:1},
 {id:'desktop-1280x800',width:1280,height:800,isMobile:false,deviceScaleFactor:1},
];
const engines=['three','phaser'];
const evidence={generatedAt:new Date().toISOString(),url:baseUrl,checks:[],screenshots:[],result:'RUNNING'};
let browser;
let failed=false;

async function visible(page,id){
 const el=page.locator('[data-testid="'+id+'"]');
 await el.first().waitFor({state:'visible',timeout:20000});
 const count=await el.count();
 if(count!==1)throw new Error('Need exactly one '+id+', got '+count);
 return el;
}
async function shot(page,filename){
 await page.screenshot({path:join(output,filename),fullPage:true,animations:'disabled'});
 evidence.screenshots.push(filename);
}
async function canvasProof(page,engine){
 const host=engine==='three'?await visible(page,'three-canvas-host'):await visible(page,'island-world');
 if(engine==='three'){
   await page.waitForFunction(()=>document.querySelector('[data-testid="three-canvas-host"]')?.getAttribute('data-renderer-ready')==='true',null,{timeout:20000});
 }
 const el=host.locator('canvas').first();
 await el.waitFor({state:'visible',timeout:20000});
 const buffer=await el.screenshot({animations:'disabled',timeout:15000});
 const png=PNG.sync.read(buffer);
 const colors=new Set();
 let colored=0;
 for(let y=4;y<png.height;y+=7){
  for(let x=4;x<png.width;x+=7){
   const idx=(y*png.width+x)*4;
   const alpha=png.data[idx+3];
   if(alpha>60){
     colored++;
     colors.add([png.data[idx]>>4,png.data[idx+1]>>4,png.data[idx+2]>>4].join(','));
   }
  }
 }
 if(colored<70||colors.size<13)throw new Error(engine+' canvas appears blank/flat: '+JSON.stringify({colored,distinctColors:colors.size,width:png.width,height:png.height}));
 if(engine==='three'){
   const gpu=await page.evaluate(()=>{
     const canvas=document.querySelector('[data-testid="three-canvas-host"] canvas');
     const gl=canvas?.getContext('webgl2');
     return gl?{version:String(gl.getParameter(gl.VERSION)),size:[gl.drawingBufferWidth,gl.drawingBufferHeight]}:null;
   });
   if(!gpu)throw new Error('Three did not create real WebGL2 context');
   return { colored,distinctColors:colors.size,gpu };
 }
 return {colored,distinctColors:colors.size};
}
async function verifyChanged(page,focus){
 const marker=await visible(page,focus+'-change');
 if(!((await marker.getAttribute('data-state'))||(await marker.innerText()).trim()))throw new Error('No '+focus+' effect');
 const nova=await visible(page,'nova-actor');
 if(await nova.getAttribute('data-focus')!==focus)throw new Error('Nova did not respond to '+focus);
}

try {
 browser=await chromium.launch({headless:true,...(process.env.CI?{channel:'chrome'}:{})});
 for(const viewport of viewports)for(const engine of engines){
  const context=await browser.newContext({
   viewport:{width:viewport.width,height:viewport.height},
   isMobile:viewport.isMobile,hasTouch:viewport.isMobile,
   deviceScaleFactor:viewport.deviceScaleFactor,
   reducedMotion:'reduce',locale:'ar-EG',
  });
  const page=await context.newPage();
  page.setDefaultTimeout(16000);
  const prefix=engine+'-'+viewport.id;
  const errors=[];
  const consoleErrors=[];
  page.on('pageerror',err=>errors.push(String(err.stack||err)));
  page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text());});
  page.on('requestfailed',req=>consoleErrors.push('request failed: '+req.url()+' '+req.failure()?.errorText));
  const result={engine,viewport:viewport.id,stage:'navigation',ok:false};
  evidence.checks.push(result);
  try{
   const response=await page.goto(baseUrl+'/?ci=1&engine='+engine,{waitUntil:'domcontentloaded',timeout:35000});
   if(!response?.ok())throw new Error('Bad app HTTP response');
   await visible(page,'island-world');
   await visible(page,'nova-actor');
   await visible(page,'cottage-hotspot');
   await visible(page,'garden-hotspot');
   if(await (await visible(page,'nova-actor')).getAttribute('data-focus')!=='idle')throw new Error('Nova not idle');
   result.stage='rendering';
   result.canvas=await canvasProof(page,engine);
   await shot(page,prefix+'-initial.png');
   result.stage='cottage';
   await (await visible(page,'cottage-hotspot')).click();
   await verifyChanged(page,'cottage');
   await shot(page,prefix+'-cottage.png');
   result.stage='garden';
   await (await visible(page,'garden-hotspot')).click();
   await verifyChanged(page,'garden');
   await shot(page,prefix+'-garden.png');
   result.stage='reload';
   await page.reload({waitUntil:'domcontentloaded'});
   await visible(page,'cottage-change');
   await visible(page,'garden-change');
   const greeting=await (await visible(page,'nova-dialogue')).innerText();
   if(!greeting.includes('جزيرتك')||greeting.includes('أخيرًا وصلنا'))throw new Error('Nova lost persistent-world context: '+greeting);
   await canvasProof(page,engine);
   await shot(page,prefix+'-after-reload.png');
   if(errors.length||consoleErrors.length)throw new Error('Browser errors '+JSON.stringify({errors,consoleErrors}));
   result.ok=true;
   result.stage='completed';
   result.navigationMs=await page.evaluate(()=>Math.round(performance.getEntriesByType('navigation')[0]?.duration||0));
   console.log('PASS '+prefix,result.canvas);
  }catch(error){
   failed=true;
   result.error=String(error.stack||error);
   result.errors=errors;
   result.consoleErrors=consoleErrors;
   console.error('FAIL '+prefix+' at '+result.stage,JSON.stringify(result));
   try{await shot(page,prefix+'-failure.png');}catch{}
  }finally{await context.close();}
 }
}catch(error){
 failed=true;evidence.setupError=String(error.stack||error);
}finally{
 evidence.result=failed?'FAIL':'PASS';
 await writeFile(join(output,'ci-result.json'),JSON.stringify(evidence,null,2));
 if(browser)await browser.close();
}
if(failed)process.exitCode=1;
