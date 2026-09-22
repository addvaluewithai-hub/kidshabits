# Milestone 0 — First Meeting

This branch starts production implementation of KidsHabits.

## What is implemented

The first deployable workflow is intentionally broader than a static Phaser demo:

1. parent welcome and basic voice/call/quiet-hour preferences,
2. child profile,
3. initial habit selection and deterministic daily threshold,
4. parent → child handoff,
5. companion selection,
6. a real animated companion stage,
7. Gemini Live conversation through a server-issued ephemeral token,
8. the first Sprout Planet introduction,
9. a real Phaser 4 Landing Meadow host.

State is persisted locally so refreshes return to the same product phase.

## PixiLive runtime source

KidsHabits currently consumes the proven PixiLive character runtime as a **pinned vendor dependency behind our companion boundary**.

Pinned source:

- repository: `addvaluewithai-hub/pixilive`
- branch lineage: `feat/character-engine`
- commit: `92a814dc82931f0e6d6d0a532f721efe52fd8180`
- flying-character base commit: `d8643ca04a211d624717c3c59728962ae60677b6`

The build syncs only the character engine + Live runtime files required by KidsHabits. It does not depend on a mutable PixiLive deployment URL.

Characters available at this milestone:

- Ember / إمبر — fox
- Louz / لوز — cat
- Sugar / سكّر — rabbit
- Bondoq / بندق — bear
- Lumi / لومي — flying sprite
- Naseem / نسمة — flying sprite

Lumi and Naseem retain independent bounded flight while expressions, gestures, speech and lip-sync continue concurrently.

## Security boundary

The Gemini API key is never bundled into Vite client JavaScript.

`functions/api/gemini-token.ts` runs on Cloudflare Pages Functions and exchanges the server-only key for a short-lived Live token. `GEMINI_API_KEY` is the preferred variable name. A lowercase `gemini_api_key` fallback exists only so the first connected environment does not fail while settings are being normalized.

Set the secret for both Production and Preview deployments.

## Architectural note

This milestone intentionally vendors PixiLive's current SVG renderer to get the companion relationship in users' hands immediately. Product code talks to the semantic character/session APIs, not to SVG geometry directly. We can later replace the renderer with a Phaser-native actor without changing companion identity, story state, or Live-AI policy.

The next milestone should move from the onboarding relationship proof to the deterministic `Landing Meadow: First Light` transition:

`habit → domain state → persist → authored sequence → camera → companion → world change → audio → reload`
