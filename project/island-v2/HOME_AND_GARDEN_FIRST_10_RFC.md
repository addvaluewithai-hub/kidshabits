# RFC-002 — First Ten Beats: Restore Our Home Before Exploring Outside

**Proposed:** 2026-10-24 · **Status:** PROPOSED FOR OWNER REVIEW; not merged, not implemented.
**Owner feedback:** The child should spend the first ~10 qualifying play/progression days on a visibly damaged/small cottage, barren garden and immediate surroundings. **Every return makes a modest, real, aesthetically delightful change**; only once the home feels personal, warm and lush do external adventures begin.

## What changed

Old ten-beat draft rushed from house and first flower to tree mystery, Lumi and a creek/bridge/gate by step 10. The child had insufficient time to grow emotionally attached to the house or notice slow transformation. **Replace with a cohesive, single-location home-renovation arc**:

- **01–05:** the outside: arrival, clean a little, restore door/window/roof/steps and prepare/grow early garden beds.
- **06–09:** inside: enter small house, restore wall/floor, furnish living space and cozy reading nook, while garden grows into distinct beds and visible paths.
- **10:** first-home reveal from eye-height camera: functional charming cottage + colorful personal garden; child sees *their* choices in every area. Only **a glimpse/soft invitation** of adventure beyond the yard; next chapter starts around step 11+.

**Keep:** Three/R3F full-screen ground-level perspective, Nova always in-world, parent authority for habit qualification, free play and persistence, respectful return, global-quality art, modular rendering/domain.

**Defer:** creek as playable zone, footbridge, Lumi's major entrance, mystery-tree deep reveal, gate quest or world expansion **until AFTER the first-home chapter**. The tree may remain scenery and a subtle distant mystery, not steal attention from the home.

## Central promise and reasons to return

> "كل مرة أرجع، بيتي وحديقتي فيهم حاجة جديدة صنعتها أنا."

The reasons for a next visit are **ownership, visible unfinished potential, confidence with tools, varied mini-actions and choices, Nova remembering what actually changed**. Not a long cinematic, daily log-in token or an anxious countdown. One major structural change per qualified beat, plus small freely rearrangeable decor/experiments; child chooses appearance/placement when possible.

### Progression pacing (not grind)

- Every beat introduces **one meaningful focal transformation**, often with a small supporting garden/interior touch, shown through 3D mesh variants and lighting, not just a UI percentage.
- A beat contains a short **active game action** (e.g. select planks, place/reposition, paint a panel, plant into an anchor, inspect leak, adjust a rug) with clear feedback and a choice; avoid "one tap, cutscene, come back tomorrow".
- Do not falsely lock two-minute content behind 24h waiting. In the intended family habit loop, one qualified habit opportunity can unlock one authored transformation; users may free-play with previously available tools. Test cadence with parents and supervised children, make it configurable and catch-up safe.
- Garden grows when an earned **world-state milestone** qualifies or from harmless ambient animation; do not require real-time watering, timers or returning to prevent decay. No guilt or sadness on skipped days.
- A repair can visually pass through **damaged → scaffold/in progress → repaired → customized**, with the intermediate state safely saved after leaving or refresh. Repeat visits remember exact structural and placed-object choices.
- **Personalization accumulates**, not overwrites prior decisions: door color, shutters, roof tile, planted species, planter locations, interior furniture/paint/rugs and cozy nook.
- No arbitrary coins/streaks, no infinite chores, no manipulative cliffhangers. Child should see a next possibility without being pressured to return at a specific time.

## Chapter plan — 10 satisfying but deliberately paced changes

| Beat | Main player action | House change | Garden / yard change | Child-led choice & Nova | Next potential |
|---|---|---|---|---|---|
| **1: Our little broken place** | Meet Nova on path, examine damaged cottage and dusty yard; clear the first short section of walkway. | Tiny old cottage remains in need of work; door/window/roof defects unmistakable. | Bare cracked soil + weeds; only a cleared access strip. | Name world; point to house/garden; Nova imagines a home. | "فيه خشب جنب الباب... نقدر نصلحه!" |
| **2: The door can open** | Fit a missing panel/handle, pick one of two door finishes. | Door becomes secure/openable; rest still worn. | Remove weeds from a **small first patch**, not whole garden. | Choose door color/knob; Nova tests opening gently. | A cracked window catches morning light. |
| **3: Let the light in** | Repair one window/shutters and wash glass. | Glass/shutters visibly repaired, warm interior glint; roof still damaged. | Dig/edge first compact planter, brown soil ready. | Choose window shape/shutter finish and planter side. | Drip from a loose roof section. |
| **4: A roof over us** | Fit a few roofing tiles/planks via readable placement interaction. | **One roof section** fixed; clear contrast to remaining weathered segment. | Plant the first seed in prepared planter, tiny seed/sprout only. | Choose plant type/spot; Nova points to drip stopping. | Crooked steps are now the blocker. |
| **5: Welcome home** | Stabilize porch steps and add one small house sign/mailbox. | Exterior entrance now safe and inviting; paint/weathered walls remain. | First sprout becomes a small seedling; second soil patch becomes available. | Pick sign/step style; Nova walks/flies toward doorway. | A locked-but-safe-to-enter first room awaits care. |
| **6: The room inside** | Enter with a grounded camera through doorway; clear dust and repair **one wall/floor section**. | Starter living room is usable but mostly bare, with readable before/after. | Prepare second plant bed outside, older seedling slightly fuller. | Choose which wall/floor finish; Nova reacts to the echo/light. | A warm spot for a rug and lamp appears. |
| **7: Our first cozy corner** | Place rug, lamp or tiny table in **two safe anchors**. | First cozy room zone, lighting shifts based on furniture; other interior area unfinished. | Plant a different species in second patch; first plant develops leaves. | Arrange the corner; Nova recognizes the child's real arrangement. | An empty wall and window nook can be personal. |
| **8: Make it ours** | Choose paint/curtains and rearrange a small shelf or photo frame. | Interior gets recognizable personal style (at least 2 distinct variants). | Add a short stone walkway/low fence edge between beds. | Paint/material & placeable choices; Nova references chosen colors. | A quiet reading/creative nook can fit near window. |
| **9: A little home with a garden** | Complete the reading/craft nook: seat, books or small art desk. | Small home feels lived in; cottage exterior receives optional facade trim. | Garden now shows **multiple** plant kinds/flowering; add trellis/lantern or small herb pot. | Choose nook purpose, plants and lantern spot. | "من الطريق، شكل المكان اتغيّر تمامًا..." |
| **10: Look what we built** | Finish a modest personalized cottage/garden flourish; tour outdoor → indoor → garden via guided perspective shots (skippable). | Starter cottage is charming, lit, furnished and clearly personal. | Once-barren yard is now **lush, varied, and arranged**; no instant giant tree/forest growth. | Compare before/after, preserve house+garden layout; Nova celebrates choices without obligation. | A gentle **new path invitation** beyond the yard becomes visible; real exploration starts chapter 2 (~11+). |

