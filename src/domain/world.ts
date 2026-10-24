/** The only authority for the first cottage and garden choices. No Three/React imports. */
export type FocusId='arrival_path'|'cottage_front'|'garden_edge';
export type HouseState='weathered'|'restored';
export type GardenState='empty'|'blooming';
export interface WorldSnapshot {
  version:1;
  cottage:HouseState;
  garden:GardenState;
  lastVisit:number;
}
export type WorldCommand={type:'RESTORE_COTTAGE'}|{type:'PLANT_GARDEN'};
export const INITIAL_WORLD:Readonly<WorldSnapshot>=Object.freeze({
 version:1,cottage:'weathered',garden:'empty',lastVisit:0
});
export function applyWorldCommand(state:WorldSnapshot,command:WorldCommand):WorldSnapshot{
 if(command.type==='RESTORE_COTTAGE')return state.cottage==='restored'?state:{...state,cottage:'restored'};
 if(command.type==='PLANT_GARDEN')return state.garden==='blooming'?state:{...state,garden:'blooming'};
 return state;
}
export function validateWorldSnapshot(value:unknown):value is WorldSnapshot{
 if(!value||typeof value!=='object')return false;
 const s=value as Record<string,unknown>;
 return s.version===1 && (s.cottage==='weathered'||s.cottage==='restored') &&
   (s.garden==='empty'||s.garden==='blooming') && typeof s.lastVisit==='number' &&
   Number.isFinite(s.lastVisit) && s.lastVisit>=0;
}
