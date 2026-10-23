import { INITIAL_ISLAND, parseIslandSnapshot, type IslandSnapshot } from '../../domain/island/model';

const STORAGE_KEY = 'kidshabits:island:v1';

export function loadIsland(): IslandSnapshot {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseIslandSnapshot(JSON.parse(raw)) : { ...INITIAL_ISLAND };
  } catch {
    return { ...INITIAL_ISLAND };
  }
}

export function saveIsland(snapshot: IslandSnapshot): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}
