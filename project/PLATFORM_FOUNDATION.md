# KidsHabits Platform Foundation

This document defines the current implementation direction after the first Sprout Planet experiments.

## Product build order

KidsHabits is a **multi-world application platform first** and a collection of authored worlds second.

Do not deepen one planet into many story days before the reusable application boundaries are proven.

The intended order is:

1. app shell / lifecycle / persistence,
2. parent and child profiles,
3. companion platform and Live AI boundary,
4. world registry and Galaxy Browser,
5. generic World Runtime,
6. at least two shallow Day-1 worlds to prove reuse,
7. deterministic habit + verification loop,
8. parent center,
9. re-engagement / calls,
10. planet lifecycle and completion,
11. content tooling / simulation,
12. production hardening,
13. then deep world-by-world story design and iteration.

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
- notifications / companion calls,
- parent controls,
- localization shell,
- debug / simulation tooling.

A world owns:

- its manifest and metadata,
- its locations,
- story definitions,
- authored copy,
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
  world/
  worlds/
    sprout-planet/
      manifest.ts
      presentation.ts
      story/          # later
      assets/         # later
      audio/          # later
      localization/   # later
    moon-garden/
      manifest.ts
      presentation.ts
      ...
```

`world-runtime/` is shared infrastructure.

`worlds/<world>/` is a content/presentation package. New planets should primarily be added here.

## Current architecture proof

The repository currently includes two intentionally shallow worlds:

- **Sprout Planet** — the first product world.
- **Moon Garden** — an architecture-proof world, not final content.

Both expose the same Day-1 contract:

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

The exact story and art are deliberately shallow. Their purpose is to prove the platform boundary before deeper writing and illustration work.

## World manifest contract

A world manifest declares stable content facts such as:

- `id`
- Arabic name / subtitle / description
- total days
- starting location
- location metadata
- Day-1 reveal event / sequence IDs
- primary authored action
- presentation adapter ID

The shared domain logic reads this data. It must not branch on `if world === sprout` for progression behavior.

World-specific visual drawing is allowed to differ, but it is loaded through the shared WorldHost / presentation registry.

## Durable state

Progress is stored **per world**.

Switching from one planet to another must not reset the previous planet.

The minimum durable world state is:

```text
day
locationId
completedHabits
pendingSequence
eventsSeen
flags
```

The app may add richer typed choice / relationship / inventory state later, but the same ownership rule applies.

## Galaxy model

The child-facing meta experience is a **galaxy of planets**.

The galaxy is the navigation metaphor, not a requirement that every planet itself look like outer space.

A planet may contain forests, oceans, dreams, cities, caves, or any other authored theme. Space is the connective tissue between worlds.

The parent experience remains calm and operational rather than visually space-heavy.

## Third-world test

Before calling the platform architecture healthy, adding a third world should require approximately:

1. create a new folder under `src/worlds/`,
2. add a manifest,
3. add a presentation/content package,
4. register the world.

It should **not** require edits to:

- parent onboarding,
- child profile,
- companion selection,
- habit domain logic,
- Gemini session code,
- persistence schema shape,
- generic WorldHost orchestration.

If adding a new world requires those edits, stop and fix the platform boundary before producing more story content.

## Content depth rule

Until platform milestones are complete, only build enough content inside a planet to exercise a reusable capability.

Do not build Days 2–30 merely because Day 1 exists.

Once the platform is stable, each planet can go through many independent story / visual iterations without destabilizing the application itself.
