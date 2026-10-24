# KidsHabits — STATUS · Immersive Three.js World

**Last updated:** 2026-10-24  
**Plan revision:** [SESSION_PLAN_25.md](./SESSION_PLAN_25.md) **v2 — full-screen immersive Three.js**  
**Current project stage:** **READY FOR NEW SESSION 01 CODE — immersive implementation NOT started**  
**Active session:** **01 / 25 — clean full-screen Three.js foundation**  
**Completed implementation sessions:** **0 / 25**  
**Engine decision:** ✅ **Three.js + React Three Fiber accepted for production direction**, pending real-device/art quality validation; **Phaser no longer the target runtime**.  
**Camera decision:** ✅ child-eye-level **perspective**, grounded, *inside* a continuous world; initial mode **guided tap-to-explore** (no free roam/joystick yet).  
**Product experience:** ✅ full-screen child world; sparse accessible overlays; Nova physically in-world; no visible floating cliff/underside or orthographic diorama.  
**New Session 01 issue:** [#15 — full-screen immersive Three foundation](https://github.com/addvaluewithai-hub/kidshabits/issues/15)  
**Next implementation branch:** **NOT CREATED** (proposed: `feat/immersive-world-s01`)  
**Main:** documentation-only pending review/merge; **no immersive-world code merged**.  
**Plan PR:** [#8](https://github.com/addvaluewithai-hub/kidshabits/pull/8) (still Draft; scope updated to include canonical docs).  
**Reference PRs:** [#12 Phaser spike](https://github.com/addvaluewithai-hub/kidshabits/pull/12), [#13 Three/Phaser A/B](https://github.com/addvaluewithai-hub/kidshabits/pull/13). **DO NOT BULK MERGE.**  
**Issue history:** [#9 master](https://github.com/addvaluewithai-hub/kidshabits/issues/9) · [#11 old S01 proof](https://github.com/addvaluewithai-hub/kidshabits/issues/11) · [#14 A/B choice](https://github.com/addvaluewithai-hub/kidshabits/issues/14).

> **Resume rule:** Read this file, [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md), [World spec](./IMMERSIVE_WORLD_SPEC.md), and the session row in [SESSION_PLAN_25.md](./SESSION_PLAN_25.md) before coding. Don't automatically declare Session 01 completed from the earlier diorama prototype.

## Decisions / facts versus assumptions

| Item | Status | Actual evidence / next work |
|---|---|---|
| 25-session **immersive** roadmap | ✅ written | v2 plan, old baseline in [archive](./archive/SESSION_PLAN_25_V1_2026-10-23.md) |
| Lived-in full-screen perspective specification | ✅ written | [Immersive spec](./IMMERSIVE_WORLD_SPEC.md), [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md) |
| Production engine / camera decision | ✅ accepted product direction | Three.js / R3F 9, perspective, grounded world, guided cinematic camera |
| Clean modular design, flexible file lengths | ✅ specified | [Engineering standards](./ENGINEERING_STANDARDS.md); source boundaries remain enforced |
| Previous Three A/B prototype | ✅ technical experiment only | [run #39990929701](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39990929701): prior **floating-island** WebGL tests/screenshots passed; not proof of immersive-camera world |
| New immersive production app | ❌ not built | Session 01 must create it on a clean branch from updated docs baseline |
| Full-screen horizon + eye-height camera screenshot | ❌ not produced | Required for Session 01, three viewports; no aerial or boxed preview |
| Guided camera motion + Nova on new scene | ❌ not implemented | Requires interaction and camera test with visible 3D scene |
| Source-compatible house/garden persistence | ⏳ transferable concept only | Reuse **small verified domain ideas** from old spike; implement/verify cleanly |
| New immersive CI + screenshot artifact | ❌ not run | Current planning branch has no runnable app; CI planning job only here |
| Premium GLB/rigged Nova & world art approval | ❌ not done | Session 02 art bible, iterative polish from Session 01 |
| Real mobile GPU/FPS/battery test | ❌ not done | Record observed devices/data before production-quality claim |
| Parent habits / Live AI voice | ❌ not in Session 01 | Later slots and child-safety gates |

## New Session 01 — exact starting brief

**Objective:** A genuinely immersive full-screen world, not the prior floating island.

- [ ] Begin **new focused code branch** from the updated docs/approved canonical baseline; keep previous PRs as references, not production mergers.
- [ ] Clean TypeScript + Vite + React + R3F/Three setup; one game renderer. Domain outside 3D.
- [ ] Render grounded clearing: **continuous ground**, sky/horizon/distant nature, old cottage, garden, ancient tree. No visual land edge/cliff/underside.
- [ ] Position a **perspective camera at child-height**, authored `arrival_path` and `cottage_front` focus rigs with gentle guided transition.
- [ ] Place Nova as a **3D actor in the world** with correct scale/gaze/return-aware authored line; her audio may be a mock subtitle.
- [ ] Cottage and garden accessible controls wired to safe semantic actions and a verifiable 3D world change. Persist at least the two starter state flags.
- [ ] Occupy mobile viewport **100dvh**, ensure no scroll, support safe areas/RTL/reduced motion/mute and sensible loading state.
- [ ] Run build/unit + **WebGL canvas pixels**, perspective camera rig state, real guided focus, changed mesh/state, reload on 360×740, 390×844, desktop.
- [ ] Upload actual Chrome screenshot artifacts and review visually; **a green CI icon does not certify beauty**.
- [ ] Record exact branch/PR/SHA/run/artifact, owner feedback and unresolved quality debt here. Only then advance to **02/25**.

### Target technical test names (to implement, not falsely claim passing)

- `world-viewport` full-screen geometry and no document scroll
- `world-canvas` WebGL2/nonblank pixels from actual Three canvas
- `camera-rig` = `arrival_path` → `cottage_front` / `garden_edge`, `camera-mode="perspective"`
- `nova-actor` and authored dialogue follow world state
- `cottage-hotspot`, `garden-hotspot` and actual **3D** mesh/material changes
- after reload, same world state at multiple viewports, not only updated badges

## Session ledger

| Session | Target | State | Code PR/SHA | CI / screenshots | Approval |
|---|---|---|---|---|---|
| 01 | Immersive full-screen Three foundation | **READY / NOT STARTED** | — | immersive proof not run | pending |
| 02 | Premium art direction + Nova bible | NOT STARTED | — | — | — |
| 03 | World terrain / horizon / modular stage | NOT STARTED | — | — | — |
| 04 | Nova 3D actor performance | NOT STARTED | — | — | — |
| 05 | Ground-level guided cottage interaction | NOT STARTED | — | — | — |
| 06 | Ground-level guided garden interaction | NOT STARTED | — | — | — |
| 07 | Early quality / mobile performance gate | NOT STARTED | — | — | — |
| 08–11 | Spatial building + persistent world | NOT STARTED | — | — | — |
| 12–14 | Parent habits / deterministic unlock | NOT STARTED | — | — | — |
| 15–19 | Authored moments / first ten beats | NOT STARTED | — | — | — |
| 20–25 | Sound, accessibility, screenshot suite, device QA and acceptance | NOT STARTED | — | — | — |

## Session recording template

- **Session:** 01/25; **branch/PR:** —; **commit:** —
- **Commands tested:** —; **Actions run:** —; **screenshot artifact:** —
- **Rendered evidence:** phone 360×740 / 390×844 / desktop — 
- **Camera from inside-world & Nova review:** —
- **Visual/UX review:** pass / revise / blocked, with concrete notes —
- **Device FPS / battery:** not measured unless real device evidence provided
- **Known issues & next step:** —
- **Owner approval:** not yet recorded

## History — preserve provenance

- **2026-10-24:** User explicitly accepted Three.js and replaced the **floating diorama** with **full-screen grounded first/close-person perspective** guided exploration, Nova present. Recorded ADR-001 and 25-session **v2**; reset starting brief to the new immersive code target. Earlier spikes remain evidence, **not completed production sessions**. Archived previous [STATUS](./archive/STATUS_BEFORE_IMMERSIVE_2026-10-24.md) and [plan](./archive/SESSION_PLAN_25_V1_2026-10-23.md).
- **2026-10-23:** Draft PR #12 established a clean Phaser/React domain proof with GitHub Actions phone screenshots and save/reload; draft PR #13 added a functioning Three.js floating-diorama A/B test, with working pixel-based WebGL validation. These tests **cannot** prove the new camera/world/UX brief.
