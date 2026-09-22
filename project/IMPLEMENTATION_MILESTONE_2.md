# Implementation Milestone 2 — Companion in the World + First Journey

This milestone removes the temporary idea of a standalone companion chat screen and makes the companion part of the world experience itself.

## Product rule

**The child does not leave the world to talk to their companion.**

The companion is a character inside the current location. Conversation can open as an in-world sheet / overlay, but the world remains the context underneath it.

## First-time companion guide

After the child chooses a companion, the app enters Sprout Planet immediately.

The first voice interaction happens over the world and has a deterministic product role:

1. greet the child by name;
2. state the exact habits configured by the parent;
3. explain the exact daily threshold (`N of M`);
4. explain that habits are not currency or points;
5. explain that real-life progress advances time, changes the world, and reveals story events;
6. explain that the companion remains supportive and never makes friendship conditional on habit completion;
7. end the explanation without asking the child a question.

The guide turn automatically closes after its first completed response. It does not wait for open-ended conversation and does not ask the child which habit to do next.

After that, free conversation remains available through **Talk to companion** inside the world.

## AI authority boundary

The Live model receives current durable state as context, but cannot change it.

It must not:

- invent a completed habit;
- invent a new objective;
- unlock a region;
- move story day;
- invent rewards;
- claim a story event happened when durable state says it did not.

State decides what is true. AI talks about what is true.

## Live turn boundary fix

KidsHabits now pins PixiLive commit:

`ec54aa03cc16dab1b8cfd1e7a356083cec735c82`

That reference hardens Gemini Live voice turn completion with:

- explicit high start/end speech sensitivity;
- a 650 ms server silence window;
- client PCM speech-boundary observation;
- `audioStreamEnd` as a fallback finalization hint after a real utterance followed by sustained silence.

This addresses the failure mode where the child answers, the agent stays silent, and only responds after a second "hello" utterance.

## Character framing

Product surfaces do not inherit the roomy Character Lab camera.

`CompanionStage` sets a tighter SVG `viewBox` for product cards so the full silhouette is visually centered rather than sitting at the bottom of a large stage. Flight-capable characters retain enough stage bounds for movement.

## First Journey

After the first-light reveal settles, a deterministic story action appears:

**Follow the light to the river.**

Selecting it performs the same transaction rule as all story progress:

1. domain validates the action;
2. durable state changes `currentLocation` to `river-clearing` and records the story event;
3. `pendingSequence = river-arrival` is persisted;
4. Phaser performs the authored transition;
5. presentation completion clears `pendingSequence`.

The River Clearing is a reusable second location, not a full-screen replacement image.

## What this milestone proves

- companion and world coexist;
- onboarding conversation has a bounded job and exits by itself;
- free conversation is grounded in current story state;
- Live voice turns finalize reliably;
- one planet can contain multiple reusable locations;
- location changes are deterministic state transitions presented by Phaser;
- the product is starting to behave like a living story world rather than a sequence of app screens.
