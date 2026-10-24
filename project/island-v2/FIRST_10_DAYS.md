# First 10 Progress Beats — Grounded Immersive World Journey

**Updated 2026-10-24:** Each beat happens **inside a full-screen continuous Three.js world**, with perspective camera at a child's comfortable view height. No floating islands, roof-level top-down shots, or separate boxed story-card scenes; see [Immersive spec](./IMMERSIVE_WORLD_SPEC.md).

**This is not 10 separate full-screen videos.** One connected grounded magical world evolves through building, decorating, gardening, small visitor events and a few authored cinematic beats. Every day offers optional free-play; story progress is based on **qualified progress events**, not the passage of calendar dates alone.

## The first grounded-world kit

- **Old Cottage** — exterior + starter indoor corner.
- **Quiet Tree** — a mystery object that reacts as the island changes.
- **Garden Patch** — first planting and light VFX.
- **Creek Edge** — initially far background, later accessible.
- **Secret Gate** — visual tease, locked until an authored milestone.
- **Nova** — persistent actor and interaction partner.
- **Lumi** — first small visitor discovered later in the arc.

All objects are stateful placements in the **same grounded world**, not discarded scene art. Named guided perspective rigs move between arrival path, cottage, garden, tree and later creek/interior; **not** ten flat screens. Distant scenery makes the clearing feel continuous.

## Story / building beat outline

### Day 1 — "دي دنيتنا!"
- **Cold open:** child-height arrival-path camera walks forward through continuous terrain with sky/horizon; cottage and old tree ahead; Nova physically flies into world view and greets child.
- **Action:** name their place; tap **cottage** or **garden** as first guided camera destination (no free-roam joystick).
- **World result:** first sign, selected focus highlighted and first editable object placed.
- **Nova:** "تفتكري نبدأ بالبيت ولا بالحديقة؟ أنا نفسي أشوف هتعملي إيه."
- **Saved:** `world.name`, `first_focus`, `placedObjects`; semantic state preserved across viewport changes. Choice affects current guided destination, not access to core content.
- **Tomorrow hook:** faint glow behind old tree.

### Day 2 — "البيت القديم"
- **Action:** travel via `cottage_front` camera rig and restore cottage doorway and choose one roof/door color combination.
- **Result:** house exterior visibly changes; small dust/sparkle reveal.
- **Nova:** "دلوقتي بقي له شكل! عارفة؟ الباب ده كأنه كان مستنيكي."
- **Mystery:** a tiny scratched symbol near doorframe.
- **Saved:** `cottage.style`, `cottage.repaired_door`.

### Day 3 — "أول حاجة خضرا"
- **Action:** guide camera to `garden_edge` and choose 1 of 2 starter plants; place in one of several validated garden spots.
- **Result:** animated sprout, subtle ambient VFX; plant location persists.
- **Nova:** "دي أول زرعة هنا! نحطها جنب البيت ولا جنب الشجرة؟"
- **Saved:** `plants[{type,anchor,stage}]`.
- **Note:** plant does not wither if child skips a day.

### Day 4 — "الغرفة اللي جوا"
- **Action:** go through guided cottage entrance transition and enter starter room and choose desk/rug/lamp placement from anchors.
- **Result:** interior genuinely resembles the child's choice.
- **Nova:** "أنا كنت متخيلة النور هنا... بس إنتِ عندك فكرة أحلى؟"
- **Saved:** `room.layout`.
- **World event:** tree light pulses once outside (tease).

### Day 5 — "سر الشجرة"
- **Action:** touch the tree's old symbol after a qualified daily goal.
- **Authored scene:** short camera close-up, roots shimmer, a small lantern-like seed emerges.
- **Nova:** "استني! هو الرمز ده نفس اللي على باب البيت؟"
- **Saved:** `discoveredFacts.tree_symbol`, `inventory.storySeed` (no arbitrary coins).
- **Hook:** where should the seed live?

### Day 6 — "اختيار مكان النور"
- **Choice:** place story seed **by cottage** or **near creek** (meaningful but bounded).
- **World result:** different permanent plant/light variant for each branch.
- **Nova:** bespoke line recognizing the selected location.
- **Saved:** `choices.seedPlacement`, `worldVariants.seedBloom`.
- **Narrative:** branch → persistent consequence → converge later.

