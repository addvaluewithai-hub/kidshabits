# Technical Contracts — Immersive Three.js World

**Updated:** 24 October 2026 · **Normative for production** under [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md). Previous Phaser WorldHost contract is superseded; pure domain/parent safety principles survive.

## System boundaries

```text
React mobile/parent shell
 ├─ parent onboarding, verification, permissions
 └─ accessible minimal full-screen HUD (subtitle, settings, focus controls)
         │ user commands
         ▼
Application use cases + deterministic Domain
 ├─ world/placement anchor catalog + rules
 ├─ habits, parent approval, progress unlock service
 ├─ discovered story facts and authored sequence
 └─ Nova-safe allow-listed context
         │ validated snapshot/events
         ▼
WorldHost3D (R3F / Three.js; no authoritative mutation)
 ├─ PerspectiveCameraDirector / CameraRigCatalog / rail transitions
 ├─ TerrainHorizon / ZoneRegistry / ZoneLoader
 ├─ PlaceableRenderer / RaycastInput / DOM control parity
 ├─ NovaActor3D / animation director / authored sequences
 ├─ ArtPack / glTF loader / shaders/materials/lighting
 └─ sound / atmospheric cues / performance profiles
         ↕
Infrastructure adapters: storage / mock AI / optional live AI / mobile services
```

**Critical dependency rule:** `domain/` has no Three, R3F, React, DOM, browser storage, audio or AI SDK import. `world-three/` renders only; `application/` validates commands and writes state. `app/` composes overlays and feature access. `content/` data never imports scene code.

## Contracts (illustrative typed boundaries)

```ts
type ZoneId = 'arrival' | 'cottage_yard' | 'garden' | 'tree_base' | 'cottage_interior' | 'creek';
type CameraRigId =
  | 'arrival_path' | 'cottage_front' | 'garden_edge'
  | 'tree_base' | 'cottage_interior' | 'creek_bank';
type ActorIntent = 'idle' | 'fly' | 'look' | 'point' | 'listen' | 'speak' | 'delighted';

interface CameraRigDefinition {
  id: CameraRigId;
  position: [number,number,number]; // world coordinates, ground-level
  target: [number,number,number];
  fov: number;
  transition: { durationMs: number; easingId: string };
  safeFallback?: CameraRigId;
}

interface Placeable {
  instanceId: string; itemId: string; anchorId: string;
  variantId: string; stateId: string;
}
interface WorldSnapshot {
  schemaVersion: number; worldId: string; worldName: string;
  currentZone: ZoneId;
  placed: Placeable[]; discoveredFacts: string[];
  choices: Record<string,string>;
  unlockedContentIds: string[];
  completedBeatIds: string[];
  pendingSequenceId?: string;
  companionId: string;
}

interface WorldArtPack {
  id: string; modelByItemId: Record<string,string>; // GLB paths by semantic ID
  materialVariants: Record<string,string>;
  animationByIntent: Record<ActorIntent,string>;
  environmentPresetId: string;
}

interface WorldDirector {
  goToRig(id: CameraRigId): Promise<void>; // animation only, no domain commit
  showAuthoredSequence(id: string): Promise<'complete'|'skipped'>;
  setCompanionIntent(intent: ActorIntent, targetId?: string): void;
}
```

**Store world semantics, not Three references:** save stable zone/object/anchor IDs and choices; never save `Mesh.uuid`, scene graph paths or screen pixel coords. The camera rig definition is content and can evolve without invalidating saved story progress. A gentle current focus ID can be persisted if needed; default return focus should be stable and safe.

## Perspective camera director contract

- `PerspectiveCamera` with designed human/child-height rigs; no orthographic camera in production.
- Moving between rigs is a presentation command with cancellation policy: new focus cancels/supersedes old; no camera stuck mid-path. Constrain yaw/pitch/velocity/transition times; handle reduced-motion instantly or via fade.
- One central camera director, not each interactive object mutating `camera.position` independently.
- Avoid occlusion/clipping; optional raycast from camera to target can inform fade/alternative rig on a valid destination.
- Camera targets and Nova reaction share semantic selected object ID, but companion choreography and domain commands remain separate.
- Debug mode exposes *read-only* camera mode, rig ID, pose and settled transition to E2E tests. No camera debugging UI in child production.
- Viewport changes recompute view/camera composition without moving stored object anchors.

