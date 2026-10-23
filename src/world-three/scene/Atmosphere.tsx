import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';

const sparks=Array.from({length:24},(_,i)=>{
 const a=i*2.399963;
 const r=1.6+(i%7)*.35;
 return {x:Math.sin(a)*r,z:Math.cos(a)*r,y:.8+(i%5)*.38,scale:.025+(i%3)*.009};
});
function Fireflies(){
 const parent=useRef<THREE.Group>(null);
 const reduced=typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 useFrame(({clock})=>{
   if(parent.current&&!reduced)parent.current.rotation.y=Math.sin(clock.elapsedTime*.11)*.17;
 });
 return <group ref={parent}>
  {sparks.map((p,i)=><mesh key={i} position={[p.x,p.y,p.z]}>
    <sphereGeometry args={[p.scale,6,6]}/>
    <meshBasicMaterial color={i%4?"#fbe6aa":"#c5ffdd"} transparent opacity={.7}/>
  </mesh>)}
 </group>;
}
export function Atmosphere(){
  return <group>
    <hemisphereLight color="#e7fbef" groundColor="#39525c" intensity={1.25}/>
    <ambientLight intensity={.28}/>
    <directionalLight position={[-4,9,6]} color="#ffe6bd" intensity={3.1}
      castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.0005}
      shadow-camera-left={-8} shadow-camera-right={8}
      shadow-camera-top={8} shadow-camera-bottom={-8}
      shadow-camera-near={.1} shadow-camera-far={26}/>
    <directionalLight position={[4,3,-5]} color="#9cd3cc" intensity={1.05}/>
    <mesh position={[-3.8,3,-7]} scale={[2.4,.55,.9]}>
      <sphereGeometry args={[1,20,12]}/>
      <meshBasicMaterial color="#9cc2bb" transparent opacity={.13} depthWrite={false}/>
    </mesh>
    <mesh position={[4.9,4,-8]} scale={[2.1,.48,.8]}>
      <sphereGeometry args={[1,20,12]}/>
      <meshBasicMaterial color="#d8cdb1" transparent opacity={.16} depthWrite={false}/>
    </mesh>
    <Fireflies/>
  </group>;
}
