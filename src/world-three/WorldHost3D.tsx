import { Canvas, useThree } from '@react-three/fiber';
import { useEffect,useState } from 'react';
import type { FocusId,WorldSnapshot } from '../domain/world';
import {CAMERA_RIGS} from '../content/cameraRigs';
import {PerspectiveCameraDirector} from './camera/PerspectiveCameraDirector';
import {LivingLandscape} from './environment/LivingLandscape';
import {WorldCottage} from './objects/WorldCottage';
import {GardenPatch} from './objects/GardenPatch';
import {NovaActor3D} from './actors/NovaActor3D';

interface WorldProps {
 world:WorldSnapshot;focus:FocusId;
 onCottage:()=>void;onGarden:()=>void;
 onSettled:()=>void;reducedMotion:boolean;
}
function SceneEvidence(){
 const {scene,camera}=useThree();
 useEffect(()=>{
  if(new URLSearchParams(window.location.search).get('ci')!=='1')return;
  // Read real visible object state from Three's scene graph, not from React's labels.
  window.__KH_CI__={
   scene,camera,
   snapshot:()=>({
    objects:{
     cottage:{lampVisible:scene.getObjectByName('cottage-lamp')?.visible===true},
     garden:{bloomVisible:!!scene.getObjectByName('garden-bloom')}
    },
    sceneObjectCount:scene.children.length
   })
  };
  return ()=>{delete window.__KH_CI__};
 },[camera,scene]);
 return null;
}
function WorldScene({world,focus,onCottage,onGarden,onSettled,reducedMotion}:WorldProps){
 return <>
  <LivingLandscape/>
  <WorldCottage world={world} onChoose={onCottage}/>
  <GardenPatch world={world} onChoose={onGarden} reducedMotion={reducedMotion}/>
  <NovaActor3D focus={focus} reducedMotion={reducedMotion}/>
  <PerspectiveCameraDirector focus={focus} onSettled={onSettled} reducedMotion={reducedMotion}/>
  <SceneEvidence/>
 </>;
}
export function WorldHost3D(props:WorldProps){
 const [ready,setReady]=useState(false);
 return <div className="world-canvas" data-testid="world-canvas" data-ready={ready?'true':'false'} aria-hidden="true">
  <Canvas shadows="percentage" dpr={[1,1.6]} camera={{position:[...CAMERA_RIGS.arrival_path.position],fov:58,near:.06,far:240}}
    gl={{antialias:true,alpha:false,powerPreference:'high-performance',stencil:false}}
    onCreated={()=>setReady(true)}>
   <WorldScene {...props}/>
  </Canvas>
  {!ready&&<div className="loading-world">بنفتح باب العالم…</div>}
 </div>;
}
