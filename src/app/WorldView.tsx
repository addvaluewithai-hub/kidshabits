import { WorldHost } from '../world/WorldHost';
import type { IslandSnapshot, WorldFocus } from '../domain/island/model';

interface Props {
  island: IslandSnapshot;
  focus: WorldFocus;
  onCottage: () => void;
  onGarden: () => void;
}

export function WorldView({ island, focus, onCottage, onGarden }: Props) {
  const restored = island.cottage === 'restored';
  const blooming = island.garden === 'blooming';

  return (
    <section className="world-frame" aria-label="الجزيرة التفاعلية">
      <div className="world-scene" data-testid="island-world">
        <WorldHost island={island} focus={focus} />

        <div className="scene-kicker">
          <span className="scene-kicker__orb" aria-hidden="true">✦</span>
          <span>ISLAND 001</span><span className="scene-kicker__dot">·</span><span>البداية</span>
        </div>

        <div className={`nova-label nova-label--${focus}`} data-testid="nova-actor" data-focus={focus}>
          <span className="nova-label__light" aria-hidden="true" /> نوفا هنا معاك
        </div>

        <button className="world-hotspot world-hotspot--cottage" type="button"
          data-testid="cottage-hotspot" aria-label="اضغطي لتصليح البيت"
          onClick={onCottage}>
          <span className="world-hotspot__spark">✦</span>
          <span>{restored ? 'البيت نور!' : 'البيت القديم'}</span>
        </button>

        <button className="world-hotspot world-hotspot--garden" type="button"
          data-testid="garden-hotspot" aria-label="اضغطي لزراعة الحديقة"
          onClick={onGarden}>
          <span className="world-hotspot__spark">✿</span>
          <span>{blooming ? 'الحديقة زهرت!' : 'مكان للزرع'}</span>
        </button>

        {restored && <div className="world-result world-result--cottage" data-testid="cottage-change"
          data-state="restored">✧ الشبابيك نورت</div>}
        {blooming && <div className="world-result world-result--garden" data-testid="garden-change"
          data-state="blooming">✿ أول زهرة في جزيرتك</div>}

        <div className="world-skyline" aria-hidden="true">✧ <span>عالم بيتغيّر باختياراتك</span> ✧</div>
      </div>
      <div className="world-caption">
        <span><span className="caption-dot" /> LIVE WORLD PREVIEW</span>
        <span>Prototype · Session 01</span>
      </div>
    </section>
  );
}
