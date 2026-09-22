import { WORLD_MANIFESTS, getWorldManifest, isWorldId } from '../worlds/registry';
import { createWorldProgress, type WorldId, type WorldProgress } from '../worlds/types';

export type ExperiencePhase =
  | 'parent_welcome'
  | 'child_profile_setup'
  | 'habit_setup'
  | 'child_handoff'
  | 'companion_selection'
  | 'world_browser'
  | 'world';

export type StorySequence = string;

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
  version: 2;
  phase: ExperiencePhase;
  childName: string;
  ageBand: '6-8' | '9-11' | 'not_set';
  habits: string[];
  requiredHabits: number;
  voiceEnabled: boolean;
  callsEnabled: boolean;
  quietHours: { start: string; end: string };
  companionId: string;
  safeInterests: string[];
  companionIntroComplete: boolean;
  activeWorldId: WorldId | null;
  worlds: Record<WorldId, WorldProgress>;
}

const STORAGE_KEY = 'kidshabits.snapshot.v2';
const LEGACY_STORAGE_KEY = 'kidshabits.snapshot.v1';

function createInitialWorlds(): Record<WorldId, WorldProgress> {
  return Object.fromEntries(
    WORLD_MANIFESTS.map(world => [world.id, createWorldProgress(world)]),
  ) as Record<WorldId, WorldProgress>;
}

export const initialSnapshot: AppSnapshot = {
  version: 2,
  phase: 'parent_welcome',
  childName: '',
  ageBand: 'not_set',
  habits: ['water', 'reading', 'bed'],
  requiredHabits: 2,
  voiceEnabled: true,
  callsEnabled: false,
  quietHours: { start: '20:00', end: '07:00' },
  companionId: 'lumi',
  safeInterests: [],
  companionIntroComplete: false,
  activeWorldId: null,
  worlds: createInitialWorlds(),
};

function normalizeProgress(worldId: WorldId, value: unknown): WorldProgress {
  const manifest = getWorldManifest(worldId);
  const base = createWorldProgress(manifest);
  if (!value || typeof value !== 'object') return base;
  const raw = value as Partial<WorldProgress>;
  const locationId = typeof raw.locationId === 'string' && manifest.locations[raw.locationId]
    ? raw.locationId
    : base.locationId;
  return {
    day: typeof raw.day === 'number' && raw.day >= 1 ? Math.min(manifest.totalDays, Math.floor(raw.day)) : 1,
    locationId,
    completedHabits: Array.isArray(raw.completedHabits) ? raw.completedHabits.filter(item => typeof item === 'string') : [],
    pendingSequence: typeof raw.pendingSequence === 'string' ? raw.pendingSequence : null,
    eventsSeen: Array.isArray(raw.eventsSeen) ? raw.eventsSeen.filter(item => typeof item === 'string') : [],
    flags: raw.flags && typeof raw.flags === 'object'
      ? Object.fromEntries(Object.entries(raw.flags).filter(([, flag]) => typeof flag === 'boolean')) as Record<string, boolean>
      : {},
  };
}

function normalizeV2(parsed: Partial<AppSnapshot>): AppSnapshot {
  const phase = ['parent_welcome', 'child_profile_setup', 'habit_setup', 'child_handoff', 'companion_selection', 'world_browser', 'world'].includes(parsed.phase ?? '')
    ? parsed.phase as ExperiencePhase
    : initialSnapshot.phase;
  const activeWorldId = isWorldId(parsed.activeWorldId) ? parsed.activeWorldId : null;
  const storedWorlds = parsed.worlds && typeof parsed.worlds === 'object' ? parsed.worlds : {} as Record<WorldId, WorldProgress>;
  const worlds = Object.fromEntries(
    WORLD_MANIFESTS.map(world => [world.id, normalizeProgress(world.id, storedWorlds[world.id])]),
  ) as Record<WorldId, WorldProgress>;

  return {
    ...initialSnapshot,
    ...parsed,
    version: 2,
    phase: phase === 'world' && !activeWorldId ? 'world_browser' : phase,
    activeWorldId,
    worlds,
    quietHours: { ...initialSnapshot.quietHours, ...(parsed.quietHours ?? {}) },
    habits: Array.isArray(parsed.habits) ? parsed.habits : initialSnapshot.habits,
    safeInterests: Array.isArray(parsed.safeInterests) ? parsed.safeInterests : [],
    companionIntroComplete: Boolean(parsed.companionIntroComplete),
  };
}

