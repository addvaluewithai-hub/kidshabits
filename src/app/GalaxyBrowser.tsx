import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import type { AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';
import type { WorldId } from '../worlds/types';
import { GalaxyScene } from './GalaxyScene';

export function GalaxyBrowser({
  snapshot,
  enterWorld,
  openParentCenter,
}: {
  snapshot: AppSnapshot;
  enterWorld: (worldId: WorldId) => void;
  openParentCenter: () => void;
}) {
  const companion = getCharacter(snapshot.companionId);
  const pendingApprovals = Object.values(snapshot.daily.checkins).filter(checkin => checkin.status === 'pending_parent').length;

  return <main className="galaxy-screen galaxy-v3">
    <GalaxyScene snapshot={snapshot} onEnterWorld={enterWorld} />

    <header className="galaxy-header galaxy-header-v3">
      <div className="galaxy-title-block">
        <small>مجرتك</small>
        <h1>كل عالم مستني حكاية جديدة.</h1>
        <p>اختار الكوكب اللي تحب تكمل فيه النهارده.</p>
      </div>
      <div className="galaxy-header-actions">
        <button className={`parent-entry ${pendingApprovals ? 'has-pending' : ''}`} type="button" onClick={openParentCenter}>
          <span>ولي الأمر</span>{pendingApprovals > 0 && <b>{pendingApprovals}</b>}
        </button>
        <div className="galaxy-companion-chip"><span>✦</span><div><b>{companion.name}</b><small>صاحب الرحلة</small></div></div>
      </div>
    </header>

    <section className="galaxy-world-labels" aria-label="العوالم المتاحة">
      {WORLD_MANIFESTS.map((world, index) => {
        const progress = snapshot.worlds[world.id];
        const started = progress.eventsSeen.length > 0 || Object.values(progress.flags).some(Boolean) || progress.locationId !== world.startingLocationId;
        const location = world.locations[progress.locationId]?.nameAr ?? world.nameAr;
        const advancedToday = snapshot.daily.storyAdvanceWorldId === world.id;
        return <button
          key={world.id}
          type="button"
          className={`galaxy-world-label galaxy-world-label-${index}`}
          onClick={() => enterWorld(world.id)}
        >
          <span className="world-label-kicker">{advancedToday ? 'اتحرك النهارده ✓' : started ? 'كمّل رحلتك' : world.availability === 'preview' ? 'عالم تجريبي' : 'عالم متاح'}</span>
          <strong>{world.nameAr}</strong>
          <span>{started ? `اليوم ${progress.day} · ${location}` : world.subtitleAr}</span>
          <em>{started ? 'كمّل' : 'ابدأ'} ↗</em>
        </button>;
      })}
    </section>

    <div className="galaxy-bottom-note"><span>✦</span><p>كل كوكب له عالمه وقصته. صاحبك يفضل معاك في كل الرحلات.</p></div>
  </main>;
}
