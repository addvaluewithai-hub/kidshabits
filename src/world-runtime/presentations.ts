import { drawMoonGarden } from '../worlds/moon-garden/presentation';
import { drawSproutWorld } from '../worlds/sprout-planet/presentation';
import type { WorldId } from '../worlds/types';
import type { WorldPresentation } from './presentation';

const PRESENTATIONS: Record<WorldId, WorldPresentation> = {
  sprout: drawSproutWorld,
  'moon-garden': drawMoonGarden,
};

export function getWorldPresentation(id: WorldId): WorldPresentation {
  return PRESENTATIONS[id];
}
