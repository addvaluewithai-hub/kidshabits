export type WorldId = 'sprout' | 'moon-garden';

export interface WorldLocationDefinition {
  id: string;
  nameAr: string;
}

export interface WorldDayOneDefinition {
  revealSequenceId: string;
  revealEventId: string;
  revealFlag: string;
  primaryAction: {
    id: string;
    labelAr: string;
    hintAr: string;
    fromLocationId: string;
    toLocationId: string;
    sequenceId: string;
    eventId: string;
    requiresFlag: string;
  };
  copy: {
    beforeRevealAr: string;
    revealingAr: string;
    afterRevealAr: string;
    secondLocationAr: string;
  };
}

export interface WorldManifest {
  id: WorldId;
  folder: string;
  nameAr: string;
  subtitleAr: string;
  descriptionAr: string;
  glyph: string;
  totalDays: number;
  startingLocationId: string;
  locations: Record<string, WorldLocationDefinition>;
  dayOne: WorldDayOneDefinition;
  presentationId: WorldId;
  availability: 'available' | 'preview';
}

/**
 * WorldProgress contains only story/world truth. Real-life habit check-ins are
 * deliberately stored in the app-level daily ledger, because one real-life
 * action must not be duplicated just because the child changes planets.
 */
export interface WorldProgress {
  day: number;
  locationId: string;
  pendingSequence: string | null;
  eventsSeen: string[];
  flags: Record<string, boolean>;
}

export function createWorldProgress(manifest: WorldManifest): WorldProgress {
  return {
    day: 1,
    locationId: manifest.startingLocationId,
    pendingSequence: null,
    eventsSeen: [],
    flags: {},
  };
}
