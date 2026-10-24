import * as THREE from 'three';

const gable=new THREE.Shape();
gable.moveTo(-1.82,2.89);
gable.lineTo(0,4.16);
gable.lineTo(1.82,2.89);
gable.closePath();
import type { WorldSnapshot } from '../../domain/world';
const plaster='#efdebb';
export function WorldCottage({world,onChoose}:{world:WorldSnapshot;onChoose:()=>void}){
 const restored=world.cottage==='restored';
 return <group position={[1.45,0,-6.9]} onClick={e=>{e.stopPropagation();onChoose()}}
   onPointerOver={()=>{document.body.style.cursor='pointer'}}
   onPointerOut={()=>{document.body.style.cursor='auto'}}>
  {/* Full-scale cottage: stone threshold, timber framing and steep blue roof. */}
  <mesh position={[0,1.46,0]} castShadow receiveShadow>
    <boxGeometry args={[3.8,2.92,3.13]}/><meshStandardMaterial color={plaster} roughness={.96}/>
  </mesh>
  <mesh position={[0,.13,.1]} castShadow receiveShadow>
   <boxGeometry args={[4.1,.23,3.5]}/><meshStandardMaterial color="#9eaa92" roughness={.92}/>
  </mesh>
  {[-1.76,1.76].map((x,i)=><mesh key={i} position={[x,1.42,1.59]} castShadow>
    <boxGeometry args={[.17,2.86,.18]}/><meshStandardMaterial color="#a17758" roughness={.9}/>
  </mesh>)}
  <mesh position={[0,2.80,1.62]} castShadow><boxGeometry args={[3.78,.20,.18]}/><meshStandardMaterial color="#ac8464"/></mesh>
  <mesh position={[0,0,1.57]} castShadow receiveShadow>
   <shapeGeometry args={[gable]}/><meshStandardMaterial color="#e9d4ad" roughness={.9} side={THREE.DoubleSide}/>
  </mesh>
  {[-1,1].map((side,i)=><mesh key={i} position={[side*.98,3.45,0]} rotation={[0,0,-side*.59]} castShadow receiveShadow>
    <boxGeometry args={[2.38,.29,3.72]}/><meshStandardMaterial color={restored?'#577e90':'#496a78'} roughness={.78}/>
  </mesh>)}
  <mesh position={[-.90,4.05,-.50]} castShadow><boxGeometry args={[.60,1.52,.60]}/><meshStandardMaterial color="#bd9980" roughness={.92}/></mesh>
  <mesh position={[-.9,4.83,-.5]} castShadow><boxGeometry args={[.79,.18,.79]}/><meshStandardMaterial color="#d5b49a"/></mesh>
  {/* Front door faces the arrival path and glows when repaired. */}
  <mesh position={[0,.98,1.605]} castShadow>
    <boxGeometry args={[1.06,1.94,.15]}/>
    <meshStandardMaterial color={restored?'#ab7654':'#675b55'} roughness={.78}/>
  </mesh>
  <mesh position={[0,1.91,1.608]}><sphereGeometry args={[.54,18,10,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={restored?'#ab7654':'#675b55'}/></mesh>
  <mesh position={[.32,1.12,1.72]}><sphereGeometry args={[.072,8,8]}/><meshStandardMaterial color="#eac48d" metalness={.65} roughness={.27}/></mesh>
  {[-1.18,1.18].map((x,i)=><group key={i} position={[x,1.81,1.61]}>
    <mesh castShadow><boxGeometry args={[.76,1.0,.16]}/><meshStandardMaterial color="#ded2ac"/></mesh>
    <mesh position={[0,0,.085]}><boxGeometry args={[.59,.82,.025]}/>
       <meshStandardMaterial color={restored?'#ffdda0':'#829da0'} emissive={restored?'#ffbd6d':'#21424d'} emissiveIntensity={restored?1.2:.14}/></mesh>
    <mesh position={[0,0,.105]}><boxGeometry args={[.05,.88,.025]}/><meshStandardMaterial color="#e7d6b4"/></mesh>
    <mesh position={[0,0,.109]}><boxGeometry args={[.64,.05,.02]}/><meshStandardMaterial color="#e7d6b4"/></mesh>
    <mesh position={[0,-.64,.26]} castShadow><boxGeometry args={[.85,.16,.43]}/><meshStandardMaterial color="#bc9b79"/></mesh>
  </group>)}
  <mesh name="cottage-lamp" visible={restored} position={[0,2.38,1.8]}>
    <sphereGeometry args={[.19,14,10]}/>
    <meshStandardMaterial color="#ffe3a9" emissive="#ffc978" emissiveIntensity={2}/>
  </mesh>
  {restored&&<pointLight color="#ffcb84" intensity={26} distance={6.5} position={[0,2.2,1.7]}/>}
  <mesh position={[0,.10,2.12]} castShadow receiveShadow><boxGeometry args={[1.63,.15,.84]}/><meshStandardMaterial color="#d0bc97"/></mesh>
  <mesh position={[.7,3.90,1.5]}><sphereGeometry args={[.095,10,6]}/><meshBasicMaterial color="#ffe5b6"/></mesh>
 </group>
}
