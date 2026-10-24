import { useCallback,useEffect,useState } from 'react';
import { applyWorldCommand,type FocusId,type WorldCommand } from '../domain/world';
import {loadWorld,saveWorld} from '../infrastructure/storage/worldStorage';

export function useWorld(){
 const [world,setWorld]=useState(loadWorld);
 const [focus,setFocus]=useState<FocusId>('arrival_path');
 const [settled,setSettled]=useState(true);
 useEffect(()=>saveWorld(world),[world]);
 const dispatch=useCallback((action:WorldCommand)=>{
  setWorld(s=>applyWorldCommand(s,action));
 },[]);
 const navigate=useCallback((to:FocusId)=>{
  if(focus===to){setSettled(true);return;}
  setFocus(to);setSettled(false);
 },[focus]);
 const completeTravel=useCallback(()=>setSettled(true),[]);
 const cottage=useCallback(()=>{navigate('cottage_front');dispatch({type:'RESTORE_COTTAGE'});},[navigate,dispatch]);
 const garden=useCallback(()=>{navigate('garden_edge');dispatch({type:'PLANT_GARDEN'});},[navigate,dispatch]);
 const home=useCallback(()=>navigate('arrival_path'),[navigate]);
 return {world,focus,settled,completeTravel,cottage,garden,home};
}
