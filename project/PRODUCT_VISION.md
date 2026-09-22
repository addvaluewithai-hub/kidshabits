# KidsHabits — Product Vision

> **A living story world that moves forward when a child makes healthy progress in real life.**

This document is the product source of truth for KidsHabits.

The repository starts clean on **Phaser 4**. The goal is not to reproduce static concept art or build a conventional habit tracker with a game skin. The goal is to build a real, production-quality child experience where habits in the real world visibly and emotionally change an explorable story world.

The Phaser skill router lives at [`project/skills/phaser/CATALOG.md`](./skills/phaser/CATALOG.md). Before implementing a substantial feature, select and read the relevant skills there.

---

## 1. North star

KidsHabits should make a child feel:

> **“When I do good things in real life, my world wakes up, my story continues, and my companion has something new to discover with me.”**

The habit itself is not the product.

Stars are not the product.

A 3D or 2D world is not the product by itself.

The product is the emotional connection between:

1. a real-life action,
2. a persistent world change,
3. an unfolding story,
4. a companion who notices and reacts,
5. curiosity about what will happen next.

The primary retention emotion should be **curiosity**, not currency accumulation.

---

## 2. The core loop

The canonical loop is:

```text
Real-life habit
    ↓
Habit is confirmed
    ↓
The world advances
    ↓
A new detail, event, character, mystery, or consequence appears
    ↓
Nova reacts
    ↓
The child explores / chooses / talks / helps
    ↓
The consequence persists
    ↓
The child wonders what will happen tomorrow
```

We should avoid reducing this to:

```text
Habit → coins → meter → reward chest
```

Rewards can exist, but they are secondary. The strongest reward is that **the world is different because the child showed up**.

---

## 3. Planets are 30-day story journeys

A major habit journey is represented as a **planet**.

Each planet is designed as a roughly **30-day story chapter**. Every successful day reveals, changes, or advances something.

The child should not wait 30 days to receive one reward. The 30 days themselves are the experience.

A planet contains approximately:

- 5–6 major locations,
- a small cast of recurring characters,
- one central mystery or emotional arc,
- several authored reveals,
- a few meaningful choices,
- persistent visual consequences,
- weekly-scale payoffs,
- a larger Day-30 conclusion.

A useful pacing model is:

```text
Days 1–3    Arrival / first clue
Days 4–6    Mystery deepens
Days 7–9    First meaningful choice
Days 10–12  Consequence appears
Days 13–15  New friend / relationship
Days 16–18  Help, repair, build, or care
Days 19–21  Obstacle / hidden path
Days 22–24  Secret revealed
Days 25–27  Final push
Days 28–30  Finale / planet completion / next-world hook
```

This is a pacing model, not a rigid content formula.

### Planet completion

At Day 30, the planet should feel genuinely transformed and explored.

The child can then begin:

- another story on the same real-world habit,
- a new planet connected to another habit,
- or a broader world arc that combines several habits.

The product should be able to grow into many planets without changing the core engine.

---

## 4. The world is a living 2D / 2.5D story space

KidsHabits is **not** initially a free-roaming platformer, open-world game, or physics-heavy game.

The target experience is a **scene-based 2D / 2.5D living world**.

A child should feel that they are moving through one connected world, but production should remain manageable.

A world location is built from reusable layers and objects, for example:

```text
Sky
Far scenery
Clouds
Back vegetation
River / path / terrain
Main landmark
Story object
Companion characters
Foreground vegetation
Particles / atmosphere
UI
```

The engine should create life through:

- parallax,
- camera pans and zooms,
- foreground occlusion,
- subtle idle animation,
- particles,
- water / wind / light loops,
- reveal effects,
- sound and music cues,
- persistent object state.

We should prefer a **small reusable world kit** over a giant pre-rendered image for every day.

### Location progression

A 30-day planet does not need 30 unique backgrounds.

A first planet might have six locations:

1. Landing Meadow
2. River Clearing
3. Great Tree
4. Whisper Woods
5. Crystal Caves
6. Planet Heart

Each location can live for several days while its state visibly changes.

