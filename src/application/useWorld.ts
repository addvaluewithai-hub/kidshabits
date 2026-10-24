import { useCallback,useState } from 'react';
import { applyWorldCommand,type FocusId,type WorldCommand } from '../domain/world';
import {loadWorld,saveWorld} from '../infrastructure/storage/worldStorage';

export function useWorld(){
 const [world,setWorld]=useState(loadWorld);
 const [focus,setFocus]=useState<FocusId>('arrival_path');
 const [settled,setSettled]=useState(true);
 const dispatch=useCallback((action:WorldCommand)=>{
  setWorld(s=>{const next=applyWorldCommand(s,action);saveWorld(next);return next;});
 },[]);
 const navigate=useCallback((to:FocusId)=>{
  setFocus(to);setSettled(false);
 },[]);
 const completeTravel=useCallback(()=>setSettled(true),[]);
 const cottage=useCallback(()=>{navigate('cottage_front');dispatch({type:'RESTORE_COTTAGE'});},[navigate,dispatch]);
 const garden=useCallback(()=>{navigate('garden_edge');dispatch({type:'PLANT_GARDEN'});},[navigate,dispatch]);
 const home=useCallback(()=>navigate('arrival_path'),[navigate]);
 return {world,focus,settled,completeTravel,cottage,garden,home};
}
