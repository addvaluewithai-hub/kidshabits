import type { AppSnapshot } from '../app/state';
import { WORLD_MANIFESTS } from './registry';
import type { WorldId, WorldManifest, WorldProgress } from './types';

export type JourneyWorldState = 'completed' | 'current' | 'future';

export function worldHasStarted(world: WorldManifest, progress: WorldProgress) {
  return progress.day > 1
    || progress.locationId !== world.startingLocationId
    || progress.eventsSeen.length > 0
    || Object.values(progress.flags).some(Boolean);
}

export function worldIsCompleted(world: WorldManifest, progress: WorldProgress) {
  return progress.day >= world.totalDays || progress.flags.worldComplete === true;
}

export function currentJourneyWorldId(snapshot: AppSnapshot): WorldId {
  const active = snapshot.activeWorldId;
  if (active) {
    const activeWorld = WORLD_MANIFESTS.find(world => world.id === active);
    if (activeWorld && worldHasStarted(activeWorld, snapshot.worlds[active])) return active;
  }

  const firstIncompleteStarted = WORLD_MANIFESTS.find(world => {
    const progress = snapshot.worlds[world.id];
    return worldHasStarted(world, progress) && !worldIsCompleted(world, progress);
  });
  if (firstIncompleteStarted) return firstIncompleteStarted.id;

  const firstAvailable = WORLD_MANIFESTS.find(world => world.availability === 'available');
  return (firstAvailable ?? WORLD_MANIFESTS[0]).id;
}

export function journeyStateFor(snapshot: AppSnapshot, world: WorldManifest, index: number): JourneyWorldState {
  const progress = snapshot.worlds[world.id];
  if (worldIsCompleted(world, progress)) return 'completed';
  if (world.id === currentJourneyWorldId(snapshot)) return 'current';

  // Preserve access to worlds somebody already started in an earlier preview.
  if (worldHasStarted(world, progress)) return 'current';

  const previous = WORLD_MANIFESTS[index - 1];
  if (index > 0 && previous) {
    const previousCompleted = worldIsCompleted(previous, snapshot.worlds[previous.id]);
    if (previousCompleted && world.availability === 'available') return 'current';
  }

  return 'future';
}

export function canEnterJourneyWorld(snapshot: AppSnapshot, world: WorldManifest, index: number) {
  return journeyStateFor(snapshot, world, index) !== 'future';
}
