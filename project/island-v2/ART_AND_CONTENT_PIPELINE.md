# Art & Content Pipeline — Immersive Three.js World

**New direction:** authored **full-scale grounded world**, human-height perspective, visually premium and child-oriented. [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md) supersedes the old layered Phaser 2.5D / floating diorama pipeline.

## Art bible — establish before expanding

Art target: magical, cozy, richly textured world that reads well on a phone, with identifiable cottage/ancient tree/garden, long atmospheric depth, varied silhouette and coherent proportions. Initial camera sees a *place surrounding the viewer*, not a little 3D model.

- **Composition:** path at eye level, horizon/distant hills, cottage along path, tree framing, foreground grasses and background clouds. Avoid camera looking onto the roof from above.
- **Palette:** warm sun/amber focal accents, spring garden greens, calm sky blue/teal, gentle shadows. Color-grade and test legibility at small scale; avoid overbloom.
- **3D materials:** consistent model style, handcrafted silhouettes, roughness/normal detail appropriate for mobile; deliberate cast/contact shadows and foliage light.
- **Nova:** a high-quality uniquely identifiable 3D character with strong silhouette and facial readability in 390 px portrait, authored expressions, hovering/pointing/looking/turning/speech animation; no billboard or placeholder primitive accepted as final.
- **UX overlay:** 100dvh world with tiny unobtrusive brand/menu, bottom-safe-area captions/context controls, age-appropriate RTL/English typography.
- **Audio:** layered subtle ambient sound, tactile object/plant/build cues, authored character phrases; muted/reduced-motion alternatives.

## Asset contract

Every shipping asset gets:
- stable semantic asset/model ID, author/source/license;
- GLB/glTF source + editable Blender/rig source (or equivalent authoring original);
- model unit/pivot/scale/orientation and named anchors;
- texture/material PBR references, mobile texture caps and fallback;
- named animations for actor and state variants, with duration/loop/cancel semantics;
- LOD/performance tier, loading fallback, actual phone screenshots;
- whether it is **placeholder, review candidate, approved**.

```yaml
id: cottage.old_v1
model: assets/models/cottage-old.glb
pivot: ground_center
units: meters
anchors:
  entry: cottage.front_door
  planter_left: garden.bed_01
materials:
  door: [aged_wood, painted_mint, painted_blue]
animations: [repair, idle_lantern]
qualityStatus: review_candidate
```

Save game references semantic `itemId`, `anchorId`, `variantId`, *not model file paths*.

## World asset kits — first ten steps

- **Terrain & sky:** connected walkable clearing, natural horizon/distant scenery, paths, foliage/rocks, cloud/mist lighting; no floating island underside.
- **Cottage:** exterior repair variants, door/roof/window materials, entry transition, interior corner.
- **Garden:** soil beds, two or more plant models/variants, sprouts/growth states, decorative paths and object anchors.
- **Tree/mystery:** tree silhouette/bark/leaf motion, ancient rune, glow seed, multiple light stages.
- **Creek:** water edge with non-distracting shaders, guided approach route, small bridge/stepping stones.
- **Visitors:** Lumi animated creature, nook and appropriate spatial interactions.
- **Nova:** expressive rig, facial/voice synchronization and reusable gestures, camera-friendly spatial poses.

## Production sequence

1. Build a **single reference keyframe** from child's eye-level on path and a small moving camera preview; approve composition.
2. Establish scale/environment/lighting/camera baseline and place temporary meshes for interactions in Session 01; clearly label provisional art.
3. Produce a premium Nova rig and representative cottage/tree/vegetation model. Review turnarounds and motion at actual mobile scale.
4. Replace placeholders with GLBs through model manifest, without changing pure domain or camera landmark IDs.
5. Implement simple meaningful build/plant variations on meshes/materials (door/window light, flower growth, plot changes), with authored cues and audio.
6. Optimize real target mobile phones; tune DPR, shadows, LOD, texture resolution, instancing, asset loading and animation.
7. Only then scale content beats, zone assets, characters and cinematic reveals.

## Media and tools

| Technology | Preferred role | Guardrail |
|---|---|---|
| Three.js / React Three Fiber | 3D world, perspective camera, light/shadow, mesh state, avatar, picking | only one main renderer; game truth elsewhere |
| Drei | selective helpers where version/size/perf justified | not a substitute for art production |
| Blender / equivalent model and rig tools | editable source, GLB export, animations and variants | preserve export metadata/scale/provenance |
| HDR / baked lighting / textures | intentional mood at mobile cost | performance / GPU fallback validated |
| Procedural effects / shaders | minor fireflies, magic glow, wind/water when valuable | measured on target phone, reduced-motion path |
| Sprites/videos | rare secondary 2D VFX overlay or authored reveal fallback | not main environment or a daily mandatory movie |
| p5.js | optional offline texture generation at most | no parallel full-screen p5 runtime |

## Camera-dependent content authoring

For each authored event, content declares **zone + semantic target + ground-level camera rig + Nova target/gaze + subtitle + sound + world outcome + skip/replay behavior**. Never force a top-down construction/inspection camera to hide poorly designed interactions.

A new zone is not a new entire game. Shared terrain, camera director, input, Nova, authoring and state systems remain reusable. Per-beat authored lines should feel responsive to child's persistent placement choices.

## Quality and budget

- Global quality is the ambition, but no assertion that the current procedural 3D spike is near final game-ready art.
- Verify phone readability, contour, eye-lines, real shadows, choice affordances, tone and emotional timing from **Session 01** onward.
- No locked-in FPS promise without device data; target smooth frames on reference phone(s) and record frame pacing, GPU load, assets and fallback tiers in Session 07/22.
- Maintain a visible art debt tracker; **never grow to ten days while the first clearing/Nova look substandard**.
- Allow model exports/licenses and child UX observations to change production time estimate transparently.
