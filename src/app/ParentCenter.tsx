import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import { HABIT_OPTIONS, type AppSnapshot, type HabitVerificationMode } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';

function habitById(id: string) {
  return HABIT_OPTIONS.find(habit => habit.id === id);
}

export function ParentCenter({
  snapshot,
  update,
  approveHabit,
  rejectHabit,
  close,
}: {
  snapshot: AppSnapshot;
  update: (patch: Partial<AppSnapshot>) => void;
  approveHabit: (habitId: string) => void;
  rejectHabit: (habitId: string) => void;
  close: () => void;
}) {
  const companion = getCharacter(snapshot.companionId);
  const pending = Object.values(snapshot.daily.checkins).filter(checkin => checkin.status === 'pending_parent');
  const verified = Object.values(snapshot.daily.checkins).filter(checkin => checkin.status === 'verified');

  const toggleHabit = (habitId: string) => {
    const selected = snapshot.habits.includes(habitId);
    const habits = selected
      ? snapshot.habits.filter(id => id !== habitId)
      : snapshot.habits.length < 3
        ? [...snapshot.habits, habitId]
        : snapshot.habits;
    if (habits === snapshot.habits) return;
    const checkins = { ...snapshot.daily.checkins };
    if (selected) delete checkins[habitId];
    update({
      habits,
      requiredHabits: Math.max(1, Math.min(snapshot.requiredHabits, Math.max(1, habits.length))),
      daily: { ...snapshot.daily, checkins },
    });
  };

  const setVerification = (habitId: string, mode: HabitVerificationMode) => {
    update({ habitVerification: { ...snapshot.habitVerification, [habitId]: mode } });
  };

  return <main className="parent-center-screen">
    <header className="parent-center-header">
      <button type="button" onClick={close} aria-label="الرجوع للطفل">←</button>
      <div><small>ولي الأمر</small><h1>مركز {snapshot.childName || 'الطفل'}</h1></div>
      <span className="parent-child-chip">{companion.name} · الصاحب</span>
    </header>

    <section className="parent-summary-grid">
      <article><small>تم التحقق اليوم</small><strong>{verified.length}</strong><span>من {snapshot.requiredHabits} مطلوبين</span></article>
      <article className={pending.length ? 'needs-attention' : ''}><small>في انتظارك</small><strong>{pending.length}</strong><span>{pending.length ? 'موافقة مطلوبة' : 'مفيش طلبات'}</span></article>
    </section>

    {pending.length > 0 && <section className="parent-panel approvals-panel">
      <div className="panel-heading"><div><small>موافقة ولي الأمر</small><h2>طلبات النهارده</h2></div><span>{pending.length}</span></div>
      <div className="approval-list">{pending.map(checkin => {
        const habit = habitById(checkin.habitId);
        if (!habit) return null;
        return <article key={checkin.habitId}>
          <div className="approval-habit"><span>{habit.icon}</span><div><b>{habit.label}</b><small>الطفل قال إنه خلصها</small></div></div>
          <div className="approval-actions"><button type="button" className="reject" onClick={() => rejectHabit(checkin.habitId)}>لسه</button><button type="button" className="approve" onClick={() => approveHabit(checkin.habitId)}>✓ موافق</button></div>
        </article>;
      })}</div>
    </section>}

    <section className="parent-panel">
      <div className="panel-heading"><div><small>العادات</small><h2>إدارة الروتين</h2></div><span>{snapshot.requiredHabits} / {snapshot.habits.length}</span></div>
      <p className="panel-note">اختار لحد 3 عادات. لكل عادة تقدر تعتمد على إبلاغ الطفل أو تطلب موافقتك قبل ما تحرك القصة.</p>
      <div className="parent-habit-list">{HABIT_OPTIONS.map(habit => {
        const selected = snapshot.habits.includes(habit.id);
        const mode = snapshot.habitVerification[habit.id] ?? 'trust';
        return <article key={habit.id} className={selected ? 'selected' : ''}>
          <button className="habit-select" type="button" onClick={() => toggleHabit(habit.id)}><span>{habit.icon}</span><b>{habit.label}</b><em>{selected ? 'مفعّلة' : 'إضافة'}</em></button>
          {selected && <div className="verification-toggle" role="group" aria-label={`طريقة التحقق من ${habit.label}`}>
            <button type="button" className={mode === 'trust' ? 'active' : ''} onClick={() => setVerification(habit.id, 'trust')}>ثقة</button>
            <button type="button" className={mode === 'parent' ? 'active' : ''} onClick={() => setVerification(habit.id, 'parent')}>موافقتي</button>
          </div>}
        </article>;
      })}</div>
      <label className="parent-threshold">عدد العادات المطلوبة لتحريك حدث اليوم <strong>{snapshot.requiredHabits}</strong><input type="range" min="1" max={Math.max(1, snapshot.habits.length)} value={Math.min(snapshot.requiredHabits, Math.max(1, snapshot.habits.length))} onChange={event => update({ requiredHabits: Number(event.target.value) })} /></label>
    </section>

    <section className="parent-panel">
      <div className="panel-heading"><div><small>التجربة</small><h2>الصوت والمكالمات</h2></div></div>
      <label className="setting-row"><div><b>الكلام مع الشخصية</b><small>Gemini Live يشتغل فقط أثناء المحادثة.</small></div><input type="checkbox" checked={snapshot.voiceEnabled} onChange={event => update({ voiceEnabled: event.target.checked })} /></label>
      <label className="setting-row"><div><b>مكالمات الشخصية</b><small>هنطبق عليها policy وrate limits قبل التفعيل الحقيقي.</small></div><input type="checkbox" checked={snapshot.callsEnabled} onChange={event => update({ callsEnabled: event.target.checked })} /></label>
      <div className="quiet-settings"><div><b>وقت هدوء</b><small>مفيش re-engagement خلال الفترة دي.</small></div><div><input type="time" value={snapshot.quietHours.start} onChange={event => update({ quietHours: { ...snapshot.quietHours, start: event.target.value } })} /><span>→</span><input type="time" value={snapshot.quietHours.end} onChange={event => update({ quietHours: { ...snapshot.quietHours, end: event.target.value } })} /></div></div>
    </section>

    <section className="parent-panel">
      <div className="panel-heading"><div><small>المجرة</small><h2>تقدم العوالم</h2></div></div>
      <div className="parent-world-list">{WORLD_MANIFESTS.map(world => {
        const progress = snapshot.worlds[world.id];
        const location = world.locations[progress.locationId]?.nameAr ?? world.nameAr;
        const advancedToday = snapshot.daily.storyAdvanceWorldId === world.id;
        return <article key={world.id}><span className="parent-world-glyph">{world.glyph}</span><div><b>{world.nameAr}</b><small>اليوم {progress.day} · {location}</small></div>{advancedToday && <em>تحرك النهارده ✓</em>}</article>;
      })}</div>
    </section>

    <button className="parent-done" type="button" onClick={close}>رجّع الموبايل لـ{snapshot.childName || 'الطفل'}</button>
  </main>;
}
