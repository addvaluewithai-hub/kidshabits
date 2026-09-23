import Phaser from 'phaser';
import { worldArtTextureKey } from './assets';
import {
  isWorldArtLayerVisible,
  type WorldArtBand,
  type WorldArtBlendMode,
  type WorldArtCompositionResult,
  type WorldArtLayerDefinition,
  type WorldArtManifest,
  type WorldArtMotion,
} from './types';
import type { WorldProgress } from '../../worlds/types';

const BAND_DEPTH: Record<WorldArtBand, number> = {
  sky: -45,
  far: -35,
  mid: -22,
  terrain: -8,
  landmark: 0,
  story: 6,
  actor: 12,
  foreground: 20,
  atmosphere: 28,
};

const BLEND_MODES: Record<WorldArtBlendMode, number> = {
  normal: Phaser.BlendModes.NORMAL,
  add: Phaser.BlendModes.ADD,
  multiply: Phaser.BlendModes.MULTIPLY,
  screen: Phaser.BlendModes.SCREEN,
};

export class WorldArtRuntime {
  private readonly bands = new Map<WorldArtBand, Phaser.GameObjects.Layer>();
  private readonly images = new Map<string, Phaser.GameObjects.Image>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly manifest: WorldArtManifest,
  ) {
    (Object.keys(BAND_DEPTH) as WorldArtBand[]).forEach(band => {
      this.bands.set(band, scene.add.layer().setDepth(BAND_DEPTH[band]));
    });
  }

  compose(locationId: string, progress: WorldProgress, width: number, height: number): WorldArtCompositionResult {
    this.clearImages();
    const location = this.manifest.locations[locationId];
    if (!location) return { activeLayerCount: 0, replacesProceduralBase: false };

    let activeLayerCount = 0;
    location.layers.forEach(layer => {
      if (!isWorldArtLayerVisible(layer, progress)) return;
      const key = worldArtTextureKey(this.manifest, layer.assetId);
      if (!this.scene.textures.exists(key)) return;
      const image = this.scene.add.image(0, 0, key);
      this.applyLayout(image, layer, width, height);
      this.bands.get(layer.band)?.add(image);
      this.images.set(layer.id, image);
      this.applyMotion(image, layer.motion ?? 'none');
      activeLayerCount += 1;
    });

    return {
      activeLayerCount,
      replacesProceduralBase: location.mode === 'replace' && activeLayerCount > 0,
      focusPoint: location.focusPoint
        ? { x: location.focusPoint.x * width, y: location.focusPoint.y * height }
        : undefined,
      ambientTint: location.ambientTint,
    };
  }

  destroy() {
    this.clearImages();
    this.bands.forEach(layer => layer.destroy());
    this.bands.clear();
  }

  private clearImages() {
    this.images.forEach(image => {
      this.scene.tweens.killTweensOf(image);
      image.destroy();
    });
    this.images.clear();
  }

  private applyLayout(
    image: Phaser.GameObjects.Image,
    layer: WorldArtLayerDefinition,
    viewportWidth: number,
    viewportHeight: number,
  ) {
    const origin = layer.origin ?? { x: 0.5, y: 0.5 };
    const fit = layer.fit ?? 'native';
    const authoredScale = layer.scale ?? 1;
    const sourceWidth = Math.max(1, image.width);
    const sourceHeight = Math.max(1, image.height);
    const reference = this.manifest.referenceSize ?? { width: 1080, height: 1920 };

    let fitScale = viewportWidth / reference.width;
    if (fit === 'cover') fitScale = Math.max(viewportWidth / sourceWidth, viewportHeight / sourceHeight);
    else if (fit === 'contain') fitScale = Math.min(viewportWidth / sourceWidth, viewportHeight / sourceHeight);
    else if (fit === 'width') fitScale = viewportWidth / sourceWidth;
    else if (fit === 'height') fitScale = viewportHeight / sourceHeight;

    image
      .setOrigin(origin.x, origin.y)
      .setPosition(layer.position.x * viewportWidth, layer.position.y * viewportHeight)
      .setScale(fitScale * authoredScale)
      .setRotation(layer.rotation ?? 0)
      .setAlpha(layer.alpha ?? 1)
      .setScrollFactor(layer.parallax ?? 1)
      .setBlendMode(BLEND_MODES[layer.blendMode ?? 'normal']);

    if (layer.tint !== undefined) image.setTint(layer.tint);
    else image.clearTint();
  }

  private applyMotion(image: Phaser.GameObjects.Image, motion: WorldArtMotion) {
    if (motion === 'none') return;
    const baseScaleX = image.scaleX;
    const baseScaleY = image.scaleY;

    if (motion === 'float') {
      this.scene.tweens.add({
        targets: image,
        y: image.y - 7,
        duration: 3400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      return;
    }

    if (motion === 'sway') {
      this.scene.tweens.add({
        targets: image,
        rotation: image.rotation + 0.018,
        duration: 2800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      return;
    }

    if (motion === 'breathe') {
      this.scene.tweens.add({
        targets: image,
        scaleX: baseScaleX * 1.025,
        scaleY: baseScaleY * 1.025,
        alpha: Math.max(0.12, image.alpha * 0.9),
        duration: 2300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      return;
    }

    this.scene.tweens.add({
      targets: image,
      x: image.x + 11,
      duration: 7200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
