import { reduceIsland, type IslandCommand, type IslandSnapshot } from '../domain/island/model';
import { loadIsland, saveIsland } from '../infrastructure/storage/islandStorage';

export function initializeIsland(): IslandSnapshot {
  return loadIsland();
}

export function executeIslandCommand(current: IslandSnapshot, command: IslandCommand): IslandSnapshot {
  const next = reduceIsland(current, command);
  saveIsland(next);
  return next;
}
