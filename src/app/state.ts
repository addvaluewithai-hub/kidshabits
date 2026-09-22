export type ExperiencePhase =
  | 'parent_welcome'
  | 'child_profile_setup'
  | 'habit_setup'
  | 'child_handoff'
  | 'companion_selection'
  | 'world';

export type WorldLocation = 'landing-meadow' | 'river-clearing';
export type StorySequence = 'first-light' | 'river-arrival';

export interface HabitChoice {
  id: string;
  label: string;
  icon: string;
}

export const HABIT_OPTIONS: readonly HabitChoice[] = [
  { id: 'water', label: 'أشرب مياه', icon: '💧' },
  { id: 'reading', label: 'أقرأ 10 دقايق', icon: '📚' },
  { id: 'bed', label: 'أرتب سريري', icon: '🛏️' },
  { id: 'teeth', label: 'أنضف سناني', icon: '🪥' },
  { id: 'movement', label: 'أتحرك شوية', icon: '🌿' },
  { id: 'kindness', label: 'أعمل حاجة لطيفة', icon: '💛' },
];

export interface AppSnapshot {
  version: 1;
  phase: ExperiencePhase;
  childName: string;
  ageBand: '6-8' | '9-11' | 'not_set';
  habits: string[];
  requiredHabits: number;
  completedHabits: string[];
  voiceEnabled: boolean;
  callsEnabled: boolean;
  quietHours: { start: string; end: string };
  companionId: string;
  safeInterests: string[];
  companionIntroComplete: boolean;
  planetId: 'sprout';
  storyDay: number;
  currentLocation: WorldLocation;
  firstLightRevealed: boolean;
  riverClearingReached: boolean;
  pendingSequence: StorySequence | null;
  storyEventsSeen: string[];
}

type StoredSnapshot = Partial<Omit<AppSnapshot, 'phase' | 'currentLocation' | 'pendingSequence'>> & {
  phase?: string;
  currentLocation?: string;
  pendingSequence?: string | null;
};

const STORAGE_KEY = 'kidshabits.snapshot.v1';

export const initialSnapshot: AppSnapshot = {
  version: 1,
  phase: 'parent_welcome',
  childName: '',
  ageBand: 'not_set',
  habits: ['water', 'reading', 'bed'],
  requiredHabits: 2,
  completedHabits: [],
  voiceEnabled: true,
  callsEnabled: false,
  quietHours: { start: '20:00', end: '07:00' },
  companionId: 'lumi',
  safeInterests: [],
  companionIntroComplete: false,
  planetId: 'sprout',
  storyDay: 1,
  currentLocation: 'landing-meadow',
  firstLightRevealed: false,
  riverClearingReached: false,
  pendingSequence: null,
  storyEventsSeen: [],
};

export function loadSnapshot(): AppSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialSnapshot;
    const parsed = JSON.parse(raw) as StoredSnapshot;
    if (parsed.version !== 1) return initialSnapshot;

    // v1 migration: the early prototype had separate companion / planet screens.
    // Those responsibilities now live inside the world, so old previews resume there.
    const phase: ExperiencePhase = parsed.phase === 'companion_first_meeting' || parsed.phase === 'first_planet_introduction'
      ? 'world'
      : ['parent_welcome', 'child_profile_setup', 'habit_setup', 'child_handoff', 'companion_selection', 'world'].includes(parsed.phase ?? '')
        ? parsed.phase as ExperiencePhase
        : initialSnapshot.phase;
    const currentLocation: WorldLocation = parsed.currentLocation === 'river-clearing' ? 'river-clearing' : 'landing-meadow';
    const pendingSequence: StorySequence | null = parsed.pendingSequence === 'first-light' || parsed.pendingSequence === 'river-arrival'
      ? parsed.pendingSequence
      : null;

    return {
      ...initialSnapshot,
      ...parsed,
      phase,
      currentLocation,
      pendingSequence,
      quietHours: { ...initialSnapshot.quietHours, ...parsed.quietHours },
      completedHabits: Array.isArray(parsed.completedHabits) ? parsed.completedHabits : [],
      storyEventsSeen: Array.isArray(parsed.storyEventsSeen) ? parsed.storyEventsSeen : [],
      safeInterests: Array.isArray(parsed.safeInterests) ? parsed.safeInterests : [],
      companionIntroComplete: Boolean(parsed.companionIntroComplete),
      firstLightRevealed: Boolean(parsed.firstLightRevealed),
      riverClearingReached: Boolean(parsed.riverClearingReached || currentLocation === 'river-clearing'),
    };
  } catch {
    return initialSnapshot;
  }
}

export function saveSnapshot(snapshot: AppSnapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSnapshot() {
  localStorage.removeItem(STORAGE_KEY);
}
