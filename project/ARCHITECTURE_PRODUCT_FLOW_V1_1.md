# KidsHabits — Product-Flow Architecture Amendments v1.1

**Status:** Normative addendum to `project/ARCHITECTURE_PROPOSAL.md`  
**Applies to:** PR #1 / `docs/product-architecture-v1`  
**Source of truth priority:** `PRODUCT_VISION.md` → this addendum → `ARCHITECTURE_PROPOSAL.md` → generic implementation examples

This document closes five product-level gaps before the architecture proposal is considered ready to merge:

1. the complete parent → child → companion → planet experience state machine,
2. a general companion model rather than a Nova-specific implementation,
3. companion calls as a real re-engagement subsystem rather than a single platform API,
4. a content-as-data pipeline that can realistically author many 30-day planets,
5. an explicit contract between the React/mobile shell and the Phaser world host.

The existing architectural laws remain unchanged:

> **State decides what is true. Phaser shows what is true.**

> **AI may perform and converse, but it does not decide progression.**

---

## 1. Complete product experience state machine

The product does not begin at `WorldScene`.

The first session is part of the core product experience and must be represented explicitly in application state. A child should not appear inside Sprout Planet before the parent configuration and companion relationship have a valid durable state.

### 1.1 Experience phases

```ts
export type ExperiencePhase =
  | 'parent_welcome'
  | 'parent_account'
  | 'child_profile_setup'
  | 'habit_setup'
  | 'permissions_setup'
  | 'child_handoff'
  | 'companion_selection'
  | 'companion_first_meeting'
  | 'companion_getting_to_know_you'
  | 'first_planet_introduction'
  | 'daily_home'
  | 'world'
  | 'live_conversation'
  | 'story_choice'
  | 'planet_completion'
  | 'between_planets';
```

The application owns the phase. Phaser may render some phases, but Phaser does not decide which phase is true.

### 1.2 First-run journey

```text
Install / Launch
    ↓
Parent welcome
    ↓
Parent account / local family setup
    ↓
Create child profile
    ↓
Choose initial habits + verification policy
    ↓
Configure permissions / quiet hours / companion calls
    ↓
Parent hands device to child
    ↓
Child chooses companion
    ↓
Authored first meeting
    ↓
Short Live AI getting-to-know-you conversation
    ↓
Persist explicit safe child/companion preferences
    ↓
Companion introduces first planet
    ↓
Enter Sprout Planet
    ↓
Daily loop
```

### 1.3 Returning-session routing

On app launch, an `ExperienceRouter` should derive the correct destination from durable state rather than from the last open route.

```ts
export interface ExperienceRouter {
  resolve(snapshot: AppSnapshot, now: Date): ExperienceDestination;
}
```

Example rules:

- no parent setup → `parent_welcome`
- no child profile → `child_profile_setup`
- no companion selected → `companion_selection`
- selected companion but first meeting incomplete → `companion_first_meeting`
- first meeting complete but no active planet → `first_planet_introduction`
- pending authored story sequence → `world` and settle/replay according to sequence policy
- otherwise → `daily_home`

Navigation history is presentation state. It is not product truth.

### 1.4 Parent onboarding minimum durable state

```ts
export interface FamilySetupSnapshot {
  parentSetupCompleted: boolean;
  childProfiles: ChildProfile[];
  activeChildId?: string;
  quietHours: QuietHoursPolicy;
  voicePermissions: VoicePermissionPolicy;
  companionCallPolicy: CompanionCallPolicy;
}

export interface ChildProfile {
  id: string;
  displayName: string;
  ageBand: 'young' | 'middle' | 'older';
  locale: string;
  timezone: string;
  habitPlanId?: string;
  companionProfileId?: string;
}
```

Avoid collecting data merely because AI could use it. Every persisted field must have a clear product purpose.

### 1.5 Child handoff

The switch from parent setup to child experience is explicit.

The child must not accidentally land in parent controls through normal child-world navigation. Parent-only areas should use an age-appropriate parent gate when necessary.

