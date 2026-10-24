import { describe,it,expect } from 'vitest';
import {INITIAL_WORLD,applyWorldCommand,validateWorldSnapshot} from '../src/domain/world';
import {CAMERA_RIGS} from '../src/content/cameraRigs';
import {novaLine} from '../src/content/novaLines';

describe('grounded world domain and camera rigs',()=>{
 it('makes distinct deterministic visible changes without rewriting the source',()=>{
  const cottage=applyWorldCommand({...INITIAL_WORLD},{type:'RESTORE_COTTAGE'});
  const both=applyWorldCommand(cottage,{type:'PLANT_GARDEN'});
  expect(INITIAL_WORLD.cottage).toBe('weathered');
  expect(cottage.cottage).toBe('restored');
  expect(both.garden).toBe('blooming');
  expect(applyWorldCommand(both,{type:'RESTORE_COTTAGE'})).toBe(both);
 });
 it('refuses invalid saved snapshots',()=>{
  expect(validateWorldSnapshot({...INITIAL_WORLD})).toBe(true);
  expect(validateWorldSnapshot({...INITIAL_WORLD,garden:'blocked'})).toBe(false);
  expect(validateWorldSnapshot({version:1,cottage:'restored'})).toBe(false);
 });
 it('keeps every camera at ground-level perspective height',()=>{
  for(const rig of Object.values(CAMERA_RIGS)){
   expect(rig.position[1]).toBeGreaterThan(.8);
   expect(rig.position[1]).toBeLessThan(2.2);
   expect(rig.fov).toBeGreaterThanOrEqual(45);
  }
 });
 it('Nova remembers the saved world on a return visit',()=>{
  expect(novaLine({...INITIAL_WORLD,cottage:'restored',garden:'blooming'},'arrival_path')).toContain('رجعتي');
 });
});