For example, the same river scene can evolve from:

```text
empty river
→ glowing seed
→ flower
→ Lumi appears
→ shelter appears
→ hidden path opens
```

The child experiences six different story moments; production maintains one reusable location kit.

---

## 5. The first planet: Sprout Planet

The initial production world should be **Sprout Planet**.

Sprout Planet is quiet and partially asleep. Paths are hidden. Plants are closed. Water is still. Strange lights appear in the distance.

Nova believes something inside the planet is waiting to wake up.

The early story introduces the product language:

- the child arrives,
- a distant light appears,
- a path opens,
- a glowing seed is discovered,
- the child chooses where to place it,
- the world remembers the choice,
- a creature named Lumi appears,
- the child helps Lumi,
- Lumi reveals a hidden route,
- the journey expands into the next region.

The exact 30-day script will be authored later, but the engine must be capable of expressing the full journey from the beginning.

---

## 6. Choices must matter without exploding content scope

Choices should follow:

**Branch → persistent consequence → converge**

Example:

```text
Place seed near water
    ↓
Water Bloom grows
    ↓
Water Bloom remains in this child's world
    ↓
Main story continues
```

or:

```text
Place seed under tree
    ↓
Moon Bloom grows
    ↓
Moon Bloom remains in this child's world
    ↓
Main story continues
```

The child should be able to look back days later and recognize something as **their choice**.

However, every decision should not create an entirely separate 30-day campaign. We want meaningful personalization without exponential story production.

---

## 7. Nova is the heart of the experience

Nova is not a chatbot attached to a game screen.

Nova is a character who exists in the world, notices what happens, remembers what has been discovered, reacts emotionally, and can talk naturally with the child.

Nova should:

- move inside the scene,
- point at discoveries,
- look toward story objects,
- celebrate authored moments,
- ask simple questions,
- react to Lumi and other characters,
- remember current-world state,
- be available for live voice conversation,
- have clear emotional and safety boundaries.

The PixiLive character work is a reference for AI-driven companion behavior, including independently controllable flying characters, gestures, movement, voice, and performance cues. KidsHabits should preserve that feeling while integrating it into a Phaser 4 world.

---

## 8. Core moments are authored; conversation is live AI

This is a fundamental product rule:

> **Core moments = authored. Conversation = live AI.**

### Authored moments

Important product beats must be deterministic and production-directed:

- a path opening,
- a flower blooming,
- Lumi appearing,
- a weekly reveal,
- a Day-30 finale,
- a new planet opening,
- a major emotional story beat.

For these moments we control:

- exact line,
- voice performance,
- animation,
- camera,
- music,
- sound effect,
- timing.

We should never delegate the emotional quality of a major reward moment to an unpredictable model response.

### Live moments

After or between authored moments, the child can naturally talk to Nova.

Example:

Nova authored reaction:

> “واااو! البذرة فتحت!”

Child:

> “هو Lumi بيحب ياكل إيه؟”

Nova then answers live and naturally.

The result should feel like a character, not a branching dialogue tree.

---

## 9. Live AI must be grounded in story state

The live agent must receive only the state it is allowed to know.

Example context:

```text
planet: sprout
storyDay: 12
location: great_tree
seedChoice: water
flowerType: water_bloom
lumiDiscovered: true
hiddenPathDiscovered: true
crystalCaveDiscovered: false
```

Future story information must not be exposed to the live model.

Nova should never accidentally spoil tomorrow's event or contradict the persistent world.

The live provider should be behind an abstraction so the product can change providers without rewriting the character/world systems.

Conceptually:

```text
CompanionConversationProvider
    GeminiLiveProvider
    MockProvider
    FutureProvider
```

---

## 10. Nova should be able to call the child

A distinctive product moment is that Nova can **literally call the child on the phone**.

This should feel like an incoming call from the companion, not merely a push notification.

Examples:

- “لين! لقيت حاجة غريبة جنب النهر… تيجي نشوفها؟”
- “Lumi صحى ولسه بيبص على الطريق الجديد.”
- a parent-configured morning hello,
- a story reminder when something new is available.

