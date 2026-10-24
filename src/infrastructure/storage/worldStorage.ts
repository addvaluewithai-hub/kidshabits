import { INITIAL_WORLD,validateWorldSnapshot,type WorldSnapshot } from '../../domain/world';
const KEY='kidshabits.immersive.world.v1';
export function loadWorld():WorldSnapshot{
 try{
  const raw=window.localStorage.getItem(KEY);
  if(!raw)return {...INITIAL_WORLD};
  const snapshot:unknown=JSON.parse(raw);
  return validateWorldSnapshot(snapshot)?snapshot:{...INITIAL_WORLD};
 }catch{
  return {...INITIAL_WORLD};
 }
}
export function saveWorld(snapshot:WorldSnapshot):void{
 try{window.localStorage.setItem(KEY,JSON.stringify(snapshot));}catch{/* private mode: safe in-memory play */}
}
