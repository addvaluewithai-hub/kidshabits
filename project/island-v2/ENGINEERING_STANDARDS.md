# KidsHabits v2 — Clean architecture & modular code rules

**Decision recorded:** 2026-10-23 (before implementation).  
**Status:** non-negotiable engineering acceptance criteria for new v2 code; existing draft PRs are **reference material, not the production foundation by default**.  
**Related:** [STATUS.md](./STATUS.md) · [SESSION_PLAN_25.md](./SESSION_PLAN_25.md) · [TECHNICAL_CONTRACTS.md](./TECHNICAL_CONTRACTS.md) · [CI_AND_VISUAL_QA.md](./CI_AND_VISUAL_QA.md).

> **Build clean on `main`. Learn from draft PRs, do not wholesale merge or copy their architecture.** Each feature should be replaceable without disturbing unrelated features; a visual redesign should not require rewriting habits, saving, AI, story logic, or gameplay interactions.

## 1. Guiding rules

1. **One responsibility per module.** A single file must not combine input, business state, rendering, audio, API requests and persistence.
2. **State decides what is true; Phaser presents it.** Habits/unlocks/placements/choices are deterministic, testable TypeScript outside React, Phaser and AI.
3. **World assets are replaceable.** No game rules, item/character identities, or anchors hard-coded into background images. The renderer accepts a world manifest/theme contract.
4. **Story and dialogue are data.** New days and worlds should not require modifying core scene classes.
5. **AI is a bounded adapter**, never the authority for rewards, approval, unlocked content, spoilers or parent safety.
6. **A small number of coherent modules**, not a monolith and not 100 files of 10 lines each. Split at semantic boundaries with tests.
7. **No "temporary" universal component** that grows into `App.tsx`, `WorldHost.tsx` or `Game.ts` holding the entire product.
8. **Explicit contracts first; premature abstractions never.** We create a generic interface when we have 2 real implementations or when provider/art replacement is a core known requirement.

## 2. Dependency direction (enforce through review + automated checks)

```text
                UI / App Shell                   World/Phaser presentation
                  React overlays                 world scene + Nova actor
                      \                                /
                       \                              /
                        └─> APPLICATION COMMANDS <───┘
                                    |
                                 DOMAIN
                          pure rules and types
                                    |
                     PORTS / INTERFACES
                   persistence, audio, AI, art

INFRASTRUCTURE implements ports (storage, provider, asset loader).
COMPOSITION ROOT wires everything; modules do not import that root.
```

**Allowed:** app/world calling application command interfaces; application calling pure domain services; presentation consuming snapshots/events; infrastructure implementing ports.  
**Forbidden:** `domain` importing React, Phaser, browser/DOM, network clients, `world` or `app`; content definitions importing runtime; components importing database or private child profile data directly; a Phaser Scene mutating canonical habit state; live AI changing rewards.

**Enforce:** simple automated guard now; later ESLint no-restricted-imports / dependency-cruiser (or equivalent) once exact import aliases chosen. Do not fake an import-boundary check we haven't implemented.

## 3. Suggested minimal production layout

```text
src/
  app/
    App.tsx                       # shell/composition only
    routes/
    parent/
    child/
  application/
    commands/                     # use cases (place item, complete habit)
    events/
    ports/                        # contracts, e.g. SaveRepository, AI adapter
  domain/
    island/                       # island snapshot, placement & rules
    habits/                       # habit ledger, verification policy
    discovery/                    # unlocks/story facts
    companion/                    # allowed safe memory & projection
  world/
    WorldHost.tsx                 # Phaser lifecycle adapter only
    scenes/                       # small scenes; no state authority
    systems/                      # placement rendering, cameras, effects
    actors/                       # Nova/Lumi animations & cues
    assets/                       # manifest resolvers, scene composition
  media/                          # scripted performance, video/audio
  infrastructure/
    storage/
    ai/                           # mock + later live provider
  content/
    island/                       # data definitions/asset manifests
    companions/
  styles/
    tokens.css                    # design tokens, typography, motion
    themes/                       # visual skins / controlled presets
    components/
tests/
  unit/
  contracts/
  e2e/
  visual/
```

This is a **target boundary map**, not a directive to scaffold dozens of empty folders. Create only the files demanded by the current slice. Move `content` to repository root if authoring tooling benefits; the one source of truth matters more than path.

## 4. File size budget (human-friendly, enforced as guardrails)

- Aim for **50–180 meaningful lines** per ordinary source file, excluding autogenerated assets.
- At **220 lines** a production TS/TSX/JS/JSX file gets a CI warning: reviewer asks whether to extract a focused unit.
- At **350 lines** it becomes an **automatic CI failure**, unless explicitly listed as a temporary reviewed exception with issue and expiry.
- Generated files, pinned vendored dependencies, minified output and story JSON/scene data are excluded from this source-code size rule. They must not live inside normal business logic files.
- A small cohesive module may legitimately be 260 lines; a bad 80-line file that mixes 5 responsibilities is still unacceptable. **LOC is a signal, not a design metric.**
- React pages should orchestrate small view components and hooks; Scene files assemble actors/systems, not contain content or habit algorithms.
- Every exception gets a follow-up issue and a documented reason; don't split files solely to evade the limit.

**Source line-count CI:** `scripts/island-ci/check-architecture.mjs` checks new production source files recursively whenever `src/` exists. It **does not** prove code is well designed; PR review and contract tests remain mandatory. First clean app implementation must satisfy this budget; selected legacy code must be refactored, not exempted silently.

