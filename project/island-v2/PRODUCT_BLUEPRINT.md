# KidsHabits — Product Blueprint (Immersive World + Nova, v3)

**2026-10-24 override:** The experience is now **full-screen grounded Three.js**, *inside* the world with child-height perspective camera, guided travel and minimal accessible HUD. The floating island/diorama presentation described in early drafts is **superseded** by [IMMERSIVE_WORLD_SPEC.md](./IMMERSIVE_WORLD_SPEC.md) and [ADR-001](./ADR_001_THREEJS_IMMERSIVE.md).

**Document type:** Product design proposal; decisions are reversible until validated by a playable slice.

## 1. North star

**Child promise:** "دي دنياي. أنا اللي بغيّرها، ونوفا بتستكشفها معايا."

**Parent promise:** "أحدد عادات بسيطة وأراجع اللي محتاج موافقتي بسرعة، من غير ضغط أو زن."

Instead of `habit → coins → chest` or `habit → watch the next cutscene`, the loop becomes:

```text
Child returns to THEIR grounded immersive world
  → Nova notices the current world and responds
  → Child plays/builds/explores freely
  → Real-life habit is completed (trust or parent-approved)
  → A meaningful new possibility becomes available
  → Child chooses how to use it: build / plant / personalize / help
  → World changes persistently; an occasional secret is revealed
  → Nova reacts naturally; child wants to come back to their creation
```

Habit completion is **not** a price tag for Nova's attention or affection. Play does not require a habit every time. Default daily sessions are short, and nothing deteriorates from a missed day.

## 2. Audience and interaction

- Primary design target: age **8–10** (first test around age 9), mobile portrait, Egyptian Arabic voice-first with readable RTL captions. English/LTR must remain possible.
- Respect competence: real choices, satisfying construction, room to explore, no babyish copy, minimal tutorial.
- Parent-controlled account, age-appropriate child mode, no social feeds, strangers, ads, or public sharing in v1.
- No high-pressure engagement mechanics, indefinite rewards, daily streak punishment or countdowns.
- Be clear that Nova is an **AI character**, not a real person; avoid emotional dependency.

## 3. Fantasy, setting and emotional arc

**Working fiction:** child and Nova arrive **on a path inside a larger magical world**, reaching a quiet clearing with an old cottage, a mysterious tree and space for a garden. The ground and scenery continue into the distance. They restore and personalize a home **together**, while gentle magical life appears through persistent changes.

The connected clearing/world is a home to inhabit and a place of discovery, *not* a mandatory 30-day quest. A light mystery ("ليه الشجرة القديمة بتنوّر أحيانًا؟") creates curiosity. New rooms/biomes/characters can open later, but there must always be meaningful things to do in the current place.

**Intro script sample (authored, colloquial Arabic):**

> نوفا: "إحنا وصلنا! ... استني، هو البيت ده كان مستنينا؟"
>
> نوفا: "تفتكري لو صلحناه وزرعنا جنبه كام حاجة، الجزيرة دي هتبقى عاملة إزاي؟ القرار قرارِك!"
>
> Choices: "نبدأ بالبيت" / "نبدأ بالحديقة".

No promise of a particular scene until the actual visual/audio quality is proven.

## 4. Three connected loops

### A. Creative loop — anytime
- Tap world hotspots to inspect, move and place a limited set of objects.
- Rearrange a small selection of house furniture and garden items.
- Rename the island; choose colors, shapes and placement; undo/redo before confirmation.
- Nova points at changes and makes contextual, occasionally humorous comments.
- Persistent choices create variants without branching the whole narrative.

### B. Healthy progress loop — at most one authored transformation beat when qualified
- Parent selects 2–3 relevant habits; rule e.g. 2 of 3 to unlock a new **creative possibility**, not purchase currency.
- Trust mode or parent confirmation; pending approval never treated as completed.
- Milestone unlocks may include a new plant type, room part, environmental transformation or visitor event.
- No decay, no loss of friend, no "you disappointed me" messaging. A missed day simply leaves the island there.

