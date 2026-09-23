import type { WorldId } from '../../worlds/types';
import { getWorldManifest } from '../../worlds/registry';
import { moonGardenArtManifest } from '../../worlds/moon-garden/art/manifest';
import { sproutArtManifest } from '../../worlds/sprout-planet/art/manifest';
import type { WorldArtManifest } from './types';
import { assertValidWorldArtManifest } from './validate';

const manifests: Record<WorldId, WorldArtManifest> = {
  sprout: sproutArtManifest,
  'moon-garden': moonGardenArtManifest,
};

(Object.keys(manifests) as WorldId[]).forEach(worldId => {
  assertValidWorldArtManifest(manifests[worldId], getWorldManifest(worldId));
});

export function getWorldArtManifest(worldId: WorldId) {
  return manifests[worldId];
}
