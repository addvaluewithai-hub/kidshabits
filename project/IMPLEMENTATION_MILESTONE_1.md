# Milestone 1 — Landing Meadow: First Light

This milestone proves the first deterministic real-life-progress → persistent story mutation → authored Phaser presentation loop.

## Product moment

The child enters Landing Meadow on Day 1. The planet is quiet. The selected daily habits are visible as today's real-life actions.

When the configured threshold is reached:

1. the domain layer records the completed habit,
2. the story state becomes `firstLightRevealed = true`,
3. `pendingSequence = "first-light"` is persisted,
4. Phaser performs the authored First Light reveal,
5. the meadow gains a visible path and brighter state,
6. the distant light becomes persistent,
7. the sequence settles by clearing `pendingSequence`.

If the app reloads after the mutation but before the sequence settles, the reveal is replayable from durable state. If the sequence already settled, the final revealed world is drawn directly.

## Current implementation

- `src/domain/storyProgress.ts` owns the deterministic Day 1 mutation.
- `src/app/state.ts` persists completed habits, story event history, First Light truth, and pending presentation state.
- `src/world/WorldHost.tsx` owns the Phaser presentation and authored camera/light/path sequence.
- `src/app/App.tsx` renders today's habit controls and connects domain → persistence → Phaser.

## First Meeting correction

The companion's first Live conversation now receives the exact habits selected by the parent and the configured daily threshold. It must explain:

- the child's actual habits by name,
- how many are required each day,
- habits are not coins or points,
- completing the daily requirement moves time/story/world state,
- the companion encourages but never guilts or makes friendship conditional.

## Character viewport correction

Character selection and first-meeting stages use a deliberately smaller contained full-body SVG footprint. The world overlay is allowed to use a larger presentation footprint separately.

## Not yet in this milestone

- parent-approval verification modes,
- Day 2 / River Clearing,
- server-side durable persistence,
- real mobile companion calls,
- full authored voice assets.

Those extend the same contracts rather than replacing this loop.
