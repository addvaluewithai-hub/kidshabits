import type { WorldArtManifest } from '../../../world-runtime/art/types';

/** Architecture-proof art package. Moon Garden stays intentionally shallow. */
export const moonGardenArtManifest: WorldArtManifest = {
  worldId: 'moon-garden',
  artVersion: 'v1',
  referenceSize: { width: 1080, height: 1920 },
  assets: [],
  locations: {
    'moon-terrace': {
      id: 'moon-terrace',
      mode: 'augment',
      focusPoint: { x: 0.72, y: 0.42 },
      ambientTint: 0xcfc7ff,
      layers: [],
    },
    'crater-garden': {
      id: 'crater-garden',
      mode: 'augment',
      focusPoint: { x: 0.62, y: 0.58 },
      ambientTint: 0xb9dfea,
      layers: [],
    },
  },
};