---

## 2. Companion system is general, not Nova-specific

Nova may be the first or flagship companion. The architecture must not assume that `Nova === companion`.

Story content talks to a semantic companion role. Rendering and voice identity come from the selected companion definition.

### 2.1 Companion definition

```ts
export interface CompanionDefinition {
  id: string;
  nameKey: string;

  visual: {
    actorType: string;
    assetManifestId: string;
    defaultScale: number;
    defaultAnchor: { x: number; y: number };
  };

  voice: {
    liveVoiceId: string;
    authoredVoiceSetId: string;
    localeVoices?: Record<string, string>;
  };

  personality: {
    promptProfileId: string;
    toneTags: string[];
    curiosityStyle: 'gentle' | 'playful' | 'adventurous';
  };

  capabilities: {
    canFly: boolean;
    canWalk: boolean;
    canPoint: boolean;
    supportsLipSync: boolean;
  };

  safetyProfileId: string;
  animationSetId: string;
}
```

### 2.2 Child-companion relationship profile

```ts
export interface ChildCompanionProfile {
  id: string;
  childId: string;
  companionId: string;

  firstMeetingCompleted: boolean;
  firstMeetingCompletedAt?: string;

  preferredChildName?: string;
  selectedInterests: string[];
  preferredConversationLanguage?: string;

  discoveredFacts: Record<string, boolean>;
  relationshipMilestones: string[];
}
```

`selectedInterests` and similar fields must be explicit, product-useful, non-sensitive, parent-compatible fields. Raw conversation history is not the relationship model.

### 2.3 First meeting

The first meeting is hybrid authored + live:

```text
Authored entrance
→ companion introduces itself
→ companion asks child's preferred name
→ live conversation opens
→ companion asks 2–3 lightweight getting-to-know-you questions
→ explicit safe fields are projected into ChildCompanionProfile
→ authored closing beat
→ companion introduces Sprout Planet
```

The model must not silently infer or persist sensitive traits.

### 2.4 Character actor contract

The existing semantic `CharacterActorPort` remains the rendering boundary.

Story and AI ask for semantics such as:

```text
look at seed
fly near child-side foreground
be excited
perform greeting
listen
speak
```

They do not manipulate sprite frame numbers, Phaser tweens, or renderer-specific layers.

A selected companion can therefore use a different renderer/rig later without changing Story Engine semantics.

### 2.5 Performance priority

Use a single `PerformanceArbiter` so authored moments, live conversation, ambient animation, and navigation do not fight each other.

Recommended priority:

```text
critical authored sequence
    > active live speaking/listening gesture
    > explicit user interaction
    > story ambient performance
    > idle animation
```

Lower-priority performance is interruptible and resumable.

---

## 3. Companion Calls and re-engagement are a product subsystem

`MobileServices.presentCompanionCall()` is only the final delivery mechanism.

KidsHabits needs a deterministic re-engagement policy before anything reaches the platform layer.

### 3.1 Re-engagement architecture

```text
Story / Habit / Product event
        ↓
ReengagementIntent
        ↓
ReengagementPolicy
        ↓
Allowed delivery channel
        ↓
Platform capability resolver
        ↓
Native call-style / notification / in-app prompt / nothing
```

### 3.2 Intent model

```ts
export interface ReengagementIntent {
  id: string;
  childId: string;
  companionId: string;
  reason:
    | 'story_hook'
    | 'story_followup'
    | 'habit_window'
    | 'return_to_world'
    | 'parent_scheduled';

  storyContextId?: string;
  authoredLineId?: string;
  priority: 'low' | 'normal' | 'high';
  earliestAt: string;
  expiresAt: string;
}
```

AI does not create arbitrary device calls. Product logic creates an intent with a known reason.

### 3.3 Parent policy

