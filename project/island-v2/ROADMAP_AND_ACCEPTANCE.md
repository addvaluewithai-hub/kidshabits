# KidsHabits Island v2 — incremental build roadmap and acceptance gates

**Objective:** a beautiful, lasting island-building experience with Nova always part of play. We do **not** move to polished 10-day production until the foundational slice earns it.

**Operating model:** one clear GitHub issue → one narrow implementation branch → one PR → phone screenshots/video + test evidence → review → merge → next issue. This folder is a proposal; the old canonical product docs are unchanged until an explicit alignment PR.

## Decision hierarchy

1. Child enjoyment, sense of ownership, age fit and safety.
2. Artistic consistency and responsive mobile interaction.
3. Durable product state and predictable companion behavior.
4. Reusability and maintainability.
5. Production speed and fancy technology last.

**No green status based on "the page rendered".** The relevant outcome must work and be demonstrated.

## Milestone overview

| Slice | Deliverable | Exit gate | Blocker to next |
|---|---|---|---|
| 0 | polished tiny island + persistent **visual Nova** + 2 interactions | looks/coheres on phone; child can touch two things and Nova reacts | no quality, don't scale |
| 1 | island state engine, anchor placement, save/reload | house + plant persist across refresh/resizing | no authoring without persistence |
| 2 | cottage + garden creative loop | child makes distinct choices, can revisit/edit safely | avoid decorative dead-end |
| 3 | companion authored behavior + mock speech | Nova remains present and contextually reacts across zones | no live AI prematurely |
| 4 | parent habits and deterministic unlock | trust/approval both work, no fake AI authority | no link between habits and play |
| 5 | first authored discovery + cinematic reveal | short story moment, skippable, replayable, interrupt-safe | don't start daily content |
| 6 | first 3 polished progress beats + child test | voluntary free-play and return demonstrated | no 10-day content expansion |
| 7 | first 10 progress beats from content data | all days, persistent choices, jump tool, mobile review | no 30-day plan until validated |
| 8 | optional safeguarded live AI voice | parents consent; bounded context; mock/offline fallback | no unrestricted model actions |
| 9 | family alpha hardening | age safety, performance, crash/reload, parent QA | not production launch yet |

**Note:** Slice 0 may be a proof-of-quality prototype while product-vision alignment is under review. Before any v2 production feature merges into `main`, reconcile `project/PRODUCT_VISION.md` and `AGENTS.md` in a dedicated PR with this new direction.

---

## Slice 0 — prove the beautiful island and Nova

**Goal:** one breathtaking but truthful interactive screen: old cottage, quiet tree, garden patch, environmental movement, Nova with expression/gesture, two touch targets, at least one tiny world reaction.

**Tasks**
- [ ] Art direction sheet: fixed camera/scale, color palette, lighting and Nova silhouette.
- [ ] One cohesive island composition at mobile portrait; layered into reusable background/foreground/interactive objects.
- [ ] Phaser 4 application boot + safe-area aware stage, responsive camera.
- [ ] Nova actor with idle, gesture, flight/look; deliberate behavior near cottage and garden.
- [ ] Two choices: tap cottage / tap garden; Nova points and responds differently.
- [ ] One magical effect: glowing plant/door; p5 only if quality demonstrably improves.
- [ ] Optional ambient sound and subtitles; mute works.
- [ ] Collect initial/before/after desktop and phone screenshots + short screen recording.
- [ ] Playtest the visual and touch experience, then either revise or approve.

**Acceptance:**
- Smartphone portrait without hidden buttons, stretched art, clipping, or unreadable text.
- Nova's motion stays in-frame, reaction timing matches child input.
- Both interactions do visibly different things in the scene.
- No fake "10 days" behind one reused screenshot.
- Developer can run locally following README, plus a static preview where technically appropriate.
- No live model API, accounts or real parental verification required **for this isolated visual test**.

## Slice 1 — island placement and persistence

- [ ] Define typed object catalog and anchor placement constraints.
- [ ] Move/place/recolor starter cottage accessory and one plant.
- [ ] Save state locally, reload world, restore placements at multiple resolutions.
- [ ] Undo/reposition ordinary decorative choices.
- [ ] Schema validation + migration tests; clear debug reset.

**Acceptance:** customize two separate objects → reload/close-reopen → same island, with no duplicated world events. Reload mid-animation reconstructs correct final state.

## Slice 2 — satisfying building loop

- [ ] Cottage repair sequence and two exterior styles.
- [ ] Garden plant kit with choice, placement and animated idle/growth.
- [ ] A starter interior corner or visibly useful outside area (choose based on test).
- [ ] Limited anchored object manipulation with depth/readability.
- [ ] No penalties for missed days, no plant decay.

**Acceptance:** child can create two visibly different islands and explain which is theirs, without relying on cutscene prompts.

## Slice 3 — Nova character behavior first, voice later

- [ ] Create companion contract/actor adapter, not hard-code one scene.
- [ ] Authored reaction director: on tap, place, color, leave, return.
- [ ] Mock conversational mode + safe captions, sound toggle.
- [ ] Fixed gaze/gesture anchor rules, speaker turn coordination.
- [ ] Validate no companion disappears on room/world transitions.
- [ ] Safe memory schema (allow-list) and story-state projection.

**Acceptance:** Nova knows what child built (through state), reacts consistently, can stay quiet, survives scene recreation, never issues domain commands from AI intents.

## Slice 4 — parent setup + habits → world unlocks

