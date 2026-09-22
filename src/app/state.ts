import { WORLD_MANIFESTS, getWorldManifest, isWorldId } from '../worlds/registry';
import { createWorldProgress, type WorldId, type WorldProgress } from '../worlds/types';

export type ExperiencePhase =
  | 'parent_welcome'
  | 'child_profile_setup'
  | 'habit_setup'
  | 'child_handoff'
  | 'companion_selection'
  | 'world_browser'
  | 'parent_center'
  | 'world';

export type StorySequence = string;
export type HabitVerificationMode = 'trust' | 'parent';
export type HabitCheckinStatus = 'pending_parent' | 'verified';

export interface HabitChoice {
  id: string;
  label: string;
  icon: string;
}

export interface HabitCheckin {
  habitId: string;
  status: HabitCheckinStatus;
  source: 'child' | 'parent';
  reportedAt: number;
  verifiedAt: number | null;
}

export interface DailyHabitLedger {
  dayKey: string;
  checkins: Record<string, HabitCheckin>;
  /** The world the child was in when today's real-life progress started. */
  targetWorldId: WorldId | null;
  /** Set once today's verified threshold has advanced one world story. */
  storyAdvanceWorldId: WorldId | null;
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
  version: 3;
  phase: ExperiencePhase;
  childName: string;
  ageBand: '6-8' | '9-11' | 'not_set';
  habits: string[];
  requiredHabits: number;
  habitVerification: Record<string, HabitVerificationMode>;
  daily: DailyHabitLedger;
  voiceEnabled: boolean;
  callsEnabled: boolean;
  quietHours: { start: string; end: string };
  companionId: string;
  safeInterests: string[];
  companionIntroComplete: boolean;
  activeWorldId: WorldId | null;
  worlds: Record<WorldId, WorldProgress>;
}

const STORAGE_KEY = 'kidshabits.snapshot.v3';
const V2_STORAGE_KEY = 'kidshabits.snapshot.v2';
const V1_STORAGE_KEY = 'kidshabits.snapshot.v1';

export function localDayKey(now = new Date()) {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function createDailyLedger(dayKey = localDayKey()): DailyHabitLedger {
  return { dayKey, checkins: {}, targetWorldId: null, storyAdvanceWorldId: null };
}

function createInitialWorlds(): Record<WorldId, WorldProgress> {
  return Object.fromEntries(
    WORLD_MANIFESTS.map(world => [world.id, createWorldProgress(world)]),
  ) as Record<WorldId, WorldProgress>;
}

function defaultVerification(): Record<string, HabitVerificationMode> {
  return Object.fromEntries(HABIT_OPTIONS.map(habit => [habit.id, 'trust'])) as Record<string, HabitVerificationMode>;
}

export const initialSnapshot: AppSnapshot = {
  version: 3,
  phase: 'parent_welcome',
  childName: '',
  ageBand: 'not_set',
  habits: ['water', 'reading', 'bed'],
  requiredHabits: 2,
  habitVerification: defaultVerification(),
  daily: createDailyLedger(),
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
    pendingSequence: typeof raw.pendingSequence === 'string' ? raw.pendingSequence : null,
    eventsSeen: Array.isArray(raw.eventsSeen) ? raw.eventsSeen.filter(item => typeof item === 'string') : [],
    flags: raw.flags && typeof raw.flags === 'object'
      ? Object.fromEntries(Object.entries(raw.flags).filter(([, flag]) => typeof flag === 'boolean')) as Record<string, boolean>
      : {},
  };
}

function normalizeDaily(value: unknown): DailyHabitLedger {
  const today = localDayKey();
  if (!value || typeof value !== 'object') return createDailyLedger(today);
  const raw = value as Partial<DailyHabitLedger>;
  if (raw.dayKey !== today) return createDailyLedger(today);
  const checkins: Record<string, HabitCheckin> = {};
  if (raw.checkins && typeof raw.checkins === 'object') {
    for (const [habitId, checkin] of Object.entries(raw.checkins)) {
      if (!checkin || typeof checkin !== 'object') continue;
      const item = checkin as Partial<HabitCheckin>;
      if (item.status !== 'pending_parent' && item.status !== 'verified') continue;
      checkins[habitId] = {
        habitId,
        status: item.status,
        source: item.source === 'parent' ? 'parent' : 'child',
        reportedAt: typeof item.reportedAt === 'number' ? item.reportedAt : Date.now(),
        verifiedAt: typeof item.verifiedAt === 'number' ? item.verifiedAt : null,
      };
    }
  }
  return {
    dayKey: today,
    checkins,
    targetWorldId: isWorldId(raw.targetWorldId) ? raw.targetWorldId : null,
    storyAdvanceWorldId: isWorldId(raw.storyAdvanceWorldId) ? raw.storyAdvanceWorldId : null,
  };
}

function normalizeVerification(value: unknown) {
  const defaults = defaultVerification();
  if (!value || typeof value !== 'object') return defaults;
  for (const [habitId, mode] of Object.entries(value)) {
    if (mode === 'trust' || mode === 'parent') defaults[habitId] = mode;
  }
  return defaults;
}