```ts
export interface CompanionCallPolicy {
  enabled: boolean;
  allowedChannels: Array<'notification' | 'in_app_call' | 'native_call_style'>;
  maxCallsPerDay: number;
  maxCallsPerWeek: number;
  quietHours: {
    enabled: boolean;
    startLocalTime?: string;
    endLocalTime?: string;
  };
  requireParentApprovedSchedule: boolean;
}
```

### 3.4 Eligibility check

```ts
export interface ReengagementPolicy {
  evaluate(
    intent: ReengagementIntent,
    snapshot: AppSnapshot,
    capabilities: MobileCapabilities,
    now: Date
  ): ReengagementDecision;
}
```

Policy should consider at minimum:

- parent enabled calls,
- allowed delivery channels,
- quiet hours,
- age/profile constraints,
- rate limits,
- whether the child already opened the relevant story beat,
- whether the intent is still meaningful,
- platform capability,
- recent interaction cooldown,
- whether a parent approval is still blocking progression.

### 3.5 Calls should have a story reason

Bad:

> "Come back to the app!"

Good:

> "Lumi woke up and found something strange near the river. Want to see it?"

A companion call should feel like the world reaching out, not a retention notification wearing a character costume.

### 3.6 Incoming call session

Accepting a call should create a `CompanionCallSession` that knows:

```ts
export interface CompanionCallSessionContext {
  intentId: string;
  childId: string;
  companionId: string;
  discoveredStoryContext: LiveStoryContext;
  permittedTools: string[];
  returnDestination: ExperienceDestination;
}
```

If the call teases a story event, accepting it may route to the relevant world moment only after deterministic story rules confirm that moment is available.

AI still cannot grant progress.

### 3.7 Calls are capability-graded

Support:

```text
native_call_style
in_app_call
notification_to_in_app_call
notification_only
unsupported
```

The product remains coherent on every level. Native call-style UX is an enhancement, not a story dependency.

---

## 4. Content must be data, not gameplay code

Thirty-day planets will fail operationally if every story beat requires an engineer editing executable logic.

The production target is:

> **Writers/designers author validated content definitions; runtime systems interpret them.**

### 4.1 Content graph

```text
Planet
├── metadata
├── locations
│   ├── visual state definitions
│   └── interactive anchors
├── days
│   ├── entry conditions
│   ├── progress gates
│   ├── story beats
│   └── end hooks
├── choices
│   ├── options
│   ├── persistent consequences
│   └── convergence rules
├── sequences
│   ├── camera
│   ├── character performance
│   ├── world mutations presentation
│   ├── dialogue
│   ├── audio
│   └── VFX
└── localization
```

### 4.2 Declarative content rule

Content files may initially be TypeScript for type safety, but they must be **declarative data**.

Allowed:

```ts
{
  id: 'sprout.day03.seed-choice',
  trigger: { type: 'daily_progress_qualified' },
  choiceId: 'sprout.seed-location',
  sequenceId: 'sprout.seed-found'
}
```

Not allowed:

```ts
async run(scene) {
  scene.children.getByName('seed').setVisible(true);
  await scene.tweens.add(...);
  storyStore.day++;
}
```

No story content file should directly mutate Phaser, persistence, habit state, or AI state.

### 4.3 Schema and validation

Every content build should validate:

- unique IDs,
- valid location references,
- valid sequence references,
- localization keys exist,
- no transition targets undiscoverable future content accidentally exposed to Live AI,
- choice options have a defined consequence,
- convergence does not produce unreachable story days,
- asset IDs exist in manifests,
- authored cue IDs exist,
- day progression has no accidental dead ends,
- every persistent variant has a reconstruction rule.

Expose:

```ts
validatePlanet(definition): ValidationReport
```

CI fails on content errors.

### 4.4 Story simulator

Build a non-visual simulator before authoring many planets.

It should support:

```text
start planet
complete today's gate
choose option A/B
jump to day N
inspect snapshot
list available transitions
simulate reload
simulate missed day
simulate approval pending/approved
run all legal paths
```

The simulator uses the same Story Engine as production, without Phaser.

