# KidsHabits Island v2 — 25-session production plan (baseline v1)

**Frozen planning baseline:** 2026-10-23.  
**Scope:** first **10 meaningful progression steps** of the new island builder, on mobile, with Nova present.  
**Estimate:** 25 focused development/review sessions, **not** a fixed schedule or production guarantee. Art iteration, voice safety, mobile hardware testing or rework can add sessions.  
**Authority:** [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md) · [NOVA_COMPANION.md](./NOVA_COMPANION.md) · [FIRST_10_DAYS.md](./FIRST_10_DAYS.md).  
**Live operational ledger:** [STATUS.md](./STATUS.md). Update after **every** session; update with verified facts, never auto-mark green from prose.

The numbers below are *planning slots*, not promised dates. Each session produces code or a reviewable artifact in its own PR/commits with CI evidence. **No proceeding to the next phase without its gate.** This plan may be revised by a new PR, preserving the older version and recording the reason.

## Phase 1 — production baseline and visual slice (sessions 01–07)

| Session | Specific deliverable | Evidence / acceptance |
|---|---|---|
| **01** | Select runnable Git baseline: audit existing draft PRs (#2–#7), adopt/reconcile v2 architecture, preserve working code, confirm local/CI build and source-of-truth docs | Working `npm run build` from selected branch; documented baseline/ref; screenshots only if actual app exists |
| **02** | Art bible: island perspective/palette/lighting/asset dimensions; Nova expressions/motion spec; choose first cottage + garden composition | Reviewed before/after keyframes at phone width; asset list; no placeholder art approved as final |
| **03** | Phaser 4 world boot, portrait responsive safe areas, separated background/foreground/hotspots | Dev URL + working mobile viewport screenshot; no console errors |
| **04** | Nova independent world actor: correct movement/flight, gaze toward cottage/garden, expression poses | Actor visible on portrait and desktop, screenshots + automated actor state check |
| **05** | Cottage interaction: tap/choose a visible door/roof change; short Nova reaction | Automated tap, changed state assertion and before/after screenshot |
| **06** | Garden interaction: first plant/placement animation + selective particles/p5 textures | Automated tap, state assertion, visual review at phone scale |
| **07** | **Visual quality gate**: animation timing, light, subtitles, accessibility and low-end profile | 2 decisions + Nova feel intentional; review before moving on; art quality approved or stay here |

## Phase 2 — world ownership and creative loop (sessions 08–11)

| Session | Specific deliverable | Evidence / acceptance |
|---|---|---|
| **08** | Typed island object catalog, finite anchors, variants, place/move constraints | Domain tests for allowed/blocked placements |
| **09** | Persistence, restore after reload, migration strategy, interruption-safe state | E2E: name/house/plant survive refresh and app restart |
| **10** | Cottage style & basic interior kit; no dead decoration UI | Real room/exterior choices; screenshot difference review |
| **11** | Garden variety, reposition/edit freely, usable play without daily reward | Child can play using unlocked starter items and resume exactly |

## Phase 3 — parents and real progress (sessions 12–14)

| Session | Specific deliverable | Evidence / acceptance |
|---|---|---|
| **12** | Calm parent onboarding: child profile, 2–3 habits, trust/approval, mic policy | Parent walkthrough, clear child handoff |
| **13** | Deterministic habit ledger, approval queue, threshold, idempotent unlock | Automated tests for pending/rejected/approved/trust, no double unlock |
| **14** | Progress unlock integrated with world building + authored milestone queue | Habit qualification visibly changes available choices; safe reload |

## Phase 4 — authored events and days 1–10 (sessions 15–19)

| Session | Specific deliverable | Evidence / acceptance |
|---|---|---|
| **15** | Typed content schema + validator, sequence director, day-jump simulator | Schema tests + authored mock scenes without hard-coded day logic |
| **16** | Polish first 3 steps: name island, cottage, garden, authored Nova lines | Play 01–03 in sequence, save/reload, first parent-supervised child feedback |
| **17** | Steps 04–06: interior, tree mystery, enduring seed-placement branch | Both seed branches visible and persisted; interruption safe |
| **18** | Steps 07–08: Lumi discovery/arrival, nook and visitors | Lumi discoverable exactly once, nook saved, Nova performance controlled |
| **19** | Steps 09–10: creek/bridge and gate hint, no forced huge new planet | Play 01–10, debug jump, compare world at start/end and after reload |

## Phase 5 — actual production QA/polish (sessions 20–25)

| Session | Specific deliverable | Evidence / acceptance |
|---|---|---|
| **20** | Cinematic/audio polish (authored clips), options for mute/skip, reduced motion | Sequence coherent, subtitles, no blocking audio, no state rollback |
| **21** | Visual/interaction screenshot coverage at desktop + portrait phone; detect state changes | GitHub Actions screenshots: baseline, cottage, garden, early/mid/late world, Nova |
| **22** | Full mobile responsive / device performance / slow loading checks | Test actual phones where available; perf findings recorded, not fabricated |
| **23** | Reliability: saved game migrations, background/resume, offline fallback, interrupted reveals | E2E recovery + deterministic domain tests |
| **24** | Parent/child UX review + AI boundaries: mock conversational mode, privacy, accessibility/RTL | Signed-off test matrix; Live AI voice still an **optional separate workstream** |
| **25** | **Ten-step acceptance gate:** screenshot/behavior review, final bugfixes, clean docs, review PR and backlog | All critical checks green, real build verified, honest unresolved issues documented |

### Important scope boundaries

- **Nova v1** means polished in-world actor, authored lines, contextual mock conversation. **Live AI voice** isn't assumed ready merely because 25 sessions passed; it needs opt-in, safety and privacy validation and may extend the schedule.
- Production assets and animation are major risks and may need external creation/iterations. No inflated promise of studio quality in 25 sessions.
- The first 10 "days" are **ten unlock/content beats**, not calendar streaks. No obligation for daily log-in; missed days do not punish.
- World should genuinely support building and gardening, not just 10 similar scenes.
- Prior draft PRs may need selective cherry-pick/reconciliation. **Never merge all blindly.**
- Current `main` is documentation-only; Session 01 must create a verified runnable baseline first.

## PR / session protocol

1. Read [STATUS.md](./STATUS.md), identify active session and blocked gates.
2. Pull current branch and review its `AGENTS.md` + the Phaser catalog for coding work.
3. Open a narrow issue/branch referencing this plan and master issue #9.
4. Implement *one* coherent target, and add testids/state assertions alongside the feature.
5. Run local build/tests and GitHub Actions. Require screenshots generated **from a running built app**, not concept images, and review them manually.
6. Record Action run URL, screenshot artifact name, tested commit SHA, result, missing tests, observations in STATUS. A green Actions icon alone is insufficient.
7. Advance session number only when target checks pass and reviewer explicitly approves. If blocked, stay on same number and revise.

## Evidence specification

`npm run build` must pass. Playwright must assert real DOM or test bridge for `island-world`, `nova-actor`, `cottage-hotspot`, `garden-hotspot`, `cottage-change`, `garden-change`. It must click both hotspots and capture initial/after screenshots at phone width and desktop. Nova must report two distinct focuses. Later sessions add per-day transitions and state snapshots, never fake green without tested user behavior. See [CI_AND_VISUAL_QA.md](./CI_AND_VISUAL_QA.md).

**Review gate:**
- Build / typecheck / domain tests pass.
- At least two meaningful interactive actions verified in CI on the **same commit SHA**.
- Screenshot artifacts available; visual reviewer actually looks at them (manual approval), not just uploads.
- Phone safe areas, Arabic captions, Nova visibility, and reload effects checked as relevant.
- Important story/child-safety/product constraints preserved.

If a session fails, mark **BLOCKED** with exact failure and owner; no fake checkmark and no session increment.

## Change control

The plan is frozen as a **baseline** so we can compare expected to actual. A planned count shift (e.g. from 25 to 29 sessions) must be explicit in a PR, explain what changed, and update STATUS. Do not quietly rewrite completed session history.