function normalizeV3(parsed: Partial<AppSnapshot>): AppSnapshot {
  const phases: ExperiencePhase[] = ['parent_welcome', 'child_profile_setup', 'habit_setup', 'child_handoff', 'companion_selection', 'world_browser', 'parent_center', 'world'];
  const phase = phases.includes(parsed.phase as ExperiencePhase) ? parsed.phase as ExperiencePhase : initialSnapshot.phase;
  const activeWorldId = isWorldId(parsed.activeWorldId) ? parsed.activeWorldId : null;
  const storedWorlds = parsed.worlds && typeof parsed.worlds === 'object' ? parsed.worlds : {} as Record<WorldId, WorldProgress>;
  const worlds = Object.fromEntries(
    WORLD_MANIFESTS.map(world => [world.id, normalizeProgress(world.id, storedWorlds[world.id])]),
  ) as Record<WorldId, WorldProgress>;
  const habits = Array.isArray(parsed.habits) ? parsed.habits.filter(item => typeof item === 'string') : initialSnapshot.habits;

  return {
    ...initialSnapshot,
    ...parsed,
    version: 3,
    phase: phase === 'world' && !activeWorldId ? 'world_browser' : phase,
    activeWorldId,
    worlds,
    habits,
    requiredHabits: Math.max(1, Math.min(typeof parsed.requiredHabits === 'number' ? parsed.requiredHabits : 1, Math.max(1, habits.length))),
    habitVerification: normalizeVerification(parsed.habitVerification),
    daily: normalizeDaily(parsed.daily),
    quietHours: { ...initialSnapshot.quietHours, ...(parsed.quietHours ?? {}) },
    safeInterests: Array.isArray(parsed.safeInterests) ? parsed.safeInterests : [],
    companionIntroComplete: Boolean(parsed.companionIntroComplete),
  };
}

function migrateV2(parsed: Record<string, unknown>): AppSnapshot {
  const worlds = createInitialWorlds();
  const storedWorlds = parsed.worlds && typeof parsed.worlds === 'object' ? parsed.worlds as Record<string, unknown> : {};
  for (const manifest of WORLD_MANIFESTS) worlds[manifest.id] = normalizeProgress(manifest.id, storedWorlds[manifest.id]);

  const activeWorldId = isWorldId(parsed.activeWorldId) ? parsed.activeWorldId : null;
  const daily = createDailyLedger();
  if (activeWorldId) {
    const rawProgress = storedWorlds[activeWorldId] as { completedHabits?: unknown } | undefined;
    if (Array.isArray(rawProgress?.completedHabits)) {
      for (const habitId of rawProgress.completedHabits.filter(item => typeof item === 'string') as string[]) {
        daily.checkins[habitId] = { habitId, status: 'verified', source: 'child', reportedAt: Date.now(), verifiedAt: Date.now() };
      }
      if (Object.keys(daily.checkins).length) daily.targetWorldId = activeWorldId;
    }
  }

  const phaseRaw = typeof parsed.phase === 'string' ? parsed.phase : 'parent_welcome';
  const phase: ExperiencePhase = ['parent_welcome', 'child_profile_setup', 'habit_setup', 'child_handoff', 'companion_selection', 'world_browser', 'world'].includes(phaseRaw)
    ? phaseRaw as ExperiencePhase
    : 'world_browser';
  const habits = Array.isArray(parsed.habits) ? parsed.habits.filter(item => typeof item === 'string') as string[] : initialSnapshot.habits;

  return {
    ...initialSnapshot,
    phase: phase === 'world' && !activeWorldId ? 'world_browser' : phase,
    childName: typeof parsed.childName === 'string' ? parsed.childName : '',
    ageBand: parsed.ageBand === '6-8' || parsed.ageBand === '9-11' ? parsed.ageBand : 'not_set',
    habits,
    requiredHabits: typeof parsed.requiredHabits === 'number' ? Math.max(1, Math.min(parsed.requiredHabits, Math.max(1, habits.length))) : initialSnapshot.requiredHabits,
    voiceEnabled: parsed.voiceEnabled !== false,
    callsEnabled: Boolean(parsed.callsEnabled),
    quietHours: parsed.quietHours && typeof parsed.quietHours === 'object'
      ? { ...initialSnapshot.quietHours, ...(parsed.quietHours as { start?: string; end?: string }) }
      : initialSnapshot.quietHours,
    companionId: typeof parsed.companionId === 'string' ? parsed.companionId : initialSnapshot.companionId,
    safeInterests: Array.isArray(parsed.safeInterests) ? parsed.safeInterests.filter(item => typeof item === 'string') as string[] : [],
    companionIntroComplete: Boolean(parsed.companionIntroComplete),
    activeWorldId,
    worlds,
    daily,
  };
}

export function loadSnapshot(): AppSnapshot {
  try {
    const rawV3 = localStorage.getItem(STORAGE_KEY);
    if (rawV3) {
      const parsed = JSON.parse(rawV3) as Partial<AppSnapshot>;
      if (parsed.version === 3) return normalizeV3(parsed);
    }
    const rawV2 = localStorage.getItem(V2_STORAGE_KEY);
    if (rawV2) return migrateV2(JSON.parse(rawV2) as Record<string, unknown>);
    return initialSnapshot;
  } catch {
    return initialSnapshot;
  }
}

export function getVerifiedHabitIds(snapshot: AppSnapshot) {
  return Object.values(snapshot.daily.checkins)
    .filter(checkin => checkin.status === 'verified')
    .map(checkin => checkin.habitId);
}

export function getPendingHabitIds(snapshot: AppSnapshot) {
  return Object.values(snapshot.daily.checkins)
    .filter(checkin => checkin.status === 'pending_parent')
    .map(checkin => checkin.habitId);
}

export function saveSnapshot(snapshot: AppSnapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSnapshot() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(V2_STORAGE_KEY);
  localStorage.removeItem(V1_STORAGE_KEY);
}
