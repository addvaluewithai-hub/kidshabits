import type Phaser from 'phaser';
import type { WorldProgress } from '../worlds/types';

export interface WorldLayers {
  sky: Phaser.GameObjects.Graphics;
  far: Phaser.GameObjects.Graphics;
  mid: Phaser.GameObjects.Graphics;
  ground: Phaser.GameObjects.Graphics;
  detail: Phaser.GameObjects.Graphics;
}

export interface WorldDrawContext {
  width: number;
  height: number;
  progress: WorldProgress;
  revealFlag: string;
  sequenceRunning: boolean;
  layers: WorldLayers;
}

export interface WorldDrawResult {
  focusPoint: { x: number; y: number };
  ambientTint: number;
}

export type WorldPresentation = (context: WorldDrawContext) => WorldDrawResult;

export function clearWorldLayers(layers: WorldLayers) {
  layers.sky.clear();
  layers.far.clear();
  layers.mid.clear();
  layers.ground.clear();
  layers.detail.clear();
}
