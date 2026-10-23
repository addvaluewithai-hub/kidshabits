import { useState } from 'react';
import { executeIslandCommand, initializeIsland } from '../../application/islandController';
import type { IslandCommand, WorldFocus } from '../../domain/island/model';

export function useIsland() {
  const [snapshot, setSnapshot] = useState(initializeIsland);
  const [focus, setFocus] = useState<WorldFocus>('idle');

  function act(command: IslandCommand, nextFocus: WorldFocus) {
    setSnapshot(current => executeIslandCommand(current, command));
    setFocus(nextFocus);
  }

  function reset() {
    setSnapshot(current => executeIslandCommand(current, { type: 'reset-island' }));
    setFocus('idle');
  }

  return { snapshot, focus, act, reset };
}
