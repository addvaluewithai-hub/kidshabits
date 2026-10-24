# First Ten Progress Beats — Our Home Grows, One Piece at a Time

**Proposal 2026-10-24, pending review.** Supersedes the *proposed* first-ten traversal into creek/bridge/Lumi/gate. The first ~10 qualifying progression steps happen in **one full-screen Three.js grounded home, barren garden and eventual cottage interior**, at child-height perspective. **No outside adventure until the home becomes a place the child truly loves.**

Read the complete rationale, staged component schema, player choices and test hypotheses in [RFC-002 — Home & Garden First](./HOME_AND_GARDEN_FIRST_10_RFC.md).

## Player fantasy

On first arrival, the little cottage looks neglected and not quite usable, with a roof leak, broken door, dusty windows and a small barren, weedy yard. It is warm and safe, not frightening or a home the child must rescue urgently. Nova and the child restore a **small but visible part** of it at a time. Over the first ten steps, they turn it into a delightful furnished starter home surrounded by a lush garden they *chose and arranged*. The tiny outdoor region is a familiar home base, not an entire map.

**One main transformation per qualified beat**, backed by several tactile mini-actions and a choice; optional free decorating/exploration can continue between beats. Avoid a one-tap house transformation or ten repetitive "tap to repair" videos. No required ten-day consecutive streak: a `beat` is a qualified progress opportunity according to the family's goal policy; if a day is missed, progress stays safe.

## Before / middle / after: 3D visual evolution

| Stage | Cottage outside | Garden/yard | Cottage inside |
|---|---|---|---|
| 01 | tiny weathered home, damaged door/window/roof | dry patch, weeds and poor path | closed at first |
| 03 | usable door and cleaner window, obvious roof work remains | first prepared plant bed | glimpse of a dusty room |
| 05 | patched roof/porch steps, chosen trim and small welcoming sign | first seedling + second empty bed | ready to enter |
| 07 | recognizable charming house entrance | leaves and second species planted | repaired wall/floor, first rug/lamp |
| 09 | inviting little cottage with child-chosen details | several flower/plant kinds, stone path/lantern | cozy window nook/books/art corner |
| 10 | bright, personalized, **complete starter** cottage | varied, colorful, clearly child-designed garden | welcoming furnished first room |

This is cumulative geometry/material/lighting change — not changing DOM badges or swapping a single canned before/after image. The finished starter home may gain new optional rooms or a greenhouse in future chapters. No wilting/death from absence.

## Ten meaningful progression beats

| Beat | Main gameplay action | One main world transformation | Supporting touch / own choice | Nova & next curiosity |
|---|---|---|---|---|
| **1 — "البيت اللي لقيناه"** | Meet Nova; examine house damage; sweep **one short section** of front path and name the place. | Access path restored, house still very broken. | Choose where to place home sign. | "شايفة قد إيه المكان محتاجنا؟ نبدأ حتة حتة." Curious loose door. |
| **2 — "أول باب جديد"** | Fit a door plank/knob by placing parts. | Broken door becomes working door. | Door color/handle, clear a tiny weedy plot outside. | Nova opens it; window stays cracked. |
| **3 — "الشباك والنور"** | Restore windowpane/shutters. | Light enters visibly. | Choose shutters and set edge of first garden bed. | Roof drip invites investigation. |
| **4 — "سقف يحمي بيتنا"** | Repair just one damaged roof section with simple placement. | Roof no longer leaks in that area; other aging details remain. | Choose and plant first seed in one bed; growth starts tiny. | "يااه! المطر مش هينزل من هنا تاني." |
| **5 — "سلم البيت"** | Rebuild uneven front steps/porch. | Entrance becomes welcoming; still a small unfinished cottage. | Choose sign/steps; first plant becomes small leaves. | Nova suggests peeking indoors. |
| **6 — "أول أوضة"** | Guided doorway visit; clean floor and repair one wall. | Previously dusty starter room usable. | Choose wall/floor finish; prepare second bed outdoors. | Empty nook awaits child's own ideas. |
| **7 — "ركن دافي"** | Place rug + lamp/table in safe layout anchors. | First comfortable living corner and warm light. | Pick rug/lampshade, plant a **second different** seed. | Nova notices child's chosen arrangement. |
| **8 — "على ذوقنا"** | Paint an interior wall and add curtains/shelf. | House has distinctive personal interior style. | Lay small garden path/edging outside. | "الأوضة دي بقت شبهك!" |
| **9 — "بيتنا بقى له روح"** | Build a reading/craft nook by the window. | Furnished useful starter room. | Flower bed now varied; choose small trellis/lantern/plant arrangement. | Nova notices several results, not day count. |
| **10 — "شوفي عملنا إيه!"** | Final small home-and-garden flourish; interactive, skippable walk-through. | **Starter house & first room** charming, garden lush and varied, with real saved choices. | Child chooses final personal emblem/placement; before/after gallery. | Nova celebrates the world they made, then subtly points to a **future outer path**. No outside mission yet. |

