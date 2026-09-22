import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { characters, getCharacter } from '../vendor/pixilive/core/registry.ts';
import { loadCharacterEngine, portrait, SvgCharacter } from '../vendor/pixilive/core/SvgCharacter.ts';
import { SessionController } from '../vendor/pixilive/core/SessionController.ts';
import { HABIT_OPTIONS, clearSnapshot, initialSnapshot, loadSnapshot, saveSnapshot, type AppSnapshot, type StorySequence } from './state';
import { completeHabit as applyHabitCompletion, followFirstLight, settleStorySequence } from '../domain/storyProgress';
import { WorldHost } from '../world/WorldHost';
import { InWorldCompanion } from '../world/InWorldCompanion';

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
  return <Shell step="لولي الأمر"><section className="screen welcome"><span className="eyebrow">REAL LIFE → LIVING STORY</span><h1>عادة صغيرة في الحقيقة.<br /><em>عالم كامل يصحى.</em></h1><p>إنت تختار العادات والحدود. الطفل يختار صاحبه، وبعدها كل يوم تقدّم حقيقي يحرك قصة الكوكب خطوة.</p><div className="parent-card"><label><input type="checkbox" checked={snapshot.voiceEnabled} onChange={e => update({ voiceEnabled: e.target.checked })} /> محادثة صوتية مع الشخصية</label><label><input type="checkbox" checked={snapshot.callsEnabled} onChange={e => update({ callsEnabled: e.target.checked })} /> مكالمات من الشخصية لاحقًا</label><div className="quiet-row"><span>وقت هدوء</span><input type="time" value={snapshot.quietHours.start} onChange={e => update({ quietHours: { ...snapshot.quietHours, start: e.target.value } })} /><span>→</span><input type="time" value={snapshot.quietHours.end} onChange={e => update({ quietHours: { ...snapshot.quietHours, end: e.target.value } })} /></div></div><PrimaryButton onClick={() => update({ phase: 'child_profile_setup' })}>نبدأ إعداد الطفل</PrimaryButton></section></Shell>;
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
  return <Shell step="2 / 4"><section className="screen"><span className="eyebrow">البداية فقط</span><h2>اختار لحد 3 عادات</h2><p>العادات لا تتحول لعملات. لما يكتمل المطلوب لليوم، القصة نفسها تتحرك.</p><div className="habit-grid">{HABIT_OPTIONS.map(habit => <button key={habit.id} className={snapshot.habits.includes(habit.id) ? 'habit selected' : 'habit'} onClick={() => toggle(habit.id)}><span>{habit.icon}</span>{habit.label}</button>)}</div><label className="range-row">المطلوب لفتح حدث اليوم <strong>{snapshot.requiredHabits} من {snapshot.habits.length || 1}</strong><input type="range" min="1" max={Math.max(1, snapshot.habits.length)} value={Math.min(snapshot.requiredHabits, Math.max(1, snapshot.habits.length))} onChange={e => update({ requiredHabits: Number(e.target.value) })} /></label><PrimaryButton disabled={!snapshot.habits.length} onClick={() => update({ phase: 'child_handoff' })}>تمام، سلّم الموبايل للطفل</PrimaryButton></section></Shell>;
}

