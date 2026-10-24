import type { FocusId,WorldSnapshot } from '../domain/world';

export function novaLine(world:WorldSnapshot,focus:FocusId):string{
 if(focus==='cottage_front')return world.cottage==='restored'
  ?'يا سلام! البيت رجع ينور! تفتكري مين كان عايش هنا زمان؟'
  :'بصي للبيت! تحبي نرجّع له نوره؟';
 if(focus==='garden_edge')return world.garden==='blooming'
  ?'دي أول زهرة من اختيارك! العالم بدأ يصحى.'
  :'المكان ده ناقصه حاجة خضرا... تحبي نزرع زهرة؟';
 if(world.cottage==='restored'&&world.garden==='blooming')
   return 'رجعتي! البيت لسه منوّر وزهرتك مستنياكي. نكمل اكتشاف؟';
 if(world.cottage==='restored')return 'أهلًا برجوعك! البيت اللي صلحتيه لسه منوّر.';
 if(world.garden==='blooming')return 'رجعتي تاني! زهرتك لسه جميلة زي ما سبتيها.';
 return 'بصي قدامك! بيت قديم وشجرة كبيرة... تفتكري نقدر نخلي المكان ده بيتنا؟';
}
