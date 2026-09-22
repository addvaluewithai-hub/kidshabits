import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import type { AppSnapshot } from './state';
import { WORLD_MANIFESTS } from '../worlds/registry';
import type { WorldId } from '../worlds/types';

type PlanetVisual = {
  container: Phaser.GameObjects.Container;
  halo: Phaser.GameObjects.Arc;
  sphere: Phaser.GameObjects.Arc;
  marker: Phaser.GameObjects.Star;
  worldId: WorldId;
};

function seeded(index: number) {
  const x = Math.sin(index * 999.91 + 17.41) * 43758.5453;
  return x - Math.floor(x);
}

function worldPosition(index: number, total: number, width: number, height: number) {
  if (total <= 1) return { x: width * 0.5, y: height * 0.54 };
  const t = index / Math.max(1, total - 1);
  const y = height * (0.37 + t * 0.34);
  const x = width * (index % 2 === 0 ? 0.35 : 0.68);
  return { x, y };
}

class GalaxyPhaserScene extends Phaser.Scene {
  private readonly snapshot: AppSnapshot;
  private readonly onEnterWorld: (worldId: WorldId) => void;
  private readonly planets: PlanetVisual[] = [];
  private orbit?: Phaser.GameObjects.Graphics;
  private selecting = false;

  constructor(snapshot: AppSnapshot, onEnterWorld: (worldId: WorldId) => void) {
    super('galaxy-browser');
    this.snapshot = snapshot;
    this.onEnterWorld = onEnterWorld;
  }

  create() {
    this.cameras.main.setBackgroundColor('#070b18');
    this.createNebula();
    this.createStars();
    this.orbit = this.add.graphics().setDepth(-4).setScrollFactor(0.76);
    this.createPlanets();
    this.layout();
    this.scale.on('resize', this.layout, this);
    this.cameras.main.fadeIn(620, 7, 11, 24);
  }

