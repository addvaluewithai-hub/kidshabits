import { useMemo } from 'react';
import type { FocusId } from '../domain/world';
import {CAMERA_RIGS} from '../content/cameraRigs';
import {novaLine} from '../content/novaLines';
import {useWorld} from '../application/useWorld';
import {WorldHost3D} from '../world-three/WorldHost3D';

function useReducedMotion(){
 return useMemo(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
}
const titles:Record<FocusId,string>={
 arrival_path:'عالمنا الجديد',
 cottage_front:'بيت الأسرار',
 garden_edge:'أول حديقة',
};
export function App(){
 const {world,focus,settled,completeTravel,cottage,garden,home}=useWorld();
 const reducedMotion=useReducedMotion();
 const isTest=new URLSearchParams(window.location.search).has('ci');
 return <main className="world-viewport" data-testid="world-viewport">
  <WorldHost3D world={world} focus={focus} onCottage={cottage}
   onGarden={garden} onSettled={completeTravel} reducedMotion={reducedMotion}/>
  <div className="world-vignette" aria-hidden="true"/>
  <header className="top-bar">
    <div className="brand" aria-label="KidsHabits">
      <span className="brand-mark">✦</span>
      <span className="brand-copy"><b>kidshabits</b><small>عالم صغير.. بخيال كبير</small></span>
    </div>
    <div className="journey-chip" aria-label="مكاننا الحالي">
      <span className="glow-dot"/>{titles[focus]}
    </div>
  </header>
  {focus==='arrival_path'&&<div className="chapter-label" aria-hidden="true">
    <small>الفصل الأول</small><span>هنا تبدأ الحكاية</span>
  </div>}
  <section className="immersive-hud" aria-label="نوفا وخيارات الاستكشاف">
    <div className="subtitle-wrap">
      <span className="nova-presence" data-testid="nova-actor" data-focus={focus}>✦ نوفا</span>
      <p className="subtitle" role="status" aria-live="polite" data-testid="nova-dialogue">{novaLine(world,focus)}</p>
    </div>
    <nav className="action-row" aria-label="أماكن تقدر تستكشفها">
      <button className={'world-action house-action'+(focus==='cottage_front'?' is-active':'')} type="button"
        data-testid="cottage-hotspot" onClick={cottage}>
        <span className="action-icon" aria-hidden="true">⌂</span>
        <span><strong>{world.cottage==='restored'?'بيتنا المنوّر':'نصلّح البيت'}</strong><small>خلّينا نقرب ونشوف</small></span>
        <span aria-hidden="true" className="action-arrow">↗</span>
      </button>
      <button className={'world-action garden-action'+(focus==='garden_edge'?' is-active':'')} type="button"
        data-testid="garden-hotspot" onClick={garden}>
        <span className="action-icon" aria-hidden="true">✿</span>
        <span><strong>{world.garden==='blooming'?'زهرتنا الأولى':'نزرع زهرة'}</strong><small>سحر صغير مستنينا</small></span>
        <span aria-hidden="true" className="action-arrow">↗</span>
      </button>
    </nav>
    {(world.cottage==='restored'||world.garden==='blooming')&&
      <div className="world-achievements" aria-label="حاجات اتغيرت في عالمنا">
       {world.cottage==='restored'&&<span data-testid="cottage-change" data-state="restored">✧ البيت رجع له النور</span>}
       {world.garden==='blooming'&&<span data-testid="garden-change" data-state="blooming">✿ زهرة جديدة</span>}
      </div>
    }
    {focus!=='arrival_path'&&<button className="home-link" onClick={home} type="button" aria-label="ارجعي لطريق البداية">↩ نرجع للطريق</button>}
  </section>
  {isTest&&<div className="camera-debug" data-testid="camera-debug"
   data-camera-mode="perspective" data-camera-rig={focus}
   data-camera-height={CAMERA_RIGS[focus].position[1]}
   data-camera-settled={settled?'true':'false'}>camera diagnostics</div>}
  <div className="corner-credit" aria-hidden="true">DAY ONE · WORLD STUDY</div>
 </main>;
}
