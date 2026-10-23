import Phaser from 'phaser';
import type { IslandSnapshot, WorldFocus } from '../../domain/island/model';
import type { IslandArtPack } from '../../content/island/artPacks';
import { NovaActor } from '../actors/NovaActor';

export class IslandScene extends Phaser.Scene {
  private readonly art: IslandArtPack;
  private snapshot: IslandSnapshot;
  private focus: WorldFocus = 'idle';
  private nova?: NovaActor;
  private cottage?: Phaser.GameObjects.Image;
  private flower?: Phaser.GameObjects.Image;
  private doorLight?: Phaser.GameObjects.Arc;
  private gardenLight?: Phaser.GameObjects.Arc;

  constructor(art: IslandArtPack, snapshot: IslandSnapshot) {
    super({ key: 'IslandWorld' });
    this.art = art;
    this.snapshot = snapshot;
  }

  preload(): void {
    const art = this.art.layers;
    this.load.svg('island-backdrop', art.backdrop);
    this.load.svg('ancient-tree', art.tree);
    this.load.svg('old-cottage', art.cottage);
    this.load.svg('restored-cottage', art.restoredCottage);
    this.load.svg('nova', art.nova);
    this.load.svg('flower', art.flower);
  }

  create(): void {
    this.add.image(450, 575, 'island-backdrop').setDisplaySize(900, 1150);

    this.doorLight = this.add.circle(648, 650, 160, this.art.colors.glow, 0)
      .setDepth(8).setBlendMode(Phaser.BlendModes.ADD);

    this.add.image(243, 500, 'ancient-tree').setDisplaySize(385, 515).setDepth(10);
    this.cottage = this.add.image(655, 666, 'old-cottage')
      .setDisplaySize(363, 381).setDepth(12);

    this.gardenLight = this.add.circle(472, 790, 112, this.art.colors.ambient, 0)
      .setDepth(13).setBlendMode(Phaser.BlendModes.ADD);
    this.flower = this.add.image(473, 788, 'flower').setDisplaySize(163, 206).setDepth(14);

    this.add.circle(126, 653, 5, this.art.colors.glow, 0.73).setDepth(20);
    this.add.circle(781, 531, 4, this.art.colors.glow, 0.71).setDepth(20);
    this.nova = new NovaActor(this);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.tweens.add({
      targets: [this.doorLight, this.gardenLight],
      scale: 1.15,
      yoyo: true,
      repeat: -1,
      duration: 3600,
      ease: 'Sine.easeInOut',
    });
    this.applySnapshot(this.snapshot, this.focus);
  }

  applySnapshot(snapshot: IslandSnapshot, focus: WorldFocus): void {
    this.snapshot = snapshot;
    this.focus = focus;
    if (!this.cottage || !this.flower || !this.nova) return;
    const restored = snapshot.cottage === 'restored';
    const blooming = snapshot.garden === 'blooming';
    this.cottage.setTexture(restored ? 'restored-cottage' : 'old-cottage');
    this.doorLight?.setAlpha(restored ? 0.46 : 0.05);
    this.flower.setVisible(blooming);
    this.gardenLight?.setAlpha(blooming ? 0.42 : 0.08);
    this.nova.lookAt(this, focus);
  }
}