function ChildHandoff({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  return <Shell step="3 / 4"><section className="screen handoff"><div className="handoff-orb">✦</div><span className="eyebrow">دور {snapshot.childName}</span><h2>من هنا الرحلة بتاعته.</h2><p>خليه يختار الشخصية اللي هتفضل معاه وتظهر جواه العالم.</p><PrimaryButton onClick={() => update({ phase: 'companion_selection' })}>أنا {snapshot.childName} 👋</PrimaryButton></section></Shell>;
}

function CompanionSelection({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  const selected = getCharacter(snapshot.companionId);
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  useEffect(() => { void loadCharacterEngine().then(setEngine); }, []);
  const portraits = useMemo(() => engine ? Object.fromEntries(characters.map(character => [character.id, portrait(engine, character)])) : {}, [engine]);
  const toggleInterest = (value: string) => update({ safeInterests: snapshot.safeInterests.includes(value) ? snapshot.safeInterests.filter(item => item !== value) : [...snapshot.safeInterests, value].slice(0, 3) });

  return <Shell step="4 / 4"><section className="screen companion-pick"><span className="eyebrow">اختار صاحب رحلتك</span><h2>مين تحب يفضل معاك؟</h2><p>كلهم يقدروا يسمعوك ويتكلموا معاك من جوه العالم. ولومي ونسمة كمان بيطيروا فعلًا.</p><CompanionPreview snapshot={snapshot} /><div className="companion-grid">{characters.map(character => <button key={character.id} className={snapshot.companionId === character.id ? 'companion-card selected' : 'companion-card'} onClick={() => update({ companionId: character.id })}><span className="portrait">{engine && <img src={portraits[character.id]} alt="" />}</span><strong>{character.name}</strong><small>{character.canFly ? '✦ بيطير' : character.description}</small></button>)}</div><div className="interest-box compact-interests"><small>حاجات بتحبها — اختياري</small><div>{interests.map(value => <button key={value} className={snapshot.safeInterests.includes(value) ? 'chip selected' : 'chip'} onClick={() => toggleInterest(value)}>{value}</button>)}</div></div><PrimaryButton onClick={() => update({ phase: 'world', companionIntroComplete: false })}>ادخل العالم مع {selected.name}</PrimaryButton></section></Shell>;
}

function WorldScreen({
  snapshot,
  update,
  completeHabit,
  settleSequence,
  followLight,
}: {
  snapshot: AppSnapshot;
  update: (patch: Partial<AppSnapshot>) => void;
  completeHabit: (habitId: string) => void;
  settleSequence: (sequence: StorySequence) => void;
  followLight: () => void;
}) {
  const selectedHabits = habitDetails(snapshot.habits);
  const completed = snapshot.completedHabits.length;
  const remaining = Math.max(0, snapshot.requiredHabits - completed);
  const locationName = snapshot.currentLocation === 'river-clearing' ? 'فسحة النهر' : 'مرج الوصول';

  const whisper = !snapshot.companionIntroComplete
    ? null
    : snapshot.pendingSequence === 'first-light'
      ? 'الكوكب بيصحى…'
      : snapshot.pendingSequence === 'river-arrival'
        ? 'النور بيتحرك ناحية النهر…'
        : snapshot.currentLocation === 'river-clearing'
          ? 'النور اختفى عند حافة الميه. في حاجة هنا لسه مستخبية.'
          : snapshot.firstLightRevealed
            ? 'الطريق بان. النور مستنينا ناحية النهر.'
            : remaining > 0
              ? `${remaining} ${remaining === 1 ? 'عادة' : 'عادات'} ونشوف أول تغيير في العالم.`
              : null;

  return <main className="world-screen world-v2">
    <WorldHost currentLocation={snapshot.currentLocation} firstLightRevealed={snapshot.firstLightRevealed} pendingSequence={snapshot.pendingSequence} onSequenceComplete={settleSequence} />

    <div className="world-hud"><div className="world-day-pill"><small>{locationName}</small><strong>اليوم {snapshot.storyDay} <span>من 30</span></strong></div></div>

    {whisper && <div className="world-whisper"><span>✦</span><p>{whisper}</p></div>}

    <div className="world-companion-v2">
      <InWorldCompanion snapshot={snapshot} onGuideComplete={() => update({ companionIntroComplete: true })} />
    </div>

    {snapshot.companionIntroComplete && snapshot.currentLocation === 'landing-meadow' && snapshot.firstLightRevealed && !snapshot.pendingSequence && <button className="journey-cta journey-cta-v2" onClick={followLight}><span>✦</span><b>اتبع النور</b><small>ناحية النهر</small></button>}

    <section className={`habit-dock habit-dock-v2 ${!snapshot.companionIntroComplete ? 'locked' : ''}`} aria-label="عادات اليوم">
      <div className="habit-dock-title"><div><small>النهارده</small><strong>{completed} / {snapshot.requiredHabits}</strong></div><span>{snapshot.firstLightRevealed ? '✦ العالم اتحرك' : snapshot.companionIntroComplete ? 'عاداتك' : 'بعد ما صاحبك يشرح'}</span></div>
      <div className="habit-dock-list">{selectedHabits.map(habit => {
        const done = snapshot.completedHabits.includes(habit.id);
        return <button key={habit.id} disabled={done || !snapshot.companionIntroComplete} className={done ? 'done' : ''} onClick={() => completeHabit(habit.id)}><span>{habit.icon}</span><b>{habit.label}</b><small>{done ? '✓' : 'تم'}</small></button>;
      })}</div>
    </section>

    <button className="debug-reset debug-reset-v2" onClick={() => { if (confirm('نرجع لأول onboarding؟')) { clearSnapshot(); location.reload(); } }}>Reset</button>
  </main>;
}

export function App() {
  const [snapshot, setSnapshot] = useState(loadSnapshot);
  const update = (patch: Partial<AppSnapshot>) => setSnapshot(current => ({ ...current, ...patch }));
  const completeHabit = (habitId: string) => setSnapshot(current => applyHabitCompletion(current, habitId));
  const settleSequence = (sequence: StorySequence) => setSnapshot(current => settleStorySequence(current, sequence));
  const followLight = () => setSnapshot(current => followFirstLight(current));
  useEffect(() => saveSnapshot(snapshot), [snapshot]);

  if (snapshot.phase === 'parent_welcome') return <ParentWelcome snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'child_profile_setup') return <ChildProfile snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'habit_setup') return <HabitSetup snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'child_handoff') return <ChildHandoff snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'companion_selection') return <CompanionSelection snapshot={snapshot} update={update} />;
  return <WorldScreen snapshot={snapshot} update={update} completeHabit={completeHabit} settleSequence={settleSequence} followLight={followLight} />;
}

export { initialSnapshot };
