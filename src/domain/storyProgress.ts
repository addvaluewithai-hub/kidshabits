import type { AppSnapshot } from '../app/state';

export const FIRST_LIGHT_SEQUENCE = 'first-light' as const;

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

export function settleStorySequence(snapshot: AppSnapshot, sequence: typeof FIRST_LIGHT_SEQUENCE): AppSnapshot {
  if (snapshot.pendingSequence !== sequence) return snapshot;
  return { ...snapshot, pendingSequence: null };
}

export function resetDayOneProgress(snapshot: AppSnapshot): AppSnapshot {
  return {
    ...snapshot,
    completedHabits: [],
    firstLightRevealed: false,
    pendingSequence: null,
    storyEventsSeen: snapshot.storyEventsSeen.filter(event => event !== 'day1.first-light'),
  };
}
