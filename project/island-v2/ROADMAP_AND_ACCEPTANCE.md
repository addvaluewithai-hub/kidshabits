# Milestones & Acceptance — Immersive Three.js World

**Updated:** 24 October 2026. Full 25-session one-row-per-session plan is [SESSION_PLAN_25.md](./SESSION_PLAN_25.md) **v2**; this document is the milestone-level companion, not a second conflicting calendar. Canonical direction: [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md) and [World spec](./IMMERSIVE_WORLD_SPEC.md).

## Production rule

A playable **full-screen, eye-level, grounded and cinematic** world matters more than an impressive floating miniature. Global art/UI/UX quality is reviewed **in every milestone**. One issue → branch → PR → built-app tests/screenshots/recording → manual review → STATUS update → accepted next slice. Production source starts clean from docs-only `main`, selectively using reviewed state/Three lessons from PR #12/#13; no wholesale merge.

| Milestone | Sessions | Proof / gate |
|---|---|---|
| A. Truly immersive world + Nova | **01–07** | Perspective ground-level full screen, horizon/terrain/house/garden/tree, guided focus, Nova in scene, two real visible actions, mobile/desktop camera screenshots and owner visual approval |
| B. Child ownership / building | **08–11** | Stable 3D anchors, choice + material/mesh change, camera visit to cottage interior, persistent garden, save/reload and no-habit free-play |
| C. Family habits → unlock | **12–14** | Calm parent UX, trust/approval policy, idempotent progress and 3D building/discovery opportunities, no currency/punishment |
| D. Ten story/build beats | **15–19** | Content-driven authored cues, ten meaningful changes in **one connected world**, tree/seed/Lumi/creek/gate, skippable interrupt-safe cinematics and debug jump |
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

Arrival path → choose cottage or garden → first repair → first planting → starter interior → tree symbol → seed branch → Lumi visits → its nook/path → creek bridge → gate hint. All within a **grounded connected world**; no ten isolated screenshots. Detailed authored beats in [FIRST_10_DAYS.md](./FIRST_10_DAYS.md).

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
5. Keep 0/25 until new immersive Session 01 meets gates and owner approves; then update it once.
6. Change session count transparently via reviewed PR, preserving archived v1.

## First post-plan code PR

**Session 01:** clean Three app: full-screen grounded clearing and one safe `arrival_path → cottage_front` perspective journey, Nova in world and two semantic choices with persistence, CI eye-level WebGL screenshot evidence. No parent/backend/AI voice complexity yet. [Exact breakdown](./SESSION_PLAN_25.md).
