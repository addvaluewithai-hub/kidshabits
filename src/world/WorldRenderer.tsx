import { Suspense, lazy } from 'react';
import { WorldHost as PhaserWorld } from './WorldHost';
import type { IslandSnapshot, WorldFocus } from '../domain/island/model';

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
 if(engine==='phaser')return <PhaserWorld island={island} focus={focus}/>;
 return <Suspense fallback={<div className="world-canvas three-loading">بنحضّر جزيرتك السحرية…</div>}>
   <ThreeWorld island={island} focus={focus} onCottage={onCottage} onGarden={onGarden}/>
 </Suspense>;
}
