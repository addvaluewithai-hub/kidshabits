# Sprout Planet art package

This folder owns immutable art/composition data for Sprout Planet. Final illustration assets will live under `public/worlds/sprout/art/` and are referenced from `manifest.ts`.

## Preferred handoff

For a painted location, export **separate transparent layers**, not one flattened screenshot.

Typical set:

```text
background/sky.webp
far/hills.webp
mid/trees-back.webp
ground/meadow.webp
landmarks/great-tree.webp
story/first-light-off.webp
story/first-light-on.webp
foreground/grass-left.webp
foreground/grass-right.webp
fx/light-haze.webp
```

Use the fewest layers that preserve useful depth and state changes. Do not split every leaf into its own texture.

## Runtime format

- WebP with alpha is the normal production choice.
- PNG is fine where exact lossless alpha or tooling compatibility matters.
- Keep individual runtime textures normally at or below 2048 px on their longest side.
- Author around a 1080 × 1920 reference frame with overscan in backgrounds.
- Keep important story objects away from extreme screen edges.
- Companion characters are separate actors and must never be painted into environment layers.

## Manifest example

When final art exists, the manifest can move from an empty composition to something like:

```ts
assets: [
  { id: 'landing.sky', type: 'image', url: '/worlds/sprout/art/background/landing-sky.webp' },
  { id: 'landing.tree', type: 'image', url: '/worlds/sprout/art/landmarks/landing-tree.webp' },
  { id: 'landing.light', type: 'image', url: '/worlds/sprout/art/story/first-light.webp' },
],
locations: {
  'landing-meadow': {
    id: 'landing-meadow',
    mode: 'replace',
    focusPoint: { x: 0.76, y: 0.46 },
    layers: [
      {
        id: 'sky',
        assetId: 'landing.sky',
        band: 'sky',
        position: { x: 0.5, y: 0.5 },
        fit: 'cover',
        parallax: 0.04,
      },
      {
        id: 'tree',
        assetId: 'landing.tree',
        band: 'landmark',
        position: { x: 0.24, y: 0.7 },
        origin: { x: 0.5, y: 1 },
        fit: 'native',
        parallax: 0.85,
        motion: 'sway',
      },
      {
        id: 'first-light',
        assetId: 'landing.light',
        band: 'story',
        position: { x: 0.78, y: 0.45 },
        fit: 'native',
        blendMode: 'screen',
        motion: 'breathe',
        when: { flag: 'firstLightRevealed' },
      },
    ],
  },
}
```

The exact assets for Days 1–7 should be decided only after the story/location beats are locked enough to avoid producing throwaway art.