  private createNebula() {
    const blobs = [
      { x: 0.14, y: 0.2, w: 430, h: 300, color: 0x62548f, alpha: 0.12, dx: 18 },
      { x: 0.86, y: 0.42, w: 500, h: 330, color: 0x376a79, alpha: 0.11, dx: -22 },
      { x: 0.48, y: 0.82, w: 520, h: 280, color: 0x765d84, alpha: 0.08, dx: 14 },
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
        scaleX: 1.08,
        scaleY: 0.94,
        alpha: blob.alpha * 0.68,
        duration: 9000 + index * 1700,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createStars() {
    const depthBands = [
      { count: 44, factor: 0.08, minR: 0.55, maxR: 1.1, alpha: 0.34 },
      { count: 30, factor: 0.24, minR: 0.7, maxR: 1.45, alpha: 0.52 },
      { count: 18, factor: 0.46, minR: 0.9, maxR: 1.8, alpha: 0.72 },
    ];
    let seed = 1;
    depthBands.forEach((band, bandIndex) => {
      for (let i = 0; i < band.count; i += 1) {
        seed += 1;
        const x = seeded(seed) * this.scale.width;
        const y = seeded(seed + 111) * this.scale.height;
        const radius = band.minR + seeded(seed + 227) * (band.maxR - band.minR);
        const tint = bandIndex === 0 ? 0xc9d5ee : seeded(seed + 53) > 0.72 ? 0xf6e1ac : 0xf7fbff;
        const star = this.add.circle(x, y, radius, tint, band.alpha)
          .setDepth(-12 + bandIndex)
          .setScrollFactor(band.factor);
        if (i % 4 === 0) {
          this.tweens.add({
            targets: star,
            alpha: Math.min(1, band.alpha + 0.28),
            scale: 1.55,
            duration: 1700 + seeded(seed + 19) * 2600,
            delay: seeded(seed + 31) * 1400,
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
      const progress = this.snapshot.worlds[world.id];
      const started = progress.eventsSeen.length > 0 || Object.values(progress.flags).some(Boolean) || progress.locationId !== world.startingLocationId;
      const baseColor = isSprout ? 0x5d9a82 : 0x74719d;
      const accentColor = isSprout ? 0xb8d89f : 0xc9c3f4;
      const shadowColor = isSprout ? 0x244f47 : 0x333450;

      const container = this.add.container(0, 0).setDepth(2);
      const halo = this.add.circle(0, 0, 72, accentColor, started ? 0.11 : 0.07)
        .setBlendMode(Phaser.BlendModes.ADD);
      container.add(halo);

      if (!isSprout) {
        const ring = this.add.ellipse(0, 7, 150, 46, 0x000000, 0)
          .setStrokeStyle(3, 0xcfc9f8, 0.28)
          .setRotation(-0.28);
        container.add(ring);
      }

      const sphere = this.add.circle(0, 0, 54, baseColor, 1)
        .setStrokeStyle(1.5, accentColor, 0.32)
        .setInteractive({ useHandCursor: true });
      container.add(sphere);

      const shade = this.add.ellipse(15, 17, 76, 68, shadowColor, 0.18);
      container.add(shade);

      if (isSprout) {
        container.add([
          this.add.ellipse(-15, -8, 38, 22, 0xa7c88e, 0.5).setRotation(-0.45),
          this.add.ellipse(14, 6, 29, 17, 0x84b88f, 0.44).setRotation(0.7),
          this.add.circle(22, -20, 8, 0xd6e9bf, 0.26),
        ]);
      } else {
        container.add([
          this.add.circle(-18, -14, 9, 0x4d506f, 0.24),
          this.add.circle(18, 10, 7, 0x4b4d69, 0.2),
          this.add.circle(8, -28, 4, 0xeeeaff, 0.18),
        ]);
      }

      const highlight = this.add.circle(-18, -20, 13, 0xffffff, 0.12);
      container.add(highlight);

      const marker = this.add.star(0, 0, 4, 3, 8, 0xffedb5, started ? 0.86 : 0.58)
        .setPosition(isSprout ? 20 : -24, isSprout ? -28 : 23)
        .setRotation(0.25);
      container.add(marker);

      sphere.on('pointerover', () => {
        if (this.selecting) return;
        this.tweens.add({ targets: container, scale: 1.05, duration: 220, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: halo, alpha: 0.19, scale: 1.1, duration: 260, ease: 'Sine.easeOut' });
      });
      sphere.on('pointerout', () => {
        if (this.selecting) return;
        this.tweens.add({ targets: container, scale: 1, duration: 240, ease: 'Sine.easeOut' });
        this.tweens.add({ targets: halo, alpha: started ? 0.11 : 0.07, scale: 1, duration: 260, ease: 'Sine.easeOut' });
      });
      sphere.on('pointerup', () => this.selectPlanet(world.id, container, halo));

      this.tweens.add({
        targets: container,
        y: '+=7',
        duration: 3200 + index * 630,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: marker,
        alpha: 0.32,
        scale: 1.35,
        duration: 1400 + index * 260,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.planets.push({ container, halo, sphere, marker, worldId: world.id });
    });
  }

  private selectPlanet(worldId: WorldId, selected: Phaser.GameObjects.Container, halo: Phaser.GameObjects.Arc) {
    if (this.selecting) return;
    this.selecting = true;
    this.planets.forEach(planet => {
      planet.sphere.disableInteractive();
      if (planet.container !== selected) {
        this.tweens.add({ targets: planet.container, alpha: 0.24, duration: 420, ease: 'Sine.easeOut' });
      }
    });
    this.tweens.add({ targets: selected, scale: 1.22, duration: 560, ease: 'Cubic.easeOut' });
    this.tweens.add({ targets: halo, alpha: 0.28, scale: 1.36, duration: 520, ease: 'Sine.easeOut' });
    this.cameras.main.pan(selected.x, selected.y, 620, 'Sine.easeInOut');
    this.cameras.main.zoomTo(1.28, 620, 'Cubic.easeInOut');
    this.time.delayedCall(690, () => this.onEnterWorld(worldId));
  }

  private layout() {
    if (!this.orbit) return;
    const { width, height } = this.scale;
    this.orbit.clear();
    this.orbit.lineStyle(1, 0xb8c4ee, 0.1);
    this.orbit.strokeEllipse(width * 0.5, height * 0.52, width * 0.74, height * 0.54, 72);
    this.orbit.lineStyle(1, 0xe8dcb6, 0.06);
    this.orbit.strokeEllipse(width * 0.5, height * 0.53, width * 0.46, height * 0.76, 72);
    this.planets.forEach((planet, index) => {
      const point = worldPosition(index, this.planets.length, width, height);
      planet.container.setPosition(point.x, point.y);
    });
  }

  shutdown() {
    this.scale.off('resize', this.layout, this);
  }
}

export function GalaxyScene({ snapshot, onEnterWorld }: { snapshot: AppSnapshot; onEnterWorld: (worldId: WorldId) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onEnterWorld);
  callback.current = onEnterWorld;

  useEffect(() => {
    if (!host.current) return;
    const scene = new GalaxyPhaserScene(snapshot, worldId => callback.current(worldId));
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      backgroundColor: '#070b18',
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      render: { antialias: true, roundPixels: false, transparent: false },
      scene: [scene],
    });
    return () => game.destroy(true);
  }, [snapshot.companionId, snapshot.daily.storyAdvanceWorldId]);

  return <div ref={host} className="galaxy-canvas" aria-hidden="true" />;
}
