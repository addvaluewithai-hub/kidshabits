import type Phaser from 'phaser';
import type { WorldArtAssetDefinition, WorldArtManifest } from './types';

export function worldArtTextureKey(manifest: WorldArtManifest, assetId: string) {
  return `world:${manifest.worldId}:${manifest.artVersion}:${assetId}`;
}

function queueAsset(scene: Phaser.Scene, manifest: WorldArtManifest, asset: WorldArtAssetDefinition) {
  const key = worldArtTextureKey(manifest, asset.id);
  if (scene.textures.exists(key)) return;

  if (asset.type === 'svg') {
    scene.load.svg(key, asset.url, asset.svgSize);
    return;
  }

  scene.load.image(key, asset.url);
}

export function queueWorldArtAssets(scene: Phaser.Scene, manifest: WorldArtManifest) {
  manifest.assets.forEach(asset => queueAsset(scene, manifest, asset));
}
