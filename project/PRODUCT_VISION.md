# KidsHabits — Current Product Vision (Immersive Living World v3)

**Updated:** 24 October 2026. **This is the canonical product vision** for new implementation.
**Prior Phaser/30-day story version:** preserved at [archive/PRODUCT_VISION_PHASER_V1.md](./archive/PRODUCT_VISION_PHASER_V1.md); not normative for this new app.

> **A magical world that grows with the child.**
>
> **"دي دنياي. أنا اللي بغيّرها، ونوفا بتستكشفها معايا."**

## 1. One connected world to LIVE IN

KidsHabits is a **full-screen immersive Three.js magical world** for children roughly 8–10, starting with a 9-year-old supervised test. The child sees the world through a **ground-level perspective camera**, like standing on a path near their cottage. Sky, trees, terrain and distant landscape continue beyond the accessible play area. The camera never looks down on a miniature floating island as the primary gameplay view.

The world begins with an old cottage, a quiet tree, a small garden and companion Nova. The child builds, plants, chooses colors and locations, explores secrets and welcomes visitors. Actions change the **actual spatial scene**, and changes persist when the child returns. The lived-in world — not coins, scoreboards, a cutscene treadmill or an infinite reward economy — is the product.

## 2. The habit → agency → wonder loop

```text
Child re-enters the world they shaped
 → Nova notices persisted choices and quietly accompanies them
 → Child may explore/decorate freely, even without a new goal
 → Parent-configured real-world habit is completed
 → Trust or parent verification qualifies a deterministic unlock
 → New creative possibility or authored mystery opens
 → Child chooses where/how to build or plant
 → 3D world state persists; Nova reacts to the actual change
 → child has a reason to care about their creation
```

A missed day is **not failure**. Plants never wilt from absence, Nova does not feel abandoned, affection and play are never withheld. Only modest 2–3 active habits initially, with simple approval and no high-pressure streaks.

## 3. Camera and movement

- **Three.js + React Three Fiber** renders the world; React owns accessible overlays and parent/account UX.
- **Perspective** camera around child's physical viewing height. No orthographic/isometric overview for initial play.
- **Guided exploration first**: tap/look at cottage/garden/tree; camera moves along safe authored route; Nova flies/turns and responds. Not a forced avatar/joystick or open-world navigation system in the ten-beat MVP.
- **True full-screen:** `100dvh`, no cards/side dashboards enclosing the world, minimal safe-area-aware HUD, subtitled voice and accessible interaction alternatives.
- A connected clearing with arrival path → cottage → garden → ancient tree → interior → creek/bridge/gate hint, without exposed land boundaries. New regions added as world content.
- Display styled objects through replaceable art packs/rigged GLB assets, controlled lights/materials/animation; saved choices remain renderer independent.

Read the definitive [Immersive World Spec](./island-v2/IMMERSIVE_WORLD_SPEC.md) for composition, camera rig, zones and acceptance tests.

## 4. Nova is our living companion

Nova is a 3D world actor with coherent scale, expressions, look targets, movement paths, listening and speech gestures. She can be silent; she does not nag or repeatedly congratulate every tap. In key reveals, authored dialogue/performance locks cinematic quality. Live conversational AI is a **separate optional later** feature requiring explicit guardian permission, tight context projection and child-safe guardrails.

**Never give AI story/habit authority**. Core choices, story facts, family permissions, re-engagement and unlocks are deterministic domain behavior. AI sees discovered facts only. The child knows Nova is an AI character, not a real person or replacement for trusted humans.

## 5. First ten progression steps — home first (proposal)

**24 October 2026 proposed product change:** First ~10 meaningful qualified steps invest in the **same small, noticeably damaged cottage, barren yard/garden and starter interior**, not fast travel across several external mystery locations. Child repairs **one visible part** at a time. Indoor furnishing begins after the entrance becomes safe; a lush, personally arranged first garden and cozy furnished starter home culminate at beat 10. See [RFC-002](./island-v2/HOME_AND_GARDEN_FIRST_10_RFC.md).

1. Arrive at the tiny weathered cottage, bare garden and overgrown approach; clear first portion of path and name home.
2. Repair first broken door/handle and choose its style.
3. Fix window/shutters and prepare first tiny garden bed.
4. Repair one roof section and plant first seed.
5. Mend steps/porch; first seed becomes visible seedling.
6. Open house for first visit, clean/fix first interior wall/floor.
7. Make living corner cozy with rug/lamp; plant different second species.
8. Paint/dress room with curtain/shelf; add small garden path.
9. Build reading/craft corner; garden now diverse and flowering.
10. Personalize final details and take a skippable grounded walk-through of **your** completed starter home and garden.

**After beat 10:** external adventures, deeper tree mystery, Lumi, creek, bridge and gate can begin (Chapter 2). Home remains the emotional and functional hub; outdoor stories bring optional enhancements back home.

Beats are progression milestones **not mandatory ten consecutive calendar days**. One meaningful focal change per eligible step, small tactile mini-actions and personal choices; optional free play always available. No plant decay, daily guilt or live-AI progress authority. Earlier technical S01 Instant Restore was a renderer proof, not the final gameplay.

## 6. Global-quality bar, from start

A premium feel requires cohesive art, world scale, camera blocking, expressive character models/animation, lighting, atmosphere, tactile feedback, sound, intuitive child touch UX, readable Arabic/RTL subtitles, localization-ready typography, loading/error states, accessibility and honest mobile performance testing. No design debt is hidden behind a green CI icon. Every PR includes built-app screenshots and a truthful quality review.

A narrow first slice should already feel like **looking into a place you can inhabit**, not a technical preview card. Don't build ten days of content until the first world + Nova is genuinely compelling.

## 7. Architecture and production

- Renderer-independent domain and application commands, versioned world snapshot, authored content schemas, bounded companion actions.
- One primary renderer (Three/R3F); older Phaser scenes and floating-island Three experiments are references, **not production dependencies**.
- Separate world/camera, character, assets, persistence, parent settings, media/audio and AI adapters. No hard line-count failures; review responsibilities and dependencies.
- Use GitHub issues/branches/PRs, typecheck, domain unit tests, browser interaction + **WebGL pixel evidence**, three viewport screenshots, reload test, manual art critique.
- The staged **25-session plan** is a planning baseline, not a time estimate guarantee. [STATUS](./island-v2/STATUS.md) is the live tracking truth. Work starts from the clean documentation-only baseline, reusing only reviewed small ideas from draft PRs.

**Definitive references:** [Decision record](./island-v2/ADR_001_THREEJS_IMMERSIVE.md) · [Camera/world spec](./island-v2/IMMERSIVE_WORLD_SPEC.md) · [25 sessions](./island-v2/SESSION_PLAN_25.md) · [Engineering](./island-v2/ENGINEERING_STANDARDS.md) · [Status](./island-v2/STATUS.md).

**Legacy documents** `project/ARCHITECTURE_PROPOSAL.md` and `project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md` contain historic Phaser-first flow and camera assumptions. Preserve nonconflicting rules about parent authority, deterministic progress, authored beats and privacy; when they conflict, **this vision + ADR-001 + current spec win**.
