import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { characters, getCharacter } from '../vendor/pixilive/core/registry.ts';
import { loadCharacterEngine, portrait, SvgCharacter } from '../vendor/pixilive/core/SvgCharacter.ts';
import { SessionController, initialSessionView } from '../vendor/pixilive/core/SessionController.ts';
import type { FlightCommand } from '../vendor/pixilive/core/flight.ts';
import { HABIT_OPTIONS, clearSnapshot, initialSnapshot, loadSnapshot, saveSnapshot, type AppSnapshot } from './state';
import { WorldHost } from '../world/WorldHost';

const interests = ['الفضاء', 'الحيوانات', 'القصص', 'الألغاز', 'الرسم'];

function Shell({ children, step }: { children: React.ReactNode; step?: string }) {
  return <main className="app-shell"><div className="phone-frame"><header className="mini-brand"><span className="brand-orb">✦</span><b>KidsHabits</b>{step && <span>{step}</span>}</header>{children}</div></main>;
}

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button className="primary" type="button" onClick={onClick} disabled={disabled}>{children}</button>;
}

function CompanionStage({
  companionId,
  childName,
  safeInterests,
  live,
  compact = false,
}: {
  companionId: string;
  childName: string;
  safeInterests: string[];
  live: boolean;
  compact?: boolean;
}) {
  const character = getCharacter(companionId);
  const host = useRef<HTMLDivElement>(null);
  const session = useRef<SessionController | null>(null);
  const introSent = useRef(false);
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
    if (!engine || !host.current || !session.current) return;
    const actor = new SvgCharacter(host.current, engine, character);
    session.current.attach(actor, { name: character.name, species: character.species, canFly: character.canFly });
    session.current.manual('happy', 'wave');
    const timer = character.canFly ? window.setTimeout(() => session.current?.manualFlight({ action: 'move', x: .7, y: .25, speed: .35, path: 'arc' }), 900) : 0;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [engine, character]);

  useEffect(() => {
    if (!live || view.connection !== 'connected' || introSent.current || !session.current) return;
    introSent.current = true;
    const interest = safeInterests.length ? ` وهو بيحب ${safeInterests.join(' و')}.` : '';
    session.current.send(
      `أنت ${character.name}، الصاحب اللي الطفل اختاره في KidsHabits. الطفل اسمه ${childName || 'صاحبك الجديد'}.${interest} دي أول مقابلة بينكم. رحّب به بالعربي المصري الدافئ، عرفه بنفسك في جملتين أو ثلاثة، وبعدها اسأله سؤال واحد بسيط للتعارف. ما تستخدمش ذنب أو ضغط أو حب مشروط بالعادات. لو أنت شخصية بتطير، استخدم fly مرة لطيفة أثناء الترحيب. استخدم perform للتعبير المناسب.`,
      '[بدأ التعارف]'
    );
  }, [view.connection, live, character, childName, safeInterests]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    session.current?.send(text);
    setText('');
  };

  const connected = view.connection === 'connected';
  const connecting = view.connection === 'connecting';
  const status = connecting ? 'بنوصل…' : connected ? (view.mode === 'speaking' ? 'بيكلمك' : view.mode === 'thinking' ? 'بيفكر…' : 'سامعك') : 'جاهز';

  return <section className={`companion-stage ${compact ? 'compact' : ''}`} style={{ '--accent': character.accent } as CSSProperties}>
    <div className="stage-meta"><div><small>صاحبك</small><strong>{character.name}</strong></div><span className={connected ? 'status live' : 'status'}>{status}</span></div>
    <div className="character-window"><div className="character-glow" /><div ref={host} className="character-host" />{!engine && <span className="loading-character">{loadError || 'بنجهّزه…'}</span>}</div>
    {!compact && character.canFly && <div className="quick-actions"><button onClick={() => session.current?.manualFlight({ action: 'move', x: .22, y: .18, speed: .55, path: 'swoop' })}>↗ طير</button><button onClick={() => session.current?.manualFlight({ action: 'land', x: .5, y: 1, speed: .3, path: 'direct' })}>انزل</button><button onClick={() => session.current?.manual('excited', 'celebrate')}>احتفل ✦</button></div>}
    {live && <div className="live-box">
      <button className={connected || connecting ? 'talk stop' : 'talk'} disabled={!engine} onClick={() => { if (connected || connecting) { introSent.current = false; void session.current?.stop(); } else void session.current?.start(); }}>{connecting ? 'إلغاء' : connected ? 'إنهاء الكلام' : '🎙️ ابدأ الكلام'}</button>
      {(view.error || loadError) && <p className="inline-error">{view.error || loadError}</p>}
      {(view.user || view.assistant) && <div className="mini-transcript">{view.user && <p><b>إنت:</b> {view.user === '[بدأ التعارف]' ? 'بدأتوا تتعرفوا على بعض…' : view.user}</p>}{view.assistant && <p><b>{character.name}:</b> {view.assistant}</p>}</div>}
      <form className="chat-form" onSubmit={submit}><input aria-label="رسالة للشخصية" value={text} disabled={!connected} onChange={e => setText(e.target.value)} placeholder={connected ? 'أو اكتب هنا…' : 'ابدأ الكلام الأول'} /><button disabled={!connected || !text.trim()}>↑</button></form>
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
  return <Shell step="3 / 4"><section className="screen handoff"><div className="handoff-orb">✦</div><span className="eyebrow">دور {snapshot.childName}</span><h2>من هنا الرحلة بتاعته.</h2><p>خليه يختار الشخصية اللي هتفضل معاه وتتعرف عليه.</p><PrimaryButton onClick={() => update({ phase: 'companion_selection' })}>أنا {snapshot.childName} 👋</PrimaryButton></section></Shell>;
}

