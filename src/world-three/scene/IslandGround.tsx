import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreePalette } from '../style/islandPalette';

type Props = { palette: ThreePalette };
const stones = Array.from({ length: 16 }, (_, i) => {
  const a = i * 2.39996;
  return { x: Math.sin(a) * (2.7 + (i % 3) * .17), z: Math.cos(a) * (2.7 + (i % 3) * .19), s: .12 + (i % 4) * .045 };
});
const meadowFlowers = Array.from({ length: 20 }, (_, i) => {
  const a = i * 2.39996;
  const radius = 2.65 + (i % 5) * .19;
  return { x: Math.cos(a) * radius, z: Math.sin(a) * radius, s: .055 + .015 * (i % 3) };
});
function GrassTuft({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <group position={[x, .11, z]}>
      {[[-.09,0,.06],[.04,.04,.07],[.11,0,-.02]].map(([a,b,c],i) => (
        <mesh key={i} position={[a,.14,c]} rotation={[0,b,i % 2 ? -.2 : .24]} castShadow>
          <coneGeometry args={[.057, .35 + i * .045, 4]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function IslandGround({ palette }: Props) {
  const darkStone = useMemo(() => new THREE.Color(palette.rock), [palette.rock]);
  return (
    <group>
      {/* Sculpted floating base, not a flat background. */}
      <mesh position={[0,-.76,0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.16, 3.40, 1.48, 12, 3]} />
        <meshStandardMaterial color={darkStone} roughness={.92} flatShading />
      </mesh>
      <mesh position={[0,-1.61,0]} rotation={[Math.PI,0,0]} castShadow>
        <coneGeometry args={[3.35,1.75,9]} />
        <meshStandardMaterial color="#344e59" roughness={1} flatShading />
      </mesh>
      <mesh position={[0,-.01,0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.20,4.15,.38,64]} />
        <meshStandardMaterial color={palette.grass} roughness={1} />
      </mesh>
      <mesh position={[0,.187,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
        <circleGeometry args={[4.13,64]} />
        <meshStandardMaterial color={palette.grassLight} roughness={1} />
      </mesh>
      {/* Forest-floor moss pebbles and wildflower marks give scale. */}
      {stones.map((p,i)=><group key={i} position={[p.x,.25,p.z]}>
        <mesh rotation={[.07,i*1.17,.14]} castShadow>
          <dodecahedronGeometry args={[p.s,0]} />
          <meshStandardMaterial color={i%3===0?"#c3bf9b":"#8fafa0"} roughness={1} />
        </mesh>
        <GrassTuft x={.19} z={-.07} color={palette.foliage[i%palette.foliage.length]} />
      </group>)}
      {meadowFlowers.map((p,i)=><group key={i} position={[p.x,.25,p.z]}>
        <mesh position={[0,.11,0]} rotation={[0,0,.1]} castShadow>
          <cylinderGeometry args={[.014,.022,.22,5]} />
          <meshStandardMaterial color="#497c61" roughness={.9} />
        </mesh>
        <mesh position={[0,.24,0]}>
          <sphereGeometry args={[p.s,8,6]} />
          <meshStandardMaterial color={i%4===0?"#ffe4ad":"#f1c5b9"} emissive="#f8cb95" emissiveIntensity={.12} roughness={.72}/>
        </mesh>
      </group>)}
      <mesh position={[0,.222,.15]} receiveShadow rotation={[-Math.PI/2,0,0]}>
        <ringGeometry args={[3.75,3.95,64]} />
        <meshStandardMaterial color="#b5cf9a" roughness={1} transparent opacity={.32} />
      </mesh>
      {/* A path and stepping stones that lead toward the cottage. */}
      {Array.from({length:7},(_,i)=>(
        <mesh key={i} position={[.25+i*.24,.243,2.55-i*.41]}
          rotation={[0, i*.22,0]} receiveShadow castShadow>
          <cylinderGeometry args={[.34,.37,.09,7]} />
          <meshStandardMaterial color={i%2?"#d0bd96":"#b4bd9e"} roughness={.95} />
        </mesh>
      ))}
    </group>
  );
}
