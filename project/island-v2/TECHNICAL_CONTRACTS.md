# Technical contracts — Island v2 (implementation guide)

**Status:** proposed interface boundaries, not implemented code. Build the smallest real slice first. Architecture should accommodate 30+ days or non-linear progression without shipping all of it now.

## 1. System boundaries

```text
Parent / app shell (React + mobile wrapper)
    │ profiles, habit setup, approval, mic consent, accessibility
    ▼
Application domain (TypeScript, deterministic)
    │ commands + validated events; state & persistence
    ├── Habit service + Progress/Unlock service
    ├── Island state + placement validation
    ├── Discovery and authored-sequence service
    └── Companion context projection + safe memory
         │                  │
         ▼                  ▼
Phaser 4 WorldHost      AI provider adapter (mock first)
scene/world render      only bounded natural conversation
+ Nova actor runtime    + safe high-level performance intents
         │
p5 offscreen artwork generator / optimized texture pipeline (optional)
media/voice/audio director (authored; separate from AI)
```

The visual engine is **a projection of domain state**. React/mobile overlays own forms, permissions, habit cards and explicit accessibility flows. A re-created world scene reconstructs exactly from a snapshot.

**Implementation discipline:** read the repository Phaser skill catalog before relevant coding; v2 should not become a rewrite just to accommodate new effects.

## 2. Durable minimal state (draft)

```ts
type AnchorId = string;
type ItemId = string;
type ProgressBeatId = string;

interface ChildWorldSnapshot {
  schemaVersion: number;
  islandId: string;
  islandName: string;
  currentZone: 'clearing' | 'cottage_room' | 'creek';
  items: Array<{
    instanceId: string; assetId: string; anchorId: AnchorId;
    variant?: string; state: string;
  }>;
  flags: Record<string, boolean>;
  choices: {
    firstFocus?: 'cottage' | 'garden';
    seedPlacement?: 'cottage' | 'creek';
  };
  visitorIds: string[];
  completedBeats: ProgressBeatId[];
  pendingSequenceId?: string;
  companion: {
    selectedId: string; // initially 'nova'
    nickname?: string; // optional, parent-managed
    allowedPreferenceIds: string[];
  };
  habitLedger: Record<string, 'pending' | 'approved' | 'trusted' | 'rejected'>;
  unlockIds: string[];
}
```

**Rules:** validate schemas on load; deterministic migration for changed layouts; save after authoritative commands; prevent duplicate reveals; don't store secrets or raw AI transcripts inside snapshots.

## 3. Commands and responsibilities

| Command | Domain effect | Possible event |
|---|---|---|
| `PlaceItem` | verify allowed anchor, asset availability, collision; update placement | `island:item-placed` |
| `SetItemVariant` | verify allowed variants; save style | `island:item-customized` |
| `CompleteHabit` | trust or queue for approval depending on policy | `habit:submitted` |
| `ApproveHabit` | parent-only, ledger update | `habit:approved` |
| `QualifyProgress` | deterministic threshold and idempotency; grant unlock | `progress:qualified` |
| `CommitStoryChoice` | persist lasting consequence | `island:choice-committed` |
| `QueueAuthoredMoment` | store pending sequence after state mutation | `sequence:queued` |
| `CompleteAuthoredMoment` | mark completion; allow replay without duplicate rewards | `sequence:completed` |

Every event carries stable IDs, timestamp, source command, and snapshot version. Distinguish free-play customization from rare story-changing choices. No arbitrary model-requested domain mutation.

## 4. Placement and world-kit model

- Start with **finite safe anchors**, not full unrestricted drag-and-drop.
- Object definitions specify supported anchor types, depth, hit area, collision exclusion, visual variants, states, animations and sound.
- Spawn render entities from saved placements; maintain deterministic z-order and logical hit targets.
- Editable placements can be moved/reset; narrative consequences cannot silently disappear.
- Persist instance IDs and anchor IDs (not screen x/y pixel positions) so layout survives different phone sizes.
- Validate no two exclusive objects occupy the same anchor.
- For approved v1 content, migrate all active saved placements when anchors change.

## 5. Companion integration

