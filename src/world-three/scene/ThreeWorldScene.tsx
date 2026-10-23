import type { IslandSnapshot, WorldFocus } from '../../domain/island/model';
import { WARM_STORYBOOK } from '../style/islandPalette';
import { Atmosphere } from './Atmosphere';
import { IslandGround } from './IslandGround';
import { AncientTree } from '../objects/AncientTree';
import { Cottage } from '../objects/Cottage';
import { MagicGarden } from '../objects/MagicGarden';
import { NovaSpirit } from '../actors/NovaSpirit';

export function ThreeWorldScene({island,focus,onCottage,onGarden}:{
 island:IslandSnapshot;focus:WorldFocus;onCottage:()=>void;onGarden:()=>void;
}){
 return <>
   <Atmosphere/>
   <IslandGround palette={WARM_STORYBOOK}/>
   <AncientTree palette={WARM_STORYBOOK}/>
   <Cottage palette={WARM_STORYBOOK} island={island} onRestore={onCottage}/>
   <MagicGarden island={island} onPlant={onGarden}/>
   <NovaSpirit focus={focus} palette={WARM_STORYBOOK}/>
 </>;
}
