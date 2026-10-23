import type { IslandSnapshot, WorldFocus } from '../domain/island/model';
import { getNovaLine } from '../content/island/novaLines';

export function StoryPanel({ island, focus, onReset }: {
  island: IslandSnapshot;
  focus: WorldFocus;
  onReset: () => void;
}) {
  const hasChanges = island.cottage === 'restored' || island.garden === 'blooming';

  return (
    <aside className="story-panel">
      <div className="story-panel__top">
        <span className="eyebrow">YOUR WORLD • YOUR WAY</span>
        <span className="session-chip">✦ جلسة 01</span>
      </div>
      <h2>كل الحكايات<br /><em>بتبدأ من مكان.</em></h2>
      <p className="story-panel__lede">وده مكانك إنتِ. اختاري هنبتدي منين، وشوفي الجزيرة بتتغير قدامك.</p>

      <div className="dialogue" aria-live="polite" aria-atomic="true">
        <div className="dialogue__head"><span className="dialogue__avatar">✦</span><div><strong>نوفا</strong><small>رفيقتك في المغامرة</small></div><span className="dialogue__wave">◡̈</span></div>
        <p data-testid="nova-dialogue">{getNovaLine(island, focus)}</p>
      </div>

      <div className="story-panel__progress">
        <span>إيه اللي عملتيه؟</span>
        <div className="progress-items">
          <span className={island.cottage === 'restored' ? 'complete' : ''}>⌂ <span>البيت</span></span>
          <span className={island.garden === 'blooming' ? 'complete' : ''}>❀ <span>الحديقة</span></span>
        </div>
      </div>

      <div className="story-panel__bottom">
        <p>{hasChanges ? 'حاجة صغيرة اتغيّرت بسبب اختيارك. ولسه قدامنا كتير!' : 'جربي تضغطي على البيت أو مكان الزرع في الجزيرة.'}</p>
        <button className="text-button" type="button" onClick={onReset}>↺ ابدئي التجربة من الأول</button>
      </div>
    </aside>
  );
}
