# KidsHabits — Sprout Planet: First 10 Days

An **Arabic-first playable Story Lab** exploring how a 30-day KidsHabits planet could feel across its opening ten days. This is a proof of the **storytelling loop**, not the production game.

## Try it

Open [index.html](./index.html) in a modern browser (or serve this folder with `python -m http.server`). No build step required. The cinematic Day 1 canvas uses p5.js when available and has a native Canvas fallback. `story-lab.js` adds the ten-day authored experience and procedurally rendered world cues.

**How to play:**
1. Read/advance Nova's short conversations.
2. Tap **تجربة إكمال العادة** (simulate completing a habit; **no real verification**).
3. Watch the scene brighten, then read Nova's reaction and tomorrow's mystery.
4. Go to the next day, or jump anywhere with the author/QA day map.
5. On Day 4, choose where to plant the seed. The choice persists in browser storage and influences the flower in later days.

## Files

- [story-content.js](./story-content.js): data-driven story definitions for all ten days; location, habit, four pre-reveal lines, reveal, two after-reveal lines, next-day hook and choice.
- [STORY_BIBLE.md](./STORY_BIBLE.md): readable full story screenplay and effect list in Egyptian Arabic.
- [index.html](./index.html): self-contained Day 1 illustrated canvas foundation with linked Story Lab scripts.
- [story-lab.js](./story-lab.js): preview UI, deterministic state machine, persistence, QA day-jump and dynamic art cues.

## Narrative arc

- **Days 1–4 · Landing Meadow:** first light, glowing stones, singing leaves, seed placement choice.
- **Days 5–9 · River Clearing:** listening river, first bloom, luminous bridge, unknown voice, Lumi's rescue.
- **Day 10 · Great Tree Gate:** Lumi shows the way and the gate opens to tease Day 11.

## Safety & architecture boundaries

This is a **preview**: it has no child accounts, parental approval integration, live AI, real habit verification, mobile call capability or production content pipeline. All story lines are authored and major choices are deterministic. The preview's dev day selector deliberately bypasses real-world daily progression rules.

The long-term engine remains **Phaser 4** per [Product Vision](../../PRODUCT_VISION.md) and [Architecture v1.1](../../ARCHITECTURE_PRODUCT_FLOW_V1_1.md). Procedural canvas/p5-style effects are visual experiments, not a replacement for those runtime boundaries.

The concept uses one base environment with evolving overlays. **Three distinct production location kits, stronger character animation and an authored sequence/audio director are still needed** to reach the full visual ambition.

## Suggested production roadmap

1. Implement first meeting and parent flow before exposing the child journey.
2. Prove Day 1–3 in real Phaser with state engine, safe persistence, authored sequences and interruption recovery.
3. Add actual reusable River Clearing and Great Tree scene kits, backed by data definitions and visual regression tests.
4. Integrate live companion conversation only after discovered-state scoping, age-appropriate moderation and privacy controls are defined.

### Acceptance checks for the preview

- Day map contains 10 selectable days and correct titles.
- Each day: four lines before simulated habit, a reveal, two lines after, next hook.
- Day 4 offers one of two persistent seed choices; Day 6 reflects it.
- Revisiting the page in the same storage-enabled browser restores preview state.
- Mobile portrait buttons remain reachable; scene remains behind the conversation.
