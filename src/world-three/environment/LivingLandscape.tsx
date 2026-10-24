import { useMemo } from 'react';
import * as THREE from 'three';

const stones=Array.from({length:23},(_,i)=>{
 const a=i*2.399963;
 return {x:Math.sin(a)*(5+(i%5)*.71),z:Math.cos(a)*(5+(i%5)*.62)-5,r:.12+(i%4)*.055};
});
const flowerSprays=Array.from({length:75},(_,i)=>{
 const a=i*2.39996,r=3.7+(i%11)*.85;
 return {x:Math.sin(a)*r,z:Math.cos(a)*r-8,s:.08+(i%3)*.03};
});
const woods=Array.from({length:35},(_,i)=>{
 const side=i%2===0?-1:1;
 return {x:side*(8+(i%8)*2.9),z:-24-Math.floor(i/3)*5.3,s:.65+(i%6)*.14};
});
function Pine({x,z,s,index}:{x:number;z:number;s:number;index:number}){
 return <group position={[x,0,z]} scale={s}>
  <mesh position={[0,1.15,0]} castShadow><cylinderGeometry args={[.20,.30,2.3,6]}/><meshStandardMaterial color="#6f6652"/></mesh>
  {[0,1,2].map(i=><mesh key={i} position={[0,1.75+i*.9,0]} castShadow>
   <coneGeometry args={[1.16-i*.20,2.45-i*.3,7]}/>
   <meshStandardMaterial color={index%3===0?'#4f8576':index%3===1?'#6b9980':'#356e65'} roughness={.92} flatShading/>
  </mesh>)}
 </group>;
}
function AncientTree(){
 const crowns:[number,number,number,number][]=[
  [-.95,4.8,-.35,1.64],[-.05,5.8,-.7,1.74],[1.20,5.0,0,1.60],
  [-1.44,4.45,.8,1.4],[.7,5.2,1.05,1.45],[-.9,6.4,.8,1.40]
 ];
 return <group position={[-5.25,0,-8.8]}>
  <mesh position={[0,2.42,0]} castShadow><cylinderGeometry args={[.43,.72,4.85,9]}/><meshStandardMaterial color="#7c6551" roughness={1}/></mesh>
  {[-1,1].map((side,i)=><mesh key={i} position={[side*.90,3.10,0]} rotation={[0,0,side*.55]} castShadow>
   <cylinderGeometry args={[.19,.39,3.3,8]}/><meshStandardMaterial color="#856b55" roughness={.95}/>
  </mesh>)}
  {crowns.map(([x,y,z,s],i)=><mesh key={i} position={[x,y,z]} scale={[s,s*.84,s]} castShadow>
    <icosahedronGeometry args={[1,2]}/>
    <meshStandardMaterial color={['#377c67','#568b74','#6b9f7c','#3b7269'][i%4]} roughness={1} flatShading/>
  </mesh>)}
  <mesh name="tree-rune" position={[.10,2.05,.56]}><torusGeometry args={[.28,.065,8,26]}/><meshStandardMaterial color="#ffda9c" emissive="#fbc273" emissiveIntensity={1}/></mesh>
  <pointLight position={[0,2.1,.8]} color="#ffcf93" intensity={19} distance={4}/>
 </group>;
}
function Cloud({x,y,z,s}:{x:number;y:number;z:number;s:number}){
 return <group position={[x,y,z]} scale={s}>
  {[[-1,0,.0],[0,.32,.0],[1.1,.0,.0],[.25,-.17,.0]].map(([a,b,c],i)=><mesh key={i} position={[a,b,c]} scale={[1.18,.54,.52]}>
    <sphereGeometry args={[1,12,8]}/>
    <meshBasicMaterial color="#fffbdd" transparent opacity={.53} depthWrite={false}/>
  </mesh>)}
 </group>;
}
export function LivingLandscape(){
 const ground=useMemo(()=>new THREE.Color('#77ab80'),[]);
 return <>
  <color attach="background" args={['#b4d7d4']}/>
  <fog attach="fog" args={['#b4d7d4',38,135]}/>
  <hemisphereLight color="#f6f3d6" groundColor="#55766b" intensity={1.8}/>
  <ambientLight intensity={.27}/>
  <directionalLight position={[-11,18,13]} intensity={3.1} color="#ffe1b2" castShadow
   shadow-mapSize={[1024,1024]} shadow-bias={-.00045}
   shadow-camera-near={.2} shadow-camera-far={55}
   shadow-camera-left={-23} shadow-camera-right={23}
   shadow-camera-top={23} shadow-camera-bottom={-23}/>
  <directionalLight position={[12,9,-8]} intensity={.8} color="#92c6ba"/>
  <mesh position={[0,-.14,-20]} rotation={[-Math.PI/2,0,0]} receiveShadow>
    <planeGeometry args={[280,280]}/>
    <meshStandardMaterial color={ground} roughness={1}/>
  </mesh>
  {/* A human-scale path extends past the camera and curves toward the cottage. */}
  <mesh position={[.38,-.08,6.2]} rotation={[-Math.PI/2,0,-.055]} receiveShadow>
    <planeGeometry args={[3.15,43]}/>
    <meshStandardMaterial color="#bfa982" roughness={1}/>
  </mesh>
  <mesh position={[1.03,-.075,-16.8]} rotation={[-Math.PI/2,0,-.21]} receiveShadow>
    <planeGeometry args={[3.1,21]}/>
    <meshStandardMaterial color="#c3b48b" roughness={1}/>
  </mesh>
  {[...Array(16)].map((_,i)=><mesh key={i} position={[.3+Math.sin(i*.8)*.35,-.022,7.4-i*1.25]}
   rotation={[-Math.PI/2,0,i*.19]} receiveShadow>
   <circleGeometry args={[.25+(i%3)*.12,7]}/>
   <meshStandardMaterial color={i%3===0?'#e0cba0':'#dac49d'} roughness={1}/>
  </mesh>)}
  {stones.map((p,i)=><mesh key={i} position={[p.x,p.r*.4,p.z]}
    rotation={[.12,i*.39,.1]} castShadow>
   <dodecahedronGeometry args={[p.r,0]}/>
   <meshStandardMaterial color={i%2?'#a8b8a1':'#8eaca1'} roughness={.96}/>
  </mesh>)}
  {flowerSprays.map((p,i)=><group key={i} position={[p.x,0,p.z]} scale={p.s}>
    <mesh position={[0,1.3,0]}><cylinderGeometry args={[.16,.18,2.6,4]}/><meshStandardMaterial color="#3c765b"/></mesh>
    <mesh position={[0,2.5,0]}><sphereGeometry args={[.66,7,5]}/><meshStandardMaterial color={i%6===0?'#fce7ba':'#d6e5b1'} roughness={.8}/></mesh>
  </group>)}
  {woods.map((p,i)=><Pine key={i} x={p.x} z={p.z} s={p.s} index={i}/>)}
  <AncientTree/>
  {[[-44,-2,-77,26],[3,-5,-110,31],[55,-2,-76,29]].map(([x,y,z,s],i)=><mesh key={i} position={[x,y,z]} rotation={[0,i*.8,0]}>
    <coneGeometry args={[s,s*.82,8]}/>
    <meshStandardMaterial color={i===1?'#82aa9a':'#7faeaa'} roughness={1} flatShading/>
  </mesh>)}
  <Cloud x={-22} y={19} z={-54} s={4.2}/>
  <Cloud x={22} y={22} z={-90} s={6}/>
  <Cloud x={-3} y={15} z={-90} s={2.8}/>
 </>;
}