- [ ] Minimal parent onboarding and child handoff.
- [ ] Choose 2–3 habits; trust or approval; 2/3-style threshold configurable.
- [ ] Child marks action; parent approval queue where configured.
- [ ] Unlock one building possibility after qualification; separate domain authority from presentation.
- [ ] Block duplicate or premature unlock and test missed-day flow.
- [ ] Parent-controlled voice settings and privacy copy baseline.

**Acceptance:** trust and approval modes each trigger exactly once; rejected/pending do not; no coins/streak shame and no child-facing admin UI takeover.

## Slice 5 — authored discovery (not daily-video treadmill)

- [ ] Create one content-driven moment: old tree symbol → seed reveals → Nova responds.
- [ ] Sequence data for camera, audio, subtitles, actor gaze, object animation, effect.
- [ ] Commit story state first; resume/skip/replay with no duplicate unlock.
- [ ] Compare engine-directed reveal vs short video only if justified by quality.
- [ ] Ship with reduced-motion and missing-asset fallback.

**Acceptance:** one delightful, coherent moment that survives interruption and respects child choice.

## Slice 6 — polish Day 1–3, then test with a real child

- [ ] Implement actual content for Day 1–3 from `FIRST_10_DAYS.md`, not three cloned backdrops.
- [ ] First-run greeting, island name, first creative focus, cottage style, first plant.
- [ ] Nova authored dialogue and reactions reviewed for nine-year-old tone.
- [ ] Save/reload/zone navigation and mobile visual QA.
- [ ] Conduct consenting parent-supervised test; record observations, not child private conversation.
- [ ] Review delight, agency, comprehension and friction; revise before expanding.

**Gate:** if child prefers watching rather than playing or cannot identify what they own, iterate design before Day 4.

## Slice 7 — produce content beats 4–10

- [ ] Day definitions validated as content (not hard-coded in Phaser scenes).
- [ ] Interior decorating, tree mystery, seed branch, Lumi and shelter, creek bridge, gate tease.
- [ ] Persistent seed placement branches (visible difference after Day 10).
- [ ] Day-jump preview/debugger to QA all ten instantly.
- [ ] QA each state at phone sizes, after reload, and with sound off / motion reduced.
- [ ] Performance profiling and reusable atlas/scene memory audit.

**Acceptance:** ten progress beats can be played in order or debug-jumped; free-play remains available; visuals and choices persist. One polished island, not ten unconnected animations.

## Slice 8 — live AI voice only after safety/product readiness

- [ ] Parent opt-in for microphone/live voice and age-appropriate explanation.
- [ ] Provider abstraction + mock/offline fallback; no locked-in vendor.
- [ ] Only discovered-world facts and allow-listed memory in prompt context.
- [ ] Strict high-level companion actions; no arbitrary code/state mutations or outgoing calls.
- [ ] Bound turn-taking, subtitles, interruption recovery, response quality review.
- [ ] Child safety testing, privacy/retention decisions, deletion/review controls.

**Acceptance:** safe, predictable AI character within world, not a raw general-purpose child chatbot. If unsolved, keep authored+mock while proceeding with gameplay QA.

## Slice 9 — family alpha / release prep

- [ ] Parent dashboard clarity, goal tuning, backup/export/reset policy.
- [ ] Device performance and battery tests; low-end quality settings.
- [ ] Localization QA for Arabic/RTL and fallback English.
- [ ] Notifications/calls only if specific product need, opt-in, rate-limited, quiet-hour safe.
- [ ] Accessibility, onboarding, consent, error/offline flows and durability tests.
- [ ] Review privacy/security/legal requirements appropriate to children before any real-world release.

**Acceptance:** usable with supervision and documented constraints; alpha ≠ production launch.

---

## PR checklist (copy to every implementation PR)

- [ ] Linked milestone issue and a **small** measurable user-visible outcome.
- [ ] Updated content/schema docs when needed.
- [ ] Screenshots/short video on portrait phone showing before and after.
- [ ] Nova behavior shown (not only mock copy).
- [ ] Test evidence (unit + browser/mobile as relevant).
- [ ] Save/reload and interruption behavior verified.
- [ ] Arabic captions/RTL, no audio and reduced-motion path checked.
- [ ] Child safety, parent permissions and AI-authority boundaries respected.
- [ ] Reuse/art consistency/performance tradeoffs called out.
- [ ] No unrelated files/old architecture overwritten.

## Definition of done for all work

A change isn't "done" because code compiles. It is done when a child can understand and use it, it looks and sounds intentional on a phone, Nova's behavior fits, it survives refresh, and the reviewer can reproduce it.

## Review ritual

For each PR:
1. Share mobile preview + screenshots/video and exactly what changed.
2. Critique the visual result **against the art bible**, not just functionality.
3. Call out things that are still placeholder or don't meet our bar.
4. Decide merge / iterate / discard. Never silently merge experiments.
5. Open only the next small issue once the current boundary is proven.

## Initial GitHub issue sequence

- [ ] `island-v2: product-vision alignment` — reconcile canonical docs after plan approval.
- [ ] `island-v2: Slice 0 — beautiful island + Nova` — first user-visible result.
- [ ] `island-v2: Slice 1 — durable placement`.
- [ ] `island-v2: Slice 2 — home and garden`.
- [ ] `island-v2: Slice 3 — persistent Nova`.
- [ ] `island-v2: Slice 4 — parent/habits`.
- [ ] `island-v2: Slice 5 — first discovery`.
- [ ] `island-v2: Slice 6 — 3-day child test`.
- [ ] `island-v2: Slice 7 — ten-beat production`.
- [ ] `island-v2: Slice 8 — safe live AI voice`.
- [ ] `island-v2: Slice 9 — family alpha`.

**Do not create all implementation branches or all content up front.** Keep the vision stable, build in narrow reviewable increments, and adjust with real evidence.