## 5. Visual style swapping without touching gameplay

**Core principle:** `same saved island data + different art pack = same island/play decisions`.

Separate **semantic identity** from **assets**:

```ts
// Content/domain identity — stable across styles and versions
type PlaceableId = 'cottage.door' | 'garden.firstPlant' | 'tree.ancient';
type Placement = {
  instanceId: string;
  itemId: PlaceableId;
  anchorId: string;
  variantId: string;
};

// Renderer-specific style — replaceable
interface WorldArtPack {
  id: string;                // e.g. 'storybook-v1', 'soft-3d-render-v2'
  backgroundLayers: string[];
  sprites: Record<string, { assetKey: string; depth: number; pivot: [number, number] }>;
  palettes: Record<string, string>;
  effects: Record<string, string>;
  audioCues: Record<string, string>;
}
```

Every renderer loads the art pack and resolves stable semantic item IDs to assets. A theme swap should change materials, textures, audio, fonts and selected effects **without** modifying `CompleteHabit`, `PlaceItem`, child progress, companion memory, or authored story facts.

Constraints:
- Validate required asset manifest IDs at build/CI time.
- Keep consistent anchors/hitboxes independent of original art resolution and platform viewport.
- Design tokens (colors, fonts, spacing, text sizes, reduced motion) stay separate from layout/business rules.
- Use overlays and layered objects rather than flattening Nova and buildings into a single background.
- **Do not** promise a totally different 3D free-camera style will be free; large perspective changes may require renderer-specific layout and new assets. Visual skin swap ≠ engine rewrite.
- A second sample art pack is not needed in Session 01. Prove the contract with a **small alternate palette / asset variant** in the first art integration.

## 6. Scaling content, scenes and AI

- A new **day/unlock** = validated content + test, not a new Scene or a switch-case ladder.
- A new **island/zone** = manifest, art layers, hotspots, anchors, discovery definitions; shared scene systems remain.
- A new **companion** = avatar/rig, voice settings, expressions, semantic performance actions; core progress doesn't know "Nova".
- An AI provider swap changes an `AiConversationPort` adapter; feature/gameplay code remains unchanged.
- Persistence saves versioned **semantic data**, never Phaser object IDs, canvas pixels or screenshot URLs.
- React/mobile owns parent settings, permissions and overlays; WorldHost owns scene lifecycle.
- p5.js is an optional procedural asset/effects **adapter**; it must not own world truth or initialize a competing full-screen game loop.

## 7. Testing and quality gates (must accompany implementation)

### Unit
- Pure domain tests: place / move, collision, saved variants, habit thresholds, approval, idempotent unlock.
- Migration tests from stored snapshot schema vN to vN+1.
- Content schema validator catches unknown IDs and missing assets.

### Contracts/integration
- Fake storage vs local storage produces identical snapshots after same commands.
- Theme manifest swap retains chosen objects/anchors/scene topology and doesn't alter domain snapshots.
- Nova performer reacts based on stable semantic IDs, not hard-coded background artwork.
- AI provider cannot issue commands to unlock content; hidden story facts never exposed.

### Browser E2E
- Actual built app opens and interacts with cottage/garden; screenshots show different results.
- Save/reload yields same world; use test IDs as *signals*, not replacement for visual proof.
- Theme toggle preserves item IDs and placements when theme-change feature is implemented.
- Sound off, narrow mobile, RTL and reduced-motion work.

### PR acceptance
- No unexplained gigantic files, UI/domain circular imports, data-coded cutscenes or direct AI state mutation.
- CI `plan-validation` and architecture guard pass; actual `production-visual-proof` passes on app PR (a skip is **not** pass).
- Attach real screenshots, inspect them and record findings in `STATUS.md`.
- Code reviewer can point to the file responsible for each behavior and see how it can be replaced.

## 8. Prior draft PR reuse policy

The previous feature PRs (#2–#7) contain valuable prototypes, but they were designed before this new island-led direction.

**Session 01 must:**
1. Inventory reusable pieces: Phaser config, parent verification logic, PixiLive Nova actor, safe AI boundaries, sprite/asset pipeline, prior tests and any robust persistence contracts.
2. Distinguish **reuse source** (e.g., a small tested domain helper) from **reuse design/idea** (e.g., schema or screenshot).
3. Identify oversized files, hidden coupling, unsafe provider dependencies, pinning/network assumptions and architecture clashes.
4. **Start from clean main**, implement reviewed reusable parts in focused modules; avoid a wholesale merge of draft PRs.
5. Document the decision for each major legacy module in the Session 01 PR.

**No code from experimental branches is production merely because it exists.** Preserve old PRs for archaeology/learning, not as the baseline automatically.

## 9. "Definition of clean" after 10 steps

A new developer can locate the habit rule, saving code, story definition, Nova actor and art manifest in seconds. A second visual skin can be integrated without touching habit logic; a second planet/zone can reuse the world runtime; a broken character animation won't corrupt a child's island; the ten beats reconstruct consistently after a reload. **This is what maintainable means**, not just lots of directories.

### Anti-patterns to reject in review

- `App.tsx` or `WorldHost.tsx` with an entire game, 20 booleans and ten day-specific `if` branches.
- Canvas click handler that reaches into localStorage, unlock logic and Nova live AI directly.
- Unbounded event bus and hidden mutable singleton state.
- Every decoration becoming a bespoke component / an art hard-code.
- Asset keys and texture paths embedded in save files.
- Copy-pasted scene for every progress day or audio/video timing hard-coded into business logic.
- API key or child conversation stored in frontend/world state.