### First session vs progression sessions

Developer **Session 01/25** already built the technical world with instantaneous cottage/flower actions. It is a **foundation prototype**, not a depiction of the desired ten-step story. This RFC changes **future production behavior**, not the fact Session 01 was completed. Refactor demo's two booleans into domain-owned repair-stage/placed-object data **only when implementing the first-home mechanics**, with migrations and tests; don't quietly treat one-click fully repaired house as the final gameplay.

## Visual transformation requirements

- Camera/player viewpoint fixed to immersive child-eye-height **perspective**, moves naturally around the **same** house/yard and then through doorway. No aerial makeover overview and no cut-to-floating-island.
- Need ten **cumulative scene states**, with visibly distinct progress even in thumbnails, plus **recoverable intermediate actions**. Start with **very broken but friendly/not scary** house and **dry/bare but not dead/dying** garden.
- Every step adds ~one main cohesive piece: repaired wood/window/roof/steps, prepared bed, two plant types, room lighting, furniture and color. Make gradual change perceptible; avoid too many objects exploding in one day.
- Original choices persist and compound; the final showcase reflects user variants, not a single pre-rendered fixed completed house.
- Small Nova authored reactions acknowledge precise repaired section/plant/furniture; quiet enough not to overwhelm. She is delighted by experimentation, not dependent on child attendance.
- Maintain an optional album of before/after **without manipulating guilt**; let child revisit earlier memories and replay skippable cinematics safely.

## Required domain model (semantic, not Three state)

```ts
type RepairStage = 'damaged' | 'work_in_progress' | 'repaired' | 'customized';
type HousePartId = 'door' | 'window' | 'roof_front' | 'porch_steps' | 'exterior_trim' | 'living_wall' | 'living_floor';
type PlantGrowth = 'seed' | 'sprout' | 'leafy' | 'flowering';
interface HousePart { partId: HousePartId; stage: RepairStage; styleId?: string; }
interface GardenPlant { instanceId: string; speciesId: string; anchorId: string; stage: PlantGrowth; }
interface InteriorPlaceable { instanceId: string; itemId: string; anchorId: string; styleId?: string; }
interface HomeChapter {
  completedBeatIds: string[];
  houseParts: HousePart[];
  gardenBeds: string[];
  plants: GardenPlant[];
  furniture: InteriorPlaceable[];
  discoveredFacts: string[];
  styleChoices: Record<string,string>;
}
```

A typed authored `beat` declares prerequisite state, one deterministic unlock, valid change slots, camera rig, Nova cue, animation/FX and post-beat free-play. Replay/skip doesn't regrant progress; all changes versioned and migrated. Tests assert no accidental skip from beat 1 to fully finished home, stage monotonicity for structure and idempotent qualified advances. Decor can be edited again without resetting earned progress.

## Prototype before producing all ten

**Target test:** a single **three-state house/garden vertical slice** (before → visibly partial → later improved) with two camera visits and one personalized choice, and a 9-year-old supervised user test. After a short visit, ask child what they'd choose to fix next **unprompted**, whether progress seems too fast/slow and if the home feels like "theirs". Compare repeated visits over several optional days, without promising 100-day retention.

**Critical negative test:** entering after no habit completion shows the same safe home, allows rearranging known items, and Nova never scolds, worries or threatens a dying plant.

## Outdoor chapter after the home chapter

**Beat 11+** (not in first ten): mysterious tree, new forest path/creek/bridge, Lumi and visitors, larger garden extensions and additional rooms. The finished starter house remains the return anchor/home hub, not abandoned. Adventures should feed back into the home (souvenir, resource for new optional room/greenhouse, resident visit), so the first ten steps remain meaningful for **20–100+ steps**.

**Open questions:** how much customization can a 9-year-old understand per day, is "one main change" enough excitement, which exact house variant/story mood best fits, and whether home renovation is intrinsically engaging across more than a week. These need actual child testing; do not assume solved.

**Tracking:** user concept is specific; this doc proposes a conservative coherent product plan, subject to owner review. See [FIRST_10_DAYS.md](./FIRST_10_DAYS.md), [SESSION_PLAN_25.md](./SESSION_PLAN_25.md), [Issue #17](https://github.com/addvaluewithai-hub/kidshabits/issues/17).
