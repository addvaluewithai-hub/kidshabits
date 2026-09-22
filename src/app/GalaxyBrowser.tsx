import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import type { AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';
import type { WorldId } from '../worlds/types';

export function GalaxyBrowser({
  snapshot,
  enterWorld,
}: {
  snapshot: AppSnapshot;
  enterWorld: (worldId: WorldId) => void;
}) {
  const companion = getCharacter(snapshot.companionId);

  return <main className="galaxy-screen">
    <div className="galaxy-stars" aria-hidden="true" />
    <header className="galaxy-header">
      <div><small>مجرتك</small><h1>اختار عالم نبدأ منه.</h1></div>
      <div className="galaxy-companion-chip"><span>✦</span><b>{companion.name}</b><small>صاحب الرحلة</small></div>
    </header>

    <section className="planet-orbit" aria-label="العوالم المتاحة">
      {WORLD_MANIFESTS.map((world, index) => {
        const progress = snapshot.worlds[world.id];
        const started = progress.eventsSeen.length > 0 || progress.completedHabits.length > 0 || progress.locationId !== world.startingLocationId;
        const location = world.locations[progress.locationId]?.nameAr ?? world.nameAr;
        return <button
          key={world.id}
          type="button"
          className={`planet-card planet-${world.id} ${index % 2 ? 'orbit-right' : 'orbit-left'}`}
          onClick={() => enterWorld(world.id)}
        >
          <span className="planet-glow" />
          <span className="planet-sphere" aria-hidden="true"><span>{world.glyph}</span></span>
          <span className="planet-copy">
            <small>{world.availability === 'preview' ? 'ARCHITECTURE PREVIEW' : started ? 'كمّل رحلتك' : 'عالم متاح'}</small>
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
