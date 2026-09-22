import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { characters, getCharacter } from '../vendor/pixilive/core/registry.ts';
import { loadCharacterEngine, portrait, SvgCharacter } from '../vendor/pixilive/core/SvgCharacter.ts';
import { SessionController } from '../vendor/pixilive/core/SessionController.ts';
import { HABIT_OPTIONS, clearSnapshot, getVerifiedHabitIds, initialSnapshot, loadSnapshot, saveSnapshot, type AppSnapshot, type StorySequence } from './state';
import { approveHabit as applyHabitApproval, enterWorld as applyEnterWorld, rejectHabit as applyHabitRejection, reportHabit as applyHabitReport, returnToWorldBrowser, runPrimaryWorldAction, settleStorySequence } from '../domain/storyProgress';
import { WorldHost } from '../world/WorldHost';
import { InWorldCompanion } from '../world/InWorldCompanion';
import { GalaxyBrowser } from './GalaxyBrowser';
import { ParentCenter } from './ParentCenter';
import { getWorldManifest } from '../worlds/registry';
import type { WorldId } from '../worlds/types';

const interests = ['الفضاء', 'الحيوانات', 'القصص', 'الألغاز', 'الرسم'];

function habitDetails(ids: string[]) {
  return ids.map(id => HABIT_OPTIONS.find(item => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function Shell({ children, step }: { children: React.ReactNode; step?: string }) {
  return <main className="app-shell"><div className="phone-frame"><header className="mini-brand"><span className="brand-orb">✦</span><b>KidsHabits</b>{step && <span>{step}</span>}</header>{children}</div></main>;
}

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button className="primary" type="button" onClick={onClick} disabled={disabled}>{children}</button>;
}

function CompanionPreview({ snapshot }: { snapshot: AppSnapshot }) {
  const character = getCharacter(snapshot.companionId);
  const host = useRef<HTMLDivElement>(null);
  const session = useRef<SessionController | null>(null);
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const controller = new SessionController(() => undefined);
    session.current = controller;
    void loadCharacterEngine().then(setEngine).catch(error => setLoadError(error instanceof Error ? error.message : 'تعذّر تحميل الشخصية.'));
    return () => {
      controller.dispose();
      session.current = null;
    };
  }, []);

  useEffect(() => {
    if (!engine || !host.current || !session.current) return;
    const actor = new SvgCharacter(host.current, engine, character);
    host.current.querySelector('svg')?.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    session.current.attach(actor, { name: character.name, species: character.species, canFly: character.canFly });
    session.current.manual('happy', 'wave');
  }, [engine, character]);

  return <section className="companion-stage compact companion-preview" style={{ '--accent': character.accent } as CSSProperties}>
    <div className="stage-meta"><div><small>صاحبك</small><strong>{character.name}</strong></div><span className="status">جاهز</span></div>
    <div className="character-window"><div className="character-glow" /><div ref={host} className="character-host" />{!engine && <span className="loading-character">{loadError || 'بنجهّزه…'}</span>}</div>
  </section>;
}

