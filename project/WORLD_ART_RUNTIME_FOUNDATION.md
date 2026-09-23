# KidsHabits — World Art Runtime Foundation

**Status:** Implementation proposal and current direction  
**Target:** Production-quality illustrated planets, beginning with Sprout Planet  
**Engine:** Phaser 4  
**Primary target:** Mobile portrait

This document intentionally advances KidsHabits from the platform-proof phase into the **world-art architecture phase**. We are still not authoring all 30 story days yet. We are building the reusable visual/content runtime that will let Sprout Planet and future planets use high-quality transparent painted assets without hard-coding each day into Phaser scene code.

## Product behavior

The child should experience a living illustrated world, not a collection of flat UI screens or one giant pre-rendered image per day.

A location is reconstructed from durable state as a composition of reusable art layers:

```text
background atmosphere
→ distant scenery
→ middle scenery
→ ground / terrain
→ landmarks
→ story objects
→ companion
→ foreground occluders
→ particles / light / weather
```

Real-life progress changes deterministic story state. The world runtime reads that state and swaps, reveals, animates, or re-composes the correct art layers.

## Experience phase

This foundation applies to the child `world` phase and authored story moments inside it. Parent UI and habit authority remain outside Phaser.

## Phaser systems / skills used

Primary skills:

- `game-architecture`
- `scenes`
- `groups-and-containers`
- `sprites-and-images`
- `graphics-and-shapes`
- `render-textures`
- `loading-assets`

Later visual passes will additionally use:

- `cameras`
- `tweens`
- `particles`
- `filters-and-postfx`
- `v4-new-features`
- `audio-and-sound`

Important skill-driven rules:

- static illustrated art should use `Image`, not `Sprite`, unless frame animation is required;
- render order should use lightweight Phaser `Layer` buckets rather than deeply nested `Container` trees;
- complex static Graphics should be baked/generated rather than replayed every frame;
- world assets are loaded declaratively through manifests;
- Phaser scene state is presentation state, not product truth.

## State model

No new story truth is introduced by the art runtime.

The renderer receives the existing durable `WorldProgress` and evaluates only presentation conditions such as:

```text
locationId
story day
flags
persistent variants later
pending authored sequence
```

The art runtime can never mark a habit complete, unlock a location, advance a story day, or commit a choice.

## World package shape

Each planet owns its art/content package:

```text
src/worlds/<world>/
  manifest.ts
  presentation.ts              # temporary procedural fallback / world-specific helper
  art/
    manifest.ts                 # asset + composition data only
    locations/
      <location>.ts             # later, if composition becomes large
    presets/                    # later, debug visual-state presets
  story/                        # authored story definitions later
  audio/                        # world-specific cues later
  localization/                 # world-specific copy later

public/worlds/<world>/
  art/
    backgrounds/
    far/
    mid/
    ground/
    landmarks/
    story/
    foreground/
    fx/
```

The shared runtime lives under:

```text
src/world-runtime/art/
```

A new planet must not need its own loader or renderer implementation.

## Art asset policy

We explicitly support premium transparent raster illustration.

Preferred runtime format for painted transparent assets:

- WebP with alpha for most shipped art,
- PNG where exact lossless alpha / tooling compatibility is useful,
- atlases later for repeated small props / animation frames,
- SVG only where vector behavior is genuinely useful.

Authoring source files such as PSD / Procreate / Affinity files are not runtime assets and do not need to ship to the client.

### Reference composition

Illustrate around a **1080 × 1920** 9:16 reference frame, but do not assume the device is exactly 9:16.

- important story objects stay inside a safe central composition zone;
- backgrounds provide overscan for taller/wider phone ratios;
- individual runtime textures should normally stay at or under 2048 px on their longest side unless a measured reason requires more;
- use multiple layers instead of a single giant 4K background;
- transparent layers should be tightly cropped around useful pixels when possible.

## Layer bands

The runtime exposes semantic render bands rather than arbitrary numeric depth scattered through world code:

```text
sky
far
mid
terrain
landmark
story
actor
foreground
atmosphere
```

Each authored art layer declares:

- asset id,
- render band,
- normalized anchor position,
- origin,
- fit rule,
- parallax factor,
- alpha / blend mode,
- optional tint,
- optional motion preset,
- optional visibility condition.

The content file does **not** call Phaser APIs.

## Layout model

Layer placement is normalized against the current viewport so the same composition survives phones with different aspect ratios.

Supported initial fit modes:

- `cover` — fill the viewport while preserving aspect ratio;
- `contain` — keep the whole asset visible;
- `width` — match viewport width;
- `height` — match viewport height;
- `native` — use authored pixel size scaled by device-independent composition scale.

Backgrounds normally use `cover`. Story props normally use `native` or `contain` with explicit normalized placement.

## Motion presets

World content references semantic motion names, not custom tween code:

```text
none
float
sway
breathe
drift
```

The shared runtime owns timing/easing implementation. This prevents every story day from inventing a different tween style and gives the whole product one motion language.

## Asset loading

Each `WorldArtManifest` declares its assets. The shared runtime queues them in Phaser `preload()` before the location is composed.

Asset keys are namespaced by world and art version to avoid cache collisions.

Example conceptual key:

```text
world:sprout:v1:landing-meadow:tree-main
```

The loader must allow zero external assets so the current procedural fallback continues to work while art is being produced.

## Runtime composition

The shared `WorldArtRuntime` owns:

- layer buckets,
- asset lookup,
- responsive placement,
- parallax,
- state-driven visibility,
- semantic idle motion,
- cleanup / rebuild,
- fallback behavior when a location has no illustrated composition yet.

The current procedural `presentation.ts` functions remain temporarily useful as fallbacks and for debug prototyping. They are not the long-term quality ceiling.

## Enhanced rendering

Filters and post-FX are enhancements, never the only representation of a story clue.

Later passes may selectively use:

- object-local glow,
- color grading,
- subtle vignette,
- noise / gradient atmosphere,
- displacement for water or magic,
- particles for pollen, fireflies, mist, dust, seeds.

A low-end / Canvas fallback must still show the correct durable world state.

## React ↔ Phaser ownership

Phaser owns illustrated world composition and cinematic presentation.

React owns accessible Arabic operational overlays such as habit controls and parent surfaces.

Art layers do not reach into React. React does not directly manipulate Phaser images.

## Persistence implications

None. Asset and composition definitions are immutable content. Durable player state remains in `WorldProgress` / Story snapshot structures.

When later content versions change art IDs or location composition, migration maps can translate old content identifiers without changing the habit domain.

## Mobile performance rules

- prefer `Image` over `Sprite` for static art;
- prefer Phaser `Layer` for render-order buckets;
- avoid deep nested Containers for entire scenes;
- load only the current world/location pack plus intentionally prefetched next assets;
- avoid per-frame Graphics redraw for static illustrated scenery;
- use particles / filters sparingly and measure on mobile;
- group compatible blend modes where practical;
- destroy location objects and transient tweens cleanly on rebuild/shutdown.

## QA / debug / simulator

The foundation should make these possible next:

- render a location at an exact `WorldProgress` snapshot;
- toggle layer visibility;
- inspect art asset id / depth band / parallax;
- preview `cover` / `contain` behavior across phone ratios;
- jump between visual-state presets;
- capture visual regression screenshots;
- run with zero art assets to verify fallback behavior.

## Initial implementation scope

This branch builds only the reusable foundation:

1. typed art-manifest schema,
2. shared asset loader,
3. shared layered image compositor,
4. semantic motion presets,
5. Sprout art manifest with empty asset slots / location composition scaffolding,
6. Moon Garden manifest proving the runtime is not Sprout-specific,
7. WorldHost integration with procedural fallback preserved.

**No final Day 1–7 illustration assets are required in this branch.**

When we start the actual first seven days, we will decide the required images per location/state and produce the art against this contract instead of changing the renderer every time.
