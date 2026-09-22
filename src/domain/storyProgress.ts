import type { AppSnapshot, StorySequence } from '../app/state';
import { getWorldManifest } from '../worlds/registry';
import type { WorldId, WorldProgress } from '../worlds/types';

function updateWorld(snapshot: AppSnapshot, worldId: WorldId, next: WorldProgress): AppSnapshot {
  return { ...snapshot, worlds: { ...snapshot.worlds, [worldId]: next } };
}

export function enterWorld(snapshot: AppSnapshot, worldId: WorldId): AppSnapshot {
  return { ...snapshot, activeWorldId: worldId, phase: 'world' };
}

export function returnToWorldBrowser(snapshot: AppSnapshot): AppSnapshot {
  return { ...snapshot, phase: 'world_browser', activeWorldId: null };
}

export function completeHabit(snapshot: AppSnapshot, habitId: string): AppSnapshot {
  const worldId = snapshot.activeWorldId;
  if (!worldId || !snapshot.habits.includes(habitId)) return snapshot;
  const manifest = getWorldManifest(worldId);
  const progress = snapshot.worlds[worldId];
  if (progress.completedHabits.includes(habitId)) return snapshot;

  const completedHabits = [...progress.completedHabits, habitId];
  const thresholdReached = completedHabits.length >= snapshot.requiredHabits;
  const alreadyRevealed = Boolean(progress.flags[manifest.dayOne.revealFlag]);

  const next: WorldProgress = {
    ...progress,
    completedHabits,
  };

  if (thresholdReached && !alreadyRevealed) {
    next.flags = { ...progress.flags, [manifest.dayOne.revealFlag]: true };
    next.pendingSequence = manifest.dayOne.revealSequenceId;
    next.eventsSeen = progress.eventsSeen.includes(manifest.dayOne.revealEventId)
      ? progress.eventsSeen
      : [...progress.eventsSeen, manifest.dayOne.revealEventId];
  }

  return updateWorld(snapshot, worldId, next);
}

export function runPrimaryWorldAction(snapshot: AppSnapshot): AppSnapshot {
  const worldId = snapshot.activeWorldId;
  if (!worldId) return snapshot;
  const manifest = getWorldManifest(worldId);
  const progress = snapshot.worlds[worldId];
  const action = manifest.dayOne.primaryAction;

  if (
    progress.pendingSequence ||
    progress.locationId !== action.fromLocationId ||
    !progress.flags[action.requiresFlag]
  ) return snapshot;

  const next: WorldProgress = {
    ...progress,
    locationId: action.toLocationId,
    pendingSequence: action.sequenceId,
    eventsSeen: progress.eventsSeen.includes(action.eventId)
      ? progress.eventsSeen
      : [...progress.eventsSeen, action.eventId],
  };
  return updateWorld(snapshot, worldId, next);
}

export function settleStorySequence(snapshot: AppSnapshot, sequence: StorySequence): AppSnapshot {
  const worldId = snapshot.activeWorldId;
  if (!worldId) return snapshot;
  const progress = snapshot.worlds[worldId];
  if (progress.pendingSequence !== sequence) return snapshot;
  return updateWorld(snapshot, worldId, { ...progress, pendingSequence: null });
}

export function resetActiveWorldDayOne(snapshot: AppSnapshot): AppSnapshot {
  const worldId = snapshot.activeWorldId;
  if (!worldId) return snapshot;
  const manifest = getWorldManifest(worldId);
  return updateWorld(snapshot, worldId, {
    day: 1,
    locationId: manifest.startingLocationId,
    completedHabits: [],
    pendingSequence: null,
    eventsSeen: [],
    flags: {},
  });
}
