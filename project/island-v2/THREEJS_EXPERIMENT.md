# Three.js vs Phaser 4 — visual production spike

**Started:** 2026-10-23. **Status:** experimental, not approved for production engine migration.  
**Upstream skills:** https://github.com/cloudai-x/threejs-skills (MIT). Read `threejs-fundamentals`, `threejs-react-three-fiber`, `threejs-lighting`, `threejs-materials`, `threejs-geometry`, `threejs-animation`, `threejs-performance` and `threejs-interaction`. Skills target three r186, fiber 9.8 and drei 10.7. No skill source copied into KidsHabits; linked as technical reference.

## Why

Island v2 is now a tactile 3D-capable builder rather than thirty static cutscenes. Test whether a real 3D diorama improves:
1. perceived depth, lighting, dynamic construction and character life;
2. child-friendly usability and clarity on portrait mobile;
3. ability to restyle a whole island without touching deterministic habits/world state;
4. performance, bundle size and production complexity.

**Don't decide on hype.** A failed/less polished 3D spike means retain Phaser and improve authored illustration.

## Implementation

- Independent branch derived from Session 01 draft PR #12, no changes to `main`.
- **Two real runtime engines in the same app** selected with URLs:
  - `/?engine=three` — React Three Fiber 9.8, three 0.186.1; 3D diorama.
  - `/?engine=phaser` — existing Phaser 4 vector-layer scene unchanged.
- Same `src/domain/island/model.ts`, same `src/application/islandController.ts`, same saved localStorage, same authored Nova dialogue and accessible UI buttons.
- Three world modules kept distinct: `src/world-three/scene`, `objects`, `actors`, `style`.
- True 3D geometry for terrain/rock underside, cottage with walls/roof/windows/door, ancient tree, garden flower and Nova with wings/facial expression.
- Warm key light and cool fill, shadow-casting meshes, 3D materials and contextual animation with `useFrame`; camera is intentionally **fixed-angle diorama** rather than heavy free-roam.
- Raycast touch to house/soil calls the same application commands as labeled HTML controls; HTML remains keyboard/screen-reader path.
- Scene palette is renderer-only and replaceable; saved state refers to semantic cottage/garden flags only.
- Reduced motion short-circuits character motion; don't collect child data or call AI.

## Quality guard

**Both engines must pass on the same code commit:**
1. TypeScript + Vite build and Vitest unit tests.
2. Browser Chrome screenshot tests on 390×844 and 1280×800.
3. Test interactive house and garden, Nova focus, reload restored state and return-aware dialogue.
4. Verify real WebGL2 context for the Three canvas and check rendered pixels have non-trivial color variation. This catches blank canvas accidentally hidden beneath a CSS gradient.
5. Upload eight initial/cottage/garden/reload screenshots **per engine** (16 total) and a `ci-result.json`; inspect actual artifacts manually.
6. Verify performance on actual representative phones separately. A headless Linux screenshot does **not** prove mobile FPS, battery, memory or worldwide launch quality.

## Decision rubric

| Area | Phaser reference | Three experiment | How evaluated |
|---|---|---|---|
| Visual quality | illustrated layered 2D | modeled 3D with physical depth | blind side-by-side phone screenshot review |
| Nova continuity | authored 2D actor | 3D hovering character with independent performance | animated screen recording + look direction |
| World ownership | DOM hotspot and saved choices | real 3D meshes and saved choices | click, reload and check outcome |
| Asset/style swapping | layered 2D art manifest | palette/material/mesh definitions | alter skin while keeping domain snapshot |
| Runtime | Phaser Vite build | code-split R3F/WebGL | measure bundle, startup and hardware FPS |
| Accessibility | accessible DOM hotspots | DOM hotspots plus raycast | keyboard, captions, screen reader/mute test |
| Future scale | sprite variants | models, animation rigs, environments | asset pipeline cost and effort |

**Production decision pending visual and device evidence.** This is an actual interactive prototype but **the procedural models are not the promised premium final assets**; if convincing, next invest in authored GLB models, high-quality character rig, environment maps, baked lighting where sensible and a polished art bible.

## Things not part of this spike

Real habits/parents, live AI voice, animated story cinematics, interior rooms, 10-day content, real phone performance profiling or finished game-ready illustration. The experiment is a technical/art-direction decision inside Session 01; we must not auto-advance the 25-session roadmap.

## Art critique question

Does the 3D diorama actually feel warmer, more alive and more customizable than the 2D scene on a small phone? Would you choose it even if it requires a stronger 3D asset pipeline? Record the answer before switching production.