### Day 7 — "ضيف صغير"
- **Action:** inspect newly moving leaves / glowing object.
- **Authored reveal:** Lumi appears; Nova gestures to child and visitor.
- **Nova:** "هو... الكائن الصغير ده طلع من النور؟ شكلنا مش لوحدنا!"
- **Interaction:** choose a safe little resting place for Lumi.
- **Saved:** `visitors.lumiDiscovered`, `lumi.homeAnchor`.

### Day 8 — "ركن لومي"
- **Action:** build tiny shelter for Lumi or set a garden path to the shelter.
- **World result:** Lumi can visit/curl up; Nova reacts to the placement.
- **Nova:** "أنا شايفة إنه مرتاح هنا. تحبي نخليه جنب الزرع؟"
- **Saved:** `builds.lumiNook`, `paths`.
- **No emotional manipulation:** never claim Lumi is sad or abandoned if child doesn't return.

### Day 9 — "المية اللي بتلمع"
- **Action:** follow guided ground-level route to creek; place a footbridge or three path stones to unlock closer creek view.
- **World result:** flowing water particles and a second interactable zone.
- **Nova:** "هو النور ماشي مع المية؟ يلا نبص من هنا!"
- **Saved:** `creek.pathComplete`, `zones.creekVisible`.
- **Hook:** secret gate reflection appears in creek.

### Day 10 — "ورا الجذور"
- **Moment:** milestone reveal, tree canopy shimmers and ancient gate gains a glowing mark; *do not yet force a new planet*.
- **Choice:** leave mystery for tomorrow or approach and inspect; both valid.
- **Nova:** "فيه حاجة جديدة اتفتحت... بس الأجمل إن الجزيرة بقت بالشكل اللي إنتِ عملتيه!"
- **Saved:** `discoveries.gateHint`, `worldStage.firstChapterComplete`.
- **Reward:** world feels transformed; child continues to have freedom to decorate and play.

## Pacing: 10 days are not 10 forced sessions

- A day means a **qualifying progress step** within a parent's chosen goal policy.
- Prototype debug tools can jump to any step and pre-populate world state without actual waiting.
- The child may freely decorate, observe and converse on days with no unlock.
- Delay is okay; no streak loss, no NPC sadness, no decaying plants.
- Allow catch-up in a controlled way if product tests show a calendar-daily restriction is frustrating.

## Content structure for each beat

```yaml
id: sprout_day_05
zone: island_clearing
requires: [progress_qualified, cottage_visible]
playOnce: true
onCommit:
  facts: [tree_symbol_discovered]
  inventory: [story_seed]
sequence:
  - camera: focus_tree
  - nova: authored_line_tree_symbol
  - effect: roots_glow
  - object: reveal_story_seed
after:
  freePlay: true
  nextHook: choose_seed_home
```

This schema is illustrative; implement and validate as typed content before authoring production days.

## Content list to produce (minimum meaningful set)

- Opening encounter (30–60 sec interactive, not a compulsory long video).
- 10 small progress definitions with 1–3 optional interactions each.
- 2 meaningful choices: first build focus and permanent seed placement.
- 1 visitor (Lumi), 1 friendly mystery, 2 satisfying authored reveals.
- 2–3 reusable world compositions with multiple state variants.
- Nova reaction lines for: placement, color change, discovery, returning session, progress qualification, refusal to continue.
- Voice/subtitles and sound cues for important moments; silence/ambient space between lines.

## Playtest questions after first 3 days, not after all 10

1. Does a nine-year-old understand "this is mine" and choose freely?
2. Are building actions fun enough without a story cutscene?
3. Does Nova feel like a true in-world character?
4. Is the pacing too slow, too scripted or too babyish?
5. Does the child notice their house/plant stayed the way they left it?
6. Does the parent understand the relationship between real habits and in-world unlocks?

**Gate:** don't commission all ten polished days before these questions are answered with a playable Slice 0–2.
