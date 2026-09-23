import type { WorldId } from '../../worlds/types';
import { moonGardenArtManifest } from '../../worlds/moon-garden/art/manifest';
import { sproutArtManifest } from '../../worlds/sprout-planet/art/manifest';
import type { WorldArtManifest } from './types';

const manifests: Record<WorldId, WorldArtManifest> = {
  sprout: sproutArtManifest,
  'moon-garden': moonGardenArtManifest,
};

export function getWorldArtManifest(worldId: WorldId) {
  return manifests[worldId];
}
