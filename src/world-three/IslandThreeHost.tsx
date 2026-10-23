import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ThreeWorldScene } from './scene/ThreeWorldScene';
import type { IslandSnapshot, WorldFocus } from '../domain/island/model';

interface Props {
 island: IslandSnapshot;
 focus: WorldFocus;
 onCottage: () => void;
 onGarden: () => void;
}

/**
 * Rendering-only adapter. 3D raycast interactions call the same pure
 * application commands as the accessible HTML hotspots and Phaser preview.
 */
export function IslandThreeHost({island,focus,onCottage,onGarden}:Props){
 const [ready,setReady]=useState(false);
 return <div className="world-canvas world-canvas--three" data-testid="three-canvas-host"
   data-renderer-ready={ready?'true':'false'} aria-hidden="true">
   <Canvas
     shadows="percentage"
     orthographic
     camera={{position:[9,10,15],zoom:41,near:.1,far:80}}
     dpr={[1,1.75]}
     gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}
     onCreated={({camera})=>{camera.lookAt(0,.65,0);setReady(true);}}
   >
     <ThreeWorldScene island={island} focus={focus} onCottage={onCottage} onGarden={onGarden}/>
   </Canvas>
 </div>;
}
