import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { characters, getCharacter } from '../vendor/pixilive/core/registry.ts';
import { loadCharacterEngine, portrait, SvgCharacter } from '../vendor/pixilive/core/SvgCharacter.ts';
import { SessionController, initialSessionView } from '../vendor/pixilive/core/SessionController.ts';
import { HABIT_OPTIONS, clearSnapshot, initialSnapshot, loadSnapshot, saveSnapshot, type AppSnapshot, type StorySequence } from './state';
import { completeHabit as applyHabitCompletion, followFirstLight, settleStorySequence } from '../domain/storyProgress';
import { WorldHost } from '../world/WorldHost';

const interests = ['الفضاء', 'الحيوانات', 'القصص', 'الألغاز', 'الرسم'];
type LiveMode = 'off' | 'guide' | 'chat';

function habitDetails(ids: string[]) {
  return ids.map(id => HABIT_OPTIONS.find(item => item.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function Shell({ children, step }: { children: React.ReactNode; step?: string }) {
  return <main className="app-shell"><div className="phone-frame"><header className="mini-brand"><span className="brand-orb">✦</span><b>KidsHabits</b>{step && <span>{step}</span>}</header>{children}</div></main>;
}

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button className="primary" type="button" onClick={onClick} disabled={disabled}>{children}</button>;
}

function fitCharacter(host: HTMLElement, compact: boolean, canFly: boolean) {
  const svg = host.querySelector('svg');
  if (!svg) return;
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  // The PixiLive master intentionally contains generous stage margins for the
  // lab. Product cards need a tighter camera around the full silhouette.
  if (compact) svg.setAttribute('viewBox', canFly ? '62 20 516 525' : '82 18 476 525');
  else svg.setAttribute('viewBox', canFly ? '18 -10 604 570' : '72 8 496 545');
}

function CompanionStage({
  snapshot,
  liveMode = 'off',
  compact = false,
  onGuideComplete,
}: {
  snapshot: AppSnapshot;
  liveMode?: LiveMode;
  compact?: boolean;
  onGuideComplete?: () => void;
}) {
  const character = getCharacter(snapshot.companionId);
  const host = useRef<HTMLDivElement>(null);
  const session = useRef<SessionController | null>(null);
  const scriptSent = useRef(false);
  const guideFinished = useRef(false);
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  const [view, setView] = useState(initialSessionView);
  const [loadError, setLoadError] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    let disposed = false;
    const controller = new SessionController(next => { if (!disposed) setView(next); });
    session.current = controller;
    void loadCharacterEngine().then(next => { if (!disposed) setEngine(next); }).catch(error => setLoadError(error instanceof Error ? error.message : 'تعذّر تحميل الشخصية.'));
    return () => { disposed = true; controller.dispose(); session.current = null; };
  }, []);

  useEffect(() => {
    scriptSent.current = false;
    guideFinished.current = false;
  }, [liveMode, snapshot.companionId]);

  useEffect(() => {
    if (!engine || !host.current || !session.current) return;
    const actor = new SvgCharacter(host.current, engine, character);
    fitCharacter(host.current, compact, Boolean(character.canFly));
    session.current.attach(actor, { name: character.name, species: character.species, canFly: character.canFly });
    session.current.manual('happy', 'wave');
    const timer = !compact && character.canFly
      ? window.setTimeout(() => session.current?.manualFlight({ action: 'move', x: .66, y: .28, speed: .32, path: 'arc' }), 900)
      : 0;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [engine, character, compact]);

  useEffect(() => {
    if (liveMode === 'off' || view.connection !== 'connected' || scriptSent.current || !session.current) return;
    scriptSent.current = true;
    const selectedHabits = habitDetails(snapshot.habits);
    const habitsText = selectedHabits.map(item => item.label).join('، ') || 'العادات اللي اختارها ولي الأمر';
    const required = Math.max(1, Math.min(snapshot.requiredHabits, selectedHabits.length || 1));
    const locationName = snapshot.currentLocation === 'river-clearing' ? 'فسحة النهر' : 'مرج الوصول';

    if (liveMode === 'guide') {
      session.current.send(
        `أنت ${character.name}، الصاحب اللي ${snapshot.childName || 'الطفل'} اختاره في KidsHabits. إنت ظاهر جوه كوكب البراعم نفسه، ومهمتك في الدور ده محددة جدًا: تشرح النظام ثم تنهي كلامك. لا تبدأ دردشة مفتوحة، لا تسأل الطفل سؤال، لا تطلب منه يختار عادة، ولا تخترع مهمة أو قصة من عندك.
العادات الحقيقية المحددة له هي فقط: ${habitsText}. المطلوب كل يوم ${required} من ${Math.max(1, selectedHabits.length)}.
قول له بالمصري البسيط: لما يكمّل العدد المطلوب في الحقيقة، الوقت في الكوكب يتحرك، العالم يتغير، وحدث جديد في القصة يظهر. العادات مش فلوس ولا نقاط، وإنت مش هتزعل منه ومش هتربط صداقتكم بإنه أنجز أو لأ.
ابدأ باسمه، عرّف نفسك في جملة قصيرة، اذكر العادات بأسمائها، اشرح قاعدة ${required} من ${Math.max(1, selectedHabits.length)}، وبعدها قول إنكم موجودين دلوقتي في مرج الوصول وإن أول سر هيتكشف لما عادات اليوم تكتمل.
استخدم 5 أو 6 جمل فقط. لا تسأل أي سؤال في النهاية. اختم حرفيًا بمعنى: «أنا هسيب الكلام دلوقتي ونبدأ نشوف العالم سوا.» لو بتطير استخدم fly مرة هادية أثناء الشرح، واستخدم perform للتعبير.`,
        '[شرح نظام KidsHabits داخل العالم]'
      );
      return;
    }

    const completedLabels = habitDetails(snapshot.completedHabits).map(item => item.label).join('، ') || 'ولا عادة متسجلة كمكتملة لسه';
    session.current.send(
      `إنت ${character.name} وبتتكلم مع ${snapshot.childName || 'صاحبك'} من جوه كوكب البراعم، في ${locationName}. ده سياق حقيقي ومحدد، مش اقتراح: اليوم ${snapshot.storyDay} من 30. العادات المحددة: ${habitsText}. المكتمل فعليًا: ${completedLabels}. أول نور ${snapshot.firstLightRevealed ? 'ظهر' : 'لسه ما ظهرش'}. فسحة النهر ${snapshot.riverClearingReached ? 'اتفتحت ووصلنا لها' : 'لسه ما وصلناش لها'}.
اتكلم بالمصري الدافئ وباختصار. ما تدّعيش إن عادة اتعملت لو الحالة ما بتقولش كده، ما تفتحش منطقة أو تقدّم القصة بنفسك، وما تخترعش objective أو reward. لو الطفل سأل نعمل إيه، اشرح له اللي ظاهر حاليًا في العالم أو العادات المطلوبة فقط. إنت صاحب داخل العالم، مش مدير progression. ابدأ بتحية قصيرة جدًا مرتبطة بالمكان الحالي وبعدها اسمع الطفل.`,
      '[فتح كلام مع الصاحب داخل العالم]'
    );
  }, [liveMode, view.connection, character, snapshot]);

  useEffect(() => {
    if (liveMode !== 'guide' || guideFinished.current || view.connection !== 'connected') return;
    if (!view.assistant.trim() || view.mode !== 'listening') return;
    guideFinished.current = true;
    const timer = window.setTimeout(() => {
      void session.current?.stop().finally(() => onGuideComplete?.());
    }, 420);
    return () => window.clearTimeout(timer);
  }, [liveMode, view.assistant, view.mode, view.connection, onGuideComplete]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    session.current?.send(text);
    setText('');
  };

  const connected = view.connection === 'connected';
  const connecting = view.connection === 'connecting';
  const status = connecting ? 'بنوصل…' : connected ? (view.mode === 'speaking' ? 'بيكلمك' : view.mode === 'thinking' ? 'بيفكر…' : 'سامعك') : 'جاهز';
  const canTalk = liveMode !== 'off';

  return <section className={`companion-stage ${compact ? 'compact' : ''} ${liveMode === 'guide' ? 'guide-mode' : ''}`} style={{ '--accent': character.accent } as CSSProperties}>
    <div className="stage-meta"><div><small>صاحبك</small><strong>{character.name}</strong></div><span className={connected ? 'status live' : 'status'}>{status}</span></div>
    <div className="character-window"><div className="character-glow" /><div ref={host} className="character-host" />{!engine && <span className="loading-character">{loadError || 'بنجهّزه…'}</span>}</div>
    {!compact && character.canFly && liveMode === 'chat' && <div className="quick-actions"><button onClick={() => session.current?.manualFlight({ action: 'move', x: .22, y: .18, speed: .55, path: 'swoop' })}>↗ طير</button><button onClick={() => session.current?.manualFlight({ action: 'land', x: .5, y: 1, speed: .3, path: 'direct' })}>انزل</button><button onClick={() => session.current?.manual('excited', 'celebrate')}>احتفل ✦</button></div>}
    {canTalk && <div className="live-box">
      <button className={connected || connecting ? 'talk stop' : 'talk'} disabled={!engine || (liveMode === 'guide' && guideFinished.current)} onClick={() => { if (connected || connecting) { scriptSent.current = false; void session.current?.stop(); } else void session.current?.start(); }}>{connecting ? 'إلغاء' : connected ? (liveMode === 'guide' ? 'إيقاف الشرح' : 'إنهاء الكلام') : liveMode === 'guide' ? `🎙️ ابدأ الرحلة مع ${character.name}` : `🎙️ كلم ${character.name}`}</button>
      {(view.error || loadError) && <p className="inline-error">{view.error || loadError}</p>}
      {liveMode === 'guide' && connected && <p className="guide-listening-note">اسمعه بس في الجزء ده — لما يخلص هنكمل جوه العالم تلقائيًا.</p>}
      {liveMode === 'chat' && (view.user || view.assistant) && <div className="mini-transcript">{view.user && <p><b>إنت:</b> {view.user.startsWith('[') ? 'بدأتوا الكلام…' : view.user}</p>}{view.assistant && <p><b>{character.name}:</b> {view.assistant}</p>}</div>}
      {liveMode === 'chat' && <form className="chat-form" onSubmit={submit}><input aria-label="رسالة للشخصية" value={text} disabled={!connected} onChange={e => setText(e.target.value)} placeholder={connected ? 'أو اكتب هنا…' : 'ابدأ الكلام الأول'} /><button disabled={!connected || !text.trim()}>↑</button></form>}
      <small className="privacy">الميكروفون يشتغل فقط أثناء المحادثة.</small>
    </div>}
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

  return <Shell step="4 / 4"><section className="screen companion-pick"><span className="eyebrow">اختار صاحب رحلتك</span><h2>مين تحب يفضل معاك؟</h2><p>كلهم يقدروا يسمعوك ويتكلموا معاك من جوه العالم. ولومي ونسمة كمان بيطيروا فعلًا.</p><CompanionStage snapshot={snapshot} liveMode="off" compact /><div className="companion-grid">{characters.map(character => <button key={character.id} className={snapshot.companionId === character.id ? 'companion-card selected' : 'companion-card'} onClick={() => update({ companionId: character.id })}><span className="portrait">{engine && <img src={portraits[character.id]} alt="" />}</span><strong>{character.name}</strong><small>{character.canFly ? '✦ بيطير' : character.description}</small></button>)}</div><div className="interest-box compact-interests"><small>حاجات بتحبها — اختياري</small><div>{interests.map(value => <button key={value} className={snapshot.safeInterests.includes(value) ? 'chip selected' : 'chip'} onClick={() => toggleInterest(value)}>{value}</button>)}</div></div><PrimaryButton onClick={() => update({ phase: 'world', companionIntroComplete: false })}>ادخل العالم مع {selected.name}</PrimaryButton></section></Shell>;
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
  const [chatOpen, setChatOpen] = useState(false);
  const character = getCharacter(snapshot.companionId);
  const selectedHabits = habitDetails(snapshot.habits);
  const completed = snapshot.completedHabits.length;
  const locationName = snapshot.currentLocation === 'river-clearing' ? 'فسحة النهر' : 'مرج الوصول';

  const hook = snapshot.pendingSequence === 'first-light'
    ? <>استنى…<br /><b>الكوكب بيصحى!</b></>
    : snapshot.pendingSequence === 'river-arrival'
      ? <>النور بيتحرك…<br /><b>خد بالك إحنا رايحين فين.</b></>
      : snapshot.currentLocation === 'river-clearing'
        ? <>وصلنا للنهر.<br /><b>النور اختفى عند الحافة… في حاجة هنا لسه مستخبية.</b></>
        : snapshot.firstLightRevealed
          ? <>شايف الطريق اللي ظهر؟<br /><b>النور بيقودنا ناحية النهر.</b></>
          : snapshot.companionIntroComplete
            ? <>الكوكب لسه هادي.<br /><b>كمّل {Math.max(0, snapshot.requiredHabits - completed)} من عاداتك ونشوف هيحصل إيه.</b></>
            : <>أول حاجة…<br /><b>{character.name} هيشرح لك إزاي العالم ده بيتحرك.</b></>;

  return <main className="world-screen">
    <WorldHost currentLocation={snapshot.currentLocation} firstLightRevealed={snapshot.firstLightRevealed} pendingSequence={snapshot.pendingSequence} onSequenceComplete={settleSequence} />
    <div className="world-top"><div><small>كوكب البراعم · {locationName}</small><strong>اليوم {snapshot.storyDay} من 30</strong></div><button disabled={!snapshot.companionIntroComplete} onClick={() => setChatOpen(true)}>كلم {character.name}</button></div>
    <div className={`world-hook ${snapshot.firstLightRevealed ? 'revealed' : ''}`}><span>✦</span><p>{hook}</p></div>

    <div className="world-companion"><CompanionStage snapshot={snapshot} liveMode="off" compact /></div>

    {!snapshot.companionIntroComplete && <section className="world-guide-card" aria-label="شرح بداية الرحلة"><div className="world-guide-copy"><span className="eyebrow">أول دقيقة جوه العالم</span><h2>{character.name} هيشرحها لك هنا.</h2><p>مش شاشة شات منفصلة. العالم موجود وراكم، وبعد ما يخلص الشرح المكالمة تقفل لوحدها.</p></div><CompanionStage snapshot={snapshot} liveMode={snapshot.voiceEnabled ? 'guide' : 'off'} onGuideComplete={() => update({ companionIntroComplete: true })} />{!snapshot.voiceEnabled && <PrimaryButton onClick={() => update({ companionIntroComplete: true })}>فهمت — نبدأ العالم</PrimaryButton>}</section>}

    {chatOpen && snapshot.companionIntroComplete && <div className="world-chat-backdrop" onClick={() => setChatOpen(false)}><section className="world-chat-sheet" onClick={event => event.stopPropagation()}><button className="sheet-close" onClick={() => setChatOpen(false)}>×</button><CompanionStage snapshot={snapshot} liveMode="chat" /></section></div>}

    {snapshot.companionIntroComplete && snapshot.currentLocation === 'landing-meadow' && snapshot.firstLightRevealed && !snapshot.pendingSequence && <button className="journey-cta" onClick={followLight}><span>✦</span><b>اتبع النور للنهر</b><small>أول انتقال حقيقي بين مناطق الكوكب</small></button>}

    <section className={`habit-dock ${!snapshot.companionIntroComplete ? 'locked' : ''}`} aria-label="عادات اليوم"><div className="habit-dock-title"><div><small>عادات النهارده</small><strong>{completed} / {snapshot.requiredHabits} لفتح حدث القصة</strong></div><span>{snapshot.firstLightRevealed ? '✦ اتفتح' : snapshot.companionIntroComplete ? 'جاهز' : 'بعد الشرح'}</span></div><div className="habit-dock-list">{selectedHabits.map(habit => {
      const done = snapshot.completedHabits.includes(habit.id);
      return <button key={habit.id} disabled={done || !snapshot.companionIntroComplete} className={done ? 'done' : ''} onClick={() => completeHabit(habit.id)}><span>{habit.icon}</span><b>{habit.label}</b><small>{done ? 'تم ✓' : 'خلصتها'}</small></button>;
    })}</div></section>

    <div className="world-bottom"><div className="day-progress"><span>{selectedHabits.map(item => item.icon).join(' ')}</span><b>{snapshot.currentLocation === 'river-clearing' ? 'وصلت لأول منطقة جديدة' : snapshot.firstLightRevealed ? 'أول نور ظهر في المرج' : `${snapshot.requiredHabits} عادات تحرك القصة`}</b></div><button className="debug-reset" onClick={() => { if (confirm('نرجع لأول onboarding؟')) { clearSnapshot(); location.reload(); } }}>Reset</button></div>
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