### Product principles for calls

Calls must be:

- parent-enabled,
- schedulable,
- easy to mute,
- age-appropriate,
- non-manipulative,
- sparse enough to remain magical,
- tied to meaningful product moments.

Nova must never pressure the child with emotional dependency language such as:

- “I was lonely without you.”
- “You made me sad because you did not complete your habit.”
- “You have to come back for me.”

Nova can be excited to continue an adventure, but affection and friendship are never conditional on habit completion.

### Technical expectation

The mobile product must support a native-feeling incoming call experience where the platform allows it.

Phaser renders the child world; the mobile/platform layer is responsible for device-level capabilities such as notifications, permissions, background delivery, and call-style presentation.

The exact wrapper/native technology can remain an implementation decision, but browser limitations must not define the product experience.

---

## 11. Child onboarding

The child should not land on a dashboard full of habit cards.

Their first experience should feel like the beginning of a relationship and an adventure.

### First child session

A recommended flow:

1. A short magical arrival screen.
2. The child chooses a companion character.
3. The chosen companion wakes up / flies in / approaches.
4. The companion introduces themselves by voice.
5. The companion asks the child's preferred name.
6. A very short live conversation establishes personality.
7. The companion asks a light preference question or two.
8. They arrive together at the first planet.
9. The companion explains the core idea through the world, not through tutorial text.

Example:

> “كل مرة تعمل حاجة كويسة في يومك، العالم هنا ممكن يتغيّر. تعال نشوف أول حاجة مستخبية!”

### Character selection

Nova can be the flagship character, but the architecture should support a small companion roster over time.

Characters should differ in:

- visual style,
- voice,
- idle behavior,
- humor / energy,
- movement style,
- some authored dialogue flavor.

They should **not** change habit authority or product rules.

The first release can ship with one production-quality companion if necessary, but the system should not hard-code Nova as the only possible character.

---

## 12. The companion gets to know the child

The relationship should grow naturally, but the product should avoid pretending the AI has unlimited human-like memory.

The system can persist safe, useful preferences such as:

- preferred name,
- chosen companion,
- favorite discovered character,
- visual choice history,
- current planet,
- completed story moments,
- child-selected interests where appropriate.

Nova can use these to make future conversations warmer and more coherent.

Sensitive personal information should not be solicited simply to make the relationship feel deeper.

---

## 13. Parent onboarding comes first operationally

The magical child experience is supported by a calm, trustworthy parent setup.

Parent onboarding should establish:

1. parent / guardian account,
2. child profile,
3. child name / nickname,
4. age range,
5. habit selection,
6. verification method,
7. daily progression rule,
8. notification and Nova-call permissions,
9. quiet hours,
10. voice / AI permissions and privacy explanation,
11. optional companion selection controls,
12. handoff into child onboarding.

Parent onboarding should feel fast and practical, not game-like.

---

## 14. Habit setup

Parents choose a small number of habits.

Examples:

- drink water,
- read for 10 minutes,
- brush teeth,
- make the bed,
- move / exercise,
- prepare school bag,
- bedtime routine,
- kindness / helping task.

Avoid overwhelming families with a large habit-management system at launch.

### Progress rule

The story advances based on a configurable daily threshold, for example:

```text
3 habits configured
2 habits required to advance the story day
```

This protects the experience from becoming all-or-nothing.

A missed habit should not emotionally punish the child or make Nova withdraw affection.

---

## 15. Habit verification

The architecture should support multiple verification philosophies:

### Trust mode

The child marks a habit complete.

Useful for low-friction habits and families who prefer autonomy.

### Parent approval

The child submits completion and the parent confirms it.

Useful for habits where verification matters.

### Automatic / integrated verification

Potential future mode for signals that can be responsibly inferred from a device or connected service.

This is not required for initial launch.

### Important rule

AI is **not authoritative** for progression.

Nova can discuss habits, but deterministic product logic decides:

- whether a habit is complete,
- whether a day advances,
- what is unlocked,
- story state,
- world state.

---

## 16. Parent dashboard

The parent side should intentionally look calmer and simpler than the child side.

