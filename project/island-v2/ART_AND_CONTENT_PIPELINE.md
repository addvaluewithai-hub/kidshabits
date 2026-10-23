# Visual, animation and content pipeline — Island v2

## Outcome, not engine worship

A premium-feeling, cozy, magical **2.5D world** with readable silhouettes and a recognizable expressive companion. The target is **consistent art + responsive interaction + good motion/audio**, not more polygons or more particles.

**Technical starting point:** existing Phaser 4 architecture. Use p5.js selectively for procedural offscreen art generation and effects proven to add value. Use external art layers/illustration and deliberate animation. The browser game runtime should remain **Phaser-owned**, not competing simultaneous render loops.

No requirement to use all tools. Tool choice follows measurable aesthetic and performance gains.

## Look and feel (art direction brief)

- Warm, lush, storybook island with a little mystery: worn old cottage, tree, garden, creek, floating atmospheric depth.
- Strong 2D silhouette and controlled texture detail. Cozy, not over-sparkly or casino-like.
- Palette: warm stone/wood, rich garden greens, soft blue twilight, occasional amber magical glow. Style locked via actual reference sheet and samples before bulk production.
- Depth: sky, distant islands, far foliage, terrain, interactive houses/props, Nova and visitors, foreground leaves, particle/lighting passes, UI.
- Camera: gentle pans/zooms anchored on story objects; no disorienting constant movement.
- Sound: ambience, footstep/object placement foley, plant bloom cues, authored musical sting; sound-off must still convey events.
- Accessible readability on a phone: no tiny furniture controls, readable subtitles, safe-area-aware interface, reduced motion.

## Tools: what for and what not for

| Technique | Use | Avoid |
|---|---|---|
| Phaser 4 | scene composition, touch input, placement, camera, animations, object transforms, audio state | storing canonical child progress only in Scene/GameObjects |
| p5.js | generate organic plant shapes, procedural textures, environment embellishments; export canvas to texture when useful | second always-running full-screen renderer without performance proof |
| Layered illustrated assets | most of the environment and hero composition; reusable modular objects | one monolithic flattened background that blocks customization |
| Sprite atlas / sheets | light character loops, plant growth stages, creature gestures | full character design entirely remade for every scene |
| Spine/Rive (evaluate integration first) | expressive character rig + reusable gestures if quality improves | purchasing/integrating before a proven sample + license/compatibility check |
| Short video | rare non-interactive major cinematic reveal when it beats engine animation | daily gameplay, important irreversible state logic or every day of the 30-day chapter |
| Audio/voice clips | authored dialogue and reveal beats with synchronized subtitles | relying on unreviewed live AI for critical emotional moments |

**Video rule:** commit the state *before* playback, make video skippable/replayable, with deterministic fallback to a still/engine animation. On reload, scene reconstructs from world state, not "which frame of video was last shown". Nova can remain visible before/after; during a full-frame clip continuity needs deliberate transition.

## Production asset manifest

For each item:
```json
{
  "id": "cottage_door_wood_01",
  "atlas": "island_structures_v1",
  "anchorType": "cottage_entry",
  "logicalSize": [120, 155],
  "pivot": [0.5, 0.95],
  "hitArea": "door_path",
  "depthLayer": "interactable",
  "states": ["old", "repaired"],
  "variants": ["amber", "mint", "blue"],
  "animations": ["repair_reveal"],
  "soundIds": ["soft_hammer", "repair_complete"],
  "fallback": "static_repaired"
}
```

Production files need stable IDs, transparent backgrounds where appropriate, consistent perspective, safe padding, and mobile-resolution atlases. The artwork pipeline must keep originals editable; optimize output atlases separately.

## Asset inventory — first slice

1. Island environment in several **real depth layers**; distant haze/cloud motion; old cottage; tree; garden soil; two planting hotspots.
2. Modular cottage door and roof/paint alternatives (minimum 2 distinct visible variants).
3. Two distinct starter plants with idle/growth states, separated shadow/FX layers.
4. Nova model/illustration + idle, fly, look/point and delighted expressions, speech UI.
5. One magical glow/reveal effect, environmental ambient loop, 3–5 short SFX; music placeholder optional.
6. Mobile overlay: small habit progress, object placement, concise conversation bubbles.

First output should include **before / after** screenshots on a phone; visual consistency is a merge gate.

## Asset inventory — first ten days

Add: cottage interior corner/furniture kit; creek/water kit; footbridge/path anchors; story seed and alternate blooms; Lumi character and nook; tree mystery states; secret-gate teaser. Reuse world layers across the ten steps.

Each asset includes: ID, dimensions, anchor, states, audio/animation needs, source provenance/rights, review owner, quality status. Avoid relying on unlicensed external visual references as shipping assets.

## Art production workflow

1. Assemble 1-page art bible with camera angle, lighting, palette, scale chart, Nova silhouette and one house.
2. Produce one polished keyframe illustration of the initial island; review on a phone.
3. Break scene into compositing layers / reusable interactive object kits.
4. Animate **one** plant bloom and **one** Nova reaction; inspect their transition at phone scale.
5. Integrate in Phaser; compare stills and live movement to quality reference.
6. Profile performance, shrink particles/atlas usage if needed.
7. Only then scale to more objects, zones, days and video.

**Never create 30 isolated hero images before interactive art quality and reusable parts are approved.**

## Animation/cinematic choreography contract

A story moment specifies: entry conditions, state mutation, camera cue, Nova position/face/gaze, authored line, object animation, particles, SFX/music, reveal timing, ability to skip/replay, persisted outcome. Motion starts after authoritative state transaction, and is safe if app loses focus.

Examples: tree roots light up, a door repairs, a seed sprouts, Lumi arrives, first bridge appears.

## Quality and performance targets (initial budgets to verify)

- Portrait smartphone primary; test at narrow/typical viewport and safe areas.
- Aim for **stable 60 FPS on target phones**, with graceful 30 FPS fallback on weaker devices. These are goals, not currently proven outcomes.
- On entry, display meaningful art promptly; avoid blocking on optional audio/video/AI.
- Optimize texture atlas size, draw calls, memory usage and particle overdraw as measured in actual hardware/browser tests.
- Support no-sound mode, captions, reduced motion, loading/fallback for missing assets, pause/resume, keyboard where relevant.
- Check Arabic text readability and animations behind overlays at multiple pixel ratios.

## Why the previous demo did not feel finished

The previous short Story Lab proved that events can be authored, but its visual states were procedural variations of one scene, with limited meaningful player agency. The new bar is: **child-made layout visibly changes the world, Nova acknowledges exact choices, and the result remains after reload**. Count of cinematic scenes is not a proxy for quality.

## Cut line / scope protection

If the visual fidelity of the first cottage + Nova is not acceptable, stop and improve style/motion instead of adding days. If p5.js makes mobile frame time worse, pre-render its art or remove runtime p5. If video makes Nova feel disconnected, use an engine-directed sequence instead. The product should feel cohesive whichever mechanism wins.
