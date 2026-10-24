# CI & Visual QA — Full-screen Three.js World

**Effective:** 24 October 2026. Supersedes Phaser/framed-diorama screenshot checks.

## Two distinct proofs — never conflate them

1. `plan-validation` on documentation-only branch verifies **25 session rows**, STATUS active/complete consistency, decision/spec/engineering docs and source dependency rules. This is **not** a gameplay pass.
2. `production-visual-proof` only when a real root application (`package.json`, `index.html`, `src/`) exists. It installs/builds/tests, runs Chrome against the **production build**, and records **actual Three.js world canvas pixels + interactive state and screenshots**. A skipped job is **not PASS**.

GitHub Actions in PR #13 verified a **floating-island 3D spike**, not the new immersive world. Preserve those results as history. **Never re-label them as full-screen camera acceptance.**

## New required browser contract (Session 01)

Use stable accessibility labels and minimal `?ci=1` read-only debug signals. Don't place hidden DOM labels over a broken canvas and declare victory.

| Signal | Meaning |
|---|---|
| `[data-testid="world-viewport"]` | visible actual full-screen container; bounding rect near viewport in both axes and no document scroll |
| `[data-testid="world-canvas"] canvas` | live Three WebGL canvas rendered; actual pixels sampled with meaningful variation |
| `[data-testid="camera-debug"]` | readonly: `data-camera-mode="perspective"`, `data-camera-rig` and `data-camera-settled`; no orthographic camera in production |
| `[data-testid="nova-actor"]` | accessible representation tied to live in-world Nova actor/focus, not a standalone fake character |
| `[data-testid="cottage-hotspot"]` | accessible cottage focus/repair action; raycast object should call same application command |
| `[data-testid="garden-hotspot"]` | accessible garden focus/plant action |
| `[data-testid="cottage-change"]`, `garden-change` | state-visible outcomes **backed by actual 3D changes**, never only labels |
| `[data-testid="nova-dialogue"]` | authored contextual subtitle, including return after reload |

**Test-only read-only bridge** may publish scene root/mesh semantic IDs and camera numbers (e.g. `window.__KH_CI__?.snapshot()`) **only** in opt-in CI mode; no power to issue arbitrary mutations or reveal private child info. The Playwright test compares before/after scene mesh/material/visibility snapshots plus screenshot, not only text.

## Exact screenshots and journeys

For **360×740, 390×844, and desktop 1280×800**:
1. first load: path, horizon, sky, house, tree and garden, Nova visible. Perspective camera at safe arrival pose.
2. focus cottage: camera transitions to `cottage_front` at ground viewing angle; visible home state changes.
3. focus garden: transition to `garden_edge`, real 3D plant/soil state changes, Nova reacts.
4. refresh: same world state, authored return dialogue and safe camera reset.

Expected artifact paths (per viewport):
```text
artifacts/immersive/
  phone-360x740-arrival.png
  phone-360x740-cottage.png
  phone-360x740-garden.png
  phone-360x740-reload.png
  phone-390x844-arrival.png
  ...
  desktop-1280x800-arrival.png
  ...
  ci-result.json
  build.log / unit-tests.log
```

Tests also assert no JavaScript console exceptions, no horizontal/vertical page overflow, interaction controls visible and hit targets adequately sized and inside safe areas. Use `reducedMotion: 'reduce'` as one test mode and normal motion at least once to catch missing camera transitions; screenshot only *after animation settled*, never race lazy loading. Check mute/subtitles/RTL. Future sessions add interiors/tree/Lumi/creek and alternate art style assertions.

**Hard design gate requiring human review:** does it look like walking into a continuous world? The screenshot should not reveal a floating island rim or underside, a mini diorama, overhead camera or game card embedded between large text panels. These are visual judgments — no automated screenshot check alone guarantees them.

## Performance evidence

- Track per-route JS size, actual canvas render readiness, WebGL warnings and photo artifacts in CI. These are browser metrics, not device frame rates.
- At least one real representative phone for first performance gate (Session 07 if available), and more devices for Session 22: frame times under camera movement, GLB load, battery/thermal observations, DPR/LOD fallbacks.
- If the build loses WebGL, provide graceful fallback rather than blank screen; clearly separate fallback screenshot from passing WebGL test.

## Production branch and Actions

- Node pinned, TypeScript + unit tests, source guard. **No line-count hard failures.**
- With only docs, plan test passes and production visual job **skips**, labelled as such; do not mark session 01 done.
- Once new Three app exists, CI should enforce above test selectors/behavior in `scripts/island-ci/visual-smoke.mjs`. Review or replace old Phaser/Three comparison smoke — it is no longer production acceptance.
- Use built Vite preview (not dev), Chrome/Playwright with JS errors captured, upload artifacts **even if tests fail**.
- Add branch protection/ruleset requiring review and successful **real app** checks *after* these jobs actually pass on the intended branch, with skipped visual check never counted as proof.

## Session handoff

Record exact commit SHA, Actions run URL, screenshot artifact, actual interactive checks, screenshots seen, subjective visual critique (including Nova/camera/terrain/UI) and hardware unknowns in [STATUS.md](./STATUS.md) **before** advancing. No status change from just writing code or CI config.
