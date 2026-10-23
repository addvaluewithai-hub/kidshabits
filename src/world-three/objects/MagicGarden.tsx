import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { IslandSnapshot } from '../../domain/island/model';

type Props={island:IslandSnapshot;onPlant:()=>void};
const petals=Array.from({length:7},(_,i)=>i*Math.PI*2/7);
function Bloom({reducedMotion}:{reducedMotion:boolean}){
 const crown=useRef<THREE.Group>(null);
 useFrame(({clock},delta)=>{
   if(!crown.current || reducedMotion)return;
   crown.current.rotation.y+=delta*.12;
   const pulse=1+Math.sin(clock.elapsedTime*1.8)*.04;
   crown.current.scale.setScalar(pulse);
 });
 return <group position={[0,.28,0]}>
   <mesh position={[0,.55,0]} castShadow>
     <cylinderGeometry args={[.045,.062,1.20,9]}/>
     <meshStandardMaterial color="#4b946d" roughness={.86}/>
   </mesh>
   {[[-.29,.57,.06,-.6],[.27,.77,-.03,.7]].map(([x,y,z,a],i)=>(
     <mesh key={i} position={[x,y,z]} rotation={[0,0,a]} scale={[.45,.17,.26]} castShadow>
       <sphereGeometry args={[1,14,9]}/>
       <meshStandardMaterial color="#72aa78" roughness={.73}/>
     </mesh>
   ))}
   <group ref={crown} position={[0,1.20,0]}>
     {petals.map((angle,i)=><mesh key={i}
       position={[Math.sin(angle)*.23,Math.cos(angle)*.23,0]}
       rotation={[0,0,-angle]}>
       <sphereGeometry args={[.27,14,10]}/>
       <meshStandardMaterial color={i%2?"#ffc7b7":"#f8dfa4"}
         roughness={.46} emissive="#fbca9e" emissiveIntensity={.17}/>
     </mesh>)}
     <mesh position={[0,0,.07]}>
       <sphereGeometry args={[.24,18,14]}/>
       <meshStandardMaterial color="#fff4bf" emissive="#ffdf7e" emissiveIntensity={.9} roughness={.35}/>
     </mesh>
     <pointLight color="#ffe4a7" intensity={18} distance={3}/>
   </group>
 </group>;
}
export function MagicGarden({island,onPlant}:Props){
 const blooming=island.garden==='blooming';
 const reducedMotion=typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 return <group position={[-.14,.22,2.05]}
   onClick={(e)=>{e.stopPropagation();onPlant();}}
   onPointerOver={()=>{document.body.style.cursor='pointer';}}
   onPointerOut={()=>{document.body.style.cursor='auto';}}>
   {/* A readable garden bed even before planting. */}
   <mesh position={[0,.015,0]} receiveShadow castShadow>
     <cylinderGeometry args={[.79,.88,.22,10]}/>
     <meshStandardMaterial color="#ab9674" roughness={1}/>
   </mesh>
   <mesh position={[0,.132,0]} receiveShadow>
     <cylinderGeometry args={[.68,.73,.04,10]}/>
     <meshStandardMaterial color="#72544b" roughness={1}/>
   </mesh>
   {blooming?<Bloom reducedMotion={reducedMotion}/>:<group>
     <mesh position={[0,.24,0]} rotation={[Math.PI/4,0,0]}>
       <octahedronGeometry args={[.26,0]}/>
       <meshStandardMaterial color="#bcb995" roughness={.7} emissive="#c4b086" emissiveIntensity={.18}/>
     </mesh>
     <mesh position={[0,.36,0]}>
       <sphereGeometry args={[.08,8,6]}/>
       <meshBasicMaterial color="#fee7ac"/>
     </mesh>
   </group>}
   {[.0,Math.PI*.75,Math.PI*1.4].map((a,i)=>(
     <group key={i} position={[Math.cos(a)*.82,.19,Math.sin(a)*.82]}>
       <mesh position={[0,.12,0]} rotation={[0,0,i*.32]}>
         <coneGeometry args={[.09,.36,5]}/>
         <meshStandardMaterial color="#78aa80"/>
       </mesh>
     </group>
   ))}
 </group>;
}
