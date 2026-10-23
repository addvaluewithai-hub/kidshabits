(()=>{
'use strict';
const story=window.SPROUT_STORY;
if(!story||!window.KidsHabitsDemo)throw Error('Missing story or Day 1 canvas demo');
const $=id=>document.getElementById(id), KEY='sprout-10day-lab-v1';
const css=`
html,body{direction:rtl;font-family:Tahoma,"Segoe UI",sans-serif}
.page{grid-template-columns:minmax(320px,540px) minmax(340px,490px);gap:clamp(22px,4vw,60px);direction:ltr}
.visual,.story-map{direction:rtl}.visual{justify-self:center}
.info,.top-hud,.story-panel,.seed-hint,.reveal-title,.progress,.callout{display:none!important}
.frame{border-color:rgba(249,226,170,.3)}.sound{top:23px;right:auto;left:22px;z-index:19}
.lab-top{position:absolute;right:23px;left:20px;top:28px;z-index:16;color:#faecd0;text-shadow:0 2px 16px #08212e;pointer-events:none}
.lab-top small{display:block;color:#baf5d5;font-size:10px;font-weight:750;letter-spacing:.1em}.lab-top h2{font-size:clamp(25px,3vw,35px);margin:8px 0 5px;line-height:1.35}.lab-top em{font-style:normal;font-size:12px;color:#d2edda}
.lab-box{position:absolute;z-index:16;left:clamp(12px,4%,27px);right:clamp(12px,4%,27px);bottom:clamp(12px,2.5%,28px);min-height:220px;border:1px solid rgba(245,237,200,.27);border-radius:22px;padding:20px 20px 16px;background:linear-gradient(120deg,rgba(7,31,35,.95),rgba(9,29,40,.91));backdrop-filter:blur(19px);box-shadow:0 20px 60px #00141a80}
.lab-speaker{font-size:12px;color:#bff4da;font-weight:800;margin-bottom:8px}.lab-line{font-size:clamp(15px,1.5vw,18px);font-weight:650;line-height:1.85;min-height:86px;color:#fff5de;margin:0 0 13px}
.lab-actions{display:flex;flex-wrap:wrap;gap:8px}.lab-actions button,.story-map button{font-family:inherit;cursor:pointer}
.lab-actions button{padding:12px 16px;min-height:44px;background:linear-gradient(110deg,#ffe5ab,#ecc987);color:#153830;border:0;border-radius:11px;font-size:13px;font-weight:800}
.lab-actions button.alt{color:#cfeede;border:1px solid rgba(206,243,219,.25);background:rgba(255,255,255,.055)}button:focus-visible{outline:3px solid #ffe199;outline-offset:3px}
.lab-choice{color:#f7dd9c;font-size:11px;margin-top:11px}
.lab-burst{z-index:14;position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center;flex-direction:column;background:radial-gradient(circle,rgba(187,250,185,.08),rgba(3,18,30,.40));color:#ffe9b5;text-shadow:0 3px 18px #183a39;font-size:26px;padding:25px;pointer-events:none}
.lab-burst.show{display:flex}.lab-burst b{max-width:360px;line-height:1.6}
.story-map{color:#f5efdf;max-height:calc(100svh - 38px);overflow:auto;padding:8px 0;scrollbar-width:thin}
.story-map h1{font-size:clamp(27px,3vw,35px);margin:16px 0 12px;line-height:1.36}
.story-map .intro,.story-map .note{font-size:13px;color:#aacac2;line-height:1.8}
.day-cards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:19px 0}
.day-cards button{border:1px solid rgba(200,241,222,.18);border-radius:14px;padding:11px 8px;background:rgba(255,255,255,.045);color:#d5e4d9;text-align:right;font-size:11px;min-height:65px}
.day-cards button.active{background:rgba(234,237,172,.12);border-color:#e2d39a;color:#fff0b8}.day-cards button.done:before{content:'✓ ';color:#83f0b7}
.day-cards small{display:block;font-size:10px;color:#98b6ad;margin-top:5px}
.map-card{border:1px solid rgba(215,249,225,.16);border-radius:16px;padding:13px 15px;background:rgba(255,255,255,.035);margin:10px 0;color:#bed9ce;font-size:12px;line-height:1.85}.map-card b{color:#ffe1a1}
.map-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.map-tools button{padding:11px;border:1px solid rgba(215,249,225,.25);color:#dfefdf;border-radius:10px;background:rgba(255,255,255,.07);font-size:11px}
@media(max-width:900px){.page{grid-template-columns:1fr;padding:15px;max-width:600px}.story-map{max-height:none;overflow:visible}.visual{width:min(100%,520px)}}
@media(max-width:550px){.page{display:flex;flex-direction:column;padding:0;gap:0}.visual{width:100%}.frame{height:100svh;min-height:600px;border-radius:0}.story-map{padding:25px 20px 38px}.lab-top{top:max(30px,env(safe-area-inset-top))}.lab-top h2{font-size:28px}.lab-box{bottom:max(13px,env(safe-area-inset-bottom));padding:17px 16px;min-height:202px}.lab-line{min-height:72px}.sound{top:95px;left:20px}}
`.trim();
const sty=document.createElement('style');sty.textContent=css;document.head.append(sty);
document.documentElement.lang='ar';document.documentElement.dir='rtl';
document.title='KidsHabits — أول عشرة أيام من كوكب سبراوت';
const frame=$('frame');const visual=document.querySelector('.visual'),info=document.querySelector('.info');if(info)info.remove();
const top=document.createElement('div');top.className='lab-top';top.innerHTML='<small>✦ KIDSHABITS · SPROUT PLANET · STORY LAB</small><h2 id="storyTitle"></h2><em id="storyPlace"></em>';
const burst=document.createElement('div');burst.className='lab-burst';burst.id='labBurst';burst.innerHTML='<small>العالم بيفتكر خطواتك…</small><b id="labRevealTitle"></b>';
const box=document.createElement('div');box.className='lab-box';box.setAttribute('aria-live','polite');box.innerHTML='<div class="lab-speaker" id="labSpeaker"></div><p class="lab-line" id="labLine"></p><div class="lab-actions" id="labActions"></div><div class="lab-choice" id="labChoice"></div>';
frame.append(top,burst,box);
const sidebar=document.createElement('aside');sidebar.className='story-map';sidebar.innerHTML='<div style="font-weight:800;color:#b5ecd7">✦ SPROUT PLANET / STORY LAB</div><h1>10 أيام… عالم واحد بيتغيّر.</h1><p class="intro">جرّب الأيام، اسمع الحوارات، وشوف كل عادة بتخلّي الحكاية تتحرك. الأزرار للمعاينة فقط.</p><div id="count" class="intro"></div><div class="day-cards" id="dayCards"></div><div class="map-card"><b>المشهد الحالي</b><div id="scene"></div></div><div class="map-card"><b>التغير اللي بيفضل</b><div id="effect"></div></div><div class="map-tools"><button id="resetDay">↺ أعد اليوم</button><button id="resetAll">امسح تقدم المعاينة</button></div><p class="note">القفز بين الأيام خاص بالمؤلف. التقدم الحقيقي يحتاج تحقق العادة وموافقة الأهل حسب الإعدادات. الحوارات مؤلفة مسبقًا، مش Live AI.</p>';
document.querySelector('.page').appendChild(sidebar);
function restore(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
const old=restore();const model={day:old.day>=1&&old.day<=10?old.day:1,done:Array.isArray(old.done)?old.done.filter(d=>d>=1&&d<=10):[],choice:['water','tree'].includes(old.choice)?old.choice:null};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(model))}catch(e){}};
let phase='before',step=0,timer=null;
const day=()=>story.days[model.day-1];
function addBtn(label,fn,alt){const b=document.createElement('button');b.textContent=label;b.type='button';if(alt)b.className='alt';b.addEventListener('click',fn);$('labActions').appendChild(b)}
function say(who,line){$('labSpeaker').textContent=who;$('labLine').textContent=line;$('labActions').replaceChildren()}
function showSidebar(){sidebar.scrollIntoView({behavior:'smooth',block:'start'})}
function map(){const d=day();$('storyTitle').textContent=d.t;$('storyPlace').textContent='اليوم '+String(model.day).padStart(2,'0')+' / 30 · '+d.p;$('count').textContent='تمت معاينة '+model.done.length+' من 10 أيام';$('scene').textContent=d.scene;$('effect').textContent=d.visual;
 $('labChoice').textContent=model.choice?'🌱 بذرتك: '+(model.choice==='water'?'زهرة الميّه الزرقا':'زهرة الشجرة الذهبية'):'';
 $('dayCards').replaceChildren();for(const item of story.days){const b=document.createElement('button');b.className=(item.d===model.day?'active ':'')+(model.done.includes(item.d)?'done':'');b.textContent=String(item.d).padStart(2,'0')+' · '+item.t;const s=document.createElement('small');s.textContent=item.p;b.appendChild(s);b.onclick=()=>load(item.d);$('dayCards').appendChild(b)}
}
function stop(){if(timer){clearTimeout(timer);timer=null}$('labBurst').classList.remove('show')}
function load(n){stop();model.day=n;save();phase='before';step=0;try{window.KidsHabitsDemo.reset();if(n>1||model.done.includes(n))window.KidsHabitsDemo.finish()}catch(e){}map();before()}
function before(){phase='before';const d=day(),x=d.before[step];say(x[0],x[1]);addBtn(step===d.before.length-1?'جاهز نكمّل ✦':'كمّل الحوار ←',()=>{if(step<d.before.length-1){step++;before()}else habit()});addBtn('خريطة الأيام ↓',showSidebar,true)}
function habit(){phase='habit';say('عادة اليوم / محاكاة','جرب «'+day().h+'». في المعاينة دي هنعتبر العادة مكتملة ونشوف كشف الحكاية.');addBtn('تجربة إكمال العادة ✨',reveal);addBtn('رجوع للحوار',()=>{step=0;before()},true)}
function reveal(){if(phase!=='habit')return;phase='reveal';try{window.KidsHabitsDemo.awaken()}catch(e){}$('labRevealTitle').textContent=day().visual;$('labBurst').classList.add('show');say('الكشف السينمائي',day().scene);addBtn('تخطي التحوّل',finishReveal,true);timer=setTimeout(finishReveal,3800)}
function finishReveal(){if(phase!=='reveal')return;stop();try{window.KidsHabitsDemo.finish()}catch(e){};if(!model.done.includes(model.day))model.done.push(model.day);save();map();phase='after';step=0;after()}
function after(){phase='after';const d=day(),line=d.after[step].slice();if(d.d===6&&step===0&&model.choice)line[1]=model.choice==='water'?'بص! الزهرة الزرقا بتخلّي النهر كله يلمع!':'بص! الزهرة الذهبية نورها وصل لحد النهر!';say(line[0],line[1]);addBtn(step===d.after.length-1?'كمّل الحكاية ←':'التالي ←',()=>{if(step<d.after.length-1){step++;after()}else if(d.choice&&!model.choice)choose();else end()})}
function choose(){phase='choice';say('اختيار بيعيش معاك','نزرع البذرة فين؟ العالم هيفضل فاكر اختيارك بعد النهارده.');for(const [id,label] of day().choice){addBtn(label,()=>{model.choice=id;save();map();end()})}}
function end(){phase='end';say('تشويق لبكرة',day().hook);if(model.day<10)addBtn('ابدأ اليوم اللي بعده ←',()=>load(model.day+1));else addBtn('ارجع لأول يوم ↺',()=>load(1));addBtn('أعد اليوم',()=>load(model.day),true)}
$('resetDay').onclick=()=>load(model.day);
$('resetAll').onclick=()=>{if(confirm('نمسح اختيار البذرة وتقدم المعاينة؟')){model.day=1;model.done=[];model.choice=null;save();load(1)}};
window.SproutLab={state:()=>({...model,phase}),jump:load,completeReveal:finishReveal};
// Transparent procedural effects canvas. State owns the truth; this is presentation only.
const layer=document.createElement('canvas');layer.width=720;layer.height=1180;layer.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none';frame.appendChild(layer);const c=layer.getContext('2d');let tt=0;
function orb(x,y,r,color,alpha){const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba('+color+','+(alpha*.5)+')');g.addColorStop(1,'rgba('+color+',0)');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}
function ellipse(x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill()}
function draw(){tt+=.022;c.clearRect(0,0,720,1180);let d=model.day;
 if(d>=2)for(let i=0;i<6;i++){let x=195+i*38,y=817+i*17;orb(x,y,34,'255,237,160',.4);ellipse(x,y,14,5,'rgba(243,227,155,.72)')}
 if(d>=3)for(let i=0;i<15;i++){let a=i*2.4+tt*.7,x=291+Math.cos(a)*122,y=450+Math.sin(a)*86;orb(x,y,12,'215,249,168',.4);ellipse(x,y,2,2,'rgba(255,252,206,.8)')}
 if(d>=4&&model.choice){const blue=model.choice==='water',x=blue?580:283,y=blue?866:754;orb(x,y,85,blue?'113,205,250':'255,215,116',.6);for(let i=0;i<7;i++){let a=i*Math.PI*2/7+tt*.15;ellipse(x+Math.cos(a)*21,y+Math.sin(a)*16,6,11,blue?'#b0dff9':'#f7dea2')}}
 if(d>=5&&d<=9){const g=c.createLinearGradient(500,805,710,1040);g.addColorStop(0,'rgba(72,164,183,0)');g.addColorStop(1,'rgba(25,123,168,.44)');c.fillStyle=g;c.beginPath();c.moveTo(640,766);c.bezierCurveTo(580,837,490,912,520,1010);c.bezierCurveTo(549,1087,565,1134,569,1180);c.lineTo(720,1180);c.lineTo(720,780);c.closePath();c.fill();for(let i=0;i<6;i++){c.strokeStyle='rgba(135,231,235,.19)';c.lineWidth=2;c.beginPath();c.moveTo(480,895+i*18);c.bezierCurveTo(560,871+i*18,650,926+i*18,716,890+i*18);c.stroke()}}
 if(d>=7)for(let i=0;i<5;i++){let x=493+i*42,y=881-i*8;orb(x,y,37,'249,238,168',.43);ellipse(x,y,18,6,'rgba(250,231,161,.6)')}
 if(d===8){orb(629,772,70,'191,247,222',.55);ellipse(615,778,4,5,'#d6ffda');ellipse(636,778,4,5,'#d6ffda')}
 if(d>=9){let x=635+Math.sin(tt)*13,y=717+Math.sin(tt*2)*11;orb(x,y,87,'177,254,240',.5);ellipse(x,y,21,24,'#ade9d4');ellipse(x-21,y-3,17,8,'#baf2dc');ellipse(x+21,y-3,17,8,'#baf2dc');ellipse(x-7,y-2,3,3,'#1a484c');ellipse(x+7,y-2,3,3,'#1a484c')}
 if(d>=10){orb(322,676,137,'255,220,150',.62);c.strokeStyle='#fce7a7';c.lineWidth=5;c.beginPath();c.ellipse(322,677,49,72,0,0,Math.PI*2);c.stroke()}
 requestAnimationFrame(draw)}
requestAnimationFrame(draw);load(model.day);
})();