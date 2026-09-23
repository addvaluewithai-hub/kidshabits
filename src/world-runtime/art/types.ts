import type { WorldId, WorldProgress } from '../../worlds/types';

export type WorldArtAssetType = 'image' | 'svg';

export interface WorldArtAssetDefinition {
  id: string;
  type: WorldArtAssetType;
  url: string;
  /** Optional rasterization size for SVG assets. */
  svgSize?: { width: number; height: number };
}

export type WorldArtBand =
  | 'sky'
  | 'far'
  | 'mid'
  | 'terrain'
  | 'landmark'
  | 'story'
  | 'actor'
  | 'foreground'
  | 'atmosphere';

export type WorldArtFit = 'cover' | 'contain' | 'width' | 'height' | 'native';
export type WorldArtMotion = 'none' | 'float' | 'sway' | 'breathe' | 'drift';
export type WorldArtBlendMode = 'normal' | 'add' | 'multiply' | 'screen';

export interface WorldArtVisibilityCondition {
  flag?: string;
  value?: boolean;
  minDay?: number;
  maxDay?: number;
}

export interface WorldArtLayerDefinition {
  id: string;
  assetId: string;
  band: WorldArtBand;
  /** Normalized viewport position. (0,0)=top-left, (1,1)=bottom-right. */
  position: { x: number; y: number };
  origin?: { x: number; y: number };
  fit?: WorldArtFit;
  /** Additional authored scale after fit/reference scaling. */
  scale?: number;
  parallax?: number;
  alpha?: number;
  blendMode?: WorldArtBlendMode;
  tint?: number;
  rotation?: number;
  motion?: WorldArtMotion;
  when?: WorldArtVisibilityCondition;
}

export interface WorldArtLocationDefinition {
  id: string;
  /**
   * augment: illustrated layers sit alongside the procedural/debug presentation.
   * replace: when at least one authored layer is active, procedural scenery is cleared.
   */
  mode?: 'augment' | 'replace';
  focusPoint?: { x: number; y: number };
  ambientTint?: number;
  layers: readonly WorldArtLayerDefinition[];
}

export interface WorldArtManifest {
  worldId: WorldId;
  artVersion: string;
  referenceSize?: { width: number; height: number };
  assets: readonly WorldArtAssetDefinition[];
  locations: Readonly<Record<string, WorldArtLocationDefinition>>;
}

export interface WorldArtCompositionResult {
  activeLayerCount: number;
  replacesProceduralBase: boolean;
  focusPoint?: { x: number; y: number };
  ambientTint?: number;
}

export function isWorldArtLayerVisible(layer: WorldArtLayerDefinition, progress: WorldProgress) {
  const condition = layer.when;
  if (!condition) return true;
  if (condition.minDay !== undefined && progress.day < condition.minDay) return false;
  if (condition.maxDay !== undefined && progress.day > condition.maxDay) return false;
  if (condition.flag) {
    const expected = condition.value ?? true;
    if (Boolean(progress.flags[condition.flag]) !== expected) return false;
  }
  return true;
}
