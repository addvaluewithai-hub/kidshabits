import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { StorySequence, WorldLocation } from '../app/state';

export interface WorldPresentationState {
  currentLocation: WorldLocation;
  firstLightRevealed: boolean;
  pendingSequence: StorySequence | null;
}

class SproutWorldScene extends Phaser.Scene {
  private sky?: Phaser.GameObjects.Graphics;
  private far?: Phaser.GameObjects.Graphics;
  private mid?: Phaser.GameObjects.Graphics;
  private ground?: Phaser.GameObjects.Graphics;
  private detail?: Phaser.GameObjects.Graphics;
  private light?: Phaser.GameObjects.Arc;
  private riverGlint?: Phaser.GameObjects.Arc;
  private ambient: Phaser.GameObjects.Arc[] = [];
  private worldState: WorldPresentationState;
  private sequenceRunning = false;
  private onSequenceComplete: (sequence: StorySequence) => void;

  constructor(initialState: WorldPresentationState, onSequenceComplete: (sequence: StorySequence) => void) {
    super('sprout-world');
    this.worldState = initialState;
    this.onSequenceComplete = onSequenceComplete;
  }

  create() {
    this.sky = this.add.graphics().setDepth(-50).setScrollFactor(0.02);
    this.far = this.add.graphics().setDepth(-40).setScrollFactor(0.18);
    this.mid = this.add.graphics().setDepth(-25).setScrollFactor(0.48);
    this.ground = this.add.graphics().setDepth(-10).setScrollFactor(0.82);
    this.detail = this.add.graphics().setDepth(1).setScrollFactor(1);
    this.light = this.add.circle(0, 0, 10, 0xffe8a2, 0.92).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
    this.riverGlint = this.add.circle(0, 0, 7, 0xf9f4ca, 0.9).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);

    this.createAmbientLife();
    this.scale.on('resize', this.redrawFromState, this);
    this.redrawFromState();
    this.cameras.main.fadeIn(650, 237, 244, 237);

