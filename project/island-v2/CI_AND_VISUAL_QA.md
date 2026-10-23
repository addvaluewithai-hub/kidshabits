# GitHub Actions + screenshot proof protocol (Island v2)

## The critical distinction

The original `main` branch is **documentation-only** as of 2026-10-23. Runnable app files (`package.json`, Phaser/Vite/React sources) exist on earlier **draft feature PR branches**, not on `main`. Therefore **no valid production screenshot can be generated from this planning PR alone**.

This folder adds a staged CI pipeline:
1. **plan-validation:** executes immediately, checks frozen 25-session plan, tracker and mandatory documentation contracts, then **runs the modular source guard**. When no \`src/\` exists it reports SKIP, not code-quality pass.
2. **production-visual-proof:** executes **only when a root production `package.json` exists**, builds the real Vite app, drives it using Chromium/Playwright, captures **phone + desktop screenshots**, and fails when specified interactions are absent. It never uses a placeholder HTML fixture or takes a screenshot of the documentation.
3. If app is absent, this workflow records a **skipped visual job**. Skipped is **NOT A VISUAL PASS**. The STATUS ledger stays blocked.

Do not configure branch required-checks until this actual production job is proven on a real app commit. GitHub required checks need repository ruleset/branch protection configured separately; a YAML workflow on its own does not prevent merges.

## Files

- `.github/workflows/island-production.yml` — CI pipeline for PRs and main.
- `scripts/island-ci/validate-plan.mjs` — zero-dependency frozen session plan/status validator and detection of an actual app.
- `scripts/island-ci/check-architecture.mjs` — guards production source files (220-line review warning, >350-line failure, forbidden domain→React/Phaser/world imports). This is not a replacement for architecture review.
- `scripts/island-ci/wait-for-server.mjs` — wait for built app preview to respond.
- `scripts/island-ci/visual-smoke.mjs` — Playwright user-journey contract and screenshots.
- `project/island-v2/STATUS.md` — human-reviewed result and evidence ledger.

## Minimum app scripts (expected once Session 01 selects baseline)

```json
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```

Existing feature branches use `npm run build` with an additional `sync:pixilive` step that fetches assets from another repository. This **may require connectivity/permission**; Session 01 must decide on a reliable pinned dependency/asset strategy if that step fails CI. Don't hide failure by removing the build step.

CI installs Node 22, dependencies, then Chromium/Playwright; it builds once and serves Vite's built output at `http://127.0.0.1:4173`. Production screenshots come from **that build**, not Vite dev server and not sample HTML.

## App visual test contract (to implement during Sessions 03–06)

A product code PR implementing the new island exposes **small, stable accessibility-friendly test hooks**. These are not a substitute for accessibility semantics (role/button labels):

| Hook | Required behavior |
|---|---|
| `data-testid="island-world"` | visible root for actual interactive island |
| `data-testid="nova-actor"` | visible Nova world actor (or accessible overlay bound to visual actor); `data-focus="idle"` before any tap |
| `data-testid="cottage-hotspot"` | clickable, visible control representing real cottage |
| `data-testid="garden-hotspot"` | clickable, visible control representing real garden |
| `data-testid="cottage-change"` | visible only after real cottage change; includes meaningful text/state |
| `data-testid="garden-change"` | visible only after real garden change; includes meaningful text/state |
| Nova `data-focus` attribute | equals `"cottage"` after cottage tap, `"garden"` after garden tap |

**Do not insert invisible flags only to satisfy tests.** Screenshot reviewer must see that actual artwork changes, not just hidden DOM text. Feature implementation should use ARIA accessible real buttons where practical, even when the renderer is Phaser/canvas.

Future tests add stable demo/debug URL overrides for predetermined world snapshots and deterministic day-jump; screenshot tests run under `?ci=1` in a safe mock mode with no live AI or real child info.

## Expected screenshots per run

```text
artifacts/island/
  phone-390x844-initial.png
  phone-390x844-cottage.png
  phone-390x844-garden.png
  desktop-1280x800-initial.png
  desktop-1280x800-cottage.png
  desktop-1280x800-garden.png
  ci-result.json
```

Screenshots are kept even on test failure as long as the app loaded. If it cannot build/start, no screenshots can be created, and the CI run fails with logs — **never claim screenshots exist when they don't**.

CI asserts selectors and changes; visual **beauty, composition, emotion, and child suitability still require a person looking at screenshots and short video**. GitHub Actions screenshot artifacts are proof of rendering, not an automatic aesthetic sign-off.

## Local reproducibility once a working app branch is chosen

```bash
npm install
npm run build
npm install --no-save --no-package-lock playwright@1.56.1
npx playwright install chromium
./node_modules/.bin/vite preview --host 127.0.0.1 --port 4173 &
node scripts/island-ci/wait-for-server.mjs
node scripts/island-ci/visual-smoke.mjs
```

CI uses `npx playwright install --with-deps chromium` because the runner needs Linux browser dependencies. Versions pinned for reproducibility of the **test runner only**; update deliberately in a PR.

## Session gate procedure

1. PR opened from correctly chosen production baseline.
2. Check `plan-validation` and `production-visual-proof`.
3. Confirm visual job did not skip and succeeded **on the same commit SHA** intended for merge.
4. Download `island-screenshots-*` from that run and look at them, plus any screen recording.
5. Review interaction change, Nova focus, responsive layout, Arabic/RTL, cropping, eye lines, loading placeholder and visual quality.
6. Update [STATUS.md](./STATUS.md) with commit SHA, run URL, artifact, screenshot outcome, review decision and next session.
7. Only then move to next session.

### When we're ready: GitHub protected branch setup

Repository owner/admin should configure Settings → Rules → Rulesets (or branch protection for `main`) to require a successful **actual app** `production-visual-proof` check and build/unit checks, require PR review, and prevent force pushes. Do this *after* that check runs successfully on integrated baseline; skipped checks must not be mistaken for passing tests.

## Known limitations

- The CI is authored as part of this planning PR; no workflow run has been verified just by committing files. Inspect Actions run/jobs before calling setup complete.
- Existing feature PR builds may need authenticated retrieval of pinned PixiLive private resources; report failures openly.
- Screenshot rendering on Ubuntu Chromium ≠ real-device iOS/Android QA. Manual device checks are separately mandatory.
- A static image or canvas screenshot alone cannot prove depth of interactivity. We assert real DOM interaction signals and save/reload in subsequent sessions.
