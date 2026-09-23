import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';
import { canEnterJourneyWorld, currentJourneyWorldId, journeyStateFor, type JourneyWorldState } from '../worlds/journey';
import type { WorldId } from '../worlds/types';

type PlanetVisual = {
  container: Phaser.GameObjects.Container;
  halo: Phaser.GameObjects.Arc;
  sphere: Phaser.GameObjects.Arc;
  marker: Phaser.GameObjects.Star;
  state: JourneyWorldState;
  worldId: WorldId;
};

function seeded(index: number) {
  const x = Math.sin(index * 999.91 + 17.41) * 43758.5453;
  return x - Math.floor(x);
}

function journeyPoint(index: number, width: number) {
  const corridor = Math.min(width * 0.27, 210);
  const x = width * 0.5 + (index % 2 === 0 ? -corridor : corridor);
  const y = 360 + index * 270;
  return { x, y };
}

class GalaxyPhaserScene extends Phaser.Scene {
  private readonly snapshot: AppSnapshot;
  private readonly onEnterWorld: (worldId: WorldId) => void;
  private readonly onLockedWorld: (worldId: WorldId) => void;
  private readonly planets: PlanetVisual[] = [];
  private path?: Phaser.GameObjects.Graphics;
  private selecting = false;
  private guideComplete: boolean;
  private dragStartY = 0;
  private dragStartScroll = 0;
  private dragging = false;
  private dragDistance = 0;

  constructor(
    snapshot: AppSnapshot,
    guideComplete: boolean,
    onEnterWorld: (worldId: WorldId) => void,
    onLockedWorld: (worldId: WorldId) => void,
  ) {
    super('galaxy-browser');
    this.snapshot = snapshot;
    this.guideComplete = guideComplete;
    this.onEnterWorld = onEnterWorld;
    this.onLockedWorld = onLockedWorld;
  }

  create() {
    this.cameras.main.setBackgroundColor('#070b18');
    this.createNebula();
    this.createStars();
    this.path = this.add.graphics().setDepth(-4);
    this.createPlanets();
    this.layout(true);
    this.bindJourneyInput();
    this.scale.on('resize', this.layout, this);
    this.cameras.main.fadeIn(620, 7, 11, 24);
    if (!this.guideComplete) this.runGuideCamera();
  }

  setGuideComplete(value: boolean) {
    if (this.guideComplete === value) return;
    this.guideComplete = value;
    if (value) this.focusCurrentPlanet();
  }

