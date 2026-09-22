# KidsHabits

**A living story world that moves forward when a child makes healthy progress in real life.**

KidsHabits is a mobile-first child experience built around one idea:

```text
Real-life habit
→ world changes
→ story continues
→ companion reacts
→ child becomes curious about tomorrow
```

This is intentionally **not** a conventional habit tracker covered in stars, streaks, coins, and reward chests.

The child experiences KidsHabits primarily as an adventure. Parents configure the real-world habits behind it.

## Product direction

A major habit journey becomes a **30-day story planet**.

Each successful day advances the living world through a reveal, persistent change, new character, mystery, story beat, or meaningful choice. A planet is composed from a small number of reusable 2D / 2.5D locations rather than one giant illustration per day.

The flagship companion is **Nova**. Major moments are authored and deterministic; normal conversation is live AI:

> **Core moments = authored. Conversation = live AI.**

Nova exists inside the world, reacts to discoveries, talks naturally with the child, and can support parent-approved incoming call experiences for meaningful story moments.

The child can eventually choose between companion characters, and the chosen companion gets to know safe, useful preferences such as the child's preferred name and story history.

## Parent experience

Parents handle the practical layer:

- create the child profile,
- choose a small set of habits,
- choose trust or parent-approval verification,
- define the daily progression threshold,
- configure notifications / Nova calls / quiet hours,
- review progress without turning the experience into pressure.

The intended parent outcome is:

> **“I configure a few habits and confirm what matters in seconds; the story provides the motivation instead of me constantly nagging.”**

## Child experience

The child should feel:

> **“Nova and I are discovering my world together.”**

A typical session opens directly into the current world location. The child sees what changed, talks to Nova, completes real-world habits, triggers the next authored story beat, and leaves with a reason to wonder what happens tomorrow.

No friendship or affection is conditional on habit completion. Missing a day may pause progression, but Nova never uses guilt, disappointment, abandonment language, or emotional pressure.

## Technology direction

KidsHabits starts clean on **Phaser 4**.

Phaser is responsible for the child world:

- reusable layered 2D / 2.5D scenes,
- cameras and parallax,
- character animation,
- particles and visual effects,
- story-object state,
- touch interaction,
- audio synchronization,
- persistent world presentation.

The world should combine selective illustrated assets with Phaser's own rendering capabilities rather than depending on a new full-screen render for every story day.

The mobile/platform layer owns device capabilities such as permissions, push/background delivery, and native-feeling incoming call presentation.

The AI provider is kept behind an interface so live conversation is not coupled permanently to one vendor.

## Start here

### Product source of truth

[`project/PRODUCT_VISION.md`](./project/PRODUCT_VISION.md)

This describes the complete intended product: 30-day planets, child and parent onboarding, companion selection, live AI, authored story moments, Nova calls, world architecture, story authoring, persistent choices, emotional boundaries, production workflow, and success criteria.

### Phaser implementation knowledge

[`project/skills/phaser/CATALOG.md`](./project/skills/phaser/CATALOG.md)

The repository contains the curated Phaser 4 skill library under:

```text
project/skills/phaser/
```

Before substantial Phaser work, use the catalog to select the smallest relevant set of skills and read those `SKILL.md` files first.

## Engineering principles

1. **Phaser 4 clean start.** Do not design for Phaser 3 compatibility.
2. **World state over reward currency.** Prefer visible persistent consequences to arbitrary points.
3. **Reusable locations over daily hero images.** A location should evolve across multiple story days.
4. **Story content over hard-coded day logic.** New planets must be data-driven.
5. **AI does not control progression.** Habit completion, unlocks, and story state are deterministic.
6. **Important moments are authored.** Exact animation, camera, line, timing, audio, and VFX are controlled.
7. **Live AI knows only current discovered state.** Never expose future plot information.
8. **Mobile portrait first.** The target experience is a phone, not a desktop browser game.
9. **Developer tooling is a feature.** We need instant story-day jumping, state editing, AI mocking, reset, and screenshot workflows.
10. **Curiosity is the main retention mechanism.** The best ending to a daily session is: “What happens tomorrow?”

## First world

The first intended planet is **Sprout Planet**: a quiet world that gradually wakes up as the child's real-life progress continues.

Early story language includes a mysterious light, a hidden path, a glowing seed, a choice that permanently changes the environment, the discovery of Lumi, helping Lumi, and revealing the next region.

This is the beginning of the product—not a fixed seven-day prototype. The architecture should be designed from the start for complete 30-day planets and future worlds.