function migrateV1(parsed: Record<string, unknown>): AppSnapshot {
  const worlds = createInitialWorlds();
  const legacyLocation = parsed.currentLocation === 'river-clearing' ? 'river-clearing' : 'landing-meadow';
  const legacyFlags: Record<string, boolean> = {
    firstLightRevealed: Boolean(parsed.firstLightRevealed),
    riverClearingReached: Boolean(parsed.riverClearingReached || legacyLocation === 'river-clearing'),
  };
  worlds.sprout = {
    ...worlds.sprout,
    day: typeof parsed.storyDay === 'number' ? Math.max(1, Math.min(30, Math.floor(parsed.storyDay))) : 1,
    locationId: legacyLocation,
    completedHabits: Array.isArray(parsed.completedHabits) ? parsed.completedHabits.filter(item => typeof item === 'string') as string[] : [],
    pendingSequence: typeof parsed.pendingSequence === 'string' ? parsed.pendingSequence : null,
    eventsSeen: Array.isArray(parsed.storyEventsSeen) ? parsed.storyEventsSeen.filter(item => typeof item === 'string') as string[] : [],
    flags: legacyFlags,
  };

  const oldPhase = typeof parsed.phase === 'string' ? parsed.phase : 'parent_welcome';
  const phase: ExperiencePhase = oldPhase === 'world' || oldPhase === 'companion_first_meeting' || oldPhase === 'first_planet_introduction'
    ? 'world'
    : oldPhase === 'companion_selection'
      ? 'companion_selection'
      : ['parent_welcome', 'child_profile_setup', 'habit_setup', 'child_handoff'].includes(oldPhase)
        ? oldPhase as ExperiencePhase
        : 'world_browser';

  return {
    ...initialSnapshot,
    phase,
    childName: typeof parsed.childName === 'string' ? parsed.childName : '',
    ageBand: parsed.ageBand === '6-8' || parsed.ageBand === '9-11' ? parsed.ageBand : 'not_set',
    habits: Array.isArray(parsed.habits) ? parsed.habits.filter(item => typeof item === 'string') as string[] : initialSnapshot.habits,
    requiredHabits: typeof parsed.requiredHabits === 'number' ? parsed.requiredHabits : initialSnapshot.requiredHabits,
    voiceEnabled: parsed.voiceEnabled !== false,
    callsEnabled: Boolean(parsed.callsEnabled),
    quietHours: parsed.quietHours && typeof parsed.quietHours === 'object'
      ? { ...initialSnapshot.quietHours, ...(parsed.quietHours as { start?: string; end?: string }) }
      : initialSnapshot.quietHours,
    companionId: typeof parsed.companionId === 'string' ? parsed.companionId : initialSnapshot.companionId,
    safeInterests: Array.isArray(parsed.safeInterests) ? parsed.safeInterests.filter(item => typeof item === 'string') as string[] : [],
    companionIntroComplete: Boolean(parsed.companionIntroComplete),
    activeWorldId: phase === 'world' ? 'sprout' : null,
    worlds,
  };
}

export function loadSnapshot(): AppSnapshot {
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<AppSnapshot>;
      if (parsed.version === 2) return normalizeV2(parsed);
    }

    const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV1) return migrateV1(JSON.parse(rawV1) as Record<string, unknown>);
    return initialSnapshot;
  } catch {
    return initialSnapshot;
  }
}

export function getActiveWorldProgress(snapshot: AppSnapshot): WorldProgress | null {
  return snapshot.activeWorldId ? snapshot.worlds[snapshot.activeWorldId] : null;
}

export function saveSnapshot(snapshot: AppSnapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSnapshot() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