    if (this.far && this.mid) {
      this.tweens.add({ targets: this.far, x: 7, duration: 9000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      this.tweens.add({ targets: this.mid, x: -4, duration: 7200, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }

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

  private layersReady() {
    return Boolean(this.sky && this.far && this.mid && this.ground && this.detail && this.light && this.riverGlint);
  }

  private clearLayers() {
    this.sky?.clear();
    this.far?.clear();
    this.mid?.clear();
    this.ground?.clear();
    this.detail?.clear();
  }

  private redrawFromState = () => {
    if (this.worldState.currentLocation === 'river-clearing') this.drawRiverClearing();
    else this.drawLandingMeadow(this.worldState.firstLightRevealed && !this.sequenceRunning);
  };

  private drawSky(base: number, haze: number, glow: number) {
    if (!this.sky) return;
    const w = this.scale.width;
    const h = this.scale.height;
    const g = this.sky;
    g.fillStyle(base, 1).fillRect(-80, -80, w + 160, h + 160);
    g.fillStyle(haze, 0.45).fillEllipse(w * 0.16, h * 0.16, w * 1.0, h * 0.42);
    g.fillStyle(glow, 0.28).fillCircle(w * 0.82, h * 0.13, Math.max(80, w * 0.25));
    g.fillStyle(0xffffff, 0.28).fillEllipse(w * 0.19, h * 0.19, w * 0.34, 34);
    g.fillEllipse(w * 0.79, h * 0.24, w * 0.26, 24);
  }

  private drawLandingMeadow(revealed: boolean) {
    if (!this.layersReady()) return;
    this.clearLayers();
    const w = this.scale.width;
    const h = this.scale.height;
    const far = this.far!;
    const mid = this.mid!;
    const ground = this.ground!;
    const detail = this.detail!;

    this.drawSky(revealed ? 0xf2f7ee : 0xeaf2ec, 0xdfece1, revealed ? 0xffefbd : 0xf6f0d5);

    far.fillStyle(revealed ? 0xd6e7d7 : 0xd7e2d9, 0.95).fillEllipse(w * 0.08, h * 0.38, w * 1.05, h * 0.36);
    far.fillStyle(revealed ? 0xc9dfcc : 0xcbd8cd, 0.95).fillEllipse(w * 0.86, h * 0.39, w * 1.22, h * 0.4);
    far.fillStyle(0xbfd7c6, 0.5).fillEllipse(w * 0.5, h * 0.47, w * 1.35, h * 0.34);

    mid.fillStyle(revealed ? 0xa8cbb0 : 0xa5bfa9, 1).fillEllipse(w * 0.15, h * 0.7, w * 0.95, h * 0.36);
    mid.fillStyle(revealed ? 0x94bea0 : 0x91ab99, 1).fillEllipse(w * 0.83, h * 0.71, w * 1.16, h * 0.39);
    mid.fillStyle(0x7da98b, 0.42).fillEllipse(w * 0.52, h * 0.78, w * 1.45, h * 0.29);

    ground.fillStyle(revealed ? 0x7fab8d : 0x789988, 1).fillEllipse(w * 0.5, h * 0.98, w * 1.5, h * 0.42);
    ground.fillStyle(revealed ? 0x8fbea0 : 0x86a993, 0.92).fillEllipse(w * 0.05, h * 0.9, w * 0.72, h * 0.24);
    ground.fillStyle(revealed ? 0x76a383 : 0x718f7d, 0.96).fillEllipse(w * 0.97, h * 0.93, w * 0.82, h * 0.27);

    const treeX = w * 0.22;
    const treeY = h * 0.71;
    detail.fillStyle(0x806f56, 1).fillRoundedRect(treeX - 12, treeY - 126, 25, 145, 11);
    detail.fillStyle(revealed ? 0x719d77 : 0x718d78, 1).fillCircle(treeX - 25, treeY - 137, 48);
    detail.fillStyle(revealed ? 0x7eaa80 : 0x77947c, 1).fillCircle(treeX + 25, treeY - 151, 56);
    detail.fillStyle(revealed ? 0x8ab68a : 0x809d82, 1).fillCircle(treeX + 7, treeY - 111, 47);
    detail.fillStyle(0xc9d9b0, revealed ? 0.32 : 0.18).fillCircle(treeX + 18, treeY - 163, 26);

    for (let i = 0; i < 18; i += 1) {
      const x = (i / 17) * w;
      const y = h * (0.83 + (i % 4) * 0.018);
      const tint = i % 3 === 0 ? 0xf7e5a8 : i % 3 === 1 ? 0xe8d8ed : 0xdceecf;
      detail.fillStyle(tint, revealed ? 0.86 : 0.42).fillCircle(x, y, 2.5 + (i % 2));
    }

    if (revealed) {
      detail.lineStyle(11, 0xe7dfb6, 0.38);
      detail.beginPath();
      detail.moveTo(w * 0.51, h * 0.92);
      detail.lineTo(w * 0.61, h * 0.79);
      detail.lineTo(w * 0.72, h * 0.62);
      detail.lineTo(w * 0.79, h * 0.45);
      detail.strokePath();
      detail.lineStyle(3, 0xfff3c9, 0.55);
      detail.beginPath();
      detail.moveTo(w * 0.53, h * 0.91);
      detail.lineTo(w * 0.63, h * 0.78);
      detail.lineTo(w * 0.75, h * 0.58);
      detail.strokePath();
    }

    this.light!.setPosition(w * 0.79, h * 0.44).setVisible(revealed || this.sequenceRunning);
    this.riverGlint!.setVisible(false);
    if (!this.sequenceRunning) this.light!.setAlpha(revealed ? 0.74 : 0).setScale(1);
  }

  private drawRiverClearing() {
    if (!this.layersReady()) return;
    this.clearLayers();
    const w = this.scale.width;
    const h = this.scale.height;
    const far = this.far!;
    const mid = this.mid!;
    const ground = this.ground!;
    const detail = this.detail!;

    this.drawSky(0xeff6ef, 0xdcebe1, 0xeef4d3);

    far.fillStyle(0xd4e7d9, 0.96).fillEllipse(w * 0.12, h * 0.34, w * 1.05, h * 0.36);
    far.fillStyle(0xc4ddce, 0.94).fillEllipse(w * 0.88, h * 0.37, w * 1.18, h * 0.39);
    far.fillStyle(0xb7d5c3, 0.42).fillEllipse(w * 0.53, h * 0.5, w * 1.5, h * 0.3);

    mid.fillStyle(0x86b493, 1).fillEllipse(w * 0.1, h * 0.68, w * 0.78, h * 0.31);
    mid.fillStyle(0x79a989, 1).fillEllipse(w * 0.92, h * 0.72, w * 0.92, h * 0.32);

    ground.fillStyle(0x6ea2a2, 1).fillRoundedRect(-w * 0.1, h * 0.63, w * 1.2, h * 0.26, 58);
    ground.fillStyle(0x87bebe, 0.92).fillRoundedRect(-w * 0.08, h * 0.665, w * 1.16, h * 0.07, 28);
    ground.fillStyle(0xc5e2db, 0.56).fillRoundedRect(w * 0.04, h * 0.71, w * 0.45, 7, 8);
    ground.fillStyle(0xd9eee5, 0.46).fillRoundedRect(w * 0.58, h * 0.79, w * 0.31, 5, 7);
    ground.fillStyle(0x73a07e, 1).fillEllipse(w * 0.08, h * 0.85, w * 0.75, h * 0.28);
    ground.fillStyle(0x7cab86, 1).fillEllipse(w * 0.94, h * 0.92, w * 0.86, h * 0.3);

    detail.lineStyle(3, 0x668f69, 0.82);
    for (let i = 0; i < 11; i += 1) {
      const x = w * (0.03 + i * 0.035);
      detail.beginPath();
      detail.moveTo(x, h * 0.7);
      detail.lineTo(x + (i % 2 ? 5 : -4), h * (0.59 - (i % 3) * 0.013));
      detail.strokePath();
    }
    for (let i = 0; i < 14; i += 1) {
      const x = w * (0.55 + i * 0.035);
      const y = h * 0.91 + Math.sin(i * 1.2) * 8;
      detail.fillStyle(i % 3 === 0 ? 0xf5dfaa : i % 3 === 1 ? 0xe8dbef : 0xdbe9c8, 0.88).fillCircle(x, y, 2.5 + (i % 2));
    }

    detail.fillStyle(0xe7e4ce, 0.72).fillEllipse(w * 0.69, h * 0.64, 34, 16);
    detail.fillStyle(0xffffff, 0.28).fillEllipse(w * 0.69, h * 0.635, 20, 6);

    this.light!.setVisible(false);
    this.riverGlint!.setPosition(w * 0.69, h * 0.615).setVisible(true);
    if (!this.sequenceRunning) this.riverGlint!.setAlpha(0.72).setScale(1);
  }

  private createAmbientLife() {
    const w = this.scale.width;
    const h = this.scale.height;
    const palette = [0xfff0b8, 0xe9ddf2, 0xd9efdf];
    for (let i = 0; i < 9; i += 1) {
      const mote = this.add.circle(w * (0.08 + ((i * 0.113) % 0.84)), h * (0.22 + ((i * 0.137) % 0.58)), 1.5 + (i % 3) * 0.55, palette[i % palette.length], 0.18).setDepth(5).setScrollFactor(0.72);
      this.ambient.push(mote);
      this.tweens.add({
        targets: mote,
        y: mote.y - (14 + (i % 4) * 4),
        x: mote.x + (i % 2 ? 5 : -4),
        alpha: { from: 0.12, to: 0.55 },
        duration: 2600 + i * 330,
        delay: i * 180,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }

  private startAmbientPulse() {
    if (!this.light || !this.riverGlint || this.sequenceRunning) return;
    this.tweens.killTweensOf(this.light);
    this.tweens.killTweensOf(this.riverGlint);
    if (this.worldState.currentLocation === 'river-clearing') {
      this.riverGlint.setVisible(true).setAlpha(0.75).setScale(1);
      this.tweens.add({ targets: this.riverGlint, alpha: 0.3, scale: 2.05, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    } else if (this.worldState.firstLightRevealed) {
      this.light.setVisible(true).setAlpha(0.78).setScale(1);
      this.tweens.add({ targets: this.light, alpha: 0.36, scale: 2.2, duration: 1750, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }
  }

  private startFirstLightSequence() {
    if (!this.light || this.sequenceRunning) return;
    this.sequenceRunning = true;
    this.tweens.killTweensOf(this.light);
    this.drawLandingMeadow(false);
    this.light.setVisible(true).setAlpha(0).setScale(0.22);

    const camera = this.cameras.main;
    camera.zoomTo(1.1, 700, 'Sine.easeOut');
    camera.pan(this.light.x, this.light.y, 900, 'Sine.easeInOut');
    this.tweens.add({ targets: this.light, alpha: 1, scale: 2.7, duration: 1000, ease: 'Sine.easeOut' });
    void this.playRevealChime();

    this.time.delayedCall(920, () => {
      this.drawLandingMeadow(true);
      this.spawnSparkles(this.light!.x, this.light!.y);
      this.tweens.add({ targets: this.light, alpha: 0.56, scale: 1.3, duration: 900, ease: 'Sine.easeInOut' });
    });
    this.time.delayedCall(1900, () => {
      camera.pan(this.scale.width / 2, this.scale.height / 2, 800, 'Sine.easeInOut');
      camera.zoomTo(1, 800, 'Sine.easeInOut');
    });
    this.time.delayedCall(2800, () => {
      this.sequenceRunning = false;
      this.drawLandingMeadow(true);
      this.startAmbientPulse();
      this.onSequenceComplete('first-light');
    });
  }

  private startRiverArrivalSequence() {
    if (!this.light || !this.riverGlint || this.sequenceRunning) return;
    this.sequenceRunning = true;
    const camera = this.cameras.main;
    this.tweens.killTweensOf(this.light);
    this.tweens.killTweensOf(this.riverGlint);
    camera.fadeOut(430, 229, 239, 230);

    this.time.delayedCall(450, () => {
      this.drawRiverClearing();
      camera.setZoom(1.07);
      camera.fadeIn(650, 237, 245, 239);
      camera.pan(this.scale.width * 0.69, this.scale.height * 0.61, 900, 'Sine.easeInOut');
      void this.playRevealChime(0.05);
    });
    this.time.delayedCall(1200, () => {
      if (!this.riverGlint) return;
      this.spawnSparkles(this.riverGlint.x, this.riverGlint.y);
      this.riverGlint.setAlpha(0.9).setScale(1.75);
      this.tweens.add({ targets: this.riverGlint, scale: 1, alpha: 0.64, duration: 920, ease: 'Sine.easeOut' });
    });
    this.time.delayedCall(2100, () => {
      camera.pan(this.scale.width / 2, this.scale.height / 2, 700, 'Sine.easeInOut');
      camera.zoomTo(1, 700, 'Sine.easeInOut');
    });
    this.time.delayedCall(2950, () => {
      this.sequenceRunning = false;
      this.drawRiverClearing();
      this.startAmbientPulse();
      this.onSequenceComplete('river-arrival');
    });
  }

  private spawnSparkles(x: number, y: number) {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const sparkle = this.add.circle(x, y, 2 + (i % 3), i % 2 ? 0xfff2b8 : 0xf5dff7, 0.95).setDepth(9);
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

  private async playRevealChime(level = 0.075) {
    try {
      const context = new AudioContext();
      await context.resume();
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(level, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);
      gain.connect(context.destination);
      for (const [offset, frequency] of [[0, 523.25], [0.14, 659.25], [0.29, 783.99]] as const) {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start(context.currentTime + offset);
        oscillator.stop(context.currentTime + offset + 0.38);
      }
      window.setTimeout(() => void context.close(), 1300);
    } catch {
      // The visual reveal remains authoritative if the browser blocks audio.
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
