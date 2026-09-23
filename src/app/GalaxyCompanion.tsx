import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import { loadCharacterEngine, SvgCharacter } from '../vendor/pixilive/core/SvgCharacter.ts';
import { SessionController, initialSessionView } from '../vendor/pixilive/core/SessionController.ts';
import { HABIT_OPTIONS, type AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';

function habitLabels(snapshot: AppSnapshot) {
  return snapshot.habits
    .map(id => HABIT_OPTIONS.find(habit => habit.id === id)?.label)
    .filter((label): label is string => Boolean(label));
}

export function GalaxyCompanion({
  snapshot,
  guideComplete,
  onGuideComplete,
}: {
  snapshot: AppSnapshot;
  guideComplete: boolean;
  onGuideComplete: () => void;
}) {
  const character = getCharacter(snapshot.companionId);
  const host = useRef<HTMLDivElement>(null);
  const session = useRef<SessionController | null>(null);
  const scriptSent = useRef(false);
  const finishHandled = useRef(false);
  const autoStartAttempted = useRef(false);
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  const [view, setView] = useState(initialSessionView);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let disposed = false;
    const controller = new SessionController(next => { if (!disposed) setView(next); });
    session.current = controller;
    void loadCharacterEngine()
      .then(next => { if (!disposed) setEngine(next); })
      .catch(error => setLoadError(error instanceof Error ? error.message : 'تعذّر تحميل الشخصية.'));
    return () => {
      disposed = true;
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
    const timer = character.canFly
      ? window.setTimeout(() => session.current?.manualFlight({ action: 'move', x: .58, y: .38, speed: .18, path: 'arc' }), 800)
      : 0;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [engine, character]);

  const startGuide = () => {
    if (guideComplete || !snapshot.voiceEnabled || !engine || !session.current) return;
    if (view.connection === 'connected' || view.connection === 'connecting') return;
    scriptSent.current = false;
    finishHandled.current = false;
    void session.current.start();
  };

  useEffect(() => {
    if (guideComplete || !snapshot.voiceEnabled || !engine || autoStartAttempted.current) return;
    autoStartAttempted.current = true;
    const timer = window.setTimeout(startGuide, 280);
    return () => window.clearTimeout(timer);
    // startGuide intentionally depends on live connection state; this effect should only attempt once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideComplete, snapshot.voiceEnabled, engine]);

  useEffect(() => {
    if (guideComplete || view.connection !== 'connected' || scriptSent.current || !session.current) return;
    scriptSent.current = true;
    const habits = habitLabels(snapshot);
    const firstWorld = WORLD_MANIFESTS[0];
    const nextWorld = WORLD_MANIFESTS[1];
    const required = Math.max(1, Math.min(snapshot.requiredHabits, Math.max(1, habits.length)));
    const exactScript = [
      `يا ${snapshot.childName || 'صاحبي'}! أنا ${character.name}، ودي مجرتنا اللي هنسافر فيها سوا.`,
      `كل كوكب هنا حكاية مختلفة، وجواه أماكن وأحداث هنكتشفها واحدة واحدة.`,
      `العادات اللي عندنا هي ${habits.join('، ') || 'العادات اللي اختارها ولي الأمر'}، ولما نكمل ${required} من ${Math.max(1, habits.length)} في الحقيقة، الحكاية اللي إحنا فيها تتحرك والعالم يتغير.`,
      `دي مش نقاط ولا فلوس، إحنا بنغيّر القصة نفسها.`,
      `رحلتنا تبدأ من ${firstWorld.nameAr}${nextWorld ? `، واللي بعده ${nextWorld.nameAr} مستنينا بعدين` : ''}. دوس على الكوكب المنوّر ويلا نستكشفه.`,
    ];
    session.current.send(
      `أنت ${character.name}، صاحب ${snapshot.childName || 'الطفل'} داخل خريطة المجرة في KidsHabits. دي لحظة onboarding مكتوبة وليست دردشة حرة. قل النص التالي بنفس المعنى والترتيب وبأقرب صياغة ممكنة، من غير سؤال، من غير إضافة مهمة، من غير اختراع قصة، ومن غير مطالبة الطفل يختار عادة:\n${exactScript.map((line, index) => `${index + 1}. ${line}`).join('\n')}\nاستخدم perform بهدوء أثناء الكلام. لو الشخصية بتطير استخدم fly مرة واحدة بحركة خفيفة. بعد آخر جملة اسكت ولا تضف أي سؤال أو اقتراح.`,
      exactScript.join(' '),
    );
  }, [guideComplete, view.connection, character, snapshot]);

  useEffect(() => {
    if (guideComplete || finishHandled.current || view.connection !== 'connected') return;
    if (!view.assistant.trim() || view.mode !== 'listening') return;
    finishHandled.current = true;
    const timer = window.setTimeout(() => {
      void session.current?.stop().finally(onGuideComplete);
    }, 360);
    return () => window.clearTimeout(timer);
  }, [guideComplete, view.assistant, view.mode, view.connection, onGuideComplete]);

  const connected = view.connection === 'connected';
  const connecting = view.connection === 'connecting';
  const speaking = view.mode === 'speaking';
  const error = view.error || loadError;

  return <aside className={`galaxy-guide-companion ${guideComplete ? 'is-settled' : 'is-guiding'} ${speaking ? 'is-speaking' : ''}`} style={{ '--accent': character.accent } as CSSProperties}>
    <div className="galaxy-guide-character" ref={host} aria-label={`شخصية ${character.name}`} />
    {!guideComplete && <div className="galaxy-guide-copy">
      <b>{speaking ? `${character.name} بيشرحلك المجرة…` : connected ? `${character.name} سامعك` : `ابدأ الرحلة مع ${character.name}`}</b>
      <span>{snapshot.voiceEnabled ? 'شرح قصير وبعدها هنبدأ من أول كوكب.' : 'الصوت مقفول، نقدر نبدأ من الخريطة مباشرة.'}</span>
      {snapshot.voiceEnabled
        ? <button type="button" onClick={startGuide} disabled={!engine || connected || connecting}>{connecting ? 'بنوصل…' : connected ? 'شغال دلوقتي' : `اسمع ${character.name}`}</button>
        : <button type="button" onClick={onGuideComplete}>تمام، ورّيني البداية</button>}
      {error && <small>{error}</small>}
    </div>}
  </aside>;
}
