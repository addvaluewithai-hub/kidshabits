import { useIsland } from './hooks/useIsland';
import { WorldView } from './WorldView';
import { StoryPanel } from './StoryPanel';

export function App() {
  const { snapshot, focus, act, reset } = useIsland();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="KidsHabits, العودة للجزيرة">
          <span className="brand__mark">✳</span>
          <span><strong>KidsHabits</strong><small>THE WONDER ISLAND</small></span>
        </a>
        <span className="topbar__chapter"><span className="topbar__line" /> تجربة بناء عالم جديد <span className="topbar__line" /></span>
        <span className="topbar__badge"><i /> نسخة تصميم أولية</span>
      </header>

      <main className="experience">
        <section className="intro-rail" aria-label="مقدمة الجزيرة">
          <div className="intro-rail__stars">✳ &nbsp; ✦ &nbsp; ✳</div>
          <div className="eyebrow">A LITTLE WORLD OF YOUR OWN</div>
          <h1>مكان صغير.<br /><em>خيال كبير.</em></h1>
          <p>جزيرة كانت مستنية حد يديها حياة. بيت قديم، شجرة عندها أسرار، وصديقة اسمها نوفا.</p>
          <span className="intro-rail__divider" />
          <div className="chapter-line"><span>01</span><div><strong>أول زيارة</strong><small>THE ARRIVAL</small></div></div>
          <div className="micro-note"><span>✧</span> مفيش نقاط ولا عدّاد. المكان ده هيكبر باختياراتك.</div>
        </section>

        <WorldView island={snapshot} focus={focus}
          onCottage={() => act({ type: 'restore-cottage' }, 'cottage')}
          onGarden={() => act({ type: 'plant-garden' }, 'garden')} />

        <StoryPanel island={snapshot} focus={focus} onReset={reset} />
      </main>

      <footer className="app-footer">
        <span>✳ WONDER ISLAND · A WORLD THAT GROWS WITH YOU</span>
        <span>Made with care for curious minds</span>
      </footer>
    </div>
  );
}
