# KidsHabits — Island World v2 (product pivot proposal)

**Status:** Product direction approved in conversation; architecture/design proposal for GitHub review. **Not yet merged or implemented.**  
**Audience:** children around 8–10, starting with a 9-year-old user test; parent-controlled configuration.  
**Working title:** *The Little Wonder Island* / *جزيرتي العجيبة*. Final brand/name remains open.

> **A magical world that grows with the child.**
>
> Real-world habits unlock creative possibilities. The child owns an evolving island, builds a home, grows a garden, discovers friends and mysteries, and is accompanied throughout by an expressive AI character (Nova).

## The decision

We are **pivoting away from a rigid 30-day sequence of cinematic story scenes** as the main product. The heart is now **create + nurture + discover + companion**. Short authored story moments punctuate the world; the world itself persists. We will prototype a coherent island and test whether the child *wants to return voluntarily* before committing to 30-day production.

The previous 10-day story-only exploration in PR #7 is an experiment, **not the new product blueprint**. Preserve useful assets or lessons but do not build v2 on its hard-coded day-by-day presentation.

## Read in order

**ابدأ هنا بالعربي:** [PLAN_AR.md](./PLAN_AR.md) — ملخص عملي شامل للفكرة والخطوات وأول عشرة أيام.

1. [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md) — audience, game loops, emotional goals, family boundaries.
2. [NOVA_COMPANION.md](./NOVA_COMPANION.md) — character behavior, live AI, authored dialogue, safety.
3. [FIRST_10_DAYS.md](./FIRST_10_DAYS.md) — playable ten-day outline with building, choice, mystery and state.
4. [ART_AND_CONTENT_PIPELINE.md](./ART_AND_CONTENT_PIPELINE.md) — cohesive art, sprites/video/p5, production assets.
5. [TECHNICAL_CONTRACTS.md](./TECHNICAL_CONTRACTS.md) — state, game architecture, integration and save rules.
6. [ROADMAP_AND_ACCEPTANCE.md](./ROADMAP_AND_ACCEPTANCE.md) — small GitHub deliverables, tests, gates, next PR.

## Repository alignment / precedence

- This folder proposes the **v2 experience direction**. Existing `project/PRODUCT_VISION.md`, `project/ARCHITECTURE_PROPOSAL.md`, `project/ARCHITECTURE_PRODUCT_FLOW_V1_1.md` and `AGENTS.md` remain on `main` and are not silently overwritten.
- On approving this proposal, a **separate, explicit alignment PR** must update the canonical vision/agent instructions to remove the assumption that every successful day primarily advances a linear 30-day plot.
- Preserve solid established rules: Phaser 4 clean start; domain state outside renderer; authored core moments / AI conversation; safe memory; Arabic-first; mobile portrait; parents own habit authority; no guilt.
- Do not treat ten days of content as ten separate scenes or ten videos.

## Definition of success

A child can return to a world **they changed**, see their previous choices, spend a few enjoyable minutes building or exploring with Nova, and leave curious to continue. Parents can set a few habits and verify progress quickly. The world never punishes missed days.

## First action after review

Start with [Roadmap: Slice 0](./ROADMAP_AND_ACCEPTANCE.md#slice-0--prove-the-beautiful-island-and-nova), which delivers a beautiful, **interactive** tiny island, a recognizable animated Nova, and camera/interaction feel — before expansion to ten days or production voice calls.

We work on one issue/branch/PR at a time, posting phone screenshots/video and test evidence before merging.