Keep `CompanionActor` independent of individual Phaser scenes and Nova-specific rules. Actor runtime exposes semantic actions:
```ts
type CompanionAction =
  | { type: 'look_at'; targetId: string }
  | { type: 'move_to'; safeAnchorId: string }
  | { type: 'gesture'; name: 'wave'|'point'|'curious'|'celebrate' }
  | { type: 'expression'; name: 'happy'|'surprised'|'thinking'|'calm' }
  | { type: 'speak'; authoredLineId?: string; text?: string }
  | { type: 'idle' };
```

The performance director arbitrates authored > live > reactive > idle. Live AI can issue **only validated actions**; domain knows the story facts and AI sees only discovered facts. Mock provider can drive all tests; safe fallback is authored captions.

## 6. Authored sequences, sprite animation and video

Sequence definitions live in `content/`, not inside Scene code. A sequence lists input state, authorized outcome, director cues, fallback and replay rules.

```text
on qualifying progress:
  1. validate command and parent policy
  2. commit unlock + any world change atomically
  3. persist pendingSequenceId
  4. render sequence: cue camera, Nova, audio, FX / optional clip
  5. mark sequence complete, preserving resulting world state
```

If the browser closes between 3 and 4, relaunch can safely resume/replay. If the child skips video, the world state still exists. If a sprite atlas fails to load, use static safe fallback. A video must never be the sole record of a world transformation.

**Possible beat schema** (validate with JSON schema / Zod / TypeScript before content scale):
```ts
interface IslandBeatDefinition {
  id: string;
  requiredFlags: string[];
  progressRequirement?: string;
  unlockIds: string[];
  worldMutations: Array<{op: string; targetId: string; value: unknown}>;
  authoredSequenceId?: string;
  optionalChoices?: string[];
  discoveredFactIds: string[];
}
```

## 7. Dev tooling and QA are first-class

Add a clearly separated **developer mode**:
- jump to any of first ten beats; toggle old/new world variants; mock qualifying habit/approval;
- set active scene, anchor, visitor or Nova animation; skip/replay authored sequence;
- reset local island; save/load and inspect serialized state; switch live/mock AI;
- simulate offline, tab background/resume, no sound, reduced motion, RTL and narrow phones.

Tests:
1. Domain unit tests: thresholds, trust vs approval, idempotency, choices, placement collisions and snapshot migration.
2. Contract tests: AI can't unlock, leak future facts or call without policy.
3. E2E: build → save → reload → same house/plant; change zone → Nova still present; pending reveal after interruption.
4. Visual/mobile snapshots for first-run, choice, build, return and milestone reveal.
5. Parent-child playtest on actual hardware before ten-day authoring commitment.

## 8. Proposed repo structure (add gradually)

```text
src/
  app/           # React shell, parent and overlays
  domain/        # deterministic habits/island/discoveries
  world/         # Phaser boot, scenes, placeable kits, cameras
  companion/     # behavior controller, safe performance adapter
  media/         # authored clips, audio/video presentation
  storage/       # local-first snapshot, migrations
content/
  island/        # object catalog, placements, beats, story lines
  localization/  # ar / en
assets/
  island/        # layered backgrounds, objects, character atlases
tests/
  unit/ e2e/ visual/
project/island-v2/ # planning proposal and milestone checklist
```

These directories are a target, not a reason to implement all modules before the first real slice.

## 9. Risk register and mitigation

| Risk | Mitigation |
|---|---|
| "beautiful image, boring game" | require 2 meaningful child decisions and return persistence in slice |
| too many assets | location kits + stable asset manifest, reusable object states |
| character feels pasted-on | grounded eye-line, responsive timing, persistent actor, audio sync |
| p5 plus Phaser jank | one real-time renderer; pre-render p5 textures or remove |
| video disconnect | reserve for rare moments, always have skippable authored fallback |
| AI inconsistency | limited context, deterministic story facts, mock provider, moderation |
| child privacy/voice | parent consent, minimization, deletion, no raw default memory |
| parent burden | 2–3 habits, rapid approval mode, simple return-to-world |
| new v2 contradicts v1 docs | explicit product-vision alignment PR before production merge |

## 10. Definition of technically complete

Not just a screenshot. A slice must be playable on portrait mobile, look good while moving, keep Nova in the correct position, survive reload, let the child make a real visual choice, handle skipped/muted motion/audio, and have repeatable test evidence.
