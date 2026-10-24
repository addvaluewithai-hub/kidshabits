# KidsHabits — 25-Session Immersive Three.js Production Plan (v2)

**Adopted direction:** 24 October 2026 — product owner selected **Three.js / React Three Fiber**, **full-screen grounded living world**, **child-height perspective camera** and **guided cinematic exploration**.  
**Work:** first **10 meaningful progress beats** for children around 9, *not* ten separate scenes or compulsory calendar dates.  
**Budget:** **25 provisional focused sessions**, not guaranteed delivery; extra time for models, animation, hardware or accessibility is allowed and must be recorded openly.  
**Superseded:** [archived 2D/Phaser plan](./archive/SESSION_PLAN_25_V1_2026-10-23.md).  
**Required reads:** [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md) · [Immersive spec](./IMMERSIVE_WORLD_SPEC.md) · [Engineering standards](./ENGINEERING_STANDARDS.md) · [STATUS](./STATUS.md).

## Non-negotiable production direction

- **One primary renderer:** Three.js / React Three Fiber. Phaser PR #12 and Three/Phaser PR #13 are **reference/spike branches**, not production dependencies. No two renderers shipped together.
- **Full screen:** the child is **inside a grounded world**, never looking at a floating rock from above. Perspective camera, believable horizon, footpaths, distant scenery and physically located Nova.
- **Movement initially guided:** tap a landmark → smooth, human-height camera move to a safe authored viewing point → interact. **No forced avatar, free-orbit or joystick for first 10 beats** unless child tests change the decision.
- **World quality from Session 01:** no boxed demo, giant side-panel or delayed UX work. Every PR checked for mobile legibility, thoughtful light/motion, safe areas, audio-off, reduction of motion, accessible HTML fallback and Nova continuity.
- **Code hygiene:** deterministic domain + versioned state outside 3D, typed interfaces, small cohesive modules, stable IDs, replaceable art packs/GLB assets. File length is **advisory** (no hard LOC fail). React Three Fiber scene components are projection only.
- **Child privacy & safety:** 2–3 parent-configured habits, approval/trust options, no punitive streaks or dying plants, no AI control over unlocks, no unapproved child audio or external calls.

## Phase A — world foundation + character (01–07)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **01** | **Clean production Three.js app from documentation-only main**. React/Vite/TS, R3F/Three; full-screen 100dvh grounded clearing (terrain to horizon, sky, old house, garden, ancient tree); human-height perspective arrival and **one guided focus journey**; Nova represented in-world; pure minimal island/world state, app commands and local save. Port only reviewed small domain/tests and 3D ideas from #12/#13. | CI build/unit + real WebGL nonblank pixel proof; phone 390×844, narrow 360×740 & desktop screenshots; **no floating underside, orthographic bird's-eye, boxed island or page scroll**. Camera pose assertion + a focus interaction; save/reload baseline. Record actual SHA/run/artifact in STATUS. Not final art. |
| **02** | **World & Nova art bible** with final direction candidates: character silhouette/expression sheet, scale reference, ground-level camera language, lighting, materials, rig/GLB authoring/export conventions, mobile target devices and captions/UX controls. Improve ugly placeholders before more world content. | Approved keyframe/mock and moving phone capture against same eye-level camera; source/provenance manifest; quality debt explicit; rejection/iteration allowed. |
| **03** | Modular Three `WorldHost3D`, terrain/sky/horizon, named 3D zones, physically plausible lighting/shadows, graphics settings, loading/error/retry and orientation/safe-area behavior. | Works in mobile viewport; no world edges or empty void; no frame clipping; keyboard/accessibility controls retained; automated screenshot reference. |
| **04** | **NovaActor3D** independent rig/GLB with idle/fly/turn/look/point/listen/speak cues, camera-aware placement and authored animation priority. | In-world eye-line and gestures follow current selected object; no vanishing/offscreen or distracting perpetual voice; authored/mock dialogue + subtitles and reduced motion pass. |
| **05** | **Cottage visit**: tapping cottage or accessible target guides camera to front door; repair or style action changes material/mesh + Nova specific response; access to path back. | CI asserts camera rig `cottage_front` and actual material/state change, screenshot before/after + return; state survives reload. |
| **06** | **Garden visit**: child taps ground plot, guided camera and two safe 3D planting anchors; growth animation + Nova reaction; collision/occlusion validation. | CI asserts camera rig `garden_edge`, raycast/accessible tap, growth and save/reload; world does not become top-down for placement. |
| **07** | **Premiere visual/UX/performance gate**: polish scene composition, Nova, shading, particles/ambience, subtitles, readable HUD; test memory/frame time on at least one real phone if available. | Owner sees phone screenshots **and short camera-motion recording**; confirm it feels like *living in a world*, not a showroom. If quality fails, do not expand content; stay here. |

