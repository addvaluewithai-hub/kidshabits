# Milestones & Acceptance — Immersive Three.js World

**Updated:** 24 October 2026. Full 25-session one-row-per-session plan is [SESSION_PLAN_25.md](./SESSION_PLAN_25.md) **v3 (home-first proposal)**; this document is the milestone-level companion, not a second conflicting calendar. Canonical direction: [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md) and [World spec](./IMMERSIVE_WORLD_SPEC.md).

**Review proposal:** first ten progress beats should gradually renovate the same cottage, barren garden and starter interior. Read [RFC-002](./HOME_AND_GARDEN_FIRST_10_RFC.md); this version does not become canonical until the PR is accepted.

## Production rule

A playable **full-screen, eye-level, grounded and cinematic** world matters more than an impressive floating miniature. Global art/UI/UX quality is reviewed **in every milestone**. One issue → branch → PR → built-app tests/screenshots/recording → manual review → STATUS update → accepted next slice. Production source starts clean from docs-only `main`, selectively using reviewed state/Three lessons from PR #12/#13; no wholesale merge.

| Milestone | Sessions | Proof / gate |
|---|---|---|
| A. Truly immersive world + Nova | **01–07** | Perspective ground-level full screen, horizon/terrain/house/garden/tree, guided focus, Nova in scene, two real visible actions, mobile/desktop camera screenshots and owner visual approval |
| B. Child ownership / building | **08–11** | Stable 3D anchors, choice + material/mesh change, camera visit to cottage interior, persistent garden, save/reload and no-habit free-play |
| C. Family habits → unlock | **12–14** | Calm parent UX, trust/approval policy, idempotent progress and 3D building/discovery opportunities, no currency/punishment |
| D. Ten story/build beats | **15–19** | Content-driven authored cues, ten **cumulative small renovations** of one cottage exterior, bare garden and first interior room; outdoor adventure after beat 10, skippable interrupt-safe cinematics and debug jump |
| E. Production hardening | **20–25** | Sound, subtitle/camera/accessibility polish; extended browser/phone tests, child-supervised testing, error/offline/privacy/recovery, owner launch-quality sign-off |

## Slice 0 / Sessions 01–07 acceptance

- Canvas fills real viewport (100dvh and safe-area-aware). No large permanent panels, framing/bezel or scrolling.
- Natural ground continues to horizon. The house, garden, tree and surroundings have **real perceived size** relative to child view; no floating land mass shown.
- Perspective camera at a designed human-height rig, not orthographic/top-down. Selected building or garden guides camera *along path*, not teleport to overhead map.
- Nova appears and reacts **inside world**, with child-visible gesture/gaze rather than a pasted label.
- House and garden changes occur in meshes/materials and persist. Scene is state projection, not authoritative business logic.
- Two reactions, subtle sound or subtitles, loading/fallback, mute, reduced motion, RTL and touch affordances supported from first slice.
- CI checks true WebGL rendered pixels, camera rig, object changes and reload at 360/390 phone plus desktop; screenshot review and a short moving-camera capture required.
- Real-device performance observed when possible before pushing ten days. No false flagship quality claims from procedural placeholders.

## Child experience arc (not compulsory calendar dates)

Arrival path and **still-broken cottage** → tidy a little path → repair door → window → one roof section + first seed → porch steps → enter and repair starter room → rug/lamp/furniture → paint/curtains/second bed → cozy nook/diverse flowers → personalized **home-and-garden showcase**. **Only after beat 10** do tree/creek/Lumi/gate adventures begin (Chapter 2). All in the same grounded connected world; no ten separate screenshots. Detailed authored beats in [FIRST_10_DAYS.md](./FIRST_10_DAYS.md).

## Deterministic / child safety gate

Parent grants/approves habits under a clear policy. Progress unlocks possibilities not currency. No guilt for missed days or attachment manipulation by Nova. AI conversation optional and safety/consent-gated, **never** unlocks or spoils content. Raw child transcripts not durable by default. Parent can mute/delete data and return to parent controls.

## Definition of production-ready

A feature isn't done when a build compiles. It must be discoverable and delightful on real phone, 3D scene responsive, camera physically coherent, Nova readable and context-aware, objects saved, multilingual/RTL accessible, performance measured, visual output inspected and known deficits recorded. A feature's aesthetic quality requires explicit human approval, not just a green Action status.

## Out of scope until validated

Free-roaming avatar with joystick/complex collisions, huge continuous streaming world, multiplayer/social child chat, 30 authored videos, production Live AI voice/calls without separate parental and safety approval, paid decorations, procedural unlimited quests.

## GitHub session workflow

1. Review [STATUS.md](./STATUS.md): no double counting PR #12/#13 as immersive Session 01.
2. Read current [ADR](./ADR_001_THREEJS_IMMERSIVE.md) and [World spec](./IMMERSIVE_WORLD_SPEC.md).
3. Implement a narrow user-visible interaction/scene improvement on focused code branch; keep pure domain + art theme separation.
4. Submit code, tests, built-app screenshots and an honest art/UX critique in PR.
5. **Session 01 already accepted: 1/25.** Do not reset or recategorize it. The home-first product changes apply to future sessions and become canonical only on PR approval.
6. Change session count transparently via reviewed PR, preserving archived v1.

## First post-plan code PR

**Session 01 (already completed in PR #16):** clean Three app: full-screen grounded clearing and one safe `arrival_path → cottage_front` perspective journey, Nova in world and two semantic choices with persistence, CI eye-level WebGL screenshot evidence. No parent/backend/AI voice complexity yet. [Exact breakdown](./SESSION_PLAN_25.md).
