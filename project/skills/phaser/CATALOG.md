# KidsHabits Phaser 4 Skills Catalog

This is the **first file to read before any substantial Phaser implementation in KidsHabits**.

KidsHabits starts clean on **Phaser 4**. Pick the smallest relevant set of skills below, read their `SKILL.md` files, then implement. The project direction and product-specific decisions always override generic examples.

## Fast routing

| KidsHabits task | Read first |
|---|---|
| Establish project/runtime foundation | `game-setup-and-config`, `game-architecture`, `scenes`, `events-system` |
| Build a beautiful reusable world location | `game-designer`, `scenes`, `groups-and-containers`, `sprites-and-images`, `graphics-and-shapes`, `cameras` |
| Make the world feel magical | `game-designer`, `tweens`, `particles`, `filters-and-postfx`, `audio-and-sound`, `cameras` |
| Animate Nova / Lumi / flying companions | `animations`, `tweens`, `curves-and-paths`, `groups-and-containers`, `events-system`, `audio-and-sound` |
| Build portrait-first mobile UX | `scale-and-responsive`, `input-keyboard-mouse-touch`, `text-and-bitmaptext`, `cameras` |
| Build dynamic reveal / glow / compositing effects | `particles`, `filters-and-postfx`, `render-textures`, `v4-new-features` |
| Organize reusable world kits | `groups-and-containers`, `game-object-components`, `loading-assets`, `actions-and-utilities` |
| Build content-driven 7/30-day story systems | `game-architecture`, `events-system`, `scenes`, `time-and-timers` |
| QA before calling a slice production-ready | `game-qa`, `game-designer`, `scale-and-responsive` |
| Use new Phaser 4 rendering capabilities | `v4-new-features`, then the relevant rendering skill |

---

## Product, design & quality

### [game-designer](./game-designer/SKILL.md)
**Description:** Game UI/UX and visual-polish guidance for improving atmosphere, backgrounds, particles, animations, transitions, game feel, visual hierarchy, and overall player experience.

**Use in KidsHabits:** Every serious visual/game-feel pass on Sprout Planet, Nova moments, reveals, and daily story beats.

### [game-architecture](./game-architecture/SKILL.md)
**Description:** Architecture patterns and best practices for browser games, including system boundaries, project structure, state, communication, and maintainability.

**Use in KidsHabits:** Story engine, world state, provider boundaries, persistent consequences, and scaling from 7 to 30 days.

### [game-qa](./game-qa/SKILL.md)
**Description:** Browser-game QA with Playwright, including gameplay verification, visual regression, performance, accessibility, and test-debugging guidance.

**Use in KidsHabits:** Mobile 9:16 E2E, persistent-world checks, visual screenshots, performance gates, and release confidence.

---

## Setup, lifecycle & runtime structure

### [game-setup-and-config](./game-setup-and-config/SKILL.md)
**Description:** Phaser 4 game creation and `GameConfig`: renderer choice, canvas setup, scaling, FPS, boot sequence, and configuration sub-objects.

### [scenes](./scenes/SKILL.md)
**Description:** Phaser 4 scene lifecycle, preload/create/update, transitions, parallel scenes, communication, pause/sleep/restart, and SceneManager.

### [events-system](./events-system/SKILL.md)
**Description:** Phaser 4 EventEmitter, scene/game events, custom events, listeners, and event-driven communication.

### [time-and-timers](./time-and-timers/SKILL.md)
**Description:** Phaser timers, delayed calls, looping events, Clock plugin, and time scaling.

### [actions-and-utilities](./actions-and-utilities/SKILL.md)
**Description:** Phaser Actions and utility helpers for alignment, grids, batch changes, positioning, arrays, objects, and strings.

---

## World composition & rendering

### [sprites-and-images](./sprites-and-images/SKILL.md)
**Description:** Creating and manipulating Phaser 4 Sprites and Images: texture/frame selection, transforms, alpha, tint, flip, origin, and depth.

