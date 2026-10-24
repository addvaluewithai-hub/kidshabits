import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FocusId } from '../../domain/world';

const destinations:Record<FocusId,THREE.Vector3>={
 arrival_path:new THREE.Vector3(-1.65,2.24,-2.45),
 cottage_front:new THREE.Vector3(.51,2.17,-4.45),
 garden_edge:new THREE.Vector3(-1.00,2.15,-3.25),
};
function Wings({side,reducedMotion}:{side:-1|1;reducedMotion:boolean}){
 const group=useRef<THREE.Group>(null);
 useFrame(({clock})=>{
  if(group.current&&!reducedMotion)group.current.rotation.y=side*(.27+Math.sin(clock.elapsedTime*7)*.26);
 });
 return <group ref={group} position={[side*.35,.15,-.07]} rotation={[0,side*.35,side*.35]}>
  <mesh position={[side*.25,0,-.10]} scale={[.53,.82,.16]} rotation={[0,0,side*.26]}>
   <sphereGeometry args={[1,18,13]}/>
   <meshPhysicalMaterial color="#b6f1d8" transparent opacity={.77} depthWrite={false}
     roughness={.26} side={THREE.DoubleSide}/>
  </mesh>
 </group>;
}
export function NovaActor3D({focus,reducedMotion}:{focus:FocusId;reducedMotion:boolean}){
 const root=useRef<THREE.Group>(null);
 const body=useRef<THREE.Group>(null);
 useFrame(({clock},delta)=>{
  if(!root.current||!body.current)return;
  const destination=destinations[focus];
  root.current.position.lerp(destination,reducedMotion?1:1-Math.exp(-delta*2.4));
  body.current.position.y=reducedMotion?0:Math.sin(clock.elapsedTime*2.5)*.14;
  body.current.rotation.z=reducedMotion?0:Math.sin(clock.elapsedTime*1.8)*.075;
 });
 return <group name="nova-world-actor" ref={root} scale={.78} position={destinations.arrival_path.toArray()}>
  <pointLight position={[0,0,.45]} color="#ffdbac" intensity={22} distance={4.0}/>
  <group ref={body}>
   <Wings side={-1} reducedMotion={reducedMotion}/>
   <Wings side={1} reducedMotion={reducedMotion}/>
   <mesh castShadow><sphereGeometry args={[.46,26,18]}/>
    <meshPhysicalMaterial color="#fff0ce" roughness={.40} clearcoat={.55} emissive="#ffc88d" emissiveIntensity={.20}/>
   </mesh>
   <mesh position={[0,-.42,-.07]} scale={[.80,.85,.68]}>
    <sphereGeometry args={[.48,22,15]}/><meshStandardMaterial color="#ffdbb8" roughness={.66}/>
   </mesh>
   {[-.17,.17].map((x,i)=><group key={i} position={[x,.04,.405]}>
    <mesh scale={[.088,.13,.04]}><sphereGeometry args={[1,14,10]}/><meshStandardMaterial color="#334b50" roughness={.15}/></mesh>
    <mesh position={[-.02,.05,.042]}><sphereGeometry args={[.028,8,6]}/><meshBasicMaterial color="#ffffff"/></mesh>
   </group>)}
   <mesh position={[0,-.16,.458]} rotation={[0,0,Math.PI/2]}>
    <torusGeometry args={[.065,.012,5,16,Math.PI]}/><meshStandardMaterial color="#925957"/>
   </mesh>
   <mesh position={[0,.54,0]} rotation={[0,0,.2]}><cylinderGeometry args={[.02,.05,.40,8]}/><meshStandardMaterial color="#e5c391"/></mesh>
   <mesh position={[.07,.79,0]}><sphereGeometry args={[.11,12,8]}/><meshStandardMaterial color="#ffe8a9" emissive="#ffce7e" emissiveIntensity={1.4}/></mesh>
   <mesh position={[0,-.46,.32]}><octahedronGeometry args={[.125,0]}/><meshStandardMaterial color="#a0e5d8" emissive="#79dac0" emissiveIntensity={.8}/></mesh>
  </group>
 </group>;
}
