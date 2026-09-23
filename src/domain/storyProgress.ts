import type { AppSnapshot, HabitCheckin, StorySequence } from '../app/state';
import { getVerifiedHabitIds } from '../app/state';
import { getWorldManifest } from '../worlds/registry';
import type { WorldId, WorldProgress } from '../worlds/types';

function updateWorld(snapshot: AppSnapshot, worldId: WorldId, next: WorldProgress): AppSnapshot {
  return { ...snapshot, worlds: { ...snapshot.worlds, [worldId]: next } };
}

function maybeAdvanceDailyStory(snapshot: AppSnapshot): AppSnapshot {
  if (snapshot.daily.storyAdvanceWorldId) return snapshot;
  const verified = getVerifiedHabitIds(snapshot).filter(habitId => snapshot.habits.includes(habitId));
  if (verified.length < snapshot.requiredHabits) return snapshot;

  const worldId = snapshot.daily.targetWorldId ?? snapshot.activeWorldId;
  if (!worldId) return snapshot;

  const manifest = getWorldManifest(worldId);
  const progress = snapshot.worlds[worldId];
  const alreadyRevealed = Boolean(progress.flags[manifest.dayOne.revealFlag]);
  const daily = { ...snapshot.daily, targetWorldId: worldId, storyAdvanceWorldId: worldId };

  if (alreadyRevealed) return { ...snapshot, daily };

  const nextWorld: WorldProgress = {
    ...progress,
    flags: { ...progress.flags, [manifest.dayOne.revealFlag]: true },
    pendingSequence: manifest.dayOne.revealSequenceId,
    eventsSeen: progress.eventsSeen.includes(manifest.dayOne.revealEventId)
      ? progress.eventsSeen
      : [...progress.eventsSeen, manifest.dayOne.revealEventId],
  };

  return { ...snapshot, daily, worlds: { ...snapshot.worlds, [worldId]: nextWorld } };
}

export function enterWorld(snapshot: AppSnapshot, worldId: WorldId): AppSnapshot {
  const next: AppSnapshot = {
    ...snapshot,
    activeWorldId: worldId,
    phase: 'world',
    // Reaching a world from the guided galaxy is the durable boundary that says
    // the one-time companion introduction has finished. The world companion can
    // now be conversational instead of repeating onboarding.
    companionIntroComplete: true,
    daily: {
      ...snapshot.daily,
      targetWorldId: snapshot.daily.targetWorldId ?? worldId,
    },
  };
  return maybeAdvanceDailyStory(next);
}

export function returnToWorldBrowser(snapshot: AppSnapshot): AppSnapshot {
  // Keep activeWorldId as the last visited world. The routing phase determines
  // what is visible; retaining this ID gives parent verification a stable daily
  // story target even after the child returns to the galaxy.
  return { ...snapshot, phase: 'world_browser' };
}

export function reportHabit(snapshot: AppSnapshot, habitId: string): AppSnapshot {
  if (!snapshot.habits.includes(habitId) || snapshot.daily.checkins[habitId]) return snapshot;
  const mode = snapshot.habitVerification[habitId] ?? 'trust';
  const now = Date.now();
  const checkin: HabitCheckin = {
    habitId,
    status: mode === 'parent' ? 'pending_parent' : 'verified',
    source: 'child',
    reportedAt: now,
    verifiedAt: mode === 'parent' ? null : now,
  };
  const next: AppSnapshot = {
    ...snapshot,
    daily: {
      ...snapshot.daily,
      targetWorldId: snapshot.daily.targetWorldId ?? snapshot.activeWorldId,
      checkins: { ...snapshot.daily.checkins, [habitId]: checkin },
    },
  };
  return maybeAdvanceDailyStory(next);
}

export function approveHabit(snapshot: AppSnapshot, habitId: string): AppSnapshot {
  if (!snapshot.habits.includes(habitId)) return snapshot;
  const existing = snapshot.daily.checkins[habitId];
  if (existing?.status === 'verified') return snapshot;
  const now = Date.now();
  const checkin: HabitCheckin = {
    habitId,
    status: 'verified',
    source: existing?.source ?? 'parent',
    reportedAt: existing?.reportedAt ?? now,
    verifiedAt: now,
  };
  return maybeAdvanceDailyStory({
    ...snapshot,
    daily: {
      ...snapshot.daily,
      targetWorldId: snapshot.daily.targetWorldId ?? snapshot.activeWorldId,
      checkins: { ...snapshot.daily.checkins, [habitId]: checkin },
    },
  });
}

export function rejectHabit(snapshot: AppSnapshot, habitId: string): AppSnapshot {
  const existing = snapshot.daily.checkins[habitId];
  if (!existing || existing.status !== 'pending_parent') return snapshot;
  const checkins = { ...snapshot.daily.checkins };
  delete checkins[habitId];
  return { ...snapshot, daily: { ...snapshot.daily, checkins } };
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
  const next = updateWorld(snapshot, worldId, {
    day: 1,
    locationId: manifest.startingLocationId,
    pendingSequence: null,
    eventsSeen: [],
    flags: {},
  });
  return {
    ...next,
    daily: {
      ...next.daily,
      targetWorldId: worldId,
      storyAdvanceWorldId: null,
    },
  };
}