function CompanionSelection({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  const selected = getCharacter(snapshot.companionId);
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  useEffect(() => { void loadCharacterEngine().then(setEngine); }, []);
  const portraits = useMemo(() => engine ? Object.fromEntries(characters.map(character => [character.id, portrait(engine, character)])) : {}, [engine]);
  return <Shell step="4 / 4"><section className="screen companion-pick"><span className="eyebrow">اختار صاحب رحلتك</span><h2>مين تحب يفضل معاك؟</h2><p>كلهم يقدروا يسمعوك ويتكلموا معاك. ولومي ونسمة كمان بيطيروا فعلًا.</p><CompanionStage companionId={snapshot.companionId} childName={snapshot.childName} safeInterests={snapshot.safeInterests} live={false} compact /><div className="companion-grid">{characters.map(character => <button key={character.id} className={snapshot.companionId === character.id ? 'companion-card selected' : 'companion-card'} onClick={() => update({ companionId: character.id })}><span className="portrait">{engine && <img src={portraits[character.id]} alt="" />}</span><strong>{character.name}</strong><small>{character.canFly ? '✦ بيطير' : character.description}</small></button>)}</div><PrimaryButton onClick={() => update({ phase: 'companion_first_meeting' })}>اختار {selected.name}</PrimaryButton></section></Shell>;
}

function FirstMeeting({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  const character = getCharacter(snapshot.companionId);
  const toggleInterest = (value: string) => update({ safeInterests: snapshot.safeInterests.includes(value) ? snapshot.safeInterests.filter(item => item !== value) : [...snapshot.safeInterests, value].slice(0, 3) });
  return <Shell step="أول مقابلة"><section className="screen first-meeting"><div className="script-line"><b>{character.name}</b><span>أهلًا يا {snapshot.childName}! أنا {character.name}. من النهارده هنكتشف العالم سوا ✨</span></div><CompanionStage companionId={snapshot.companionId} childName={snapshot.childName} safeInterests={snapshot.safeInterests} live={snapshot.voiceEnabled} /><div className="interest-box"><small>ساعده يعرفك — اختار حاجات بتحبها (اختياري)</small><div>{interests.map(value => <button key={value} className={snapshot.safeInterests.includes(value) ? 'chip selected' : 'chip'} onClick={() => toggleInterest(value)}>{value}</button>)}</div></div><PrimaryButton onClick={() => update({ phase: 'first_planet_introduction' })}>جاهز لأول كوكب</PrimaryButton></section></Shell>;
}

function PlanetIntro({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  return <Shell><section className="screen planet-intro"><div className="planet-visual"><span>✦</span></div><span className="eyebrow">PLANET 01 · DAY 1 / 30</span><h2>كوكب البراعم</h2><p>مكان هادي كأنه نايم. كل يوم تلتزم فيه، جزء صغير من الكوكب هيصحى وتكمل الحكاية.</p><div className="mystery-note">في نور صغير ظاهر بعيد عند النهر…</div><PrimaryButton onClick={() => update({ phase: 'world' })}>ادخل مرج الوصول</PrimaryButton></section></Shell>;
}

function WorldScreen({ snapshot, update }: { snapshot: AppSnapshot; update: (patch: Partial<AppSnapshot>) => void }) {
  return <main className="world-screen"><WorldHost /><div className="world-top"><div><small>كوكب البراعم</small><strong>اليوم {snapshot.storyDay} من 30</strong></div><button onClick={() => update({ phase: 'companion_first_meeting' })}>كلم صاحبك</button></div><div className="world-hook"><span>✦</span><p>شايف النور ده؟<br /><b>أعتقد إن الكوكب بيحاول يقول لنا حاجة.</b></p></div><div className="world-companion"><CompanionStage companionId={snapshot.companionId} childName={snapshot.childName} safeInterests={snapshot.safeInterests} live={false} compact /></div><div className="world-bottom"><div className="day-progress"><span>{snapshot.habits.slice(0, 3).map(id => HABIT_OPTIONS.find(item => item.id === id)?.icon).join(' ')}</span><b>{snapshot.requiredHabits} عادات تحرك القصة</b></div><button className="debug-reset" onClick={() => { if (confirm('نرجع لأول onboarding؟')) { clearSnapshot(); location.reload(); } }}>Reset</button></div></main>;
}

export function App() {
  const [snapshot, setSnapshot] = useState(loadSnapshot);
  const update = (patch: Partial<AppSnapshot>) => setSnapshot(current => ({ ...current, ...patch }));
  useEffect(() => saveSnapshot(snapshot), [snapshot]);

  if (snapshot.phase === 'parent_welcome') return <ParentWelcome snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'child_profile_setup') return <ChildProfile snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'habit_setup') return <HabitSetup snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'child_handoff') return <ChildHandoff snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'companion_selection') return <CompanionSelection snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'companion_first_meeting') return <FirstMeeting snapshot={snapshot} update={update} />;
  if (snapshot.phase === 'first_planet_introduction') return <PlanetIntro snapshot={snapshot} update={update} />;
  return <WorldScreen snapshot={snapshot} update={update} />;
}

export { initialSnapshot };