### C. Discovery loop — occasional surprises
- Inspect strange objects, find small secrets, welcome characters and solve tiny non-scary puzzles.
- Three classes: micro surprise (seconds), authored event (20–45 s), major cinematic milestone (optional 10–30 s video).
- Mystery must be optional to decorative play, not a mandatory cliffhanger every day.

## 5. Core systems at launch

| System | Child experience | V1 boundary |
|---|---|---|
| Island/world | a cozy, beautifully art-directed persistent island | one main location, 2–3 evolving zones, no huge open world |
| House | restore exterior + personalize one small room | curated snap anchors, limited furniture, not freeform 3D crafting |
| Garden | choose and place plants; plants stay and animate | no plant death, no watering penalties |
| Companion | Nova visually present, reacts, has safe conversational mode | one polished character first; architecture supports more |
| Habits | parent config / child marks done / parent may approve | deterministic, simple, transparent |
| Discoveries | gentle mystery, visiting creature, one secret path | story fragments, not 30 unique cutscenes |
| Memories | display chosen objects, visitors, special moments | structured allow-listed events only |
| Parent area | profile, habits, approval, AI/mic permissions, quiet hours | not inside the child world |
| Developer tools | jump day, add/remove item, mock AI, reset | required before large content production |

## 6. What a daily session feels like

1. Reopen world in **exactly** the prior layout; Nova is naturally present.
2. Child can interact and build with **already available** items even with no newly verified habits.
3. Small, dismissible daily habit UI; no dashboard obstructing the scene.
4. When parent-configured progress qualifies, app commits an unlock and shows a deliberate authored reveal.
5. Child chooses *what* or *where* to build/plant. World saves.
6. Nova responds, invites exploration without pressure; child can leave freely.

Session should reward 3–8 enjoyable minutes but **not** optimize for trapping attention. Parent can configure quiet hours and reminders.

## 7. The "building" rules (avoid grind)

- Progress unlocks **capabilities and narrative opportunities**, not a grindable currency.
- Starter kit is generous; initial session has real autonomy.
- A plant placed by the child remains; location is recorded.
- Objects have a coherent scale, collision/placement rules, anchors, styles, animation states.
- Main story may converge but choices remain visible in the island.
- A decorative choice is reversible; major world choices clearly indicate permanence.
- No randomized paid rewards, purchases, social trading or infinite inventory loops.

## 8. Parent and child trust

- Parent is authoritative for profile/permissions and chosen verification mode.
- Trust mode: child's completion may count directly, depending on parent setting.
- Approval mode: child completion queues approval; progress unlock happens only after approval.
- Parent can edit goals without resetting their child's island.
- All AI voice/calls require explicit parent permissions; default can be **off**.
- Parent can inspect/delete permitted child profile data and reset or export local progress.

## 9. Success and failure criteria

Observe with a consenting parent and child:
- Does the child voluntarily personalize an object and remember their choice?
- Do they recognize Nova as part of the world, not a chat bubble pasted over it?
- Do they ask to revisit the island or show it to a parent?
- Can they understand habits without the game treating missed days as failure?
- Can parent configure/approve with low friction?
- On a return visit, does the world preserve exactly what they built?
- Are conversations age-appropriate, predictable and safe?

**Failure signals:** child mostly waits for videos; scenes feel static; repetitive scripted lines; cheap-looking character motion; parent sees complex chores; each day needs brand-new art; AI spoils undiscovered content; mobile performance unreliable.

## 10. Not building now

Full 3D open-world navigation, multiplayer, chat between children, procedural infinite stories, complex crafting economy, AI-directed habit verification, monetized decoration shop, 30 full videos, mood-based dependence on Nova, or large companion roster.

## 11. Open product decisions — test rather than assume

- House exterior + one interior room **versus** exclusively island-level decorating.
- Decorative drag-and-drop **versus** guided placement anchors (begin with anchors).
- Child avatar needed? **Not yet**; keep Nova as companion first.
- 30-day journey as visible calendar? **Prefer world milestones**, not daily obligations.
- True live voice on day one? Start authored+mock; wire provider after safety/quality review.
- Actual voice and visual character style require iterative parent/child feedback.

**Proposed first proof:** tiny island + empty old cottage + glowing tree + expressive Nova + two meaningful construction choices + a single magical reveal. Quality before quantity.
