import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import type * as THREE from 'three';
import type {WorldSnapshot} from '../../domain/world';

function MagicBloom({reducedMotion}:{reducedMotion:boolean}){
 const flower=useRef<THREE.Group>(null);
 useFrame(({clock})=>{
  if(flower.current&&!reducedMotion)flower.current.rotation.y=Math.sin(clock.elapsedTime*.8)*.12;
 });
 return <group name="garden-bloom" position={[0,.18,0]} ref={flower}>
   <mesh position={[0,.67,0]} castShadow><cylinderGeometry args={[.06,.085,1.35,9]}/><meshStandardMaterial color="#4a966c"/></mesh>
   {[-1,1].map((dir,i)=><mesh key={i} position={[dir*.23,.63,0]} rotation={[0,0,dir*.55]} scale={[.35,.15,.24]}>
     <sphereGeometry args={[1,12,8]}/><meshStandardMaterial color="#6bad73"/></mesh>)}
   {Array.from({length:7},(_,i)=>i*Math.PI*2/7).map((angle,i)=><mesh key={i}
     position={[Math.sin(angle)*.34,1.42+Math.cos(angle)*.34,.04]}
     scale={[.39,.39,.18]}>
     <sphereGeometry args={[1,12,10]}/>
     <meshStandardMaterial color={i%2?'#ffc2a5':'#ffe0c0'} roughness={.48} emissive="#fcae96" emissiveIntensity={.19}/>
   </mesh>)}
   <mesh position={[0,1.42,.15]}><sphereGeometry args={[.24,12,10]}/>
     <meshStandardMaterial color="#fff0a1" emissive="#ffce76" emissiveIntensity={.95}/></mesh>
   <pointLight position={[0,1.37,.2]} color="#ffe1a8" intensity={15} distance={4.2}/>
 </group>;
}
export function GardenPatch({world,onChoose,reducedMotion}:{
 world:WorldSnapshot;onChoose:()=>void;reducedMotion:boolean
}){
 const blooming=world.garden==='blooming';
 return <group position={[-2.15,0,-3.75]}
   onClick={e=>{e.stopPropagation();onChoose()}}
   onPointerOver={()=>{document.body.style.cursor='pointer'}}
   onPointerOut={()=>{document.body.style.cursor='auto'}}>
    <mesh position={[0,.11,0]} receiveShadow castShadow>
      <cylinderGeometry args={[1.15,1.24,.22,12]}/>
      <meshStandardMaterial color="#a58e71" roughness={1}/>
    </mesh>
    <mesh position={[0,.241,0]} receiveShadow>
      <cylinderGeometry args={[1.03,1.10,.052,12]}/>
      <meshStandardMaterial color="#675343" roughness={1}/>
    </mesh>
    {blooming?<MagicBloom reducedMotion={reducedMotion}/>:<group name="garden-seed-placeholder">
      <mesh position={[0,.35,0]}><dodecahedronGeometry args={[.20,0]}/>
      <meshStandardMaterial color="#cfaf87" roughness={.79}/></mesh>
      <mesh position={[0,.55,0]}><sphereGeometry args={[.055,8,8]}/>
      <meshBasicMaterial color="#fff0c2"/></mesh>
    </group>}
    {Array.from({length:6},(_,i)=>i*Math.PI/3).map((a,i)=><group key={i}
      position={[Math.cos(a)*.96,.27,Math.sin(a)*.96]}>
       <mesh position={[0,.21,0]}><coneGeometry args={[.10,.41,5]}/><meshStandardMaterial color={i%2?'#568a62':'#6ca57b'}/></mesh>
    </group>)}
 </group>;
}
