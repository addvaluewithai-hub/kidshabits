# KidsHabits — Immersive Living World Spec (v3)

**Decision:** 24 October 2026 · **Status:** approved product direction for the next code session; implementation and artistic quality still pending.
**Scope:** first 10 progression beats, child around 9, mobile portrait first. Read with [ADR_001_THREEJS_IMMERSIVE.md](./ADR_001_THREEJS_IMMERSIVE.md), [SESSION_PLAN_25.md](./SESSION_PLAN_25.md) and [STATUS.md](./STATUS.md).

## Core experience — "I'm INSIDE my world"

**Not:** floating island, miniature diorama, isometric camera, bird's-eye construction game, or a 3D picture in a card surrounded by dashboard panels.

**Yes:** a continuous, grounded, magical place extending to the horizon; the child looks **through a human-height perspective camera** at the house, garden, ancient tree, paths and surrounding nature. Nova floats near the child in that *same* space. Full-viewport render, subtle accessible overlays and cinematic but interactive exploration.

The initial fantasy is a **quiet clearing in a larger magical world**, not a floating land mass. The cottage needs repair; the tree holds a mystery; the garden can be planted. The scenery suggests more places beyond the playable clearing. On return, everything stays where the child left it.

### Opening 45–75 seconds (first playable proof)

1. **First meaningful pixels:** full-screen sky/terrain + distant tree canopy and light; no boxed island preview or framing UI.
2. Camera at a child's comfortable viewing height on a path facing the old cottage, with the garden and ancient tree visible in contextual depth; foliage in the foreground and scenery continuing beyond the interactable bounds.
3. Nova floats into the camera's field of view, turns toward the cottage and says a short authored Egyptian Arabic line with readable subtitles.
4. Child taps the cottage or garden hotspot in the world. Guided camera eases to a nearby eye-level composition; Nova moves/look-at the chosen object. One specific preview world change occurs with sound/visual feedback.
5. Child can choose the other place. No mandatory long cutscene, no forced joystick, no task completed in the real world during the demo.
6. Refresh/reopen: same restored door and planted flower, and a context-aware greeting from Nova.

**First choice should be available promptly** and never require listening to the entire opening. Audio may be off.

## Camera & navigation

### Initial mode: guided immersive exploration

- Use a **perspective** camera, not orthographic. Design baseline child-level eye height in logical world meters ~1.35–1.55m where character/house scale is consistent; tune on real phone and review, not hard-code everywhere.
- Normal walking/exploration shot **near-horizontal**, slightly downward only when composition needs it (typically ~0–10° down); never a view from above the roof/canopy. Avoid showing world bounds.
- FOV ~50–65° vertical as an initial test range; adjust for portrait frame, subject distance, distortion and safe-area overlays.
- Camera rigs and focus targets are authored **data** per named location: `arrival_path`, `cottage_front`, `garden_edge`, `tree_base`, `cottage_interior`, `creek_bank`.
- Tap a real world landmark or an accessible HTML counterpart → validate destination → smoothly move camera along a designed path (position, yaw, pitch, ease, duration) → show a clear interactive affordance.
- No free orbit, fly camera, top-down map, camera clipping through walls/trees, disorienting rapid cuts or movement behind inaccessible scenery.
- Prefer **tap-to-focus / guided walking-on-rails** initially. True 3rd-person walking (avatar, joystick, collision, navmesh and camera follow) is **not in the first 10-beat MVP** unless a supervised child test proves it essential.
- Transition can be skipped; reduced-motion uses cut/dissolve and stable focus; pointer capture/screen reader actions have parity.
- Camera should never override authoritative world state or leave Nova offscreen during dialogue.

### World structure

- A grounded continuous set of connected zones; an invisible navigable boundary is **not visually a cliff**. Beyond it: horizon, layered hills, distant vegetation, sky, fog and distant landmarks.
- **World coordinate system** defined once (Y up, meters or consistent units), with stable semantic anchors/world transforms: no saving screen pixels or viewport-dependent coordinates.
- Early zones: arrival path, cottage yard, garden patch, tree base; later interior corner, creek/bridge, gate hint. Reuse one shared world, load/unload content as necessary.
- Floor mesh/terrain collider; simple raycast interactions; bounded accessible destinations; depth-aware placement with no clipping, occlusion problems or inaccessible tap targets.
- World updates are durable; authored cinematics are temporary presentation, skippable/replayable without duplicating unlocks.

## Full-screen mobile UX

