import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import type { AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';
import type { WorldId } from '../worlds/types';

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

  return <main className="galaxy-screen">
    <div className="galaxy-stars" aria-hidden="true" />
    <header className="galaxy-header">
      <div><small>مجرتك</small><h1>اختار عالم نبدأ منه.</h1></div>
      <div className="galaxy-header-actions">
        <button className={`parent-entry ${pendingApprovals ? 'has-pending' : ''}`} type="button" onClick={openParentCenter}>
          <span>ولي الأمر</span>{pendingApprovals > 0 && <b>{pendingApprovals}</b>}
        </button>
        <div className="galaxy-companion-chip"><span>✦</span><b>{companion.name}</b><small>صاحب الرحلة</small></div>
      </div>
    </header>

    <section className="planet-orbit" aria-label="العوالم المتاحة">
      {WORLD_MANIFESTS.map((world, index) => {
        const progress = snapshot.worlds[world.id];
        const started = progress.eventsSeen.length > 0 || Object.values(progress.flags).some(Boolean) || progress.locationId !== world.startingLocationId;
        const location = world.locations[progress.locationId]?.nameAr ?? world.nameAr;
        const advancedToday = snapshot.daily.storyAdvanceWorldId === world.id;
        return <button
          key={world.id}
          type="button"
          className={`planet-card planet-${world.id} ${index % 2 ? 'orbit-right' : 'orbit-left'}`}
          onClick={() => enterWorld(world.id)}
        >
          <span className="planet-glow" />
          <span className="planet-sphere" aria-hidden="true"><span>{world.glyph}</span></span>
          <span className="planet-copy">
            <small>{world.availability === 'preview' ? 'ARCHITECTURE PREVIEW' : advancedToday ? 'اتحرك النهارده ✓' : started ? 'كمّل رحلتك' : 'عالم متاح'}</small>
            <strong>{world.nameAr}</strong>
            <em>{world.subtitleAr}</em>
            <span>{started ? `اليوم ${progress.day} · ${location}` : 'اليوم الأول جاهز'}</span>
          </span>
          <span className="planet-cta">{started ? 'ادخل تاني' : 'ابدأ'} ←</span>
        </button>;
      })}
    </section>

    <footer className="galaxy-footer">
      <span>✦</span>
      <p>كل كوكب ملف مستقل بقصته ومناطقه وأصوله. التطبيق نفسه يفضل ثابت.</p>
    </footer>
  </main>;
}