### [graphics-and-shapes](./graphics-and-shapes/SKILL.md)
**Description:** Phaser 4 Graphics: lines, rectangles, circles, arcs, polygons, gradients, fills, strokes, and generated textures.

### [groups-and-containers](./groups-and-containers/SKILL.md)
**Description:** Groups and Containers for organizing game objects, pooling, batch operations, reusable assemblies, and nested transforms.

### [game-object-components](./game-object-components/SKILL.md)
**Description:** Phaser 4 shared game-object components such as Transform, Alpha, Tint, Origin, Depth, Flip, Mask, bounds, and Lighting-related behavior.

### [render-textures](./render-textures/SKILL.md)
**Description:** RenderTexture and DynamicTexture for drawing objects into textures, off-screen rendering, snapshots, stamps, and dynamic composition.

### [v4-new-features](./v4-new-features/SKILL.md)
**Description:** Phaser 4-specific capabilities including Filters, RenderNodes, CaptureFrame, Gradient, Noise, GPU layers, Lighting component, RenderSteps, and new tint/rendering modes.

---

## Motion, camera & VFX

### [animations](./animations/SKILL.md)
**Description:** Sprite animation creation/control using spritesheets and atlases, AnimationManager/AnimationState, frame callbacks, chains, and animation events.

### [tweens](./tweens/SKILL.md)
**Description:** Property animation with Phaser 4 tweens: easing, chains, stagger, yoyo, repeat, callbacks, and TweenManager.

### [cameras](./cameras/SKILL.md)
**Description:** Camera pan, zoom, shake, fade, flash, following, scroll, bounds, viewports, multiple cameras, and minimap patterns.

### [particles](./particles/SKILL.md)
**Description:** ParticleEmitter systems, emission/death zones, motion, textures, gravity wells, and reusable particle effects.

### [filters-and-postfx](./filters-and-postfx/SKILL.md)
**Description:** Phaser 4 visual filters/post-processing including bloom, blur, glow, color matrix, distortion, displacement, and custom effects.

### [curves-and-paths](./curves-and-paths/SKILL.md)
**Description:** Curves, splines, Béziers, ellipses, lines, paths, followers, and mathematical motion paths.

---

## Mobile interaction, content & delivery

### [input-keyboard-mouse-touch](./input-keyboard-mouse-touch/SKILL.md)
**Description:** Keyboard, mouse, touch, pointer, drag/drop, hit areas, interactive objects, and gamepad input.

**KidsHabits priority:** Touch and pointer behavior first; desktop input is a development convenience.

### [scale-and-responsive](./scale-and-responsive/SKILL.md)
**Description:** ScaleManager, FIT/RESIZE/EXPAND/ENVELOP, auto-centering, fullscreen, and browser/device resize handling.

**KidsHabits priority:** Portrait-first 9:16 composition and robust phone viewport behavior.

### [text-and-bitmaptext](./text-and-bitmaptext/SKILL.md)
**Description:** Phaser Text and BitmapText, fonts, style, word wrapping, alignment, padding, and dynamic text.

### [loading-assets](./loading-assets/SKILL.md)
**Description:** Loader plugin and loading images, spritesheets, atlases, audio, JSON, tilemaps, bitmap fonts, and progress tracking.

### [audio-and-sound](./audio-and-sound/SKILL.md)
**Description:** Phaser sound/music, loading audio, playback, volume/mute, Web Audio, SoundManager, and spatial-audio patterns.

---

## Working rule for this repository

Before implementing a meaningful feature:

1. Open this catalog.
2. Select the relevant skills.
3. Read their `SKILL.md` files completely enough to understand the applicable patterns and gotchas.
4. Design the feature for **Phaser 4**, not Phaser 3 compatibility.
5. Keep world/story/content systems reusable instead of day-specific.
6. Validate in the target **mobile portrait 9:16** presentation.
7. Use `game-qa` and visual inspection before declaring the feature production-ready.

## Imported library

**25 Phaser 4 skills** are stored in this folder as independent skill directories, preserving the uploaded `SKILL.md`, metadata, and icon assets.
