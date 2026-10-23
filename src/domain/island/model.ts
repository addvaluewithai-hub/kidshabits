/** Durable, renderer-independent domain state. Nothing here imports Phaser or React. */
export type WorldFocus = 'idle' | 'cottage' | 'garden';
export type CottageStyle = 'sleeping' | 'restored';
export type GardenStyle = 'empty' | 'blooming';

export interface IslandSnapshot {
  schemaVersion: 1;
  islandName: string;
  cottage: CottageStyle;
  garden: GardenStyle;
}

export type IslandCommand =
  | { type: 'restore-cottage' }
  | { type: 'plant-garden' }
  | { type: 'reset-island' };

export const INITIAL_ISLAND: Readonly<IslandSnapshot> = {
  schemaVersion: 1,
  islandName: 'جزيرتي العجيبة',
  cottage: 'sleeping',
  garden: 'empty',
};

export function reduceIsland(previous: IslandSnapshot, command: IslandCommand): IslandSnapshot {
  switch (command.type) {
    case 'restore-cottage':
      return { ...previous, cottage: 'restored' };
    case 'plant-garden':
      return { ...previous, garden: 'blooming' };
    case 'reset-island':
      return { ...INITIAL_ISLAND };
  }
}

export function parseIslandSnapshot(input: unknown): IslandSnapshot {
  if (!input || typeof input !== 'object') return { ...INITIAL_ISLAND };
  const candidate = input as Record<string, unknown>;
  if (candidate.schemaVersion !== 1) return { ...INITIAL_ISLAND };
  if (candidate.cottage !== 'sleeping' && candidate.cottage !== 'restored') return { ...INITIAL_ISLAND };
  if (candidate.garden !== 'empty' && candidate.garden !== 'blooming') return { ...INITIAL_ISLAND };
  return {
    schemaVersion: 1,
    islandName: typeof candidate.islandName === 'string'
      ? candidate.islandName.slice(0, 40) || INITIAL_ISLAND.islandName
      : INITIAL_ISLAND.islandName,
    cottage: candidate.cottage,
    garden: candidate.garden,
  };
}