**External adventures begin after beat 10**: path toward tree/forest, creek, Lumi and related characters/mysteries are now **Chapter 2 (beat 11+)**, not within these ten. The home remains a beloved return destination; adventures can bring optional new decor or plant species *back to* the house.

## "A real play moment", not an unlock screen

Every beat has at least one short repeatable/practicable activity: remove obstructing objects, align/place a part, paint/choose a material, set a planter, plant and position, arrange movable furniture, inspect a physical change. Use a guided eye-level camera, meaningful feedback/FX and Nova cues; do not force a ten-second video and call it gameplay.

Qualifying real-world habits open a **new repair/planting/design opportunity**. Existing furniture, grown plants and play tools remain usable **even if no new habit is verified**. No coins, streaks, daily countdowns, animal abandonment messages or penalties. Family-defined cadence may give a small step per day, but "day" is a storytelling convention and must not force engagement.

## Content/data pipeline for implementation

Store `houseParts[{partId,stage,styleId}]`, `gardenBeds[]`, `plants[{instanceId,speciesId,anchorId,stage}]`, `interiorPlaceables[]`, `completedBeatIds[]`, `discoveredFacts[]`, and semantic positions. Avoid `dayN` booleans coupled to renderer code. Stage changes and animation events should be versioned and idempotent, reversible decoration distinct from permanent repaired structure. No saved mesh IDs, CSS pixels or re-completion bug.

Camera rigs focus on `arrival_path`, `front_door`, `roof_repair` (still physically child-level), `garden_bed`, `living_room_entry`, `living_corner` and `garden_overview_from_path`. Never switch to high bird's-eye/orthographic just to show home progress. Keep Nova at correct eye-line, skippable authored reactions and quiet moments.

**Existing Session 01 code** does instant `RESTORE_COTTAGE` and `PLANT_GARDEN`; this was an approved technical scene prototype, **not** the ten-beat product mechanic. Add a domain migration to incremental repairs in a later focused PR; don't silently rewrite the accepted 01/25 evidence.

## Testing priorities

1. Can a 9-year-old describe the next **small thing they personally want to fix** before any prompt or reward?
2. Are steps 2–4 meaningfully different mini-actions, not identical repetitive tapping?
3. Can a child tell that after 3/5/10 qualifying steps the *same* home grew gradually — neither instant palace nor disappointing imperceptible change?
4. Does chosen door color, first plant position, room layout persist after reload and affect the 10th reveal?
5. Does free-play work if progress doesn't qualify today? No guilt, no decay, no pressing child to return tomorrow.
6. Does the child genuinely want to go **home** after Chapter 2 adventures?

**Gate:** test a 3-stage cottage/garden vertical slice before producing ten premium states; stage 10 art should be a readable, inviting reference target from the start. See [Roadmap](./ROADMAP_AND_ACCEPTANCE.md), [25-session plan](./SESSION_PLAN_25.md), [STATUS](./STATUS.md).