## Phase B — persistent building in spatial world (08–11)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **08** | Domain-owned 3D object catalog, stable semantic anchors and world transforms; placement validation, collision rules and depth-safe object selection without saving pixels/mesh IDs. | Unit tests reject invalid/occupied spots; changing skin or viewport preserves placement; perspective placement affordances comprehensible. |
| **09** | Versioned snapshot migrations, reload/return, pause/resume and recovery from interrupted camera transition; world, zone and camera focus reconstruction. | E2E create/modify/close/reopen and rotate viewport; same objects and Nova contextual greeting; no duplicate world events. |
| **10** | Cottage exterior customization plus simple first interior corner reached through guided doorway transition (no free-roam camera collision system). | Two distinct personally recognizable homes; lighting/occlusion and navigation back tested; style independent of game rules. |
| **11** | Garden kit: choose plants and locations, rearrange, undo/preview where possible; free-play even when no habit unlock today. | Multiple visibly different gardens and return states; no plant death/missed-day guilt; comfortable touch targets. |

## Phase C — parent authority and habit progress (12–14)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **12** | Calm family onboarding/profile, parent owns 2–3 goals and trust/approval setting, mic consent default off; accessible child handoff into world. | Parent can configure without cluttering full-screen child world; test handoff/return to parent area. |
| **13** | Deterministic habit ledger, authorization + idempotent thresholds, pending approvals and resilient offline/local behavior. | Domain tests: pending/rejected never unlock, trust/approved once, retries no double rewards; audit relevant permissions. |
| **14** | Qualification unlocks **creative opportunities** (3D placeable or new path), presentation via authored sequence; no currency treadmill. | Approved real-life habit state enables one intended action; 3D world visibly changes, persists and restores without Nova/AI deciding. |

## Phase D — authored story and ten steps (15–19)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **15** | Typed story/zone/camera-director schema, content validator, skip/resume, authoring/debug day-jump tool and simulation with mock AI. | Add a new beat as content without changing `WorldHost3D`; interrupted reveal commits state once. |
| **16** | **First 3 beats** polished in grounded world: meeting Nova on arrival path, first house/roof choice, garden planting; parent-supervised user playtest. | 3 distinct playable state changes, child understands own place, actual camera journeys and screenshots; tune nine-year-old copy. |
| **17** | **Beats 4–6**: enter interior, ancient-tree symbol, secret seed with permanent placement by cottage or near creek. | Both branches persistent and visibly different in same contiguous world, close-up camera keeps credible ground perspective. |
| **18** | **Beats 7–8**: Lumi enters world and a nook/path is built for it; Nova reacts coherently without guilt/neediness. | Lumi appears once, home anchor saved, camera/Nova/visitor choreography and muted alternative pass. |
| **19** | **Beats 9–10**: reach creek via guided path, bridge/path placement, first hidden gate clue beyond clearing. | Sequence 01–10 replayable/debug-jumpable; nearby regions connected naturally; no cliff edge or artificial floating-zone scene. |

