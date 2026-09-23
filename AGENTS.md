# KidsHabits Agent Instructions

Before implementing product work in this repository:

1. Read [`README.md`](./README.md).
2. Read [`project/PRODUCT_VISION.md`](./project/PRODUCT_VISION.md) as the product source of truth.
3. Read [`project/ARCHITECTURE_PROPOSAL.md`](./project/ARCHITECTURE_PROPOSAL.md).
4. Read [`project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md`](./project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md). This normative product-flow addendum wins over older architecture wording where the two differ.
5. Read [`project/PLATFORM_FOUNDATION.md`](./project/PLATFORM_FOUNDATION.md) for the multi-world ownership boundaries.
6. Read [`project/WORLD_ART_RUNTIME_FOUNDATION.md`](./project/WORLD_ART_RUNTIME_FOUNDATION.md) before world-art, location-composition, or illustrated-asset work. This is the current direction for entering the first deep Sprout Planet design phase without undoing the platform boundary.
7. Open [`project/skills/phaser/CATALOG.md`](./project/skills/phaser/CATALOG.md).
8. Select the smallest relevant set of Phaser skills for the task and read their `SKILL.md` files before coding.

## Current implementation stage

The platform-first rule was used to prove the application shell, companion boundary, multi-world registry, shared WorldHost, habit verification, parent center, and two-world architecture proof.

The product direction is now intentionally allowing **Sprout Planet world-art architecture and the first seven authored days to begin**, with two constraints:

- build reusable art/story contracts before deep day-specific code;
- do not hard-code Sprout assumptions into global app, habit, AI, persistence, or WorldHost infrastructure.

Companion phone-call / re-engagement work is deferred until later unless explicitly requested.

## Non-negotiable product rules

- This is a **Phaser 4 clean start**. Do not preserve Phaser 3 compatibility unless explicitly requested.
- KidsHabits is a **multi-world application platform first** and a collection of authored planets second.
- The child experience is a **living 2D / 2.5D story world**, not a conventional habit dashboard with game rewards.
- Prefer reusable scene/location kits and persistent world states over one full-screen image per story day.
- Premium transparent painted assets are allowed and expected where they raise quality; Phaser composes, animates, lights, and reacts around them.
- **State decides what is true. Phaser shows what is true.**
- Story progression, habit completion, choices, unlocks, and inventory/state are deterministic application logic.
- **Core moments are authored; conversation is live AI.**
- AI may perform and converse, but it does not decide progression.
- Live AI must only receive story information the child has already discovered.
- Important choices should create visible persistent consequences while allowing the main story to converge later.
- Companions are selected semantic actors, not baked into background art.
- Parent UX is calm, clear, and operational. Child UX is immersive and magical.
- The child-facing meta navigation is a **galaxy of planets**. Individual planets do not need to be space-themed internally.
- No guilt, conditional affection, abandonment framing, or emotional pressure around missed habits.
- Raw child conversation is not durable product memory by default. Persist only explicit, safe, product-useful allow-listed fields.
- Story content is **data, not gameplay code**. Content definitions must not directly manipulate Phaser, persistence, habit state, or AI state.
- Every planet lives primarily under `src/worlds/<world>/`. A world owns its manifest/content/presentation/art, not global app services.
- `world-runtime/` owns reusable world infrastructure. Do not duplicate it per planet.
- React/mobile overlays and Phaser must follow the documented WorldHost/input/focus/audio/lifecycle contract.
- Arabic and RTL are first-class requirements; the architecture must also remain localizable.
- Mobile portrait is the primary target.

## Before major implementation

For any substantial new feature, first write a short implementation proposal covering:

- product behavior,
- relevant experience phase,
- Phaser systems / skills used,
- state model,
- reusable assets required,
- what can be rendered or animated in-engine,
- content definition / schema impact,
- mobile performance implications,
- persistence implications,
- React ↔ Phaser ownership if an overlay is involved,
- AI boundary if applicable,
- re-engagement policy impact if applicable,
- QA / debug / simulator approach.

Do not blindly reproduce concept images. Use Phaser 4 capabilities plus authored art assets to find the simplest production-quality implementation that preserves the intended emotional experience.

## Architecture bias

Keep these concerns separated:

```text
Experience routing / first-run flow
Parent / child profiles
Habit / verification logic
Companion platform
World registry / Galaxy Browser
Generic World Runtime
Per-world manifests / story / art / presentation
World art asset loading / composition
Content validation / simulation
WorldHost / overlay boundary
Character runtime
Authored sequence playback
Live AI conversation provider
Re-engagement policy
Mobile platform services
Persistence
Audio
Debug / authoring tools
```

Do not hard-code a 30-day story directly into scene classes. New story days and future planets must be content-driven, validated, simulatable, and reconstructable from durable state.

## World-art rules

For illustrated planets:

- use `Image` for static painted layers and `Sprite` only when frame animation is needed;
- use semantic render bands (`sky`, `far`, `mid`, `terrain`, `landmark`, `story`, `actor`, `foreground`, `atmosphere`);
- prefer lightweight Phaser `Layer` buckets over deeply nested `Container` trees;
- use transparent WebP/PNG assets where painted quality beats procedural drawing;
- keep procedural Graphics as fallback/debug/support, not the production quality ceiling;
- content manifests declare assets, placement, parallax, visibility, and motion presets without calling Phaser APIs;
- filters/particles are enhancements and must never be the only representation of story truth;
- preserve responsive portrait composition across phone ratios.

## Third-world test

A healthy architecture should allow a third planet to be added mostly by:

```text
src/worlds/<new-world>/manifest.ts
src/worlds/<new-world>/art/manifest.ts
src/worlds/<new-world>/story/
src/worlds/<new-world>/presentation.ts
public/worlds/<new-world>/art/
registry entry
```

If adding a planet requires changes to parent onboarding, companion selection, habit domain logic, Gemini session code, persistence infrastructure, or generic WorldHost orchestration, fix the platform boundary before producing more world content.

## Definition of good work

A feature is not complete merely because it renders.

It should be:

- understandable on a phone,
- visually readable,
- reusable,
- deterministic where progression is concerned,
- state-safe after reload or interruption,
- testable through developer tools,
- authorable without unnecessary engineering work,
- production-minded,
- emotionally aligned with the product vision.

When uncertain, prefer the interpretation that makes the world feel more alive while keeping the platform boundary and content pipeline simpler.
