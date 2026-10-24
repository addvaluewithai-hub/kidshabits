# KidsHabits — 25-Session Immersive Three.js Production Plan (v3 · Home First Proposal)

**Planning revision (proposed, not merged):** 24 October 2026 — keep accepted engine, full-screen camera and validated Session 01 — product owner selected **Three.js / React Three Fiber**, **full-screen grounded living world**, **child-height perspective camera** and **guided cinematic exploration**.  
**Work:** first **10 gradual home-renovation progression beats** (exterior cottage → barren garden → cottage interior → beautiful starter home/garden) for children around 9. **Outdoor adventures only after beat 10 (Chapter 2)**. The 10 beats are not ten video screens, mandatory consecutive calendar days or developer sessions. See [RFC-002](./HOME_AND_GARDEN_FIRST_10_RFC.md).  
**Budget:** **25 provisional focused sessions**, not guaranteed delivery; extra time for models, animation, hardware or accessibility is allowed and must be recorded openly.  
**Prior baseline:** [v2 as merged in main](https://github.com/addvaluewithai-hub/kidshabits/blob/main/project/island-v2/SESSION_PLAN_25.md) and [older 2D/Phaser plan](./archive/SESSION_PLAN_25_V1_2026-10-23.md); **v3 is a review proposal**, not adopted until approved.  
**Required reads:** [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md) · [Immersive spec](./IMMERSIVE_WORLD_SPEC.md) · [Engineering standards](./ENGINEERING_STANDARDS.md) · [STATUS](./STATUS.md).

## Non-negotiable production direction

- **One primary renderer:** Three.js / React Three Fiber. Phaser PR #12 and Three/Phaser PR #13 are **reference/spike branches**, not production dependencies. No two renderers shipped together.
- **Full screen:** the child is **inside a grounded world**, never looking at a floating rock from above. Perspective camera, believable horizon, footpaths, distant scenery and physically located Nova.
- **Movement initially guided:** tap a landmark → smooth, human-height camera move to a safe authored viewing point → interact. **No forced avatar, free-orbit or joystick for first 10 beats** unless child tests change the decision.
- **World quality from Session 01:** no boxed demo, giant side-panel or delayed UX work. Every PR checked for mobile legibility, thoughtful light/motion, safe areas, audio-off, reduction of motion, accessible HTML fallback and Nova continuity.
- **Code hygiene:** deterministic domain + versioned state outside 3D, typed interfaces, small cohesive modules, stable IDs, replaceable art packs/GLB assets. File length is **advisory** (no hard LOC fail). React Three Fiber scene components are projection only.
- **Child privacy & safety:** 2–3 parent-configured habits, approval/trust options, no punitive streaks or dying plants, no AI control over unlocks, no unapproved child audio or external calls.
- **First-home chapter:** 10 cumulative small-scale restorations of **the same cottage, immediate yard, two plant beds and starter interior**. No Lumi/bridge/gate playable or new exploration zone before completion of beat 10. Each qualified beat has one clear focal transformation, choice, tactile action and persistence, with free play between steps.

## Phase A — world foundation + character (01–07)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **01** | **Clean production Three.js app from documentation-only main**. React/Vite/TS, R3F/Three; full-screen 100dvh grounded clearing (terrain to horizon, sky, old house, garden, ancient tree); human-height perspective arrival and **one guided focus journey**; Nova represented in-world; pure minimal island/world state, app commands and local save. Port only reviewed small domain/tests and 3D ideas from #12/#13. | CI build/unit + real WebGL nonblank pixel proof; phone 390×844, narrow 360×740 & desktop screenshots; **no floating underside, orthographic bird's-eye, boxed island or page scroll**. Camera pose assertion + a focus interaction; save/reload baseline. Record actual SHA/run/artifact in STATUS. Not final art. |
| **02** | **Home transformation art bible + Nova**. Author one unmistakably worn/small cottage with roof/door/window/steps defects, a very bare garden, interior before/after, and a **beautiful but believable beat-10 finished home**; define 10 gradual intermediate looks, rig/GLB metadata, palette, child-eye-level cameras and visual cues. **Prototype a 3-step before→partial→better sequence before high-volume art.** | User approves before/after keyframes and one short interactive repair→scene-change phone clip; visual change is satisfying *but not instant palace*. Nova expressions, shaders/materials and accessibility review from start. |
| **03** | Modular Three `WorldHost3D`, terrain/sky/horizon, named 3D zones, physically plausible lighting/shadows, graphics settings, loading/error/retry and orientation/safe-area behavior. | Works in mobile viewport; no world edges or empty void; no frame clipping; keyboard/accessibility controls retained; automated screenshot reference. |
| **04** | **NovaActor3D** independent rig/GLB with idle/fly/turn/look/point/listen/speak cues, camera-aware placement and authored animation priority. | In-world eye-line and gestures follow current selected object; no vanishing/offscreen or distracting perpetual voice; authored/mock dialogue + subtitles and reduced motion pass. |
| **05** | **Progressive exterior repairs**: door panel/knob, window/shutters, roof segment, steps and optional sign, each a distinct tactile mini-action backed by small semantic part states and style choices. Not one-tap total house restoration. | CI verifies damaged→partial→repaired **different mesh states** and authored camera/Nova cues, style persistence, no accidental completion of later house sections. |
| **06** | **Gradual garden restoration**: small weed clearance, bed preparation, one seed/sprout, second plant family, pathways/trellis and safe non-punitive growth. Remain inside same yard with guided perspective placement. | At least 3 cumulative garden stages, 2 plant species + saved positions; changes never spontaneously decay or require daily watering; on-phone gardening action readable. |
| **07** | **Premiere visual/UX/performance gate**: polish scene composition, Nova, shading, particles/ambience, subtitles, readable HUD; test memory/frame time on at least one real phone if available. | Owner sees phone screenshots **and short camera-motion recording**; confirm it feels like *living in a world*, not a showroom. If quality fails, do not expand content; stay here. |

## Phase B — persistent building in spatial world (08–11)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **08** | Domain-owned **house part** repair-stage catalog and garden/interior placeable anchors: semantic IDs + damaged/work-in-progress/repaired/customized states and separate movable decor; stable world transforms. | Tests cover repair stage prerequisites, placement conflicts, incremental qualified advances and idempotency; snapshots use stable IDs, not meshes/pixels. |
| **09** | Versioned snapshot migrations, reload/return, pause/resume and recovery from interrupted camera transition; world, zone and camera focus reconstruction. | E2E create/modify/close/reopen and rotate viewport; same objects and Nova contextual greeting; no duplicate world events. |
| **10** | Starter cottage **interior rehabilitation**: guided door transition after porch/door milestone; dirty starter room → one repaired floor/wall → personalized rug/lamp → cozy window nook. No freely navigable multiroom home yet. | 3 distinct persistent room stages and child-chosen material/furniture variants; no premature polished room visible on beat 2; indoor/outdoor perspective remains grounded. |
| **11** | Garden & home **free-play toolkit**: existing unlocked plants/furniture can be moved and restyled, small variations without new habit reward; existing garden beds maintain separate plant life stages. | Child can play and rearrange even on a non-qualified day; chosen garden species/positions and room layout persist across reload; no manipulative idle damage. |

## Phase C — parent authority and habit progress (12–14)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **12** | Calm family onboarding/profile, parent owns 2–3 goals and trust/approval setting, mic consent default off; accessible child handoff into world. | Parent can configure without cluttering full-screen child world; test handoff/return to parent area. |
| **13** | Deterministic habit ledger, authorization + idempotent thresholds, pending approvals and resilient offline/local behavior. | Domain tests: pending/rejected never unlock, trust/approved once, retries no double rewards; audit relevant permissions. |
| **14** | Qualification unlocks **creative opportunities** (3D placeable or new path), presentation via authored sequence; no currency treadmill. | Approved real-life habit state enables one intended action; 3D world visibly changes, persists and restores without Nova/AI deciding. |

## Phase D — authored story and ten steps (15–19)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **15** | Typed **home renovation beat** schema: qualified habit unlock → one controlled repair/plant/interior progression, valid mini-actions, authored camera/Nova/FX, safe replay/skip; debug-jump from steps 1–10 and snapshot migration from S01 booleans. | New renovation beat is content-driven; no scene-specific day logic, no state duplication or instant full-house skip; mock parent/AI only. |
| **16** | **Beats 1–3:** arrival to weathered home/barren yard; first short pathway clearing, restore door, fix window + first prepared soil bed. | Child recognizes 3 cumulative *small* changes, knows unfinished repairs remain; first playtest probes desire to continue home transformation. |
| **17** | **Beats 4–6:** repair **one roof section**, plant first seed, repair porch steps, enter bare room and fix one wall/floor section. The garden grows to a small seedling. | Each beat physically visible and persistent; camera follows porch-to-door-to-interior at child's height; no tree mystery or creek quest preempting home. |
| **18** | **Beats 7–8:** create first cozy rug/lamp corner, plant a second different species, paint/curtain interior wall, add garden path/edging. Nova comments on **actual choices**. | At least 2 recognizable child-specific interior variations and two kinds of growing plants; no scripted fully finished scene. |
| **19** | **Beats 9–10:** child creates reading/craft nook and varied blooming garden, adds final small flourish; a **skippable home tour** shows personalized cottage + garden before/after, and only teases new path for Chapter 2 (11+). | At least 10 distinct cumulative semantic changes, before/after from true saved variants, coherent delightful starter home/garden; **no playable creek, bridge, Lumi or gate** within steps 1–10. |

## Phase E — polish, safety and production acceptance (20–25)

| Session | Deliverable | Acceptance evidence |
|---|---|---|
| **20** | Immersive authored reveals, lighting/audio/camera choreography, subtitle/haptic polish, motion reduction; optional short video only if demonstrably improves result. | Child may skip/leave/replay without progress rollback; no unskippable cinema; camera avoids nausea. |
| **21** | Extended **GitHub Actions 3D progression screenshots**: three mobile sizes and desktop at beat 1/3/5/7/10 across exterior, garden and first room, plus camera/Nova cues, cumulative meshes and refresh. | Every intermediate stage distinguishable, persistent and correctly gated; artifact+JSON on exact SHA and human visual/UX review. Do not substitute a fixed staged image. |
| **22** | Actual target device performance and accessibility audit: GPU memory, frame pacing, load time, thermal/battery observations, DPR/shadow/LOD fallback, RTL/voice-off/motion. | Document real phone models and measured results; budget findings and fixes, not theoretical claims. |
| **23** | Reliability/security: snapshot migrations, interrupted journey and authored reveal, unavailable assets/WebGL fallback, network offline, privacy data deletion and no secret leakage. | Automated recovery/contract tests + no corrupted placeables or duplicate rewards. |
| **24** | Parent-child supervised UX review and child-safe Nova mock conversation, consent and global-ready localization/accessibility review. | Logged behaviors/observations with consent, no raw private child conversation collection, top usability defects addressed. |
| **25** | **Home-first ten-beat release candidate:** delightful gradual exterior/garden/interior transformation with free-play and parent-qualified progress, real Three camera/Nova/save/QA, an **invitation** (not implemented mission) to outdoor chapter 11+. | Compare start→middle→finished house and diverse garden on real phone with supervised child test and owner art approval; explicit next-chapter backlog, no fake 100-day retention promises. |

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

Previous [v2](https://github.com/addvaluewithai-hub/kidshabits/blob/main/project/island-v2/SESSION_PLAN_25.md) remains in `main` during review; this **v3 home-first plan** becomes the source of truth only if the draft PR is accepted and merged. Session 01 stays complete; Session 02 objective becomes before/after home/garden art bible. We preserved [v1](./archive/SESSION_PLAN_25_V1_2026-10-23.md) for historical review. Session estimate is still 25 slots by choice, not an attempt to hide additional workload. If real modelling/device testing needs more, revise count explicitly in PR with evidence. No session is retrospectively marked complete because a prior experimental code PR passed.