## Phase E — polish, safety and production acceptance (20–25)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **20** | Immersive authored reveals, lighting/audio/camera choreography, subtitle/haptic polish, motion reduction; optional short video only if demonstrably improves result. | Child may skip/leave/replay without progress rollback; no unskippable cinema; camera avoids nausea. |
| **21** | Rich **GitHub Actions screenshot + interaction coverage**: 3 mobile sizes, desktop, first/house/garden/room/tree/Lumi/creek/day10, camera rig, mesh update, Nova focus and restore. | GitHub artifact/JSON at exact commit; human visual review mandatory; does not merely test existence of CSS/DOM. |
| **22** | Actual target device performance and accessibility audit: GPU memory, frame pacing, load time, thermal/battery observations, DPR/shadow/LOD fallback, RTL/voice-off/motion. | Document real phone models and measured results; budget findings and fixes, not theoretical claims. |
| **23** | Reliability/security: snapshot migrations, interrupted journey and authored reveal, unavailable assets/WebGL fallback, network offline, privacy data deletion and no secret leakage. | Automated recovery/contract tests + no corrupted placeables or duplicate rewards. |
| **24** | Parent-child supervised UX review and child-safe Nova mock conversation, consent and global-ready localization/accessibility review. | Logged behaviors/observations with consent, no raw private child conversation collection, top usability defects addressed. |
| **25** | **Ten-beat release candidate gate**: full-screen visually coherent lived-in world, robust camera/character/build loops, tests, documentation, backlog and final PR review. | All essential tests + human quality approval on actual phones. Open issues transparent; live AI voice remains a separate opt-in/safety-reviewed workstream if not ready. |

## Session protocol — every session

1. Read **[STATUS.md](./STATUS.md)** and this plan. Start from approved branch/commit. At session kickoff record exact objective and status.
2. Read **[ADR-001](./ADR_001_THREEJS_IMMERSIVE.md)**, [World spec](./IMMERSIVE_WORLD_SPEC.md), engineering rules and latest cloudai-x/threejs-skills relevant to the actual work.
3. Create a narrowly scoped issue/branch/PR. No wholesale merge of historical PR #12 or #13; avoid 2 renderers in production.
4. Implement renderer-independent domain features with tests and authored world presentation with accessibility equivalents.
5. Run unit/typecheck/build, **Three canvas / camera rig / world-state assertions**, built-app browser UI and actual screenshot artifacts in GitHub Actions.
6. **Look at** phone screenshots (and moving camera clip for animation-heavy work). Document clipping, HUD intrusion, style, quality debt and mobile performance unknowns.
7. Update STATUS with exact commit SHA, Actions URL, artifact name, visual review result and unresolved issues. **Only increment session after owner accepts**. Fail/revise means remain at current number.

## Minimum CI contract for first code session

- App compiles; domain and import-boundary tests pass. Line length guard nonblocking; forbidden imports fail.
- `data-testid="world-viewport"` fills viewport and produces **no vertical page scrolling**.
- Debug camera marker `data-camera-mode="perspective"`, `data-camera-rig="arrival_path|cottage_front|garden_edge"`, with world-space pose checks.
- Real `canvas` WebGL context + **pixel diversity**, not screenshot of a CSS placeholder.
- Three mesh/scene state reflected for house/garden changes, not DOM labels alone. Validate with safe test-only scene bridge (no mutable state authority).
- Two accessible HTML controls or actual raycast objects for house/garden; scripted camera focus and Nova reaction.
- Screenshot initial and each choice **after motion settles**, and after reload on 390×844, 360×740 and desktop.
- Manual visual sign-off required: perspective **from within world**, no aerial diorama, no floating underside, readable Nova, safe-area-aware UI and subtitles.
- CI does not falsely report a game pass when only docs exist. See [CI_AND_VISUAL_QA.md](./CI_AND_VISUAL_QA.md).

## Change control

We preserved [v1](./archive/SESSION_PLAN_25_V1_2026-10-23.md) because scope pivot was material. **v2 is the source of planning truth from Oct 24, 2026**, conditional on PR review. Session estimate is still 25 slots by choice, not an attempt to hide additional workload. If real modelling/device testing needs more, revise count explicitly in PR with evidence. No session is retrospectively marked complete because a prior experimental code PR passed.
