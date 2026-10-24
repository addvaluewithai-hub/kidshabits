import type { FocusId } from '../domain/world';
export type Vec3=readonly[number,number,number];
export interface CameraRig {
 id:FocusId;
 position:Vec3;
 lookAt:Vec3;
 fov:number;
}
/** Y coordinates in world meters: eye level 1.4–1.65m, never aerial. */
export const CAMERA_RIGS:Readonly<Record<FocusId,CameraRig>>={
 arrival_path:{id:'arrival_path',position:[0,1.55,8.4],lookAt:[0,1.68,-5.9],fov:58},
 cottage_front:{id:'cottage_front',position:[1.2,1.55,0.7],lookAt:[1.2,1.55,-5.95],fov:62},
 garden_edge:{id:'garden_edge',position:[-2.0,1.48,2.35],lookAt:[-1.9,0.94,-3.45],fov:58},
};
