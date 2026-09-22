# Parent Center & Habit Verification

This milestone establishes the product boundary between real-life habit evidence and world/story progression.

## Core rule

Real-life habit completion is **app-level daily truth**, not planet state.

A child changing planets must not duplicate the same real-life action or earn multiple story advances from it.

```text
child reports habit
→ verification policy
→ pending or verified daily check-in
→ verified threshold reached
→ exactly one target world receives today's story advance
→ durable world mutation
→ Phaser presents the authored change
```

## Verification modes

Each selected habit has one policy:

- `trust` — the child's report is immediately verified.
- `parent` — the child's report becomes `pending_parent` until the parent approves it.

The companion may see whether a habit is verified or pending, but it cannot approve, reject, fabricate, or otherwise change verification state.

## Daily ledger

The app owns a `DailyHabitLedger` with:

- local calendar day key,
- check-ins keyed by habit,
- the world that today's progress started in,
- the world that already consumed today's story advance.

The ledger resets when the local day changes. World progress does not reset with it.

## One story advance per day

Once the configured verified threshold is reached, one target world may advance. Switching to another planet afterwards does not re-spend the same real-life habit check-ins.

This is intentionally separate from future planet-specific pacing rules. Later story definitions may decide what a daily advance means for Day 2–30, but the real-life verification source remains shared.

## Parent Center

The Parent Center is operational, not fantasy-heavy. It currently owns:

- pending approvals,
- approve / reject,
- habit selection,
- per-habit verification policy,
- daily threshold,
- voice permission,
- companion-call permission,
- quiet hours,
- read-only world progress summary.

Future production work should add authenticated parent entry / PIN or device-level parent gate without changing the verification domain contract.

## Safety and AI boundary

- AI never decides whether a habit happened.
- Pending habits are described as pending, never completed.
- No guilt, disappointment, conditional affection, or pressure around approvals or missed habits.
- Parent rejection simply means the habit is not verified yet; it is not a punishment event.

## Next platform milestone

After this milestone, continue with **re-engagement infrastructure** (notifications / companion calls / policy) and then planet lifecycle/content tooling. Do not deepen Sprout or Moon Garden story content merely to exercise the platform.