  private createNebula() {
    const blobs = [
      { x: 0.18, y: 0.18, w: 480, h: 320, color: 0x62548f, alpha: 0.1, dx: 16 },
      { x: 0.82, y: 0.5, w: 560, h: 360, color: 0x376a79, alpha: 0.09, dx: -20 },
      { x: 0.5, y: 0.86, w: 540, h: 300, color: 0x765d84, alpha: 0.07, dx: 13 },
    ];
    blobs.forEach((blob, index) => {
      const ellipse = this.add.ellipse(
        this.scale.width * blob.x,
        this.scale.height * blob.y,
        blob.w,
        blob.h,
        blob.color,
        blob.alpha,
      ).setDepth(-20).setBlendMode(Phaser.BlendModes.ADD).setScrollFactor(0.08 + index * 0.04);
      this.tweens.add({
        targets: ellipse,
        x: `+=${blob.dx}`,
        scaleX: 1.06,
        scaleY: 0.95,
        alpha: blob.alpha * 0.68,
        duration: 9800 + index * 1700,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createStars() {
    const depthBands = [
      { count: 52, factor: 0.08, minR: 0.5, maxR: 1.05, alpha: 0.3 },
      { count: 34, factor: 0.22, minR: 0.7, maxR: 1.4, alpha: 0.48 },
      { count: 20, factor: 0.42, minR: 0.9, maxR: 1.7, alpha: 0.68 },
    ];
    let seed = 1;
    const starHeight = Math.max(this.scale.height * 1.6, 1300);
    depthBands.forEach((band, bandIndex) => {
      for (let i = 0; i < band.count; i += 1) {
        seed += 1;
        const x = seeded(seed) * this.scale.width;
        const y = seeded(seed + 111) * starHeight;
        const radius = band.minR + seeded(seed + 227) * (band.maxR - band.minR);
        const tint = bandIndex === 0 ? 0xc9d5ee : seeded(seed + 53) > 0.72 ? 0xf6e1ac : 0xf7fbff;
        const star = this.add.circle(x, y, radius, tint, band.alpha)
          .setDepth(-12 + bandIndex)
          .setScrollFactor(band.factor);
        if (i % 5 === 0) {
          this.tweens.add({
            targets: star,
            alpha: Math.min(1, band.alpha + 0.24),
            scale: 1.5,
            duration: 1900 + seeded(seed + 19) * 2700,
            delay: seeded(seed + 31) * 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        }
      }
    });
  }

  private createPlanets() {
    WORLD_MANIFESTS.forEach((world, index) => {
      const isSprout = world.id === 'sprout';
      const state = journeyStateFor(this.snapshot, world, index);
      const current = state === 'current';
      const future = state === 'future';
      const baseColor = isSprout ? 0x5d9a82 : 0x74719d;
      const accentColor = isSprout ? 0xb8d89f : 0xc9c3f4;
      const shadowColor = isSprout ? 0x244f47 : 0x333450;

      const container = this.add.container(0, 0).setDepth(2).setAlpha(future ? 0.55 : 1).setScale(current ? 1.06 : future ? 0.8 : 0.94);
      const halo = this.add.circle(0, 0, 78, accentColor, current ? 0.15 : future ? 0.035 : 0.08)
        .setBlendMode(Phaser.BlendModes.ADD);
      container.add(halo);

      if (!isSprout) {
        const ring = this.add.ellipse(0, 7, 154, 46, 0x000000, 0)
          .setStrokeStyle(3, 0xcfc9f8, future ? 0.12 : 0.3)
          .setRotation(-0.28);
        container.add(ring);
      }

      const sphere = this.add.circle(0, 0, 56, baseColor, future ? 0.72 : 1)
        .setStrokeStyle(1.5, accentColor, future ? 0.15 : 0.34)
        .setInteractive({ useHandCursor: true });
      container.add(sphere);

      const shade = this.add.ellipse(16, 18, 79, 70, shadowColor, future ? 0.24 : 0.18);
      container.add(shade);

      if (isSprout) {
        container.add([
          this.add.ellipse(-16, -8, 40, 23, 0xa7c88e, future ? 0.25 : 0.5).setRotation(-0.45),
          this.add.ellipse(14, 7, 30, 18, 0x84b88f, future ? 0.22 : 0.44).setRotation(0.7),
          this.add.circle(22, -21, 8, 0xd6e9bf, future ? 0.12 : 0.28),
        ]);
      } else {
        container.add([
          this.add.circle(-18, -14, 9, 0x4d506f, 0.25),
          this.add.circle(18, 10, 7, 0x4b4d69, 0.22),
          this.add.circle(8, -28, 4, 0xeeeaff, future ? 0.09 : 0.2),
        ]);
      }

      container.add(this.add.circle(-18, -20, 13, 0xffffff, future ? 0.05 : 0.12));

      const marker = this.add.star(0, 0, 4, 3, 8, 0xffedb5, current ? 0.92 : 0.48)
        .setPosition(isSprout ? 21 : -24, isSprout ? -29 : 23)
        .setRotation(0.25);
      container.add(marker);

      if (future) {
        const lock = this.add.graphics();
        lock.lineStyle(2, 0xe7e8f1, 0.72);
        lock.strokeRoundedRect(-8, -9, 16, 13, 7);
        lock.fillStyle(0x151a30, 0.86);
        lock.fillRoundedRect(-10, -1, 20, 16, 5);
        lock.fillStyle(0xe7e8f1, 0.72);
        lock.fillCircle(0, 6, 2);
        lock.setPosition(0, 78);
        container.add(lock);
      }

      sphere.on('pointerover', () => {
        if (this.selecting || this.dragging) return;
        const targetScale = current ? 1.11 : future ? 0.84 : 0.99;
        this.tweens.add({ targets: container, scale: targetScale, duration: 220, ease: 'Sine.easeOut' });
      });
      sphere.on('pointerout', () => {
        if (this.selecting) return;
        const targetScale = current ? 1.06 : future ? 0.8 : 0.94;
        this.tweens.add({ targets: container, scale: targetScale, duration: 240, ease: 'Sine.easeOut' });
      });
      sphere.on('pointerup', () => {
        if (this.dragDistance > 8 || this.selecting || !this.guideComplete) return;
        if (!canEnterJourneyWorld(this.snapshot, world, index)) {
          this.onLockedWorld(world.id);
          this.tweens.add({ targets: container, x: container.x + 3, duration: 65, yoyo: true, repeat: 2 });
          return;
        }
        this.selectPlanet(world.id, container, halo);
      });

      this.tweens.add({
        targets: container,
        y: '+=7',
        duration: 3400 + index * 640,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      if (current) {
        this.tweens.add({
          targets: halo,
          alpha: 0.07,
          scale: 1.24,
          duration: 1650,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
      this.tweens.add({
        targets: marker,
        alpha: current ? 0.35 : 0.22,
        scale: current ? 1.45 : 1.2,
        duration: 1500 + index * 250,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.planets.push({ container, halo, sphere, marker, state, worldId: world.id });
    });
  }

  private bindJourneyInput() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.guideComplete || this.selecting) return;
      this.dragging = true;
      this.dragStartY = pointer.y;
      this.dragStartScroll = this.cameras.main.scrollY;
      this.dragDistance = 0;
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.dragging || !pointer.isDown) return;
      const delta = pointer.y - this.dragStartY;
      this.dragDistance = Math.max(this.dragDistance, Math.abs(delta));
      this.cameras.main.scrollY = Phaser.Math.Clamp(this.dragStartScroll - delta, 0, this.maxScroll());
    });
    this.input.on('pointerup', () => { this.dragging = false; });
    this.input.on('wheel', (...args: unknown[]) => {
      if (!this.guideComplete || this.selecting) return;
      const deltaY = Number(args[3] ?? 0);
      this.cameras.main.scrollY = Phaser.Math.Clamp(this.cameras.main.scrollY + deltaY * 0.45, 0, this.maxScroll());
    });
  }

  private selectPlanet(worldId: WorldId, selected: Phaser.GameObjects.Container, halo: Phaser.GameObjects.Arc) {
    if (this.selecting) return;
    this.selecting = true;
    this.planets.forEach(planet => {
      planet.sphere.disableInteractive();
      if (planet.container !== selected) {
        this.tweens.add({ targets: planet.container, alpha: 0.2, duration: 420, ease: 'Sine.easeOut' });
      }
    });
    this.tweens.add({ targets: selected, scale: 1.28, duration: 560, ease: 'Cubic.easeOut' });
    this.tweens.add({ targets: halo, alpha: 0.3, scale: 1.42, duration: 520, ease: 'Sine.easeOut' });
    this.cameras.main.pan(selected.x, selected.y, 620, 'Sine.easeInOut');
    this.cameras.main.zoomTo(1.3, 620, 'Cubic.easeInOut');
    this.time.delayedCall(690, () => this.onEnterWorld(worldId));
  }

  private maxScroll() {
    const worldHeight = 360 + Math.max(1, WORLD_MANIFESTS.length - 1) * 270 + 430;
    return Math.max(0, worldHeight - this.scale.height);
  }

  private focusCurrentPlanet(duration = 650) {
    const currentId = currentJourneyWorldId(this.snapshot);
    const planet = this.planets.find(item => item.worldId === currentId) ?? this.planets[0];
    if (!planet) return;
    const target = Phaser.Math.Clamp(planet.container.y - this.scale.height * 0.49, 0, this.maxScroll());
    this.tweens.add({ targets: this.cameras.main, scrollY: target, duration, ease: 'Sine.easeInOut' });
  }

  private runGuideCamera() {
    const currentId = currentJourneyWorldId(this.snapshot);
    const currentIndex = Math.max(0, WORLD_MANIFESTS.findIndex(world => world.id === currentId));
    const next = this.planets[currentIndex + 1];
    const current = this.planets[currentIndex] ?? this.planets[0];
    if (!current) return;
    this.cameras.main.scrollY = Phaser.Math.Clamp(current.container.y - this.scale.height * 0.5, 0, this.maxScroll());
    if (!next) return;
    this.time.delayedCall(1700, () => {
      if (this.guideComplete) return;
      const target = Phaser.Math.Clamp(next.container.y - this.scale.height * 0.56, 0, this.maxScroll());
      this.tweens.add({ targets: this.cameras.main, scrollY: target, duration: 1100, ease: 'Sine.easeInOut' });
    });
    this.time.delayedCall(3700, () => {
      if (this.guideComplete) return;
      this.focusCurrentPlanet(1100);
    });
  }

  private layout(initial = false) {
    if (!this.path) return;
    const { width, height } = this.scale;
    const worldHeight = 360 + Math.max(1, WORLD_MANIFESTS.length - 1) * 270 + 430;
    this.cameras.main.setBounds(0, 0, width, Math.max(height, worldHeight));

    this.planets.forEach((planet, index) => {
      const point = journeyPoint(index, width);
      const floatOffset = index % 2 === 0 ? 0 : 5;
      planet.container.setPosition(point.x, point.y + floatOffset);
    });

    this.path.clear();
    this.path.lineStyle(2, 0xb8c4ee, 0.13);
    if (this.planets.length) {
      const first = this.planets[0].container;
      this.path.beginPath();
      this.path.moveTo(width * 0.5, 230);
      this.path.lineTo(first.x, first.y - 76);
      for (let index = 0; index < this.planets.length - 1; index += 1) {
        const a = this.planets[index].container;
        const b = this.planets[index + 1].container;
        const midY = (a.y + b.y) / 2;
        this.path.lineTo(width * 0.5, midY);
        this.path.lineTo(b.x, b.y - 76);
      }
      const last = this.planets[this.planets.length - 1].container;
      this.path.lineTo(width * 0.5, last.y + 170);
      this.path.strokePath();
      for (let i = 1; i <= 4; i += 1) {
        const y = last.y + 80 + i * 58;
        const x = width * 0.5 + (i % 2 ? -18 : 20);
        this.path.fillStyle(0xd7dff5, 0.16 / i + 0.025);
        this.path.fillCircle(x, y, Math.max(1.3, 3.2 - i * 0.45));
      }
    }

    if (initial) this.focusCurrentPlanet(0);
    else this.cameras.main.scrollY = Phaser.Math.Clamp(this.cameras.main.scrollY, 0, this.maxScroll());
  }

  shutdown() {
    this.scale.off('resize', this.layout, this);
  }
}

export function GalaxyScene({
  snapshot,
  guideComplete,
  onEnterWorld,
  onLockedWorld,
}: {
  snapshot: AppSnapshot;
  guideComplete: boolean;
  onEnterWorld: (worldId: WorldId) => void;
  onLockedWorld: (worldId: WorldId) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<GalaxyPhaserScene | null>(null);
  const enterCallback = useRef(onEnterWorld);
  const lockedCallback = useRef(onLockedWorld);
  enterCallback.current = onEnterWorld;
  lockedCallback.current = onLockedWorld;

  useEffect(() => {
    if (!host.current) return;
    const galaxyScene = new GalaxyPhaserScene(
      snapshot,
      guideComplete,
      worldId => enterCallback.current(worldId),
      worldId => lockedCallback.current(worldId),
    );
    scene.current = galaxyScene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      backgroundColor: '#070b18',
      transparent: false,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      render: { antialias: true, roundPixels: false },
      scene: [galaxyScene],
    });
    return () => {
      scene.current = null;
      game.destroy(true);
    };
  }, [snapshot.companionId, snapshot.daily.storyAdvanceWorldId]);

  useEffect(() => {
    scene.current?.setGuideComplete(guideComplete);
  }, [guideComplete]);

  return <div ref={host} className="galaxy-canvas" aria-hidden="true" />;
}