## Grounded world and 3D content

- Consistent world units; horizon/sky/terrain continue beyond accessible zone; collision/nav bounds invisible to child, not a floating rock rim.
- Use validated glTF/GLB model registry with consistent scale, pivot, draw groups, casts/receives shadow, animation names and LOD/quality variants.
- Raycast interactive objects by stable semantic IDs, never mesh children as domain identity. Offer accessible DOM controls in addition to canvas pick.
- Loading/failure states preserve input safety, provide fallback and don't corrupt world state.
- Art/style changes must preserve semantic anchors and domain snapshots. Different camera language may need scene-specific asset adjustments, not habit logic changes.
- Prior experiment's procedural shapes are allowed as placeholders for **Session 01 engineering**, labelled honestly; accepted premium art requires explicit review.

## Domain/application commands

| Command | Authority | Result |
|---|---|---|
| `FocusLocation` | UI/application validates accessible location; **camera only** | camera rig / Nova reaction cue |
| `PlaceItem` | domain validates unlock, supported anchor and collisions | save semantic placement, rerender 3D |
| `ChangeItemVariant` | domain validates allowed variant | save, renderer swaps mesh/material |
| `SubmitHabit` | child's policy; trust or pending approval | ledger event only until qualified |
| `ApproveHabit` | parent-only | verified ledger transition |
| `QualifyProgress` | deterministic domain, idempotent | unlock authored option / world event |
| `CommitStoryChoice` | domain, persistent | permanent branch flag and selected placement |
| `Queue/CompleteSequence` | domain/state then authored director | safely replay/skip without duplicate outcome |

**Sequence ordering:** validate + commit state transaction → persist pending sequence → perform camera/Nova/audio/FX → mark played. Recover after backgrounding or reload and skip safely. Story content is declarative, not scene classes with day-specific branches.

## Companion boundary

- Nova always a world-space actor with target anchors, performance director, gesture/face animation and visibility/camera awareness.
- Priority: authored reveal > safety/accessibility message > explicit child request / bounded live conversation > reactive > idle.
- Core authored responses about installed content; optional live model gets **only known facts and allow-listed fields**, semantic actions restricted to safe `look_at`, `move_to_safe_anchor`, `gesture`, `speak`.
- AI cannot mutate world, verify habits, reveal unseen plot, call the child without parent rules, or retain raw private transcripts by default.
- Mock provider and subtitle-only game work with internet/offline audio disabled.

## Test seam and release gates

- Domain units for placements, unlock threshold, approval, retries, branches, persistence migrations.
- Content validation for camera rig names, coordinates, item models/material variants and actor animation names.
- E2E on **built 3D**: screenshot on phone/desktop; require real WebGL2 canvas with meaningful pixels **and** camera mode `perspective`/rig movement/visible landmark + saved world change, no `100dvh` overflow.
- Screenshots must be reviewed for eye level, world continuity, composition, Nova physical presence, texts and touch affordances. A CSS background screenshot alone never passes.
- Real phone performance, heat, memory and input latency are a separate required gate before family alpha.

## Proposed minimal implementation folders (create only as used)

```text
src/
 app/                     # React shell, minimal HUD + parent UI
 application/             # commands, domain orchestration + ports
 domain/                  # pure rules, schema and state
 world-three/
   WorldHost3D.tsx        # Canvas lifecycle, fallback
   camera/                # PerspectiveCameraDirector, authored rigs
   environment/           # terrain, horizon, sky, weather presets
   zones/                 # connected zones / spatial anchors
   actors/                # Nova actor and animation director
   interactables/         # raycast, focus cues, placement visuals
   assets/                # glTF & art packs
 content/                 # story beats / item definitions / lines
 infrastructure/          # save adapter, mock/live AI later
 media/                   # authored sequences/audio
 styles/                  # HUD tokens, themes, safe areas
tests/                    # unit, integration, browser, visual
```

**Do not create empty abstractions for future features.** First coding session produces a real lived-in world screenshot and one genuine camera interaction, not a framework demo.
