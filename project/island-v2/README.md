# KidsHabits — Full-Screen Immersive Three.js World (v3)

**Adopted product direction:** 24 October 2026. **Code not yet implemented** for this new ground-level world. Planning lives in draft [PR #8](https://github.com/addvaluewithai-hub/kidshabits/pull/8); `main` remains clean pending review.

> **A magical world that grows with you.**
>
> A girl around nine should feel **inside** a richly crafted world with a house, garden, old tree and Nova. She should NOT feel as though she's looking down on a floating island in a frame.

## Where we really are

**[STATUS.md](./STATUS.md)** is the first file at every session. It currently tracks **01/25 active, 0/25 immersive sessions completed**, previous prototype evidence, unmerged PRs and the exact next task.

### Read before any production coding

1. **[PLAN_AR.md](./PLAN_AR.md)** — full Arabic explanation of the direction and the first ten beats.
2. **[ADR_001_THREEJS_IMMERSIVE.md](./ADR_001_THREEJS_IMMERSIVE.md)** — accepted Three.js / full-screen / perspective / guided exploration decision.
3. **[IMMERSIVE_WORLD_SPEC.md](./IMMERSIVE_WORLD_SPEC.md)** — camera pose, first 75s, space, UI, Nova, acceptance.
4. **[SESSION_PLAN_25.md](./SESSION_PLAN_25.md)** — 25 detailed sessions reallocated around immersive world.
5. **[TECHNICAL_CONTRACTS.md](./TECHNICAL_CONTRACTS.md)** · **[ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)** — modular Three, state, GLB assets, art swapping, no hard line-limit.
6. **[ART_AND_CONTENT_PIPELINE.md](./ART_AND_CONTENT_PIPELINE.md)** — premium 3D art/model/rig pipeline and world style.
7. **[CI_AND_VISUAL_QA.md](./CI_AND_VISUAL_QA.md)** — actual WebGL/perspective/camera/full-viewport screenshot tests.
8. **[ROADMAP_AND_ACCEPTANCE.md](./ROADMAP_AND_ACCEPTANCE.md)** · **[FIRST_10_DAYS.md](./FIRST_10_DAYS.md)** — milestone gates and ten connected progress beats.
9. [NOVA_COMPANION.md](./NOVA_COMPANION.md) · [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md) · [FINCH_COMPETITOR_STUDY_AR.md](./FINCH_COMPETITOR_STUDY_AR.md) — character, loop, competitor lessons.

**Decision/history preserved:** [v1 25-session plan](./archive/SESSION_PLAN_25_V1_2026-10-23.md), [pre-immersive STATUS](./archive/STATUS_BEFORE_IMMERSIVE_2026-10-24.md), [older product vision](../archive/PRODUCT_VISION_PHASER_V1.md).

## Important GitHub code state

- [PR #12](https://github.com/addvaluewithai-hub/kidshabits/pull/12) is a **Phaser 4 demo**. Good domain/storage lessons, not production runtime.
- [PR #13](https://github.com/addvaluewithai-hub/kidshabits/pull/13) is a **Three floating-diorama A/B experiment**. Real CI pixel/screenshots, but **NOT** the newly approved immersive camera composition.
- Do **not** bulk merge these old PRs, ship two renderers or count them as done immersive sessions.
- Start Session 01 from reviewed planning docs with **one renderer: Three.js/R3F**, full-screen grounded land and a perspective camera. Code and screenshot tasks are separate from this planning-only PR.
- [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) informs React Three Fiber, geometry, lights, camera, animation, materials and performance; verify current APIs before coding.

## Design & review principles

- Enduring child-selected world changes, actual models/materials, camera movements and Nova performance; authored scene beats and safe AI boundary.
- Child-safe habit verification and optional guarded AI voice; no guilt, coercive streaks, currency grind, or dying plants.
- Arabic-first, global localization-ready, accessible and mobile optimized; parent UX separate from full-screen child world.
- **Top-tier quality ambition from first PR:** artistic detail, UX, light, animation and sound; file length nonblocking but real coupling forbidden.
- No claim of flagship quality until real phone / human visual review. CI proof is a necessary but insufficient gate.