It should answer quickly:

- What is my child working on?
- What was completed today?
- What needs my approval?
- Where are they in the current 30-day journey?
- Is the experience helping without becoming pressure?

Core parent dashboard elements:

```text
Child
Current planet
Story day X / 30
Today's habits
Completed / pending
Approval requests
Manage habits
Verification settings
Nova call settings
Quiet hours
View child's world
Progress / history
```

Do not overload the parent with game currencies or fictional inventory.

---

## 17. Daily child experience

The child home should be extremely lightweight.

The **world is the home**.

A typical session should be able to begin like this:

1. App opens directly into the current world location.
2. Nova notices the child and reacts.
3. A small, clear daily panel shows remaining habits.
4. Nova hints at what may happen when today's progress is complete.
5. The child can talk to Nova at any time.
6. Once the progression threshold is reached, the authored story beat starts.
7. The world updates and persists.

The UI should not cover the world with cards.

One screen should usually have one dominant action or story focus.

---

## 18. Core child surfaces

The production product should support these conceptual surfaces. They do not necessarily need to be separate routes.

### A. Living World
The current location, Nova, story objects, atmosphere, and daily progress.

### B. Story Moment
A focused authored reveal or event, normally inside the world rather than a separate reward modal.

### C. Choice
A simple, readable choice with 2–3 options and a clear visual consequence later.

### D. Nova Live
Voice-first conversation while the current world remains visible.

### E. Planet Map
Shows the 30-day journey and mysterious future regions without exposing future plot details.

### F. Story / Memory Book
A lightweight record of discovered characters, meaningful choices, completed planets, and persistent memories.

### G. Companion / Character Space
Allows safe customization and future companion selection without turning the product into an avatar shop.

---

## 19. Story authoring must be data-driven

A 30-day planet cannot be implemented as 30 giant hard-coded scene files.

The story layer should be content-driven.

Conceptually:

```text
StoryDayDefinition
  day
  location
  entryState
  progressionRequirement
  authoredSequence
  choices
  liveContext
  exitState
  nextHook
```

Example:

```text
day: 5
location: river_clearing
entryState: water_bloom
trigger: daily_progress_complete
sequence:
  - camera_focus_flower
  - nova_line
  - flower_open
  - spawn_lumi
  - nova_reaction
exitState: lumi_discovered
```

The exact implementation may use JSON, TypeScript configuration, or another authoring format, but story content must be editable without rewriting engine code.

Eventually we should be able to author a new planet mainly by creating:

- location kits,
- characters / props,
- audio,
- story definitions,
- dialogue,
- choices,
- state variants.

---

## 20. Persistent world state

The world must remember what happened.

Minimum state categories include:

```text
Current planet
Story day
Current location
Daily habit status
Story events seen
Companion selected
Major choices
Persistent visual variants
Characters discovered
Location states
Planet completion
```

Closing the app and returning later should show the world exactly as the child left it, except for intentional time-based changes.

Persistent consequence is one of the main reasons this is a world rather than a sequence of videos.

---

## 21. Phaser 4 is the world engine

KidsHabits begins as a **Phaser 4 clean start**.

Phaser owns the interactive child world:

- scene composition,
- cameras,
- movement,
- animation,
- particles,
- filters,
- render textures,
- world transitions,
- story objects,
- touch interaction,
- audio synchronization,
- 2D / 2.5D presentation.

The project has a curated Phaser skill library under:

[`project/skills/phaser/`](./skills/phaser/)

and routing guidance in:

[`project/skills/phaser/CATALOG.md`](./skills/phaser/CATALOG.md)

Use the engine creatively. Do not assume every visible element needs to be an externally generated PNG.

The production target should combine:

- selective illustrated assets,
- reusable sprites,
- engine-drawn shapes / gradients where appropriate,
- particles,
- filters and lighting,
- procedural atmosphere,
- camera composition,
- sound.

The target is **premium with a small reusable asset vocabulary**, not maximal rendering complexity.

---

## 22. Character engine direction

Companions should be independently controllable actors, not baked into background art.

A character system should support commands such as:

