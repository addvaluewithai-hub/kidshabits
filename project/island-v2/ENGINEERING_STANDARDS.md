# KidsHabits — Engineering & World-Class Quality Standards

**Normative:** 24 October 2026 · Three.js full-screen grounded world. Read [World spec](./IMMERSIVE_WORLD_SPEC.md), [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md), [25 sessions](./SESSION_PLAN_25.md) and [STATUS](./STATUS.md).

## Principles

1. **One concern per module; no file-count fetish.** Code cohesion and obvious responsibility first. Aim for compact components; modules of >220 lines warrant nonblocking review; >350 lines stronger advisory only. **No hard LOC limit or CI failure solely for a long file.**
2. **Pure domain:** real habits, approvals, unlocks, object IDs, placement, story flags and persistence schemas know nothing about React, Three, R3F, browser storage or AI APIs.
3. **World renders state:** Three.js R3F components own geometry/camera/motion and relay semantic UI commands; they do not mutate habit authority or saved game truth directly.
4. **Camera gets its own system:** a single `PerspectiveCameraDirector` with authored `CameraRigDefinition` catalog and safe transitions. Not arbitrary camera mutations sprinkled in house/tree/Nova files.
5. **Assets are swappable:** GLB models, textures, colors, character rig/animation names, lighting and SFX come from manifests; safe migrations protect stored semantic IDs/anchors.
6. **Small-but-real vertical slices:** no empty framework scaffold or mock screenshots passed off as product. Build a visible, touchable immersive world first.
7. **Art quality and UX are foundational:** every feature reviews visual hierarchy, camera choreography, touch feedback, age fit, sound/subtitles, RTL/English readiness, graceful failure, performance and accessibility. Don't wait for final polish sessions.
8. **Child safety:** parent owns habit authority and consent, AI never advances story/habits, no addictive pressure or conditional affection.

## Dependency direction

```text
app/ (React child HUD and parent forms)              world-three/ (R3F presentation)
                 \                                      /
                  → application/ (commands, ports) ←
                                   ↓
                          domain/ (pure state/rules)
                                   ↑
                    infrastructure/ (storage, AI)
content/ is validated data, imported by application or presentation as needed
```

- Domain never imports `three`, `@react-three/fiber`, `@react-three/drei`, React, `app/`, `world-three/`, DOM, browser storage or provider SDK.
- App/scene communicate through typed commands and immutable snapshots/events.
- Application authorizes player actions. World rendering reacts only to authorized results.
- Nova live AI adapters return **bounded semantic intents**, no direct scene execution or unlock commands.
- Component reuse is earned: a small house object can own its mesh, not parent verification.

## Target layout — create on demand, no empty directory farm

```text
src/
  app/
    App.tsx               # composition; 100dvh fullscreen child-world layout
    child/                # accessible minimal HUD, subtitles, focus controls
    parent/               # habit configuration and approval
  application/            # command/use case handlers, ports and event projection
  domain/                 # pure world/habit/choice/discovery rules
  world-three/
    WorldHost3D.tsx       # Canvas lifecycle, fallback, DPR
    camera/               # named perspective rigs and transitions
    environment/          # grounded terrain, horizon, lighting, sky
    zones/                # connected zone definitions, nav boundaries
    interactables/        # raycasts and semantic anchor display
    actors/               # Nova3D and other companion animation performers
    assets/               # model/texture registry and art pack resolver
  media/                  # authored 3D sequences, voice and SFX
  content/                # beats, authored lines, safe zone/object/camera catalogs
  infrastructure/         # versioned local storage; later safe AI provider
  styles/                 # HUD tokens, RTL/LTR, safe areas, motion controls
tests/                    # domain, contracts, actual-browser E2E, visual
```

## World design must survive an art refresh

- Logical placeable: `{itemId, anchorId, variantId, stateId}`, not GLB file paths or meshes.
- Camera data: `{rigId, position, target, fov, transition}` resolved in renderer; content controls safe moves, no world-state authority.
- World assets: `{artPackId, modelManifest, materialVariants, characterRig, lightingPreset}` with required IDs verified by validator.
- Changing the style from soft storybook to polished 3D stylization must not rewrite child choices, habit ledger, story facts or placements.
- A major changed perspective may require deliberate asset/camera updates, but never new habit rules.
- Don't use one giant skybox image containing house/Nova/furniture: scene elements must truly change spatially.

## React Three Fiber performance and correctness

- Use Three's render loop and `useFrame` for motion (delta based), avoid React state updates 60 times/second.
- Camera transitions must be interruptible, deterministic to tested end pose and honor `prefers-reduced-motion`.
- Dispose geometries/textures/listeners on unload. Avoid unnecessary per-frame allocations, duplicated renderers and remounting Canvas for every focus tap.
- Ship model glTF/GLB with well-defined origin, scale, low-medium geometry budget, texture formats, optional LOD/instance groups and validation of provenance/licenses.
- Lighting/shadows/texture resolution and DPR are quality tiers tuned against real devices, not desktop screenshots only.
- Real terrain/horizon prevents exposing ground plane end; environment loading failures get a deliberate fallback/repair UI, never a black screen.

## Global UI/UX acceptance

- Canvas truly fills viewport; not a bordered illustration, framed device or dashboard.
- Child can interact through accessible labeled controls and 3D hit targets, with minimum ~44 CSS px actionable target and good feedback.
- HUD may be concealed/contextual; captions always readable against variable bright/dark world; no permanent text slab obscuring the house/Nova.
- Arabic-first natural wording, RTL typography, adaptable to LTR; no tiny fonts, text clipping or overlap near safe area.
- No scroll on 360×740 or 390×844, keyboard focus works, back/exit/parent handoff is clear.
- Ambient motion without sickness; mute and reduced motion both work; controls responsive, loading and failures comprehensible.
- Motion/transitions not blocking real habit confirmation; user can skip cinematics.

## Tests and PR review

**Static/build:** TypeScript, unit domain, content validation, import-boundary check; size scan advisory only.

**Browser:** Render actual production built R3F app in Chrome; real WebGL context and sampled nonblank canvas pixels; assert perspective camera, grounded focus rig, DOM viewport dimensions/no overflow, actual mesh state and Nova reaction; test refresh and multiple viewport dimensions.

**Manual:** Review screenshots at phone size and a **recorded or observed moving camera** for emotional quality; mark art debt honestly; run real phone GPU/frame-time validation before claiming flagship performance. A screenshot cannot certify animation or camera nausea.

**Merge gate:** PR references session, tested exact SHA/run and artifact. STATUS receives evidence and owner decision. No auto-advance on green CI alone.

## Prior experiments and skills

- PR #12 established domain/storage ideas in Phaser; PR #13 established Three/R3F WebGL and screenshot tests. **Reference only; no bulk merge or shipping two renderers**.
- Follow [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills), reading relevant current `SKILL.md` before implementing geometry, lighting, R3F, camera, input, animation or optimization; verify installed API versions.

**Reject in review:** giant single `App.tsx` driving camera + habits + save + chat; scene-specific hard-coded ten days; world-state saved in WebGL objects; invisible hotspots as fake progress; fixed art into progress IDs; API keys in browser; and overconfident 'production-ready' claims from CI-only evidence.
