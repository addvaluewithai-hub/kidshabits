import { moonGardenManifest } from './moon-garden/manifest';
import { sproutPlanetManifest } from './sprout-planet/manifest';
import type { WorldId, WorldManifest } from './types';

export const WORLD_MANIFESTS: readonly WorldManifest[] = [
  sproutPlanetManifest,
  moonGardenManifest,
];

const byId = Object.fromEntries(WORLD_MANIFESTS.map(world => [world.id, world])) as Record<WorldId, WorldManifest>;

export function getWorldManifest(id: WorldId): WorldManifest {
  return byId[id];
}

export function isWorldId(value: unknown): value is WorldId {
  return typeof value === 'string' && value in byId;
}
