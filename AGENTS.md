# KidsHabits Agent Instructions

Before implementing product work in this repository:

1. Read [`README.md`](./README.md).
2. Read [`project/PRODUCT_VISION.md`](./project/PRODUCT_VISION.md) as the product source of truth.
3. Open [`project/skills/phaser/CATALOG.md`](./project/skills/phaser/CATALOG.md).
4. Select the smallest relevant set of Phaser skills for the task and read their `SKILL.md` files before coding.

## Non-negotiable product rules

- This is a **Phaser 4 clean start**. Do not preserve Phaser 3 compatibility unless explicitly requested.
- Build toward the **full product vision and complete 30-day planets**, not a disposable seven-day demo architecture.
- The child experience is a **living 2D / 2.5D story world**, not a conventional habit dashboard with game rewards.
- Prefer reusable scene/location kits and persistent world states over one full-screen image per story day.
- Story progression, habit completion, choices, unlocks, and inventory/state are deterministic application logic.
- **Core moments are authored; conversation is live AI.**
- Live AI must only receive story information the child has already discovered.
- Important choices should create visible persistent consequences while allowing the main story to converge later.
- Nova / companions are independent scene actors. They should not be baked into background art.
- Parent UX is calm, clear, and operational. Child UX is immersive and magical.
- No guilt, conditional affection, abandonment framing, or emotional pressure around missed habits.
- Incoming companion calls must be parent-enabled, schedulable, mutable, and respectful of quiet hours.
- Arabic and RTL are first-class requirements; the architecture must also remain localizable.
- Mobile portrait is the primary target.

## Before major implementation

For any substantial new feature, first write a short implementation proposal covering:

- product behavior,
- Phaser systems / skills used,
- state model,
- reusable assets required,
- what can be rendered or animated in-engine,
- mobile performance implications,
- persistence implications,
- AI boundary if applicable,
- QA / debug approach.

Do not blindly reproduce concept images. Use Phaser 4 capabilities to find the simplest production-quality implementation that preserves the intended emotional experience.

## Architecture bias

Keep these concerns separated:

```text
Habit / parent logic
Story state and story definitions
World rendering
Character runtime
Authored sequence playback
Live AI conversation provider
Mobile platform services
Persistence
Audio
Debug / authoring tools
```

Do not hard-code a 30-day story directly into scene classes. New story days and future planets must be content-driven.

## Definition of good work

A feature is not complete merely because it renders.

It should be:

- understandable on a phone,
- visually readable,
- reusable,
- state-safe after reload,
- testable through developer tools,
- production-minded,
- emotionally aligned with the product vision.

When uncertain, prefer the interpretation that makes the world feel more alive while keeping the content pipeline simpler.