```text
move_to
fly_to
look_at
face_direction
play_gesture
play_expression
speak
idle
follow_target
```

Animation and movement should be able to continue while voice conversation is active.

The AI should request high-level behavior; deterministic runtime systems own actual motion bounds, collision constraints if any, sequencing, and performance.

This preserves the useful separation demonstrated by the PixiLive character-engine work: the model can express intent without directly owning low-level rendering.

---

## 23. Visual direction

The visual target is **calm premium 2D / 2.5D children's illustration**.

Avoid:

- hyper-detailed 3D scenes,
- huge piles of decorative UI,
- full-screen glossy reward modals everywhere,
- excessive gradients and sparkles on every object,
- art that requires a new hero render for every story day,
- generic “mobile game” visual noise.

Prefer:

- strong silhouettes,
- simple readable shapes,
- soft atmospheric depth,
- a restrained palette per planet,
- one clear focal point per story beat,
- subtle parallax,
- reusable environmental pieces,
- small high-quality animations,
- excellent sound design.

The child should be able to understand what changed without reading a paragraph.

---

## 24. Arabic-first quality without becoming Arabic-only

Arabic should be treated as a first-class product language, not a later localization pass.

Requirements include:

- correct RTL layout,
- natural child-friendly Arabic copy,
- readable typography,
- voice-first interaction where reading level is low,
- UI layouts that remain good in both RTL and LTR,
- story content designed to localize without breaking timing.

The engine and UI architecture should still support other languages.

---

## 25. Audio is part of the product, not polish at the end

Sound is essential for making lightweight visuals feel alive.

A location can gain richness through:

- water ambience,
- wind,
- insects / birds,
- soft character vocalizations,
- discovery cues,
- movement sounds,
- authored musical stings,
- spatial emphasis when the camera reveals something.

Major story moments should have controlled audio timing.

Nova's voice should feel continuous with the world, not like a separate assistant UI speaking over a game.

---

## 26. Emotional boundaries for Nova

Nova celebrates, encourages, wonders, and explores.

Nova does **not** use guilt, fear of abandonment, or conditional friendship to drive engagement.

Avoid lines like:

- “أنا زعلانة منك عشان ما عملتش العادة.”
- “Lumi كان مستنيك وحزين إنك ما جيتش.”
- “لو ما رجعتش بكرة هافضل لوحدي.”

Prefer:

- “لسه عندنا حاجة مستخبية لما تكون جاهز.”
- “نقدر نكمل الرحلة بكرة.”
- “كل خطوة صغيرة بتخلّي العالم يتحرك.”

Missing a day may pause story progression, but it should not create shame.

---

## 27. Notifications and re-engagement

The product can use:

- normal notifications,
- Nova voice messages,
- Nova incoming calls,
- parent-controlled reminders.

But story curiosity should remain the primary retention mechanism.

Re-engagement should reference **what is happening in the world**, not generic streak pressure.

Good:

> “ظهر نور جديد عند الشجرة.”

Less desirable:

> “Your streak is about to expire!”

---

## 28. Debug and authoring tools are mandatory

A 30-day story product cannot be developed or QA'd in real time.

Developer tooling must support:

```text
Jump to any story day
Set current location
Complete today's habits
Approve pending habits
Set major choices
Trigger authored sequences
Spawn / hide characters
Set location state
Unlock paths
Reset current planet
Reset all story state
Switch live AI / mock AI
Inspect current live-AI context
Mute / isolate audio layers
Capture screenshots
```

Content production speed is part of the product architecture.

---

## 29. Production workflow for a new planet

A healthy planet-production pipeline should look roughly like:

### Step 1 — Story
Write the 30-day narrative, reveals, choices, hooks, and emotional arc.

### Step 2 — Location plan
Choose roughly 5–6 reusable world locations.

### Step 3 — State plan
List how each location changes over the month.

### Step 4 — Asset kit
Create only the environmental pieces, characters, props, effects, and audio that the state plan actually requires.

### Step 5 — Story definitions
Encode the 30 days in the content-driven story system.

