import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { WorldFocus } from '../../domain/island/model';
import type { ThreePalette } from '../style/islandPalette';

const TARGETS: Record<WorldFocus,THREE.Vector3>={
  idle:new THREE.Vector3(.05,2.55,1.15),
  cottage:new THREE.Vector3(.55,2.55,.85),
  garden:new THREE.Vector3(-.35,2.00,1.74),
};
const eyes=[-.19,.19];
function Wing({side}:{side:-1|1}){
  const wing=useRef<THREE.Group>(null);
  const still=typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useFrame(({clock})=>{
    if(!wing.current || still)return;
    wing.current.rotation.y=side*(.35+Math.sin(clock.elapsedTime*8)*.22);
  });
  return <group ref={wing} position={[side*.36,.20,-.03]} rotation={[0,side*.35,side*.3]}>
    <mesh position={[side*.24,.02,0]} rotation={[.24,0,side*.3]}
      scale={[.50,.76,.16]}>
      <sphereGeometry args={[1,18,12]}/>
      <meshPhysicalMaterial color="#b3f7e1" transparent opacity={.68} roughness={.35}
        transmission={.10} depthWrite={false} side={THREE.DoubleSide}/>
    </mesh>
  </group>;
}
export function NovaSpirit({focus,palette}:{focus:WorldFocus;palette:ThreePalette}){
  const root=useRef<THREE.Group>(null);
  const body=useRef<THREE.Group>(null);
  const reduced=typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useFrame(({clock},delta})=>{
    if(!root.current || !body.current)return;
    const target=TARGETS[focus];
    root.current.position.lerp(target,1-Math.exp(-delta*(reduced?100:2.3)));
    body.current.position.y=reduced?0:Math.sin(clock.elapsedTime*2.1)*.12;
    body.current.rotation.z=reduced?0:Math.sin(clock.elapsedTime*1.25)*.065;
    body.current.rotation.y=THREE.MathUtils.damp(body.current.rotation.y,focus==='cottage'?-.45:focus==='garden'?.42:0,2.2,delta);
  });
  return <group ref={root} position={[TARGETS.idle.x,TARGETS.idle.y,TARGETS.idle.z]}>
    <pointLight color="#ffe3bd" intensity={29} distance={4} position={[0,0,.4]}/>
    <group ref={body}>
      <Wing side={-1}/><Wing side={1}/>
      <mesh position={[0,0,0]} castShadow>
        <sphereGeometry args={[.49,32,24]}/>
        <meshPhysicalMaterial color={palette.novaBody} roughness={.48}
          clearcoat={.48} clearcoatRoughness={.25} emissive="#ffc895" emissiveIntensity={.2}/>
      </mesh>
      <mesh position={[0,-.46,-.035]} scale={[.84,.81,.70]}>
        <sphereGeometry args={[.47,26,20]}/>
        <meshStandardMaterial color="#ffe2b9" roughness={.62}/>
      </mesh>
      {/* Eyes: proper 3D features with highlights facing the camera. */}
      {eyes.map((x,i)=><group key={i} position={[x,.05,.40]}>
        <mesh scale={[.085,.145,.053]}>
          <sphereGeometry args={[1,16,12]}/>
          <meshStandardMaterial color="#2c4146" roughness={.20}/>
        </mesh>
        <mesh position={[-.025,.048,.047]}>
          <sphereGeometry args={[.031,8,7]}/>
          <meshBasicMaterial color="#fffdfa"/>
        </mesh>
        <mesh position={[0,-.22,-.002]} scale={[.13,.07,.03]}>
          <sphereGeometry args={[1,12,8]}/>
          <meshStandardMaterial color="#eaa9a1" transparent opacity={.57}/>
        </mesh>
      </group>)}
      <mesh position={[0,-.20,.477]} rotation={[0,0,Math.PI/2]}>
        <torusGeometry args={[.075,.012,6,20,Math.PI]}/>
        <meshStandardMaterial color="#945c58"/>
      </mesh>
      {/* Antenna and pendant carry the same golden magical material. */}
      <mesh position={[0,.56,0]} rotation={[0,0,.2]}>
        <cylinderGeometry args={[.02,.05,.42,9]}/>
        <meshStandardMaterial color="#f4dca7"/>
      </mesh>
      <mesh position={[.07,.78,0]}>
        <sphereGeometry args={[.12,16,12]}/>
        <meshStandardMaterial color="#ffeca9" emissive="#ffcc71" emissiveIntensity={1.6}/>
      </mesh>
      <mesh position={[0,-.52,.33]}>
        <octahedronGeometry args={[.135,0]}/>
        <meshStandardMaterial color="#8fdfcf" emissive="#73e1c2" emissiveIntensity={.7}/>
      </mesh>
      {[[-.35,-.38],[.35,-.38]].map(([x,y],i)=>(
        <mesh key={i} position={[x,y,.06]} rotation={[0,0,i===0?-.5:.5]}>
          <capsuleGeometry args={[.09,.13,5,8]}/>
          <meshStandardMaterial color="#ffe2b9"/>
        </mesh>
      ))}
    </group>
    <mesh position={[0,-.93,0]} rotation={[-Math.PI/2,0,0]} scale={[.75,.43,1]}>
      <circleGeometry args={[.52,32]}/>
      <meshBasicMaterial color="#172e35" transparent opacity={.17} depthWrite={false}/>
    </mesh>
  </group>;
}
