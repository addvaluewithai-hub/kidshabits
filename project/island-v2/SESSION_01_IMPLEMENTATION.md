# Session 01/25 — clean-production foundation and first interactive island

**Status:** Draft PR #12, stacked on draft plan PR #8. **Not merged**. Technical initial build/visual checks were verified on [run #39983478004](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39983478004), before the most recent Nova dialogue polish; the latest commit must have its own green check. Do not claim final approval until that check and user review.

## What this session delivered

- A fresh **Phaser 4.2.1 + React + TypeScript + Vite** application added to a documentation-only base. No bulk import from legacy feature branches #2–#7.
- Actual Phaser island renderer at phone-first 900×1150 logical stage, with layered original SVG art assets separated via an `IslandArtPack` contract.
- Nova as an independent `NovaActor` in world space; idle flight, visual gaze/position changes toward touched cottage/garden, reduced-motion behavior.
- State-authoritative cottage repair and garden bloom via pure domain reducer, application controller, local storage adapter; visual state restored from saved snapshot.
- Arabic-first RTL captions and UI; two real tappable world interaction anchors, actionable feedback, keyboard accessible buttons.
- Context-aware authored Nova greeting based on island state after reload, so Nova does not greet a repaired home as "the old broken cottage".
- Vitest domain/dialogue tests, a minimal dependency guard and a GitHub Actions Playwright end-to-end flow including phone, desktop and reload screenshots.

### Concrete feature file map

```text
src/domain/island/model.ts                  stable truth for cottage/garden and snapshot v1
src/application/islandController.ts         application command boundary
src/infrastructure/storage/islandStorage.ts browser adapter; future backend behind port
src/content/island/artPacks.ts              replaceable visual resources
src/content/island/novaLines.ts             authored dialogue, state aware
src/world/scenes/IslandScene.ts             Phaser visual projection and sequence start
src/world/actors/NovaActor.ts               Nova independent movement/presentation
src/world/WorldHost.tsx                     React ↔ Phaser lifecycle
src/app/hooks/useIsland.ts                  React app state adapter
src/app/App.tsx                             app composition
src/app/WorldView.tsx                       island UI/hotspots
src/app/StoryPanel.tsx                      dialogue/feedback
src/styles/                                 tokens and responsive presentation
public/art/                                 layerable original SVG art source files
tests/unit/                                 pure state and dialogue checks
scripts/island-ci/visual-smoke.mjs          real production build UI/viewport/reload QA
```

## How to run from this code branch

Requires Node 22.18+ and npm:

```bash
npm install
npm run check       # dependency guard + unit tests + TypeScript + Vite build
npm run dev         # local Vite development server
npm run preview     # serve production build for visual review
```

To reproduce GitHub Actions screenshot checks, see [CI_AND_VISUAL_QA.md](./CI_AND_VISUAL_QA.md). CI uses **Chrome preinstalled on ubuntu-24.04 GitHub runners** instead of downloading Chromium each time; local Playwright can install Chromium as documented. Screenshot test selectors are stable and assert real app behavior, but do not assess artistic quality automatically.

## Prior PR reuse review

| Legacy draft PR | Take forward | Do not bulk import |
|---|---|---|
| #2 first meeting/world loop | product boundaries: authored beats vs live AI, initial Phaser scale and persistence | prior large App/WorldHost and day-specific timeline |
| #3 multi-world foundation | world definitions and registry idea | extra galaxy scaffolding before one island is great |
| #4 parent verification | clear trust/approval policy ideas for session 12–14 | parent UI not needed in Session 01 scaffold |
| #5 visual foundation | quality ambition, galaxy flow for future | old world-specific CSS and scene coupling |
| #6 art runtime | semantic manifest/asset registry direction | unproven runtime modules wholesale |
| #7 ten-day Story Lab | first ten story ideas and learnings | hard-coded ten-screen procedural story as v2 gameplay |

Current implementation is genuinely new code and does not depend on any prior draft source file or on private PixiLive sync at build time. Nova v1 is an **authored visual actor**, not the actual live-AI voice integration.

## Verified evidence so far

- [Workflow #39981298570](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39981298570) build/unit PASS, visual FAIL due Scene lifecycle access before boot. Fixed.
- [Workflow #39982930606](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39982930606) build/unit/visual PASS (6 screenshots); reviewer spotted small typography, status overlaps and reduced-motion gaps.
- [Workflow #39983478004](https://github.com/addvaluewithai-hub/kidshabits/actions/runs/39983478004) build/unit/visual/reload PASS (8 screenshots). Manual visual review of actual artifacts passed **technical composition baseline** but did not approve final game art.
- After that, Nova's greeting and in-scene teaser were improved; a new run is required to verify the exact final commit.

## Honest quality assessment — what must improve next

**Good foundation:** cohesive UI direction; island framing; recognizable house and ancient tree; true separate actor Nova; visible changes; saved return; phone text improved.

**Not yet global flagship art:** vector imagery is currently simplified; character faces/body, flying gesture and environment materials need authored animation and production-quality layered illustration. No proper art bible yet (Session 02); camera / palette / lighting / motion reference must be reviewed before locking a style.

**UX debts:** 
- On a small phone, longer Nova dialogue is in the panel below the first fold. Short in-scene subtitles were added; eventually audio subtitles and focus management need a refined design.
- The in-scene result badges/buttons are touch-friendly but may feel overly HUD-like; test more diegetic treatments.
- Keyboard/screen-reader semantics of rendered world beyond HTML hotspots require later audit.
- Responsive safe areas and reduced motion have initial paths but need actual device tests.
- Sound, tactile haptics, particle effects, p5 procedural art, story seeds, parent app and live AI aren't present yet. Do not pretend they are complete.
- App's initial JS bundle is ~1.6 MB minified due Phaser; future production optimization needs code splitting and measured load time.

**Bar to close the session:** latest code build/unit + Playwright screenshot+reload pass on exact SHA, source size guard remains advisory only, screenshots manually inspected, user approves visual direction and no remaining critical functional bugs, docs PR #8 and canon alignment reviewed before production merge.

## Session 02 recommendation

Lock an extremely high standard for **art direction and Nova character design**, with multiple exploratory keyframes and one approved source/art asset workflow. The existing SVG assets are replaceable; don't build lots of days on provisional art. Continue UI/UX quality reviews from day one instead of pushing polish into Session 25.
