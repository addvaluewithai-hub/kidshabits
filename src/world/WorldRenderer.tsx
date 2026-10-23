import { Suspense, lazy } from 'react';
import type { IslandSnapshot, WorldFocus } from '../domain/island/model';

// Each runtime is code-split. Comparing Three must not download Phaser.
const PhaserWorld = lazy(async () => {
 const module = await import('./WorldHost');
 return { default: module.WorldHost };
});
const ThreeWorld = lazy(async () => {
 const module = await import('../world-three/IslandThreeHost');
 return { default: module.IslandThreeHost };
});
export type WorldEngine = 'three' | 'phaser';

export function activeEngine(): WorldEngine {
 return typeof window !== 'undefined' &&
   new URLSearchParams(window.location.search).get('engine') === 'phaser'
   ? 'phaser' : 'three';
}

export function WorldRenderer({engine,island,focus,onCottage,onGarden}:{
 engine:WorldEngine;island:IslandSnapshot;focus:WorldFocus;
 onCottage:()=>void;onGarden:()=>void;
}){
 return <Suspense fallback={<div className="world-canvas three-loading">بنحضّر جزيرتك السحرية…</div>}>
   {engine==='phaser'
     ? <PhaserWorld island={island} focus={focus}/>
     : <ThreeWorld island={island} focus={focus} onCottage={onCottage} onGarden={onGarden}/>}
 </Suspense>;
}
