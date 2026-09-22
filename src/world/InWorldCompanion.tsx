import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import { loadCharacterEngine, SvgCharacter } from '../vendor/pixilive/core/SvgCharacter.ts';
import { SessionController, initialSessionView } from '../vendor/pixilive/core/SessionController.ts';
import { HABIT_OPTIONS, getPendingHabitIds, getVerifiedHabitIds, type AppSnapshot } from '../app/state';
import { getWorldManifest } from '../worlds/registry';

type ConversationIntent = 'idle' | 'guide' | 'chat';

function habitLabels(ids: string[]) {
  return ids
    .map(id => HABIT_OPTIONS.find(item => item.id === id)?.label)
    .filter((label): label is string => Boolean(label));
}

export function InWorldCompanion({
  snapshot,
  onGuideComplete,
}: {
  snapshot: AppSnapshot;
  onGuideComplete: () => void;
}) {
  const character = getCharacter(snapshot.companionId);
  const worldId = snapshot.activeWorldId ?? 'sprout';
  const manifest = getWorldManifest(worldId);
  const progress = snapshot.worlds[worldId];
  const host = useRef<HTMLDivElement>(null);
  const session = useRef<SessionController | null>(null);
  const scriptSent = useRef(false);
  const guideFinished = useRef(false);
  const [intent, setIntent] = useState<ConversationIntent>(snapshot.companionIntroComplete ? 'idle' : 'guide');
  const [engine, setEngine] = useState<Awaited<ReturnType<typeof loadCharacterEngine>> | null>(null);
  const [view, setView] = useState(initialSessionView);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (snapshot.companionIntroComplete && intent === 'guide') setIntent('idle');
    if (!snapshot.companionIntroComplete && intent === 'idle') setIntent('guide');
  }, [snapshot.companionIntroComplete, intent]);

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
    scriptSent.current = false;
    guideFinished.current = false;
  }, [intent, snapshot.companionId, worldId]);

  useEffect(() => {
    if (!engine || !host.current || !session.current) return;
    const actor = new SvgCharacter(host.current, engine, character);
    host.current.querySelector('svg')?.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    session.current.attach(actor, { name: character.name, species: character.species, canFly: character.canFly });
    session.current.manual('happy', 'wave');
    const timer = character.canFly
      ? window.setTimeout(() => session.current?.manualFlight({ action: 'move', x: .62, y: .34, speed: .25, path: 'arc' }), 700)
      : 0;
    return () => { if (timer) window.clearTimeout(timer); };
  }, [engine, character]);

  useEffect(() => {
    if (intent === 'idle' || view.connection !== 'connected' || scriptSent.current || !session.current) return;
    scriptSent.current = true;

    const habits = habitLabels(snapshot.habits);
    const habitsText = habits.join('، ') || 'العادات اللي اختارها ولي الأمر';
    const required = Math.max(1, Math.min(snapshot.requiredHabits, habits.length || 1));
    const completed = habitLabels(getVerifiedHabitIds(snapshot));
    const pending = habitLabels(getPendingHabitIds(snapshot));
    const parentVerifiedHabits = snapshot.habits.filter(id => snapshot.habitVerification[id] === 'parent');
    const locationName = manifest.locations[progress.locationId]?.nameAr ?? manifest.nameAr;
    const revealIsVisible = Boolean(progress.flags[manifest.dayOne.revealFlag]);

    if (intent === 'guide') {
      session.current.send(
        `أنت ${character.name}، الصاحب اللي ${snapshot.childName || 'الطفل'} اختاره. إنت واقف معاه جوه ${manifest.nameAr}، ومهمتك في أول دقيقة محددة: تشرح نظام KidsHabits باختصار ثم تنهي الدور. لا تعمل دردشة مفتوحة، لا تسأل سؤال، لا تطلب منه يختار عادة، ولا تخترع أي مهمة أو قصة.\nالعادات المحددة من ولي الأمر هي فقط: ${habitsText}. المطلوب كل يوم ${required} من ${Math.max(1, habits.length)}. ${parentVerifiedHabits.length ? `في ${parentVerifiedHabits.length} عادة ولي الأمر اختار إنها تحتاج موافقته قبل ما تتحسب.` : 'ولي الأمر اختار إن إبلاغ الطفل كفاية للعادات الحالية.'}\nقول بالمصري المناسب لطفل إن لما العدد المطلوب يبقى متحقق في الحقيقة، الوقت في العالم يتحرك، المكان يتغير، وجزء جديد من الحكاية يظهر. العادات مش نقاط ولا فلوس، وصداقتكم مش مشروطة بإنجازها. لو عادة محتاجة موافقة، قول ببساطة إنها تستنى موافقة ولي الأمر من غير ضغط أو لوم.\nابدأ باسمه، عرّف نفسك بسرعة، اذكر العادات بأسمائها، اشرح قاعدة ${required} من ${Math.max(1, habits.length)}، وقل إنكم دلوقتي في ${locationName}.\nخليها 5 أو 6 جمل فقط، من غير أي سؤال في الآخر. اختم بمعنى: «يلا نسيب الكلام ونشوف العالم سوا.» استخدم perform أثناء الكلام، ولو بتطير استخدم fly مرة هادية.`,
        '[شرح بداية الرحلة داخل العالم]'
      );
      return;
    }

    session.current.send(
      `إنت ${character.name}، صاحب ${snapshot.childName || 'الطفل'} جوه ${manifest.nameAr}. إنت موجود بصوتك وشخصيتك داخل العالم، مش شات منفصل.\nالحالة الحقيقية الآن: اليوم ${progress.day} من ${manifest.totalDays}، المكان ${locationName}، العادات المحددة ${habitsText}، المتحقق فعليًا ${completed.length ? completed.join('، ') : 'ولا عادة لسه'}، وفي انتظار موافقة ولي الأمر ${pending.length ? pending.join('، ') : 'ولا حاجة'}. علامة اليوم الأول ${revealIsVisible ? 'ظهرت' : 'لسه ما ظهرتش'}.\nاتكلم بالمصري الدافئ وبجمل قصيرة. اسمع الطفل ورد طبيعي، لكن لا تدّعي إن عادة اتعملت أو اتوافقت لو الحالة ما بتقولش كده، لا تفتح مناطق، لا تغيّر progression، ولا تخترع objective أو reward. لو سألك نعمل إيه، اتكلم فقط عن اللي ظاهر فعلًا أو العادات المطلوبة. استخدم perform، ولو بتطير استخدم fly بشكل طبيعي.`,
      '[فتح محادثة صوتية داخل العالم]'
    );
  }, [intent, view.connection, character, snapshot, manifest, progress]);

  useEffect(() => {
    if (intent !== 'guide' || guideFinished.current || view.connection !== 'connected') return;
    if (!view.assistant.trim() || view.mode !== 'listening') return;
    guideFinished.current = true;
    const timer = window.setTimeout(() => {
      void session.current?.stop().finally(() => {
        setIntent('idle');
        onGuideComplete();
      });
    }, 420);
    return () => window.clearTimeout(timer);
  }, [intent, view.assistant, view.mode, view.connection, onGuideComplete]);

  const connected = view.connection === 'connected';
  const connecting = view.connection === 'connecting';
  const speaking = view.mode === 'speaking';
  const thinking = view.mode === 'thinking';

  const toggleVoice = () => {
    if (!snapshot.voiceEnabled) {
      if (!snapshot.companionIntroComplete) onGuideComplete();
      return;
    }
    if (!engine || !session.current) return;
    if (connected || connecting) {
      void session.current.stop();
      setIntent(snapshot.companionIntroComplete ? 'idle' : 'guide');
      scriptSent.current = false;
      return;
    }
    setIntent(snapshot.companionIntroComplete ? 'chat' : 'guide');
    scriptSent.current = false;
    guideFinished.current = false;
    void session.current.start();
  };

  const status = connecting
    ? 'بنوصل…'
    : speaking
      ? `${character.name} بيكلمك`
      : thinking
        ? `${character.name} بيفكر…`
        : connected
          ? `${character.name} سامعك`
          : `اضغط واسمع ${character.name}`;
  const showStatus = !snapshot.companionIntroComplete || connected || connecting || Boolean(view.error || loadError);

  return <div className={`in-world-companion ${connected ? 'is-live' : ''} ${speaking ? 'is-speaking' : ''}`} style={{ '--accent': character.accent } as CSSProperties}>
    <div className="world-character-render" ref={host} aria-label={`شخصية ${character.name}`} />
    <button className="world-voice-button" type="button" onClick={toggleVoice} disabled={!engine} aria-label={connected || connecting ? `إنهاء الكلام مع ${character.name}` : `التكلم مع ${character.name}`}>
      <span>{connected || connecting ? '■' : '🎙️'}</span>
    </button>
    {showStatus && <div className="world-voice-status">{status}</div>}
    {(view.error || loadError) && <div className="world-voice-error">{view.error || loadError}</div>}
  </div>;
}
