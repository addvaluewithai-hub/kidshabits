import type { ThreePalette } from '../style/islandPalette';

const crowns=[
  [-.64,3.1,0,.92],[-.15,3.65,-.13,1.03],[.75,3.28,0,1],
  [-.96,2.73,.66,.83],[.60,2.92,.72,.94],
  [0,4.00,.38,.88],[.47,3.7,-.63,.88],[-1.00,3.56,-.4,.66],
] as const;
export function AncientTree({palette}:{palette:ThreePalette}){
  return <group position={[-2.18,.19,-.68]}>
    <mesh position={[0,1.43,0]} castShadow>
      <cylinderGeometry args={[.38,.68,2.80,10]}/>
      <meshStandardMaterial color="#786a52" roughness={1}/>
    </mesh>
    <mesh position={[0,1.41,.01]} rotation={[0,0,.16]} castShadow>
      <cylinderGeometry args={[.16,.29,2.84,9]}/>
      <meshStandardMaterial color="#998063" roughness={.95}/>
    </mesh>
    {[[-.54,1.29,-.24,-.65],[.5,1.48,.18,.62]].map(([x,y,z,angle],i)=>(
      <mesh key={i} position={[x,y,z]} rotation={[0,0,angle]} castShadow>
        <cylinderGeometry args={[.12,.24,2.35,8]}/>
        <meshStandardMaterial color="#78634c" roughness={1}/>
      </mesh>
    ))}
    {crowns.map(([x,y,z,s],i)=><mesh key={i} position={[x,y,z]} scale={[s*1.22,s*.82,s*1.12]} castShadow receiveShadow>
      <icosahedronGeometry args={[1,2]} />
      <meshStandardMaterial color={palette.foliage[i%palette.foliage.length]}
        roughness={.94} flatShading/>
    </mesh>)}
    {[[-1.13,.12,.62],[.38,.1,.86],[.83,.07,-.29]].map(([x,y,z],i)=>(
      <mesh key={i} position={[x,y,z]} rotation={[0,0,i*.5]} castShadow>
        <capsuleGeometry args={[.17,.67,4,8]}/>
        <meshStandardMaterial color="#776951" roughness={1}/>
      </mesh>
    ))}
    {/* Ancient tree's glowing rune: discovery stays authored, not AI-driven. */}
    <mesh position={[.13,1.47,.59]}>
      <torusGeometry args={[.20,.035,8,32]}/>
      <meshStandardMaterial color="#f7d08c" emissive="#ffc46f" emissiveIntensity={.7} metalness={.25}/>
    </mesh>
    <mesh position={[.13,1.47,.63]}>
      <octahedronGeometry args={[.09,0]}/>
      <meshBasicMaterial color="#ffe9a2"/>
    </mesh>
    <pointLight position={[.2,1.5,.8]} color="#e9bc7c" intensity={18} distance={3.0}/>
  </group>;
}