function ParentWelcome({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  return <Shell step="لولي الأمر"><section className="screen welcome"><span className="eyebrow">REAL LIFE → LIVING STORY</span><h1>عادة صغيرة في الحقيقة.<br /><em>مجرة كاملة تتحرك.</em></h1><p>إنت تختار العادات والحدود. الطفل يختار صاحبه، وبعدها يقدر يسافر بين عوالم مختلفة وكل عالم يتحرك مع تقدمه الحقيقي.</p><div className="parent-card"><label><input type="checkbox" checked={snapshot.voiceEnabled} onChange={e => update({ voiceEnabled: e.target.checked })} /> محادثة صوتية مع الشخصية</label><label><input type="checkbox" checked={snapshot.callsEnabled} onChange={e => update({ callsEnabled: e.target.checked })} /> مكالمات من الشخصية لاحقًا</label><div className="quiet-row"><span>وقت هدوء</span><input type="time" value={snapshot.quietHours.start} onChange={e => update({ quietHours: { ...snapshot.quietHours, start: e.target.value } })} /><span>→</span><input type="time" value={snapshot.quietHours.end} onChange={e => update({ quietHours: { ...snapshot.quietHours, end: e.target.value } })} /></div></div><PrimaryButton onClick={() => update({ phase: 'child_profile_setup' })}>نبدأ إعداد الطفل</PrimaryButton></section></Shell>;
}

function ChildProfile({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  const [name, setName] = useState(snapshot.childName);
  return <Shell step="1 / 4"><section className="screen"><span className="eyebrow">ملف بسيط</span><h2>مين صاحب الرحلة؟</h2><p>هنستخدم الاسم والعمر عشان نخلي الكلام والمحتوى مناسبين، من غير ما نخزن تفاصيل مالهاش لازمة.</p><label className="field"><span>اسم الطفل</span><input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="مثلاً: عمر" /></label><div className="age-grid"><button className={snapshot.ageBand === '6-8' ? 'selected' : ''} onClick={() => update({ ageBand: '6-8' })}>6–8 سنين</button><button className={snapshot.ageBand === '9-11' ? 'selected' : ''} onClick={() => update({ ageBand: '9-11' })}>9–11 سنة</button></div><PrimaryButton disabled={!name.trim() || snapshot.ageBand === 'not_set'} onClick={() => update({ childName: name.trim(), phase: 'habit_setup' })}>اختيار العادات</PrimaryButton></section></Shell>;
}

function HabitSetup({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  const toggle = (id: string) => {
    const exists = snapshot.habits.includes(id);
    const habits = exists ? snapshot.habits.filter(item => item !== id) : snapshot.habits.length < 3 ? [...snapshot.habits, id] : snapshot.habits;
    update({ habits, requiredHabits: Math.min(snapshot.requiredHabits, Math.max(1, habits.length)) });
  };
  return <Shell step="2 / 4"><section className="screen"><span className="eyebrow">البداية فقط</span><h2>اختار لحد 3 عادات</h2><p>العادات لا تتحول لعملات. لما يكتمل المطلوب لليوم، القصة نفسها تتحرك جوه العالم اللي الطفل فيه.</p><div className="habit-grid">{HABIT_OPTIONS.map(habit => <button key={habit.id} className={snapshot.habits.includes(habit.id) ? 'habit selected' : 'habit'} onClick={() => toggle(habit.id)}><span>{habit.icon}</span>{habit.label}</button>)}</div><label className="range-row">المطلوب لفتح حدث اليوم <strong>{snapshot.requiredHabits} من {snapshot.habits.length || 1}</strong><input type="range" min="1" max={Math.max(1, snapshot.habits.length)} value={Math.min(snapshot.requiredHabits, Math.max(1, snapshot.habits.length))} onChange={e => update({ requiredHabits: Number(e.target.value) })} /></label><PrimaryButton disabled={!snapshot.habits.length} onClick={() => update({ phase: 'child_handoff' })}>تمام، سلّم الموبايل للطفل</PrimaryButton></section></Shell>;
}

function ChildHandoff({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  return <Shell step="3 / 4"><section className="screen handoff"><div className="handoff-orb">✦</div><span className="eyebrow">دور {snapshot.childName}</span><h2>من هنا الرحلة بتاعته.</h2><p>خليه يختار الشخصية اللي هتفضل معاه في كل الكواكب.</p><PrimaryButton onClick={() => update({ phase: 'companion_selection' })}>أنا {snapshot.childName} 👋</PrimaryButton></section></Shell>;
}

function CompanionSelection({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  const selected = getCharacter(snapshot.companionId);
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  useEffect(() => { void loadCharacterEngine().then(setEngine); }, []);
  const portraits = useMemo(() => engine ? Object.fromEntries(characters.map(character => [character.id, portrait(engine, character)])) : {}, [engine]);
  const toggleInterest = (value: string) => update({ safeInterests: snapshot.safeInterests.includes(value) ? snapshot.safeInterests.filter(item => item !== value) : [...snapshot.safeInterests, value].slice(0, 3) });

  return <Shell step="4 / 4"><section className="screen companion-pick"><span className="eyebrow">اختار صاحب رحلتك</span><h2>مين تحب يسافر معاك؟</h2><p>الشخصية واحدة ومستمرة مع الطفل حتى وهو بيتنقل بين الكواكب. ولومي ونسمة يقدروا يطيروا فعلًا.</p><CompanionPreview snapshot={snapshot} /><div className="companion-grid">{characters.map(character => <button key={character.id} className={snapshot.companionId === character.id ? 'companion-card selected' : 'companion-card'} onClick={() => update({ companionId: character.id })}><span className="portrait">{engine && <img src={portraits[character.id]} alt="" />}</span><strong>{character.name}</strong><small>{character.canFly ? '✦ بيطير' : character.description}</small></button>)}</div><div className="interest-box compact-interests"><small>حاجات بتحبها — اختياري</small><div>{interests.map(value => <button key={value} className={snapshot.safeInterests.includes(value) ? 'chip selected' : 'chip'} onClick={() => toggleInterest(value)}>{value}</button>)}</div></div><PrimaryButton onClick={() => update({ phase: 'world_browser' })}>شوف المجرة مع {selected.name}</PrimaryButton></section></Shell>;
}

function WorldScreen({
  snapshot,
  update,
  reportHabit,
  settleSequence,
  primaryAction,
  backToGalaxy,
}: {
  snapshot: AppSnapshot;
  update: (patch: Partial<AppSnapshot>) => void;
  reportHabit: (habitId: string) => void;
  settleSequence: (sequence: StorySequence) => void;
  primaryAction: () => void;
  backToGalaxy: () => void;
}) {
  const worldId = snapshot.activeWorldId;
  if (!worldId) return null;
  const manifest = getWorldManifest(worldId);
  const progress = snapshot.worlds[worldId];
  const selectedHabits = habitDetails(snapshot.habits);
  const verifiedHabitIds = getVerifiedHabitIds(snapshot).filter(id => snapshot.habits.includes(id));
  const completed = verifiedHabitIds.length;
  const remaining = Math.max(0, snapshot.requiredHabits - completed);
  const revealed = Boolean(progress.flags[manifest.dayOne.revealFlag]);
  const atSecondLocation = progress.locationId === manifest.dayOne.primaryAction.toLocationId;
  const locationName = manifest.locations[progress.locationId]?.nameAr ?? manifest.nameAr;
  const anotherWorldAdvancedToday = snapshot.daily.storyAdvanceWorldId && snapshot.daily.storyAdvanceWorldId !== worldId;

  const whisper = !snapshot.companionIntroComplete
    ? null
    : progress.pendingSequence === manifest.dayOne.revealSequenceId
      ? manifest.dayOne.copy.revealingAr
      : progress.pendingSequence === manifest.dayOne.primaryAction.sequenceId
        ? `بنسافر ناحية ${manifest.locations[manifest.dayOne.primaryAction.toLocationId]?.nameAr ?? 'المكان الجديد'}…`
        : atSecondLocation
          ? manifest.dayOne.copy.secondLocationAr
          : revealed
            ? manifest.dayOne.copy.afterRevealAr
            : anotherWorldAdvancedToday
              ? 'عادات النهارده حرّكت عالم تاني بالفعل. نقدر نستكشف هنا من غير ما نكرر نفس التقدم.'
              : remaining > 0
                ? manifest.dayOne.copy.beforeRevealAr
                : null;

  return <main className={`world-screen world-v2 world-theme-${worldId}`}>
    <WorldHost worldId={worldId} progress={progress} onSequenceComplete={settleSequence} />

    <div className="world-hud">
      <button className="galaxy-back" type="button" onClick={backToGalaxy} aria-label="الرجوع للمجرة">✦</button>
      <div className="world-day-pill"><small>{manifest.nameAr} · {locationName}</small><strong>اليوم {progress.day} <span>من {manifest.totalDays}</span></strong></div>
    </div>

    {whisper && <div className="world-whisper"><span>✦</span><p>{whisper}</p></div>}

    <div className="world-companion-v2">
      <InWorldCompanion snapshot={snapshot} onGuideComplete={() => update({ companionIntroComplete: true })} />
    </div>

    {snapshot.companionIntroComplete && !atSecondLocation && revealed && !progress.pendingSequence && <button className="journey-cta journey-cta-v2" onClick={primaryAction}><span>✦</span><b>{manifest.dayOne.primaryAction.labelAr}</b><small>{manifest.dayOne.primaryAction.hintAr}</small></button>}

    <section className={`habit-dock habit-dock-v2 ${!snapshot.companionIntroComplete ? 'locked' : ''}`} aria-label="عادات اليوم">
      <div className="habit-dock-title"><div><small>النهارده</small><strong>{completed} / {snapshot.requiredHabits}</strong></div><span>{snapshot.daily.storyAdvanceWorldId === worldId ? '✦ العالم اتحرك' : snapshot.companionIntroComplete ? 'عاداتك' : 'بعد ما صاحبك يشرح'}</span></div>
      <div className="habit-dock-list">{selectedHabits.map(habit => {
        const checkin = snapshot.daily.checkins[habit.id];
        const verified = checkin?.status === 'verified';
        const pending = checkin?.status === 'pending_parent';
        const needsParent = snapshot.habitVerification[habit.id] === 'parent';
        return <button key={habit.id} disabled={verified || pending || !snapshot.companionIntroComplete} className={verified ? 'done' : pending ? 'pending' : ''} onClick={() => reportHabit(habit.id)}><span>{habit.icon}</span><b>{habit.label}</b><small>{verified ? '✓' : pending ? 'مستني موافقة' : needsParent ? 'بلّغت' : 'تم'}</small></button>;
      })}</div>
    </section>

    <button className="debug-reset debug-reset-v2" onClick={() => { if (confirm('نرجع لأول onboarding؟')) { clearSnapshot(); location.reload(); } }}>Reset</button>
  </main>;
}

export function App() {
  const [snapshot, setSnapshot] = useState(loadSnapshot);
  const update = (patch: Partial<AppSnapshot>) => setSnapshot(current => ({ ...current, ...patch }));
  const enterWorld = (worldId: WorldId) => setSnapshot(current => applyEnterWorld(current, worldId));
  const reportHabit = (habitId: string) => setSnapshot(current => applyHabitReport(current, habitId));
  const approveHabit = (habitId: string) => setSnapshot(current => applyHabitApproval(current, habitId));
  const rejectHabit = (habitId: string) => setSnapshot(current => applyHabitRejection(current, habitId));
  const settleSequence = (sequence: StorySequence) => setSnapshot(current => settleStorySequence(current, sequence));
  const primaryAction = () => setSnapshot(current => runPrimaryWorldAction(current));
  const backToGalaxy = () => setSnapshot(current => returnToWorldBrowser(current));
  const openParentCenter = () => setSnapshot(current => ({ ...current, phase: 'parent_center' }));
  const closeParentCenter = () => setSnapshot(current => ({ ...current, phase: 'world_browser' }));
  useEffect(() => saveSnapshot(snapshot), [snapshot]);

  if (snapshot.phase === 'parent_welcome') return <ParentWelcome snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'child_profile_setup') return <ChildProfile snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'habit_setup') return <HabitSetup snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'child_handoff') return <ChildHandoff snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'companion_selection') return <CompanionSelection snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'parent_center') return <ParentCenter snapshot={snapshot} update={update} approveHabit={approveHabit} rejectHabit={rejectHabit} close={closeParentCenter} />;
  if (snapshot.phase === 'world_browser' || !snapshot.activeWorldId) return <GalaxyBrowser snapshot={snapshot} enterWorld={enterWorld} openParentCenter={openParentCenter} />;
  return <WorldScreen snapshot={snapshot} update={update} reportHabit={reportHabit} settleSequence={settleSequence} primaryAction={primaryAction} backToGalaxy={backToGalaxy} />;
}

export { initialSnapshot };
