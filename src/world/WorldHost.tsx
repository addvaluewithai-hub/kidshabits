import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { StorySequence, WorldLocation } from '../app/state';

export interface WorldPresentationState {
  currentLocation: WorldLocation;
  firstLightRevealed: boolean;
  pendingSequence: StorySequence | null;
}

class SproutWorldScene extends Phaser.Scene {
  private backdrop?: Phaser.GameObjects.Graphics;
  private light?: Phaser.GameObjects.Arc;
  private riverGlint?: Phaser.GameObjects.Arc;
  private worldState: WorldPresentationState;
  private sequenceRunning = false;
  private onSequenceComplete: (sequence: StorySequence) => void;

  constructor(initialState: WorldPresentationState, onSequenceComplete: (sequence: StorySequence) => void) {
    super('sprout-world');
    this.worldState = initialState;
    this.onSequenceComplete = onSequenceComplete;
  }

  create() {
    this.backdrop = this.add.graphics();
    this.light = this.add.circle(0, 0, 10, 0xffe9a8, 0.9).setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
    this.riverGlint = this.add.circle(0, 0, 7, 0xf6f2d0, 0.85).setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
    this.scale.on('resize', this.redrawFromState, this);
    this.redrawFromState();
    this.cameras.main.fadeIn(650, 239, 246, 235);

    if (this.worldState.pendingSequence === 'first-light') this.startFirstLightSequence();
    else if (this.worldState.pendingSequence === 'river-arrival') this.startRiverArrivalSequence();
    else this.startAmbientPulse();
  }

  setWorldState(next: WorldPresentationState) {
    const pendingChanged = next.pendingSequence !== this.worldState.pendingSequence;
    const locationChanged = next.currentLocation !== this.worldState.currentLocation;
    this.worldState = next;

    if (next.pendingSequence === 'first-light' && (pendingChanged || !this.sequenceRunning)) {
      this.startFirstLightSequence();
      return;
    }
    if (next.pendingSequence === 'river-arrival' && (pendingChanged || locationChanged || !this.sequenceRunning)) {
      this.startRiverArrivalSequence();
      return;
    }
    if (!this.sequenceRunning) {
      this.redrawFromState();
      this.startAmbientPulse();
    }
  }

  private redrawFromState = () => {
    if (this.worldState.currentLocation === 'river-clearing') this.drawRiverClearing();
    else this.drawLandingMeadow(this.worldState.firstLightRevealed && !this.sequenceRunning);
  };

  private drawLandingMeadow(revealed: boolean) {
    if (!this.backdrop || !this.light || !this.riverGlint) return;
    const w = this.scale.width;
    const h = this.scale.height;
    const g = this.backdrop;
    g.clear();

    g.fillStyle(revealed ? 0xf0f6ed : 0xe7efe8, 1).fillRect(0, 0, w, h);
    g.fillStyle(revealed ? 0xdcebdd : 0xd3dfd8, 1).fillEllipse(w * 0.15, h * 0.34, w * 0.9, h * 0.32);
    g.fillStyle(revealed ? 0xcfe6d3 : 0xc4d5ca, 1).fillEllipse(w * 0.85, h * 0.38, w * 1.15, h * 0.38);
    g.fillStyle(revealed ? 0xa6cdb0 : 0x99baa2, 1).fillRect(0, h * 0.58, w, h * 0.42);
    g.fillStyle(revealed ? 0x86b999 : 0x7da78b, 1).fillEllipse(w * 0.5, h * 0.72, w * 1.35, h * 0.42);

    g.fillStyle(0x759f98, 1).fillRoundedRect(w * 0.02, h * 0.63, w * 0.96, Math.max(18, h * 0.075), 30);
    g.fillStyle(revealed ? 0xb8ddd0 : 0xa7c8be, 1).fillRoundedRect(w * 0.02, h * 0.645, w * 0.96, Math.max(7, h * 0.028), 20);

    const treeX = w * 0.23;
    const treeY = h * 0.6;
    g.fillStyle(0x7d6f54, 1).fillRoundedRect(treeX - 12, treeY - 105, 24, 120, 10);
    g.fillStyle(revealed ? 0x74a47c : 0x6f9275, 1).fillCircle(treeX - 26, treeY - 114, 48);
    g.fillCircle(treeX + 24, treeY - 128, 54);
    g.fillStyle(revealed ? 0x8ab38a : 0x809b82, 1).fillCircle(treeX + 8, treeY - 88, 45);

    if (revealed) {
      g.lineStyle(13, 0xd7d5a7, 0.6);
      g.beginPath();
      g.moveTo(w * 0.54, h * 0.86);
      g.lineTo(w * 0.62, h * 0.72);
      g.lineTo(w * 0.73, h * 0.57);
      g.lineTo(w * 0.78, h * 0.46);
      g.strokePath();
      for (let i = 0; i < 8; i += 1) {
        const x = w * (0.48 + i * 0.045);
        const y = h * (0.8 - i * 0.035);
        g.fillStyle(i % 2 ? 0xf5db9f : 0xe6d5f1, 0.92).fillCircle(x, y, 4 + (i % 2));
      }
    }

    for (let i = 0; i < 14; i += 1) {
      const x = (i / 13) * w;
      const y = h * 0.82 + Math.sin(i * 1.7) * 10;
      g.fillStyle(i % 3 === 0 ? 0xffefb2 : 0xe7d6ee, revealed ? 0.95 : 0.55).fillCircle(x, y, 3 + (i % 2));
    }

    this.light.setPosition(w * 0.78, h * 0.43).setVisible(revealed || this.sequenceRunning);
    this.riverGlint.setVisible(false);
    if (!this.sequenceRunning) this.light.setAlpha(revealed ? 0.72 : 0).setScale(1);
  }