This becomes the fastest way to catch content logic failures across 30 days.

### 4.5 World preview

Add a developer preview route capable of rendering:

```text
planet + location + exact WorldSnapshot
```

Example:

```text
/debug/world?planet=sprout&location=river-clearing&preset=day04-water-bloom
```

Presets are developer/content tools, never production progression shortcuts.

### 4.6 Sequence preview

Sequences should also be independently previewable:

```text
/debug/sequence/sprout.path-opens
```

with controls for:

- play,
- pause,
- restart,
- playback speed,
- skip to step,
- inspect active actor command,
- inspect camera state,
- inspect audio cue,
- capture screenshot.

### 4.7 Content packaging

Runtime should load a validated planet bundle/manifests rather than scan arbitrary code.

Conceptually:

```ts
export interface PlanetBundle {
  definition: PlanetDefinition;
  assetManifest: PlanetAssetManifest;
  localizationNamespaces: string[];
  contentVersion: string;
}
```

This keeps future remote/content-update options possible without making them a v1 requirement.

---

## 5. WorldHost / React overlay contract

The React/mobile shell and Phaser are two presentation systems sharing one screen. Their ownership must be explicit.

### 5.1 WorldHost responsibilities

`WorldHost` owns:

- Phaser canvas lifecycle,
- mounting/unmounting the game,
- viewport/safe-area bridge,
- input gating between canvas and overlays,
- world pause/resume policy,
- focus state,
- app lifecycle propagation,
- audio-session coordination,
- route-to-world snapshot projection.

Phaser does not reach into React DOM.

React does not reach into individual Phaser sprites.

Communication happens through typed ports/events/application state.

### 5.2 Overlay modes

```ts
export type WorldOverlayMode =
  | 'none'
  | 'habit_sheet'
  | 'story_choice'
  | 'live_conversation'
  | 'permission_prompt'
  | 'parent_gate'
  | 'debug';
```

Each overlay declares behavior:

```ts
export interface OverlayPolicy {
  blocksWorldPointer: boolean;
  blocksWorldKeyboard: boolean;
  pauseAuthoredSequence: boolean;
  pauseAmbientMotion: boolean;
  dimWorld: boolean;
  audioMode: 'world' | 'conversation' | 'muted_world';
  backBehavior: 'dismiss' | 'confirm' | 'delegate';
}
```

### 5.3 Recommended policies

**Habit sheet**

```text
blocks pointer: yes beneath sheet
pause authored sequence: yes
ambient motion: continue
world audio: lowered
back: dismiss
```

**Story choice**

```text
blocks world pointer: yes
pause authored sequence: yes at a defined choice checkpoint
ambient motion: continue subtly
world audio: continue quietly
back: no accidental dismissal after choice presentation begins
```

**Live conversation**

```text
world pointer: limited to explicit companion/world affordances
ambient motion: continue
story progression: frozen
conversation audio session: active
back/end: cleanly terminate session then restore world audio
```

**Permission prompt**

```text
world pointer: blocked
sequence: paused safely
ambient motion: optional
back: governed by app/platform permission flow
```

### 5.4 Input ownership

Only one layer owns a pointer interaction at a time.

When a blocking React overlay is present, Phaser input must be explicitly disabled or constrained rather than relying on accidental DOM stacking behavior.

World interaction events should include an interaction ID so duplicate touch/pointer delivery cannot execute a command twice.

### 5.5 Back/navigation behavior

Android back, gesture navigation, app route changes, and internal Phaser transitions must converge on application navigation policy.

Phaser never directly exits the app or changes parent routes.

If a critical authored sequence is active, back behavior is defined by the sequence interruption policy rather than by browser history alone.

### 5.6 App lifecycle

On background/suspend:

1. stop accepting new world commands,
2. persist any required durable snapshot,
3. pause authored sequence presentation,
4. suspend/duck audio appropriately,
5. end or suspend Live AI according to provider/platform capability.

On resume:

1. reload/verify durable state if necessary,
2. settle/replay pending sequence according to its policy,
3. reconstruct world,
4. restore ambient systems,
5. restore overlay only if it remains semantically valid.

### 5.7 Safe areas and responsive ownership

React shell owns device safe-area measurements and passes normalized insets to `WorldHost` / viewport service.

Phaser owns composition inside the available world viewport.

Story-critical objects must never be placed solely inside overscan or underneath reserved system/overlay zones.

---

## 6. Revised milestone order

Do not start by implementing seven story days.

Do not build a generic planet engine in isolation.

Build the smallest end-to-end production path that exercises the real product boundaries.

### Milestone 0 — First Meeting

Prove the product exists outside the world engine:

```text
Parent onboarding shell
→ child profile
→ minimal habit plan
→ child handoff
→ choose companion
→ real CharacterActorPort
→ authored companion entrance
→ mock/live provider boundary
→ short getting-to-know-you interaction
→ persisted ChildCompanionProfile
→ enter first planet
```

This may use minimal visual content, but the contracts should be production ones.

### Milestone 1 — Landing Meadow: First Light

Then prove the living world pipeline:

```text
habit completion
→ deterministic habit domain
→ daily qualification
→ story transition computation
→ atomic persistence + pending sequence
→ authored sequence
→ camera
→ selected companion performance
→ world mutation reveal
→ audio cue
→ completion acknowledgement
→ reload to exact durable state
```

Acceptance requirement:

> If the app is killed at any meaningful point, reopening it must never lose or duplicate real progress and must reconstruct a coherent world.

### Milestone 2 — First re-engagement

After First Light is stable:

```text
story creates eligible hook
→ ReengagementIntent
→ deterministic policy
→ mock platform call/notification
→ accept
→ Live AI session with discovered context
→ route into the correct world destination
```

Do not implement native call-style UI until policy/platform validation is complete; prove the product flow through the interface first.

### Milestone 3 — First meaningful choice

Only then implement the first persistent story branch:

```text
choice presented
→ choice committed durably
→ authored consequence
→ reload
→ visible persistent variant remains
→ story later converges without erasing the child's choice
```

---

## 7. Repository changes implied by this addendum

The following boundaries should exist when their milestone is implemented:

```text
src/
├─ experience/
│  ├─ ExperienceRouter.ts
│  ├─ model.ts
│  └─ events.ts
│
├─ companions/
│  ├─ definitions.ts
│  ├─ ChildCompanionProfile.ts
│  ├─ CompanionRegistry.ts
│  └─ FirstMeetingController.ts
│
├─ reengagement/
│  ├─ model.ts
│  ├─ ReengagementPolicy.ts
│  ├─ ReengagementScheduler.ts
│  └─ events.ts
│
├─ content/
│  ├─ schema/
│  ├─ validation/
│  ├─ loader/
│  └─ simulator/
│
└─ app/
   └─ world-host/
      ├─ WorldHost.tsx
      ├─ OverlayPolicy.ts
      ├─ InputBridge.ts
      └─ LifecycleBridge.ts
```

Do not create empty abstractions merely to match this tree. Add each boundary with the first production behavior that exercises it.

---

## 8. Merge gate for Architecture PR #1

PR #1 is architecture-ready when the proposal plus this addendum make the following unambiguous:

- the full parent-to-child first-run experience,
- who owns current experience phase,
- how a child selects and first meets a companion,
- how companion identity stays renderer/AI independent,
- what companion memory may persist,
- who is allowed to schedule a companion call,
- how quiet hours/rate limits/parent policy gate re-engagement,
- how content authors can build a 30-day planet without writing gameplay code,
- how content is validated and simulated,
- who owns pointer/focus/back/audio while React overlays sit above Phaser,
- how app background/resume affects sequences and Live AI,
- why progress remains deterministic and durable throughout.

Once those boundaries are accepted, stop architecture expansion and bootstrap Milestone 0 + Milestone 1 with production-quality contracts.
