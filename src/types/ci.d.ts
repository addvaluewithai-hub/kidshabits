import type { Object3D,Scene,Camera } from 'three';
declare global{
 interface Window{
  __KH_CI__?:{
   scene:Scene;
   camera:Camera;
   snapshot:()=>{objects:{cottage:unknown;garden:unknown};sceneObjectCount:number;cameraPose:{isPerspective:boolean;position:number[]}};
  };
 }
}
export type SceneHandle={scene:Scene;camera:Camera;root?:Object3D};
