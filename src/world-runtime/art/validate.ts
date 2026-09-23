import type { WorldManifest } from '../../worlds/types';
import type { WorldArtManifest } from './types';

export interface WorldArtValidationIssue {
  code: string;
  message: string;
}

export function validateWorldArtManifest(
  art: WorldArtManifest,
  world: WorldManifest,
): WorldArtValidationIssue[] {
  const issues: WorldArtValidationIssue[] = [];
  const assetIds = new Set<string>();

  if (art.worldId !== world.id) {
    issues.push({ code: 'world-id-mismatch', message: `Art manifest ${art.worldId} does not match world ${world.id}.` });
  }

  for (const asset of art.assets) {
    if (assetIds.has(asset.id)) {
      issues.push({ code: 'duplicate-asset', message: `Duplicate art asset id: ${asset.id}` });
    }
    assetIds.add(asset.id);
    if (!asset.url.startsWith('/')) {
      issues.push({ code: 'asset-url', message: `Art asset ${asset.id} should use a root-relative runtime URL.` });
    }
  }

  for (const [locationId, location] of Object.entries(art.locations)) {
    if (!world.locations[locationId]) {
      issues.push({ code: 'unknown-location', message: `Art location ${locationId} is not declared by world ${world.id}.` });
    }
    const layerIds = new Set<string>();
    for (const layer of location.layers) {
      if (layerIds.has(layer.id)) {
        issues.push({ code: 'duplicate-layer', message: `Duplicate layer ${locationId}/${layer.id}.` });
      }
      layerIds.add(layer.id);
      if (!assetIds.has(layer.assetId)) {
        issues.push({ code: 'missing-asset', message: `Layer ${locationId}/${layer.id} references missing asset ${layer.assetId}.` });
      }
      if (layer.position.x < -0.5 || layer.position.x > 1.5 || layer.position.y < -0.5 || layer.position.y > 1.5) {
        issues.push({ code: 'position-range', message: `Layer ${locationId}/${layer.id} is unusually far outside the composition frame.` });
      }
    }
  }

  return issues;
}

export function assertValidWorldArtManifest(art: WorldArtManifest, world: WorldManifest) {
  const issues = validateWorldArtManifest(art, world);
  if (!issues.length) return;
  throw new Error(`Invalid art manifest for ${world.id}:\n${issues.map(issue => `- [${issue.code}] ${issue.message}`).join('\n')}`);
}