- Canvas occupies `100dvh` × viewport width, respects safe-area insets, orientation changes and minimum supported sizes.
- No sidebars, intro rail, framed thumbnail or permanent story panel over the scene. Parent controls separate from child-world.
- UI is **spatially aware and minimal**: compact upper brand/settings, tiny habit indicator (dismissible), subtitle near bottom with safe areas, context action/choice near selected object but not blocking it.
- Target size ≥44 CSS px for key actions; clear focus states/labels for screen readers, RTL-friendly copy, readable contrast against light/dark parts of world and text zoom.
- A child can identify what to tap without scavenger hunt; optional guided highlight, not spammy labels everywhere.
- No accidental scroll of the immersive canvas. Exit/settings/parent flow accessible and safe; browser/back behavior explicit.
- Reduced motion, mute, subtitle controls and configurable graphics quality are foundational, not later polish.

## Character & quality direction

- Nova is a **real in-world 3D actor**, physically coherent with the scene's lighting, depth, hover paths and eye-line; not a fixed DOM avatar or baked background. Dialogue may be in accessible HTML with actor performance controlled via semantic intent.
- Character performance needs idle, arrive, fly, turn, look, point, listen, delight, speak and rest, with animation blending and interruption rules (authored > essential UI > live > reactive > idle).
- Use reviewed **GLB/glTF assets** for character, cottage, trees, vegetation and props. Procedural primitives/rough test meshes remain technical placeholders and must be called that.
- Global premium bar: consistent modelling style, sculptural silhouette, intentional composition, lighting/color grading, materials, cast/contact shadows, tasteful ambient effects, sound and subtle microinteractions. Beauty cannot be automatically proven by green CI.
- Art styles are replaceable through world/character manifests, materials, palette and lighting presets without changing habit commands, progress facts, anchors or saved choice IDs. Dramatically changing camera language may legitimately need presentation-layer work.

## Technology & boundaries

```text
React app shell + accessible overlays (Arabic first)
       ↓ commands                             ↘ parent UX
Application layer → pure deterministic Domain → versioned persistence
       ↓ snapshots/events
WorldHost3D: React Three Fiber 9 + Three.js
       ├─ PerspectiveCameraDirector (locations, rails, cues)
       ├─ WorldTerrain + sky / distant scenery
       ├─ ZoneRegistry + semantic placement anchors
       ├─ Interactions / raycast + HTML fallback
       ├─ NovaActor + authored animation director
       └─ ArtPack / glTF loader / LOD / environment lighting
AI adapter: mock first, optional child-safe opt-in later; no progress authority
```

- Target versions from tested experiment: Three.js r186 and React Three Fiber 9; **revalidate versions/pins before coding**. Drei helpers only where needed; avoid heavyweight extras without value.
- Phaser PR #12 and Three/Phaser comparison PR #13 are **learning/reference prototypes**. Selectively reuse the renderer-independent domain/reducer, storage idea, Nova line content, tests and CI approach after review; **do not merge both rendering engines** into production.
- Start production from documentation-only `main` once reviewed plans align; no migration to a massive experimental branch by default. Product code PR needs one renderer (Three).
- Model loading must have graceful fallbacks, visible error boundaries and retry; never ship API keys or child conversations in assets or client logs.

## Real tests and acceptance

| Gate | Needed demonstration |
|---|---|
| Full-screen framing | screenshots at 390×844, 360×740, 1280×800: scene reaches all edges, no framed artwork, parent dashboard panels or unwanted scroll |
| Grounded eye-level camera | inspect debug camera pose + actual screenshots: perspective projection, no visible island underside, not isometric / top-down; landmarks readable |
| Actual 3D draw | WebGL context exists, nonblank pixel proof **within rendered canvas** plus visible real mesh landmark |
| Guided moves | tap/keyboard activate cottage and garden; camera reaches deterministic focus rigs without clipping/rapid jumps; Nova looks at correct target |
| World mutation | door and garden materially change **3D meshes/materials**, not only DOM labels; screenshot before/after confirms |
| Durability | saved semantic state identical after reload and viewport change, Nova acknowledges saved choices |
| Quality | screenshot and short clip human-reviewed for legibility, magic, emotion, model quality and polish; nothing labelled "final" if placeholder |
| Performance | measure real mobile frame pacing, initial load, GPU/device memory and fallback; headless Chrome is *not* phone hardware proof |
| Accessibility/safety | subtitles, no sound, reduced motion, RTL, focus/target controls, no habit shame, no unapproved AI |

## Explicitly not in first session

10 fully polished days, complex interiors, free-roam third-person controller, full physics engine, physics-heavy vegetation, multiplayer, social features, production live AI or parent habits. The first coding session creates a truthful **full-screen immersive world with one meaningful camera journey** and tests, not a giant empty engine scaffold.

## Decision checklist for every PR

1. Does the child feel **inside** a place rather than looking at a model?
2. Is the camera physically plausible and forgiving on a portrait phone?
3. Are Nova, house, terrain and garden coherent in real 3D?
4. Can style and content change without rewriting the domain?
5. Can the action be tested via built-app screenshot plus behavior assertion?
6. Does the design meet a global-quality **direction** from the first code slice, with visible quality debts honestly logged?
