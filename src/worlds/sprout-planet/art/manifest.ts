import type { WorldArtManifest } from '../../../world-runtime/art/types';

/**
 * Production illustration slots for Sprout Planet.
 *
 * Asset lists are intentionally empty until the first seven days are art-directed.
 * Adding painted layers should be a data change here, not a WorldHost rewrite.
 */
export const sproutArtManifest: WorldArtManifest = {
  worldId: 'sprout',
  artVersion: 'v1',
  referenceSize: { width: 1080, height: 1920 },
  assets: [],
  locations: {
    'landing-meadow': {
      id: 'landing-meadow',
      mode: 'augment',
      focusPoint: { x: 0.79, y: 0.44 },
      ambientTint: 0xfff0b8,
      layers: [],
    },
    'river-clearing': {
      id: 'river-clearing',
      mode: 'augment',
      focusPoint: { x: 0.69, y: 0.62 },
      ambientTint: 0xd9efdf,
      layers: [],
    },
  },
};
