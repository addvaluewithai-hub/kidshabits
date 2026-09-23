import { useMemo, useState } from 'react';
import { getCharacter } from '../vendor/pixilive/core/registry.ts';
import type { AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';
import { currentJourneyWorldId, journeyStateFor } from '../worlds/journey';
import type { WorldId } from '../worlds/types';
import { GalaxyScene } from './GalaxyScene';
import { GalaxyCompanion } from './GalaxyCompanion';

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
  const [guideComplete, setGuideComplete] = useState(snapshot.companionIntroComplete);
  const [lockedWorldId, setLockedWorldId] = useState<WorldId | null>(null);
  const pendingApprovals = Object.values(snapshot.daily.checkins).filter(checkin => checkin.status === 'pending_parent').length;
  const currentWorldId = currentJourneyWorldId(snapshot);
  const currentWorld = WORLD_MANIFESTS.find(world => world.id === currentWorldId) ?? WORLD_MANIFESTS[0];
  const currentProgress = snapshot.worlds[currentWorld.id];
  const currentLocation = currentWorld.locations[currentProgress.locationId]?.nameAr ?? currentWorld.nameAr;

  const lockedWorld = useMemo(
    () => lockedWorldId ? WORLD_MANIFESTS.find(world => world.id === lockedWorldId) ?? null : null,
    [lockedWorldId],
  );

  const showLocked = (worldId: WorldId) => {
    setLockedWorldId(worldId);
    window.setTimeout(() => setLockedWorldId(current => current === worldId ? null : current), 2600);
  };

  return <main className={`galaxy-screen galaxy-v3 galaxy-journey ${guideComplete ? 'guide-complete' : 'guide-active'}`}>
    <GalaxyScene
      snapshot={snapshot}
      guideComplete={guideComplete}
      onEnterWorld={enterWorld}
      onLockedWorld={showLocked}
    />

    <header className="galaxy-header galaxy-header-v3">
      <div className="galaxy-title-block">
        <small>{guideComplete ? 'رحلتك في المجرة' : `أول رحلة مع ${companion.name}`}</small>
        <h1>{guideComplete ? 'المكان اللي مستنينا دلوقتي…' : 'المجرة أكبر من شاشة واحدة.'}</h1>
        <p>{guideComplete ? 'اتبع الطريق المنوّر. العوالم البعيدة هتظهر أكتر كل ما الرحلة تتقدم.' : `${companion.name} هيوريك إزاي العوالم دي مرتبطة بعاداتك في الحقيقة.`}</p>
      </div>
      <div className="galaxy-header-actions">
        <button className={`parent-entry ${pendingApprovals ? 'has-pending' : ''}`} type="button" onClick={openParentCenter}>
          <span>ولي الأمر</span>{pendingApprovals > 0 && <b>{pendingApprovals}</b>}
        </button>
      </div>
    </header>

    <GalaxyCompanion snapshot={snapshot} guideComplete={guideComplete} onGuideComplete={() => setGuideComplete(true)} />

    <section className="journey-focus-card" aria-live="polite">
      <span className="journey-focus-kicker">{snapshot.companionIntroComplete ? 'كمّل من هنا' : 'بداية الرحلة'}</span>
      <strong>{currentWorld.nameAr}</strong>
      <p>{currentWorld.subtitleAr}</p>
      <small>{currentProgress.eventsSeen.length ? `اليوم ${currentProgress.day} · ${currentLocation}` : `اليوم الأول · ${currentLocation}`}</small>
      <button type="button" disabled={!guideComplete} onClick={() => enterWorld(currentWorld.id)}>
        {guideComplete ? `ادخل ${currentWorld.nameAr}` : `اسمع ${companion.name} الأول`}
        <span>↗</span>
      </button>
    </section>

    {lockedWorld && <div className="journey-locked-toast" role="status">
      <span>✦</span>
      <div><b>{lockedWorld.nameAr}</b><small>باين من بعيد… وهيقرب لما رحلتك توصله.</small></div>
    </div>}

    <div className="galaxy-bottom-note"><span>✦</span><p>اسحب لفوق وتحت عشان تشوف امتداد الرحلة. كل عالم جديد بيتضاف للمسار من الـWorld Registry.</p></div>

    <div className="sr-only" aria-label="حالة العوالم">
      {WORLD_MANIFESTS.map((world, index) => <span key={world.id}>{world.nameAr}: {journeyStateFor(snapshot, world, index)}</span>)}
    </div>
  </main>;
}
