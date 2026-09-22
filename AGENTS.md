# KidsHabits Agent Instructions

Before implementing product work in this repository:

1. Read [`README.md`](./README.md).
2. Read [`project/PRODUCT_VISION.md`](./project/PRODUCT_VISION.md) as the product source of truth.
3. Read [`project/ARCHITECTURE_PROPOSAL.md`](./project/ARCHITECTURE_PROPOSAL.md).
4. Read [`project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md`](./project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md). This is a normative product-flow addendum and wins over older architecture wording where the two differ.
5. Read [`project/PLATFORM_FOUNDATION.md`](./project/PLATFORM_FOUNDATION.md). This is the current implementation-order rule: build the multi-world application platform before deepening any one planet.
6. Open [`project/skills/phaser/CATALOG.md`](./project/skills/phaser/CATALOG.md).
7. Select the smallest relevant set of Phaser skills for the task and read their `SKILL.md` files before coding.

## Non-negotiable product rules

- This is a **Phaser 4 clean start**. Do not preserve Phaser 3 compatibility unless explicitly requested.
- Build toward the **full product vision and complete 30-day planets**, but do not produce many story days until the reusable platform boundaries are proven.
- KidsHabits is a **multi-world application platform first** and a collection of authored planets second.
- The child experience is a **living 2D / 2.5D story world**, not a conventional habit dashboard with game rewards.
- Prefer reusable scene/location kits and persistent world states over one full-screen image per story day.
- **State decides what is true. Phaser shows what is true.**
- Story progression, habit completion, choices, unlocks, and inventory/state are deterministic application logic.
- **Core moments are authored; conversation is live AI.**
- AI may perform and converse, but it does not decide progression.
- Live AI must only receive story information the child has already discovered.
- Important choices should create visible persistent consequences while allowing the main story to converge later.
- Nova is not a hard-coded product assumption. Companions are selected semantic actors defined through reusable companion contracts.
- Nova / companions are independent scene actors. They should not be baked into background art.
- Parent UX is calm, clear, and operational. Child UX is immersive and magical.
- Parent onboarding, child handoff, companion selection, first meeting, Galaxy Browser, and entering a planet are part of the product architecture, not temporary setup screens.
- The child-facing meta navigation is a **galaxy of planets**. Individual planets do not need to be space-themed internally.
- Companion re-engagement is deterministic product behavior. AI does not decide when to call a child.
- Incoming companion calls must be parent-enabled, policy-gated, rate-limited, schedulable where applicable, and respectful of quiet hours.
- No guilt, conditional affection, abandonment framing, or emotional pressure around missed habits.
- Raw child conversation is not durable product memory by default. Persist only explicit, safe, product-useful allow-listed fields.
- Story content is **data, not gameplay code**. Content definitions must not directly manipulate Phaser, persistence, habit state, or AI state.
- Every planet lives primarily under `src/worlds/<world>/`. A world owns its manifest/content/presentation, not global app services.
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

Do not blindly reproduce concept images. Use Phaser 4 capabilities to find the simplest production-quality implementation that preserves the intended emotional experience.

## Architecture bias

Keep these concerns separated:

```text
Experience routing / first-run flow
Parent / child profiles
Habit / verification logic
Companion platform
World registry / Galaxy Browser
Generic World Runtime
Per-world manifests / story / presentation
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

## Platform-first milestone bias

Do not spend the next milestones deepening Sprout Planet.

Prove the reusable product in this order unless the product documents are intentionally revised:

```text
1 — Core app shell
routing → lifecycle → persistence → reload safety

2 — Parent + child profiles
habits → verification policy → voice/call permissions → quiet hours

3 — Companion platform
selection → persistent companion → character runtime → Live AI boundary

4 — World registry + Galaxy Browser
list worlds → start/resume world → independent world progress

5 — Generic World Runtime
manifest → durable state → shared WorldHost → authored sequence orchestration

6 — Two-world architecture proof
one shallow Day 1 in two worlds; prove a second planet is not a rewrite

7 — Daily habit / verification loop
real-life completion → authoritative verification → story trigger

8 — Parent center
progress → approvals → edit habits → controls → world visibility

9 — Re-engagement platform
notifications / companion calls → quiet hours → policy → deep link to correct state

10 — Planet lifecycle
start → resume → map/progress → completion → next planet

11 — Content tooling
manifest validation → state inspector → jump/simulate day → sequence preview

12 — Production foundations
auth/sync as needed → offline/recovery → analytics/privacy → localization → performance
```

Only after these boundaries are healthy should the team deeply iterate Days 2–30 of any planet.

## Third-world test

A healthy architecture should allow a third planet to be added mostly by:

```text
src/worlds/<new-world>/manifest.ts
src/worlds/<new-world>/presentation.ts
story/assets/audio/localization content
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
