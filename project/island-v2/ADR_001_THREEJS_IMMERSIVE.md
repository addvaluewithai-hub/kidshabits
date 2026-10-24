# ADR-001 — Three.js full-screen immersive world is the production direction

**Date:** 24 October 2026
**Decision:** **ACCEPTED as product and target-engine direction** by product owner in conversation; **implementation, visual quality and real-device performance are not yet approved**.
**Supersedes:** Phaser-first 2D/2.5D planet storyline and the Three.js *floating island / orthographic diorama* experiment as the **production presentation**, not their reusable domain/state lessons.
**References:** [Three A/B experiment](./THREEJS_EXPERIMENT.md), [world specification](./IMMERSIVE_WORLD_SPEC.md), [25-session plan](./SESSION_PLAN_25.md).

## Context

KidsHabits shifted from authored linear 30-day story screens toward a home/garden/discovery game for a child around nine, with an always-present Nova. Earlier prototypes:
- [PR #12](https://github.com/addvaluewithai-hub/kidshabits/pull/12): clean modular React + Phaser 4 island proof.
- [PR #13](https://github.com/addvaluewithai-hub/kidshabits/pull/13): Three.js r186 / R3F 9 versus Phaser on the **same saved domain state**. Tested A/B with real GitHub Actions Chrome screenshots and WebGL pixel proof. This proved Three can render the objects and support interaction/reload; **it did not prove phone FPS or flagship art quality**.
- [CI evidence](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39990099568) and later [run](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39990929701).

Product owner then explicitly chose **Three.js** and refined the target: **not** an island floating in space or a top-down diorama, but a **full-screen world seen from within it**, like being there, with ground-level guided cinematic travel.

## Decision

- Adopt **Three.js + React Three Fiber** as the sole primary production renderer for the child world.
- Design a **grounded continuous magical world**: scenery extends past the interactable clearing; no island edge/underside; sky and horizon establish an inhabitable place.
- Use **perspective camera at approximately child's eye height**, not orthographic/high/isometric camera.
- Initial movement is **guided perspective camera transitions / tap-to-explore**. Avoid premature third-person avatar/joystick controls; revisit when actual child testing calls for them.
- **Full viewport canvas**, with only compact accessible overlay UI; stop framing the game in a portrait card alongside a dashboard.
- Nova is a reusable **3D world actor** always present, responsive to discovered state and selected objects, with authored performance first.
- Keep deterministic domain, state IDs, habits, parent authority, save/reload and bounded AI **renderer-independent**.
- No Phaser engine in the final production runtime. Phaser experiments remain historical references.
- Document the changes to the original 25-session budget while keeping **25 provisional slots** (scope reshuffled, not a delivery promise).

## Alternatives rejected for initial launch

| Choice | Reason |
|---|---|
| Floating island Three diorama (PR #13) | Too much like looking **at** a miniature rather than living **in** a world |
| 2D Phaser production base | Excellent for authored scenes but not the newly chosen lived-in perspective |
| Unrestricted walk + mobile virtual joystick immediately | camera/collision/control burden before playtest, quality/motion sickness risk |
| One giant 3D sandbox at start | hurts quality, mobile performance, maintainability and asset production |
| One pre-rendered cinematic/video per beat | cannot preserve real interactive spatial changes, difficult to scale |

## Consequences and costs

**Advantages:** genuine parallax/depth, character movement with believable spatial relationships, lighting/shadows, placing objects in 3D space, extensible connected zones.

**Costs:** more difficult content production, camera navigation, light/shadow optimization, WebGL compatibility and accessibility overlays, asset authoring and rigging, mobile GPU pressure. **Quality is still a human review gate**. Mobile device tests are mandatory; do not confuse CI Chrome emulation with phone FPS.

## Design/technical guardrails

- A renderer swap must never modify past achievements, habit logic, semantic anchors or child preferences.
- Art Packs and camera rigs are data validated against scene geometry; renderer classes should orchestrate, not own business logic.
- Separate the parent UI from immersive child experience.
- No streak punishment, no decaying plants, no Nova sadness over absence, and no model-controlled progress.
- Don't move unfinished placeholder demo art into production under a "premium" label.
- Use [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) as technical guidance; read relevant current upstream skills before 3D implementation and validate actual library APIs.

## Integration strategy

1. Update canonical vision/AGENTS and CI contracts with this ADR (this planning PR).
2. Review and merge the product-planning PR when acceptable, keeping `main` code-clean.
3. Start a **new, focused Session 01 implementation PR** from the updated docs baseline for immersive full-screen Three. Selectively port reviewed pure domain/state/CI logic from PR #12 and useful Three scene techniques from PR #13 — do **not** bulk merge the old demos.
4. Show first production screenshot, mobile viewport behavior, working two focus actions and save/reload; keep Session 01 open until evidence and visual direction approved.
5. Continue 25-session plan, re-estimating explicitly if asset/hardware reality demands.

**Status:** decision accepted; no session automatically completed, no new immersive-world code shipped by this ADR.
