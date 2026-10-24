# KidsHabits — Agent / Contributor Instructions (Immersive Three.js v3)

**Current product direction: [Immersive World Specification](./project/island-v2/IMMERSIVE_WORLD_SPEC.md) + [ADR-001](./project/island-v2/ADR_001_THREEJS_IMMERSIVE.md).** This replaces the old Phaser-first 30-day story instruction set.

## Required first reads, in order

1. [STATUS.md](./project/island-v2/STATUS.md) — current session, precise blockers and tested evidence.
2. [SESSION_PLAN_25.md](./project/island-v2/SESSION_PLAN_25.md) — current 25-session plan, not the archived version.
3. [PRODUCT_VISION.md](./project/PRODUCT_VISION.md) and [Immersive spec](./project/island-v2/IMMERSIVE_WORLD_SPEC.md).
4. [ADR-001](./project/island-v2/ADR_001_THREEJS_IMMERSIVE.md) and [TECHNICAL_CONTRACTS.md](./project/island-v2/TECHNICAL_CONTRACTS.md).
5. [ENGINEERING_STANDARDS.md](./project/island-v2/ENGINEERING_STANDARDS.md), [CI_AND_VISUAL_QA.md](./project/island-v2/CI_AND_VISUAL_QA.md).
6. For actual 3D coding, review relevant instructions from [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) (React Three Fiber, geometry, camera, lighting, materials, animation, interaction, performance); verify APIs against installed versions.

**Legacy:** `project/ARCHITECTURE_PROPOSAL.md`, `project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md`, `project/skills/phaser/` and experimental PRs #2–#7, #12–#13 are **historical references only** where they conflict with this current direction. Do not accidentally follow their Phaser-first or hard-coded 30-day planet directives.

## Product invariants

- **One production renderer: Three.js + React Three Fiber**. No Phaser in new immersive production path. Previous A/B evidence can inspire small reusable ideas only.
- **Child must feel inside a real magical world**. Canvas full viewport; continuous ground/landscape, sky, far scenery, true perspective camera near child-eye height. **Never** floating island, top-down/orthographic isometric diorama, or preview in a card.
- First ten beats are **stateful changes to one connected, grounded home/garden/tree/creek world**, not 10 video screens or mandatory calendar days.
- Initial navigation: **guided, smooth ground-level camera transitions** between named safe destinations. No forced free roam/joystick/third-person controls before testing demands it.
- **Nova is an always-present, spatial 3D world actor**: expressive cues, eye-line, proximity, authored lines, safe optional live AI later. Never static overlay-only or baked into skybox.
- **State decides what is true. Three renders it.** Domain logic for placement, real habits, parent authority, unlocks and choices is deterministic/persistent and independent of Three/React/AI.
- **Core reveals authored. AI only performs bounded conversation/actions**, sees discovered facts only, never approves habits, unlocks content or contacts children without parent authorization.
- Children roughly 8–10 (first user test 9). Egyptian Arabic-first, localization-ready, safe parent handoff, calm parent operations.
- No guilt or punishing missed habits, no dying plants, no conditional affection from Nova, no currency grind, ads, public child chat or unsafe engagement pressure.
- Default **no durable raw child conversation memory**, no unapproved microphone/voice calls; only parent-visible allow-listed safe fields.
- Child's world keeps choices after reload; saved semantic item IDs/anchors, not mesh IDs or canvas pixel positions.
- Global premium aspiration: outstanding art, character acting, accessible UI/UX, audio, camera, loading/recovery, graphics performance **from first slice**, not a 'polish later' promise. Report placeholder and quality debt honestly.
- File size is **advisory**. One responsibility per module and correct import direction matter more than line-count thresholds.

## Architecture boundaries

```text
app (React world shell / parent and accessible HUD)
     ↓
application commands, domain models, versioned persistence
     ↓ read-only world snapshot + cue intents
WorldHost3D (R3F + Three)
  ├─ PerspectiveCameraDirector & named authored camera rigs
  ├─ WorldTerrain/Horizon & ZoneRegistry
  ├─ Placeables/ArtPack/validated anchors
  ├─ NovaActor3D & safe animation director
  └─ Raycast interaction / DOM accessibility counterpart
AI provider boundary; audio/voice policy; authored content schemas
```

**Forbidden:** domain importing Three/R3F/React/browser APIs, rendering scene owning habit truth, scene-specific day logic, unbounded AI commands, backend keys in frontend, giant multi-purpose App/World classes, directly altering persistent state in tween callbacks.

## Before each substantial change

Write a short issue/PR plan covering behavior, experience location, camera state, art assets/model rig, affected domain commands, mobile/safety/accessibility implications, and exact tests. Do not scaffold empty systems without a feature. Keep code modular and file sizes comfortable, but **never fail on length alone**.

## Done means proven

1. Typecheck, unit/contract tests, build, real Three WebGL pixel proof.
2. Phone portrait + desktop screenshots from **the built app** at exact commit; no boxed artwork, top-down view or sky void; human review of visual quality.
3. Screen-sized UI and subtitles with RTL, no unwanted scroll, meaningful keyboard/a11y actions, reduced motion/mute.
4. Deterministic camera rigs and world-object mutations, save/reload/resume tests, Nova state-aware performance.
5. Real device GPU/performance and child UX measurements before claiming production/flagship quality. CI screenshot ≠ real phone benchmark.
6. Update [STATUS](./project/island-v2/STATUS.md) with SHA, Actions run, artifacts, critique and owner's approval. **Never increment 25-session count for an experimental PR or unreviewed work.**

## Session 01 next step

**Start new Three code from documentation-only `main` after plan alignment**, not by bulk merging PR #12/#13. Build a truthfully full-screen grounded clearing and guided `arrival_path → cottage_front` camera experience, with minimal Nova/world interaction, real screenshots and preservation. Read [STATUS](./project/island-v2/STATUS.md) for exact remaining gate.
