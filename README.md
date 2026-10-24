# KidsHabits — A Magical World That Grows With You

**Current production direction (24 October 2026):** **full-screen grounded immersive Three.js world**, viewed through a child-height perspective camera. This is **not** a top-down/floating island, a boxed game preview, or a rigid 30-day story slideshow.

The child (design focus: around nine) enters a magical clearing by an old cottage, garden and ancient tree, accompanied by in-world 3D character **Nova**. Real-life habits unlock new **creative possibilities** in a persistent space the child can personalize. Returning to play is allowed even without a new achievement; there is no guilt or punishment for absence.

The experience is **inside** the world: guided ground-level camera movement to house, garden, tree, rooms and eventually creek/bridge, with full-screen 3D graphics, thoughtful atmosphere and only small accessible Arabic-first HUD/captions. Free-roaming third-person/avatar controls are an **option for later testing**, not first-slice scope.

## Start here

- **[الخطة بالعربي](./project/island-v2/PLAN_AR.md)** — المنتج وطريقة البناء وأول 10 خطوات.
- **[STATUS / أين وقفنا](./project/island-v2/STATUS.md)** — live session and evidence tracking.
- **[Updated 25-session plan](./project/island-v2/SESSION_PLAN_25.md)** — deliverables and quality gates.
- **[Immersive camera & full-screen world spec](./project/island-v2/IMMERSIVE_WORLD_SPEC.md)** — what the child should actually see.
- **[ADR-001 Three.js direction](./project/island-v2/ADR_001_THREEJS_IMMERSIVE.md)** — engine choice and scope tradeoffs.
- **[Product vision](./project/PRODUCT_VISION.md)** · **[Engineering rules](./project/island-v2/ENGINEERING_STANDARDS.md)** · **[CI and screenshot proof](./project/island-v2/CI_AND_VISUAL_QA.md)**.

## Run the immersive app (Session 01)

Requires Node 22.18+ / npm. From the implementation branch:

```bash
npm install
npm run dev        # local development, Vite
npm run check      # architecture guard + Vitest + typecheck + production build
npm run preview    # after build: production Vite preview
```

The child world is a **full-screen Three.js experience** with an arrival-path camera and focus actions for cottage and garden. Local progress is saved under a versioned key and restored on reload. No parental verification or production AI voice is part of this first session.

GitHub Actions runs `plan-validation` plus `production-visual-proof` from the actual Vite build on Chrome, captures phone/desktop screenshots and verifies live camera/scene changes. Headless Chrome success is **not** real mobile GPU/FPS validation.

## Technical architecture at a glance

- **React + TypeScript** for app shell and accessible child/parent UI.
- **Three.js + React Three Fiber** for one immersive perspective world renderer.
- Renderer-independent deterministic `domain/` and `application/` for habits, placement, unlocks, choices and safe snapshots.
- **WorldHost3D** contains perspective camera director, terrain/horizon, 3D assets, NovaActor, zone/interactable modules.
- Visual changes are driven by art packs and real GLB/model/material states, not baked into persisted data.
- Authored story/camera/actor beats, optional bounded AI conversation **later**, with parent permission and strict child safety.
- Responsive mobile portrait, RTL and accessibility, mute/reduced motion, performance, security/privacy and source-quality boundaries from **Session 01**, not an afterthought.

## Current repository / experiments

The initial source baseline was documentation-only. Session 01 code is implemented on [PR #16](https://github.com/addvaluewithai-hub/kidshabits/pull/16). Old [Phaser clean spike PR #12](https://github.com/addvaluewithai-hub/kidshabits/pull/12) and [Three diorama comparison PR #13](https://github.com/addvaluewithai-hub/kidshabits/pull/13) passed their own CI but **do not implement the current lived-in full-screen world**; preserve them as reference, never merge both renderers as production.

After the planning PR is reviewed, **Session 01 starts a focused clean implementation branch** for a 100dvh grounded world, perspective `arrival_path → cottage_front` move, Nova in the same 3D space, accessible interaction and true screenshot evidence. [Current STATUS](./project/island-v2/STATUS.md) remains 0/25 until that new scene passes review.

**All PRs:** narrow and modular, tests + screenshot artifacts + honest quality critique. No rigid file-length hard limits; no domain/renderer or AI/child-safety violations. Global-level craft is the direction but not yet a completed claim.

## Historical references

The [previous Phaser/30-day product vision](./project/archive/PRODUCT_VISION_PHASER_V1.md), [architecture proposal](./project/ARCHITECTURE_PROPOSAL.md) and [Phaser skill catalog](./project/skills/phaser/CATALOG.md) remain useful history only, superseded for new engine, story schedule and perspective assumptions.