  private drawRiverClearing() {
    if (!this.backdrop || !this.light || !this.riverGlint) return;
    const w = this.scale.width;
    const h = this.scale.height;
    const g = this.backdrop;
    g.clear();

    g.fillStyle(0xedf5ef, 1).fillRect(0, 0, w, h);
    g.fillStyle(0xd8e8df, 1).fillEllipse(w * 0.2, h * 0.28, w * 0.95, h * 0.28);
    g.fillStyle(0xc8dfd0, 1).fillEllipse(w * 0.82, h * 0.34, w * 1.1, h * 0.34);
    g.fillStyle(0x8eb99c, 1).fillRect(0, h * 0.56, w, h * 0.44);

    // River ribbon.
    g.fillStyle(0x78b7b7, 1).fillRoundedRect(-w * 0.08, h * 0.62, w * 1.18, h * 0.23, 42);
    g.fillStyle(0x9ed0c8, 0.9).fillRoundedRect(-w * 0.05, h * 0.65, w * 1.1, h * 0.055, 26);
    g.fillStyle(0xd9eee3, 0.65).fillRoundedRect(w * 0.12, h * 0.75, w * 0.42, 7, 7);

    // Banks, reeds and calm foreground life.
    g.fillStyle(0x6e9b79, 1).fillEllipse(w * 0.18, h * 0.64, w * 0.56, h * 0.2);
    g.fillStyle(0x78a982, 1).fillEllipse(w * 0.82, h * 0.83, w * 0.7, h * 0.28);
    g.lineStyle(4, 0x698d68, 0.9);
    for (let i = 0; i < 10; i += 1) {
      const x = w * (0.05 + i * 0.035);
      g.beginPath(); g.moveTo(x, h * 0.66); g.lineTo(x + (i % 2 ? 6 : -4), h * (0.59 - (i % 3) * 0.012)); g.strokePath();
    }
    for (let i = 0; i < 12; i += 1) {
      const x = w * (0.56 + i * 0.038);
      const y = h * 0.9 + Math.sin(i) * 8;
      g.fillStyle(i % 3 === 0 ? 0xf5dfaa : 0xe4d9ef, 0.95).fillCircle(x, y, 3 + (i % 2));
    }

    this.light.setVisible(false);
    this.riverGlint.setPosition(w * 0.69, h * 0.62).setVisible(true);
    if (!this.sequenceRunning) this.riverGlint.setAlpha(0.72).setScale(1);
  }

