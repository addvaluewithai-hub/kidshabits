import type { AppSnapshot, StorySequence } from '../app/state';

export const FIRST_LIGHT_SEQUENCE = 'first-light' as const;
export const RIVER_ARRIVAL_SEQUENCE = 'river-arrival' as const;

export function completeHabit(snapshot: AppSnapshot, habitId: string): AppSnapshot {
  if (!snapshot.habits.includes(habitId) || snapshot.completedHabits.includes(habitId)) return snapshot;

  const completedHabits = [...snapshot.completedHabits, habitId];
  const thresholdReached = completedHabits.length >= snapshot.requiredHabits;
  const shouldRevealFirstLight = thresholdReached && !snapshot.firstLightRevealed;

  if (!shouldRevealFirstLight) return { ...snapshot, completedHabits };

  return {
    ...snapshot,
    completedHabits,
    firstLightRevealed: true,
    pendingSequence: FIRST_LIGHT_SEQUENCE,
    storyEventsSeen: snapshot.storyEventsSeen.includes('day1.first-light')
      ? snapshot.storyEventsSeen
      : [...snapshot.storyEventsSeen, 'day1.first-light'],
  };
}

/**
 * A story action, not an AI decision. The location is made durable first;
 * Phaser then performs the authored arrival sequence that presents this truth.
 */
export function followFirstLight(snapshot: AppSnapshot): AppSnapshot {
  if (!snapshot.firstLightRevealed || snapshot.pendingSequence || snapshot.currentLocation !== 'landing-meadow') return snapshot;
  return {
    ...snapshot,
    currentLocation: 'river-clearing',
    riverClearingReached: true,
    pendingSequence: RIVER_ARRIVAL_SEQUENCE,
    storyEventsSeen: snapshot.storyEventsSeen.includes('day1.river-arrival')
      ? snapshot.storyEventsSeen
      : [...snapshot.storyEventsSeen, 'day1.river-arrival'],
  };
}

export function settleStorySequence(snapshot: AppSnapshot, sequence: StorySequence): AppSnapshot {
  if (snapshot.pendingSequence !== sequence) return snapshot;
  return { ...snapshot, pendingSequence: null };
}

export function resetDayOneProgress(snapshot: AppSnapshot): AppSnapshot {
  return {
    ...snapshot,
    completedHabits: [],
    currentLocation: 'landing-meadow',
    firstLightRevealed: false,
    riverClearingReached: false,
    pendingSequence: null,
    storyEventsSeen: snapshot.storyEventsSeen.filter(event => !event.startsWith('day1.')),
  };
}
