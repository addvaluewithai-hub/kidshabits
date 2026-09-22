import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { getWorldManifest } from '../worlds/registry';
import type { WorldId, WorldProgress } from '../worlds/types';
import { getWorldPresentation } from '../world-runtime/presentations';
import type { StorySequence } from '../app/state';
import type { WorldLayers } from '../world-runtime/presentation';

interface WorldHostProps {
  worldId: WorldId;
  progress: WorldProgress;
  onSequenceComplete: (sequence: StorySequence) => void;
}

class PlanetWorldScene extends Phaser.Scene {
  private layers?: WorldLayers;
  private focusGlow?: Phaser.GameObjects.Arc;
  private ambient: Phaser.GameObjects.Arc[] = [];
  private progress: WorldProgress;
  private readonly worldId: WorldId;
  private readonly onSequenceComplete: (sequence: StorySequence) => void;
  private sequenceRunning = false;

  constructor(worldId: WorldId, progress: WorldProgress, onSequenceComplete: (sequence: StorySequence) => void) {
    super(`world-${worldId}`);
    this.worldId = worldId;
    this.progress = progress;
    this.onSequenceComplete = onSequenceComplete;
  }

  create() {
    this.layers = {
      sky: this.add.graphics().setDepth(-50).setScrollFactor(0.02),
      far: this.add.graphics().setDepth(-40).setScrollFactor(0.18),
      mid: this.add.graphics().setDepth(-25).setScrollFactor(0.48),
      ground: this.add.graphics().setDepth(-10).setScrollFactor(0.82),
      detail: this.add.graphics().setDepth(1).setScrollFactor(1),
    };
    this.focusGlow = this.add.circle(0, 0, 9, 0xffefb0, 0).setDepth(8).setBlendMode(Phaser.BlendModes.ADD);
    this.createAmbientLife();
    this.scale.on('resize', this.redraw, this);
    this.redraw();
    this.cameras.main.fadeIn(520, 235, 242, 238);

    const manifest = getWorldManifest(this.worldId);
    if (this.progress.pendingSequence === manifest.dayOne.revealSequenceId) this.startRevealSequence();
    else if (this.progress.pendingSequence === manifest.dayOne.primaryAction.sequenceId) this.startTravelSequence();
    else this.startAmbientFocus();
  }

  setProgress(progress: WorldProgress) {
    const pendingChanged = progress.pendingSequence !== this.progress.pendingSequence;
    const locationChanged = progress.locationId !== this.progress.locationId;
    this.progress = progress;
    const manifest = getWorldManifest(this.worldId);

    if (progress.pendingSequence === manifest.dayOne.revealSequenceId && (pendingChanged || !this.sequenceRunning)) {
      this.startRevealSequence();
      return;
    }
    if (progress.pendingSequence === manifest.dayOne.primaryAction.sequenceId && (pendingChanged || locationChanged || !this.sequenceRunning)) {
      this.startTravelSequence();
      return;
    }
    if (!this.sequenceRunning) {
      this.redraw();
      this.startAmbientFocus();
    }
  }

  private draw(forceReveal?: boolean) {
    if (!this.layers || !this.focusGlow) return;
    const manifest = getWorldManifest(this.worldId);
    const presentation = getWorldPresentation(manifest.presentationId);
    const progress = forceReveal === undefined
      ? this.progress
      : { ...this.progress, flags: { ...this.progress.flags, [manifest.dayOne.revealFlag]: forceReveal } };
    const result = presentation({
      width: this.scale.width,
      height: this.scale.height,
      progress,
      revealFlag: manifest.dayOne.revealFlag,
      sequenceRunning: this.sequenceRunning,
      layers: this.layers,
    });
    this.focusGlow.setPosition(result.focusPoint.x, result.focusPoint.y).setFillStyle(result.ambientTint, 1);
    const revealed = Boolean(progress.flags[manifest.dayOne.revealFlag]);
    this.focusGlow.setVisible(revealed || this.sequenceRunning);
    if (!this.sequenceRunning) this.focusGlow.setAlpha(revealed ? 0.58 : 0).setScale(1);
  }

  private redraw = () => this.draw();