  private startAmbientPulse() {
    if (!this.light || !this.riverGlint || this.sequenceRunning) return;
    this.tweens.killTweensOf(this.light);
    this.tweens.killTweensOf(this.riverGlint);
    if (this.worldState.currentLocation === 'river-clearing') {
      this.riverGlint.setVisible(true).setAlpha(0.76).setScale(1);
      this.tweens.add({ targets: this.riverGlint, alpha: 0.34, scale: 1.9, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    } else if (this.worldState.firstLightRevealed) {
      this.light.setVisible(true).setAlpha(0.78).setScale(1);
      this.tweens.add({ targets: this.light, alpha: 0.42, scale: 2.15, duration: 1550, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
  }

  private startFirstLightSequence() {
    if (!this.light || this.sequenceRunning) return;
    this.sequenceRunning = true;
    this.tweens.killTweensOf(this.light);
    this.drawLandingMeadow(false);
    this.light.setVisible(true).setAlpha(0).setScale(0.25);

    const camera = this.cameras.main;
    camera.zoomTo(1.12, 650, 'Sine.easeOut');
    camera.pan(this.light.x, this.light.y, 850, 'Sine.easeInOut');
    this.tweens.add({ targets: this.light, alpha: 1, scale: 2.8, duration: 950, ease: 'Sine.easeOut' });
    void this.playRevealChime();

    this.time.delayedCall(900, () => {
      this.drawLandingMeadow(true);
      this.spawnSparkles(this.light!.x, this.light!.y);
      this.tweens.add({ targets: this.light, alpha: 0.55, scale: 1.35, duration: 900, ease: 'Sine.easeInOut' });
    });
    this.time.delayedCall(1850, () => {
      camera.pan(this.scale.width / 2, this.scale.height / 2, 750, 'Sine.easeInOut');
      camera.zoomTo(1, 750, 'Sine.easeInOut');
    });
    this.time.delayedCall(2700, () => {
      this.sequenceRunning = false;
      this.drawLandingMeadow(true);
      this.startAmbientPulse();
      this.onSequenceComplete('first-light');
    });
  }

  private startRiverArrivalSequence() {
    if (this.sequenceRunning) return;
    this.sequenceRunning = true;
    const camera = this.cameras.main;
    this.tweens.killTweensOf(this.light);
    this.tweens.killTweensOf(this.riverGlint);
    camera.fadeOut(420, 222, 235, 226);

    this.time.delayedCall(440, () => {
      this.drawRiverClearing();
      camera.setZoom(1.08);
      camera.fadeIn(620, 234, 244, 237);
      camera.pan(this.scale.width * 0.69, this.scale.height * 0.62, 850, 'Sine.easeInOut');
      void this.playRevealChime(0.055);
    });
    this.time.delayedCall(1150, () => {
      if (!this.riverGlint) return;
      this.spawnSparkles(this.riverGlint.x, this.riverGlint.y);
      this.riverGlint.setAlpha(0.9).setScale(1.8);
      this.tweens.add({ targets: this.riverGlint, scale: 1, alpha: 0.65, duration: 900, ease: 'Sine.easeOut' });
    });
    this.time.delayedCall(2050, () => {
      camera.pan(this.scale.width / 2, this.scale.height / 2, 650, 'Sine.easeInOut');
      camera.zoomTo(1, 650, 'Sine.easeInOut');
    });
    this.time.delayedCall(2850, () => {
      this.sequenceRunning = false;
      this.drawRiverClearing();
      this.startAmbientPulse();
      this.onSequenceComplete('river-arrival');
    });
  }

  private spawnSparkles(x: number, y: number) {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const sparkle = this.add.circle(x, y, 2 + (i % 3), i % 2 ? 0xfff2b8 : 0xf5dff7, 0.95).setDepth(5);
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * (36 + i * 4),
        y: y + Math.sin(angle) * (28 + i * 3),
        alpha: 0,
        scale: 0.35,
        duration: 850 + i * 45,
        ease: 'Sine.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  private async playRevealChime(level = 0.08) {
    try {
      const context = new AudioContext();
      await context.resume();
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(level, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.65);
      gain.connect(context.destination);
      for (const [offset, frequency] of [[0, 523.25], [0.13, 659.25], [0.27, 783.99]] as const) {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start(context.currentTime + offset);
        oscillator.stop(context.currentTime + offset + 0.35);
      }
      window.setTimeout(() => void context.close(), 1200);
    } catch {
      // Visual sequence remains authoritative if autoplay policy blocks the cue.
    }
  }

  shutdown() {
    this.scale.off('resize', this.redrawFromState, this);
  }
}

export function WorldHost({
  currentLocation,
  firstLightRevealed,
  pendingSequence,
  onSequenceComplete,
}: WorldPresentationState & { onSequenceComplete: (sequence: StorySequence) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<SproutWorldScene | null>(null);
  const complete = useRef(onSequenceComplete);
  complete.current = onSequenceComplete;

  useEffect(() => {
    if (!host.current) return;
    const sprout = new SproutWorldScene(
      { currentLocation, firstLightRevealed, pendingSequence },
      sequence => complete.current(sequence),
    );
    scene.current = sprout;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      transparent: true,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      render: { antialias: true, roundPixels: false },
      scene: [sprout],
    });
    return () => {
      scene.current = null;
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    scene.current?.setWorldState({ currentLocation, firstLightRevealed, pendingSequence });
  }, [currentLocation, firstLightRevealed, pendingSequence]);

  const label = currentLocation === 'river-clearing' ? 'فسحة النهر في كوكب البراعم' : 'مرج الوصول في كوكب البراعم';
  return <div ref={host} className="world-canvas" aria-label={label} />;
}