### Step 6 — Authored sequences
Polish key moments with camera, animation, dialogue, VFX, and audio.

### Step 7 — Live context
Define what Nova is allowed to know on each story day.

### Step 8 — QA
Test every day, choice variant, persistent state, screen size, and interruption path.

This pipeline should become faster with every planet.

---

## 30. What we are explicitly not building right now

To protect the product, avoid turning KidsHabits into all of these at once:

- Minecraft for children,
- an open-world sandbox,
- a full life simulator,
- a curriculum platform,
- a social network,
- a multiplayer game,
- a complex crafting economy,
- a giant avatar marketplace,
- an AI chatbot with habit cards attached,
- a streak app with prettier rewards.

Any of those can be considered later only if the core living-story loop proves strong.

---

## 31. Product success criteria

The best product question remains:

> **Would a child genuinely want to come back tomorrow to see what happens?**

Useful observation criteria include:

- Does the child understand that real-life progress changes the world?
- Do they notice persistent visual changes without being told?
- Do they remember characters and choices?
- Do they ask what is behind the next path / door / region?
- Do they voluntarily talk to Nova about the story?
- Does Nova increase excitement rather than interrupt it?
- Does the child describe the world as “mine” or refer to their choices?
- Does the parent understand the system without needing a tutorial?
- Does habit setup remain low-friction?
- Are calls and reminders perceived as delightful rather than intrusive?

Success is not simply session length. A short daily session can be excellent if it creates anticipation for tomorrow.

---

## 32. Product experience from the parent's point of view

A parent should feel:

> “I set a few habits once. I can confirm what matters in seconds. My child is motivated by the story instead of me nagging them.”

A parent's recurring loop is:

```text
Choose / adjust habits
    ↓
Child acts
    ↓
Confirm when needed
    ↓
See meaningful progress
    ↓
Occasionally adjust
```

The product should reduce nagging, not replace it with app administration.

---

## 33. Product experience from the child's point of view

A child should feel:

> “Nova and I are discovering my world together.”

Not:

> “My parents installed a habit tracker and I have to earn stars.”

The habit UI is therefore supporting infrastructure. The emotional foreground is:

- the companion,
- the world,
- the story,
- the mystery,
- the child's choices.

---

## 34. High-level app journey

### Parent

```text
Install
→ Parent onboarding
→ Create child profile
→ Choose initial habits
→ Choose verification
→ Configure Nova calls / quiet hours
→ Hand device to child
```

### Child first session

```text
Magical arrival
→ Choose companion
→ Companion wakes / appears
→ Live introduction
→ Companion learns preferred name
→ Enter first planet together
→ First world clue
```

### Daily child session

```text
Return to living world
→ Nova reacts
→ See simple daily progress
→ Complete real-life habits
→ Deterministic verification
→ Authored story progression
→ Explore / choose / talk
→ Persistent world update
→ Tomorrow hook
```

### Planet conclusion

```text
Day 30
→ Major authored finale
→ Planet transformed
→ Story memory saved
→ Next journey introduced
```

---

## 35. Implementation principle

When a developer faces a choice between:

- a technically impressive system that adds little child value, and
- a simple system that makes the world feel more alive,

choose the second.

When choosing between:

- one giant unique illustration, and
- reusable pieces that can create several convincing world states,

prefer the reusable system unless the moment truly deserves unique art.

When choosing between:

- generic AI spontaneity, and
- a tightly authored important story moment,

use authored direction for the important moment.

When choosing between:

- a reward meter, and
- a meaningful world consequence,

prefer the world consequence.

---

# Final product statement

**KidsHabits is a mobile living-story experience where a child's real-life habits wake up and transform magical 2D / 2.5D worlds. Each planet unfolds across roughly 30 days. Nova or another chosen AI companion explores alongside the child, performs tightly authored story moments, talks naturally through live voice, remembers the current world state, and can even call the child for parent-approved story moments. Parents configure habits and verification through a calm control layer; the child experiences the system primarily as an adventure. Phaser 4 renders the world as reusable, persistent scenes rather than a sequence of giant static illustrations.**

That is the product we are building.