  private createAmbientLife() {
    const palette = this.worldId === 'sprout'
      ? [0xfff0b8, 0xe9ddf2, 0xd9efdf]
      : [0xffefae, 0xcfc7ff, 0xb9dfea];
    for (let i = 0; i < 9; i += 1) {
      const mote = this.add.circle(
        this.scale.width * (0.08 + ((i * 0.113) % 0.84)),
        this.scale.height * (0.2 + ((i * 0.137) % 0.6)),
        1.3 + (i % 3) * 0.5,
        palette[i % palette.length],
        0.18,
      ).setDepth(5).setScrollFactor(0.72);
      this.ambient.push(mote);
      this.tweens.add({
        targets: mote,
        y: mote.y - (14 + (i % 4) * 4),
        x: mote.x + (i % 2 ? 5 : -4),
        alpha: { from: 0.1, to: 0.5 },
        duration: 2800 + i * 310,
        delay: i * 170,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }

  private startAmbientFocus() {
    if (!this.focusGlow || this.sequenceRunning) return;
    this.tweens.killTweensOf(this.focusGlow);
    const manifest = getWorldManifest(this.worldId);
    if (!this.progress.flags[manifest.dayOne.revealFlag]) {
      this.focusGlow.setAlpha(0);
      return;
    }
    this.focusGlow.setVisible(true).setAlpha(0.58).setScale(1);
    this.tweens.add({
      targets: this.focusGlow,
      alpha: 0.3,
      scale: 1.75,
      duration: 1700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });
  }

  private startRevealSequence() {
    if (!this.focusGlow || this.sequenceRunning) return;
    this.sequenceRunning = true;
    this.tweens.killTweensOf(this.focusGlow);
    this.draw(false);
    this.focusGlow.setVisible(true).setAlpha(0).setScale(0.3);
    const camera = this.cameras.main;
    camera.zoomTo(1.1, 650, 'Sine.easeOut');
    camera.pan(this.focusGlow.x, this.focusGlow.y, 820, 'Sine.easeInOut');
    this.tweens.add({ targets: this.focusGlow, alpha: 1, scale: 2.7, duration: 980, ease: 'Sine.easeOut' });
    void this.playRevealChime();

    this.time.delayedCall(900, () => {
      this.draw(true);
      this.focusGlow?.setAlpha(0.72).setScale(1.45);
      if (this.focusGlow) this.spawnSparkles(this.focusGlow.x, this.focusGlow.y);
    });
    this.time.delayedCall(1800, () => {
      camera.pan(this.scale.width / 2, this.scale.height / 2, 700, 'Sine.easeInOut');
      camera.zoomTo(1, 700, 'Sine.easeInOut');
    });
    this.time.delayedCall(2600, () => {
      this.sequenceRunning = false;
      this.draw();
      this.startAmbientFocus();
      const sequence = getWorldManifest(this.worldId).dayOne.revealSequenceId;
      this.onSequenceComplete(sequence);
    });
  }

  private startTravelSequence() {
    if (!this.focusGlow || this.sequenceRunning) return;
    this.sequenceRunning = true;
    const camera = this.cameras.main;
    this.tweens.killTweensOf(this.focusGlow);
    camera.fadeOut(380, 226, 234, 230);
    this.time.delayedCall(400, () => {
      this.draw();
      camera.setZoom(1.07);
      camera.fadeIn(580, 234, 240, 236);
      camera.pan(this.focusGlow!.x, this.focusGlow!.y, 820, 'Sine.easeInOut');
      void this.playRevealChime(0.05);
    });
    this.time.delayedCall(1050, () => {
      if (!this.focusGlow) return;
      this.spawnSparkles(this.focusGlow.x, this.focusGlow.y);
    });
    this.time.delayedCall(1900, () => {
      camera.pan(this.scale.width / 2, this.scale.height / 2, 620, 'Sine.easeInOut');
      camera.zoomTo(1, 620, 'Sine.easeInOut');
    });
    this.time.delayedCall(2700, () => {
      this.sequenceRunning = false;
      this.draw();
      this.startAmbientFocus();
      const sequence = getWorldManifest(this.worldId).dayOne.primaryAction.sequenceId;
      this.onSequenceComplete(sequence);
    });
  }

  private spawnSparkles(x: number, y: number) {
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const sparkle = this.add.circle(x, y, 2 + (i % 3), i % 2 ? 0xfff2b8 : 0xe4daf6, 0.92).setDepth(10);
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * (32 + i * 4),
        y: y + Math.sin(angle) * (26 + i * 3),
        alpha: 0,
        scale: 0.35,
        duration: 760 + i * 45,
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
      const notes = this.worldId === 'sprout' ? [523.25, 659.25, 783.99] : [440, 554.37, 659.25];
      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start(context.currentTime + index * 0.13);
        oscillator.stop(context.currentTime + index * 0.13 + 0.38);
      });
      window.setTimeout(() => void context.close(), 1200);
    } catch {
      // Presentation stays deterministic if mobile autoplay policy blocks audio.
    }
  }

  shutdown() {
    this.scale.off('resize', this.redraw, this);
  }
}

export function WorldHost({ worldId, progress, onSequenceComplete }: WorldHostProps) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<PlanetWorldScene | null>(null);
  const complete = useRef(onSequenceComplete);
  complete.current = onSequenceComplete;

  useEffect(() => {
    if (!host.current) return;
    const planetScene = new PlanetWorldScene(worldId, progress, sequence => complete.current(sequence));
    scene.current = planetScene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      transparent: true,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      render: { antialias: true, roundPixels: false },
      scene: [planetScene],
    });
    return () => {
      scene.current = null;
      game.destroy(true);
    };
  }, [worldId]);

  useEffect(() => {
    scene.current?.setProgress(progress);
  }, [progress]);

  const manifest = getWorldManifest(worldId);
  const locationName = manifest.locations[progress.locationId]?.nameAr ?? manifest.nameAr;
  return <div ref={host} className="world-canvas" aria-label={`${locationName} في ${manifest.nameAr}`} />;
}
