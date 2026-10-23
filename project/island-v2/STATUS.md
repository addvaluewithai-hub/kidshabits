# KidsHabits Island v2 — STATUS (single source of execution truth)

**Last updated:** 2026-10-23 (baseline setup; no production session completed)  
**Plan revision:** `SESSION_PLAN_25.md` baseline v1 (25 provisional sessions)  
**Project status:** **PLANNING READY / IMPLEMENTATION NOT STARTED**  
**Active session:** **01 / 25 — choose and verify a production code baseline**  
**Completed implementation sessions:** **0 / 25**  
**Current status:** **BLOCKED ON REVIEW + RUNNABLE BASELINE**, not green  
**Next execution issue:** [#10 — Island + expressive Nova](https://github.com/addvaluewithai-hub/kidshabits/issues/10) (after Session 01 baseline)  
**Master tracking issue:** [#9](https://github.com/addvaluewithai-hub/kidshabits/issues/9)  
**Product proposal:** [PR #8](https://github.com/addvaluewithai-hub/kidshabits/pull/8) (draft; `docs/island-world-product-plan-v2`)  
**Canonical main:** `main` remains documentation-only as last verified on Oct 23, 2026; no root `package.json` on `main`. Verify again before work.

> **⚠️ Important:** GitHub CI may validate the planning files today, but **NO production game screenshot or playable new-island build has passed CI yet**. Never mark Session 01 done based solely on documentation/CI infrastructure passing.

## Current factual snapshot

| Gate | State | Evidence / blocker |
|---|---|---|
| V2 product vision written | ✅ ready for review | docs PR #8; Arabic plan, blueprint, first 10 beats, Finch research |
| 25-session execution estimate | ✅ documented | [SESSION_PLAN_25.md](./SESSION_PLAN_25.md); planning estimate only |
| Status and one-session-at-a-time protocol | ✅ documented | this file, [CI_AND_VISUAL_QA.md](./CI_AND_VISUAL_QA.md) |
| Initial production target | ✅ defined | [issue #10](https://github.com/addvaluewithai-hub/kidshabits/issues/10) |
| V2 product approved + merged to `main` | ⏳ pending | PR #8 is draft; `PRODUCT_VISION.md` still describes linear 30-day journey |
| Actual production app baseline | ❌ not yet selected | Existing draft code PRs #2–#6 have app code on feature branches; `main` has no root package |
| Local release build on selected v2 branch | ❌ not run | No selected implementation branch yet |
| Github Actions game build + behavioral tests | ❌ not verified | New CI harness is proposed; must first run on real app PR |
| GitHub Actions **real game screenshots** | ❌ not produced | Run Playwright on actual Vite app after Session 01 |
| Reviewer checked screenshots | ❌ not started | Save screenshot artifact/run URL + review decision here |
| Phone hardware performance tested | ❌ not run | Simulator/emulation alone is not device validation |
| Child safety/live AI QA | ⏳ future | Mock conversation initially; parental opt-in and privacy before live AI |

## Pre-session 01 checklist

- [ ] Review/approve proposed v2 doc changes; decide fate of old story lab PR #7.
- [ ] Audit code branches PRs #2–#6: compare overlap and dependency; choose clean code integration strategy, not blind merging.
- [ ] Explicitly reconcile canonical `project/PRODUCT_VISION.md`, `AGENTS.md`, and any new tech docs with island-led v2.
- [ ] Choose **one** source branch/SHA for the first real app. Record below.
- [ ] Clone/build with `npm run build`, capture build log and tested commit SHA.
- [ ] Enable visual CI on that app PR; satisfy stable test IDs and interaction contracts.
- [ ] Run CI; verify actual screenshots downloadable from artifact; inspect visuals.
- [ ] Only then update this status with a `PASS` and mark Session 01 completed.

### Selected baseline

- Repository: `addvaluewithai-hub/kidshabits`
- Production branch: **NOT SELECTED**
- Base SHA: **NOT SELECTED**
- App framework: **Phaser 4 + React/Vite anticipated from existing feature branches; not in main**
- Test command: **NOT VERIFIED**
- Preview address in CI: `http://127.0.0.1:4173` (**planned**)
- GitHub Actions workflow: `.github/workflows/island-production.yml` (**introduced on planning PR, verification pending**)
- Required check names: `plan-validation`, `production-visual-proof` (the latter must **not** be interpreted as passed if visual job skips due to absent app)

## Session ledger (immutable completed rows; edit current row)

| Session | Objective | State | Branch/PR | Evidence URL/SHA | Reviewer decision |
|---|---|---|---|---|---|
| 01 | Choose code baseline, verified build/CI app screenshots | **NEXT / BLOCKED** | TBD | none | not reviewed |
| 02 | Art bible and asset style lock | NOT STARTED | — | — | — |
| 03 | Phaser phone-first island foundation | NOT STARTED | — | — | — |
| 04 | Animated Nova actor | NOT STARTED | — | — | — |
| 05 | Cottage interaction | NOT STARTED | — | — | — |
| 06 | Garden interaction | NOT STARTED | — | — | — |
| 07 | Visual quality gate | NOT STARTED | — | — | — |
| 08–11 | Durable building / decorating | NOT STARTED | — | — | — |
| 12–14 | Parent habits + verified unlock | NOT STARTED | — | — | — |
| 15–19 | Story moments and first 10 content steps | NOT STARTED | — | — | — |
| 20–25 | Visual, test, performance, content and family QA | NOT STARTED | — | — | — |

## Latest session handoff (copy/edit in every future session)

**What exists:** Product v2 plan and draft proposal; prior Phaser production experiments remain separated as draft PRs.  
**What does *not* exist:** Verified v2 runtime on `main`; actual screenshot pass of the new island.  
**Exact next task:** Session 01 — select trustworthy code baseline from existing PRs, get a reproducible app build running, reconcile docs, run visual CI and capture screenshots from it.  
**Do not do:** Expand 10-day content, claim AI voice production ready, or merge unrelated experimental PRs.  
**Definition of Session 01 done:** chosen implementation branch/SHA + passing build + GitHub Actions **real interactive app** screenshots + human review recorded in this file.  
**Blocker / question:** product plan PR #8 must be reviewed and canonical docs aligned before production merges into `main`.

## How to update after an actual session

1. Record the **actual commit SHA**, branch, PR and CI run URL. Do not only link a moving branch name.
2. List commands, tests, screenshot artifacts and the two interactions exercised.
3. Put reviewer feedback (pass/revise/block) and describe visible issues. Automation cannot grade beauty.
4. Mark the completed row PASS only after checking evidence and explicitly approving.
5. Move the ACTIVE SESSION to the next slot only if the previous gate passes.
6. Preserve session history; if skipped/re-scoped, explain in a change log below.

### History
- **2026-10-23** — v2 product/docs PR #8 exists; 25-session plan and tracking/visual-CI protocol drafted. Implementation progress **0/25**. Prior app code exists only on feature PR branches. First real visual CI run still pending.
