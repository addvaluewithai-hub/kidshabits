import { useMemo } from 'react';
import * as THREE from 'three';
import type { IslandSnapshot } from '../../domain/island/model';
import type { ThreePalette } from '../style/islandPalette';

type Props={ palette:ThreePalette; island:IslandSnapshot; onRestore:()=>void };
function Roof({ palette }: {palette:ThreePalette}) {
  return <group position={[0,2.08,0]}>
    <mesh position={[-.62,.04,0]} rotation={[0,0,.64]} castShadow receiveShadow>
      <boxGeometry args={[1.93,.19,2.48]} />
      <meshStandardMaterial color={palette.roof} roughness={.82} />
    </mesh>
    <mesh position={[.62,.04,0]} rotation={[0,0,-.64]} castShadow receiveShadow>
      <boxGeometry args={[1.93,.19,2.48]} />
      <meshStandardMaterial color="#405c75" roughness={.85}/>
    </mesh>
    <mesh position={[0,.59,0]} rotation={[Math.PI/2,0,0]} castShadow>
      <cylinderGeometry args={[.085,.085,2.57,8]}/>
      <meshStandardMaterial color="#d8b985" roughness={.77}/>
    </mesh>
    {[-1.17,1.17].map((z,i)=><mesh key={i} position={[0,.02,z]} castShadow>
      <boxGeometry args={[2.56,.12,.14]} />
      <meshStandardMaterial color="#d1b58e" roughness={.88}/>
    </mesh>)}
  </group>;
}
export function Cottage({palette,island,onRestore}:Props){
  const restored=island.cottage==='restored';
  const roofStars=useMemo(()=>[-.6,-.2,.25,.68],[]);
  return <group position={[1.69,.19,-.86]} rotation={[0,-.14,0]}
    onClick={(e)=>{ e.stopPropagation();onRestore(); }}
    onPointerOver={()=>{document.body.style.cursor='pointer';}}
    onPointerOut={()=>{document.body.style.cursor='auto';}}>
    <mesh position={[0,.98,0]} castShadow receiveShadow>
      <boxGeometry args={[2.28,1.78,2.02]} />
      <meshStandardMaterial color={palette.plaster} roughness={.92} />
    </mesh>
    <mesh position={[0,.25,.02]} castShadow>
      <boxGeometry args={[2.5,.18,2.21]} />
      <meshStandardMaterial color="#a2a88f" roughness={.9}/>
    </mesh>
    <Roof palette={palette}/>
    {/* Chimney: catches light, makes silhouette readable. */}
    <mesh position={[-.64,2.48,-.43]} castShadow>
      <boxGeometry args={[.40,1.14,.39]}/>
      <meshStandardMaterial color="#a78575" roughness={.91}/>
    </mesh>
    <mesh position={[-.64,3.05,-.43]} castShadow>
      <boxGeometry args={[.53,.13,.52]}/>
      <meshStandardMaterial color="#d4b9a0" roughness={.9}/>
    </mesh>
    {/* Front door with curved crown; opening faces camera. */}
    <mesh position={[.08,.88,1.034]} castShadow>
      <boxGeometry args={[.79,1.32,.15]}/>
      <meshStandardMaterial color={restored?"#9c6a50":"#6d544b"} roughness={.85}/>
    </mesh>
    <mesh position={[.08,1.52,1.042]} castShadow>
      <sphereGeometry args={[.405,20,12,0,Math.PI*2,0,Math.PI/2]}/>
      <meshStandardMaterial color={restored?"#9c6a50":"#6d544b"} roughness={.86}/>
    </mesh>
    <mesh position={[.32,.94,1.13]}>
      <sphereGeometry args={[.06,12,8]}/>
      <meshStandardMaterial color="#ffd58a" metalness={.5} roughness={.22}/>
    </mesh>
    {[-.72,.74].map((x,i)=><group key={i} position={[x,1.39,1.035]}>
      <mesh>
        <boxGeometry args={[.47,.62,.13]}/>
        <meshStandardMaterial color="#d8d2b1" roughness={.7}/>
      </mesh>
      <mesh position={[0,0,.072]}>
        <boxGeometry args={[.34,.48,.018]}/>
        <meshStandardMaterial color={restored?"#ffd58d":"#849da0"}
          emissive={restored?"#ffcf83":"#2f5058"} emissiveIntensity={restored?1.3:.12}/>
      </mesh>
      <mesh position={[0,0,.09]}>
        <boxGeometry args={[.035,.52,.027]}/>
        <meshStandardMaterial color="#e6dcaf"/>
      </mesh>
      <mesh position={[0,0,.09]}>
        <boxGeometry args={[.36,.035,.027]}/>
        <meshStandardMaterial color="#e6dcaf"/>
      </mesh>
    </group>)}
    <mesh position={[0,1.98,1.03]}>
      <circleGeometry args={[.29,28]}/>
      <meshStandardMaterial color={restored?"#ffe7a3":"#718e98"}
        emissive={restored?"#ffe2a5":"#44616a"} emissiveIntensity={restored?.9:.06}/>
    </mesh>
    {roofStars.map((x,i)=><mesh key={i} position={[x,2.76-Math.abs(x)*.52,1.12]}>
      <sphereGeometry args={[.022,7,6]}/>
      <meshBasicMaterial color="#e1c2a0"/>
    </mesh>)}
    <mesh position={[0,.1,1.46]} castShadow receiveShadow>
      <boxGeometry args={[1.25,.19,.76]}/>
      <meshStandardMaterial color="#c4ae8c" roughness={1}/>
    </mesh>
    <mesh position={[0,.025,2.03]} receiveShadow>
      <cylinderGeometry args={[.57,.65,.07,7]}/>
      <meshStandardMaterial color="#b3b59a" roughness={1}/>
    </mesh>
    {/* House is a full 3D object: shadows and material change across choices. */}
    {restored && <pointLight color="#ffd18a" intensity={34} distance={5} position={[0,1.5,1.15]}/>}
  </group>;
}
