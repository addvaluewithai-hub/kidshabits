import { useEffect,useMemo,useRef } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { FocusId } from '../../domain/world';
import { CAMERA_RIGS } from '../../content/cameraRigs';

export function PerspectiveCameraDirector({
 focus,onSettled,reducedMotion
}:{focus:FocusId;onSettled:()=>void;reducedMotion:boolean}){
 const {camera}=useThree();
 const gaze=useRef(new THREE.Vector3(...CAMERA_RIGS.arrival_path.lookAt));
 const destination=CAMERA_RIGS[focus];
 const targetPos=useMemo(()=>new THREE.Vector3(...destination.position),[destination]);
 const targetGaze=useMemo(()=>new THREE.Vector3(...destination.lookAt),[destination]);
 const didSignal=useRef<string>('arrival_path');
 useEffect(()=>{
  const start=CAMERA_RIGS.arrival_path;
  camera.position.set(...start.position);
  gaze.current.set(...start.lookAt);
  (camera as THREE.PerspectiveCamera).fov=start.fov;
  (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(gaze.current);
 },[camera]);
 useFrame((_,delta)=>{
  const factor=reducedMotion?1:1-Math.exp(-delta*2.7);
  camera.position.lerp(targetPos,factor);
  gaze.current.lerp(targetGaze,factor);
  const perspective=camera as THREE.PerspectiveCamera;
  const fov=THREE.MathUtils.lerp(perspective.fov,destination.fov,factor);
  if(Math.abs(perspective.fov-fov)>.001){
   perspective.fov=fov;perspective.updateProjectionMatrix();
  }
  camera.lookAt(gaze.current);
  const close=camera.position.distanceTo(targetPos)<.025
   && gaze.current.distanceTo(targetGaze)<.025
   && Math.abs(perspective.fov-destination.fov)<.03;
  if(close && didSignal.current!==focus) {
   didSignal.current=focus;
   onSettled();
  }
  if(!close && didSignal.current===focus) didSignal.current='';
 });
 return null;
}
