# KidsHabits Platform Foundation

This document defines the multi-world ownership boundary established after the first Sprout Planet experiments.

## Current stage amendment

The platform-first work has now proven the core shell, parent/child setup, companion boundary, Galaxy Browser, generic WorldHost, two-world proof, habit verification, and Parent Center strongly enough to begin **Sprout Planet world-art architecture and the first seven authored days**.

This is an intentional product-order revision. It does **not** mean hard-coding Sprout into the platform. Before deep day-specific implementation, build reusable art/story contracts that future planets can use. See [`WORLD_ART_RUNTIME_FOUNDATION.md`](./WORLD_ART_RUNTIME_FOUNDATION.md).

Companion phone-call / re-engagement work is intentionally deferred until later unless explicitly requested.

## Product principle

KidsHabits remains a **multi-world application platform first** and a collection of authored worlds second.

The architecture must let us deeply iterate a planet without destabilizing onboarding, habit authority, companion infrastructure, persistence, or other worlds.

## Ownership rule

The platform owns:

- onboarding and routing,
- parent and child profile,
- habit definitions and verification,
- companion selection,
- Live AI provider/session boundary,
- world registry / loading,
- durable progress storage,
- authored-sequence orchestration,
- notifications / companion calls when implemented later,
- parent controls,
- localization shell,
- debug / simulation tooling,
- reusable world-art loading and composition infrastructure.

A world owns:

- its manifest and metadata,
- its locations,
- story definitions,
- authored copy,
- art manifest and illustrated assets,
- presentation implementation / scene kit,
- assets and audio unique to the world,
- local choices and persistent consequences.

A world must **not** own parent onboarding, global habit policy, Gemini connection code, persistence infrastructure, or app navigation.

## Repository shape

```text
src/
  app/
  domain/
  world-runtime/
    art/
  world/
  worlds/
    sprout-planet/
      manifest.ts
      presentation.ts
      art/
        manifest.ts
      story/
      audio/
      localization/
    moon-garden/
      manifest.ts
      presentation.ts
      art/
        manifest.ts
      ...

public/
  worlds/
    sprout/
      art/
```

`world-runtime/` is shared infrastructure.

`worlds/<world>/` is a content/presentation package. New planets should primarily be added here.

## Architecture proof already established

The repository includes two intentionally shallow worlds:

- **Sprout Planet** — the first production world.
- **Moon Garden** — an architecture-proof world, not final content.

Both currently expose the same shallow Day-1 contract:

```text
enter world
→ complete configured real-life habit threshold
→ durable world mutation
→ pending authored sequence
→ Phaser presents the reveal
→ optional authored travel action
→ second location
→ progress persists independently per world
```

That proof remains valuable, but Sprout can now deepen through reusable world packages rather than through global app changes.

## Art runtime contract

A world art package declares immutable content facts such as:

- asset IDs and runtime URLs,
- location compositions,
- semantic render bands,
- normalized placement and origin,
- fit behavior,
- parallax,
- alpha / blend / tint,
- semantic idle motion,
- state-driven visibility,
- story focus points.

The shared Phaser runtime interprets this data. Content definitions do not call Phaser APIs.

High-quality transparent WebP/PNG illustration is a first-class production path. Procedural Graphics remain useful for prototypes, debug fallback, masks, generated textures, and effects, but they are not the visual-quality ceiling.

## Durable state

Progress is stored **per world**.

Switching from one planet to another must not reset the previous planet.

The minimum durable world state remains:

```text
day
locationId
pendingSequence
eventsSeen
flags
```

Real-life habit check-ins stay in the app-level daily ledger rather than being duplicated inside world state.

The app may add richer typed choice / relationship / inventory state later, but the same ownership rule applies.

## Galaxy model

The child-facing meta experience is a **galaxy journey of planets**.

The galaxy is the navigation metaphor, not a requirement that every planet itself look like outer space.

A planet may contain forests, oceans, dreams, cities, caves, or any other authored theme. Space is the connective tissue between worlds.

The parent experience remains calm and operational rather than visually space-heavy.

## Third-world test

A healthy architecture should allow a third world to be added mostly by:

1. create a new folder under `src/worlds/`,
2. add a manifest,
3. add an art manifest and assets,
4. add presentation/story content,
5. register the world.

It should **not** require edits to:

- parent onboarding,
- child profile,
- companion selection,
- habit domain logic,
- Gemini session code,
- persistence infrastructure,
- generic WorldHost orchestration.

If adding a new world requires those edits, stop and fix the platform boundary before producing more story content.

## Content depth rule — current phase

We may now author the **first seven Sprout days** after the art/story foundation is in place, because they will be used as the first serious production-quality vertical slice.

Do not jump straight to Days 8–30 until the first seven days have proven:

- reusable illustrated locations,
- state-driven visual variants,
- authored sequences,
- performance on mobile,
- reload reconstruction,
- companion integration,
- clean content authoring boundaries.

Once that slice is healthy, Sprout can be iterated deeply without destabilizing the application itself.
