# KidsHabits Visual Foundation

This pass deliberately pauses new product features. Its job is to make the current application feel coherent and premium before deeper world production.

## Product split

### Child experience

The child side is magical, immersive, story-first and spatial.

- The Galaxy is a real Phaser scene, not a list of decorative HTML cards.
- Space is the connective meta-theme between worlds.
- Each planet must be visually recognizable without reading its title.
- Motion is slow, restrained and alive: drift, twinkle, parallax, breathing scale, cinematic camera movement.
- React overlays are kept only where they improve Arabic typography, accessibility and operational clarity.

### Parent experience

The parent side is calm, legible and operational.

- warm neutral surfaces,
- stronger typography hierarchy,
- fewer borders and nested cards,
- clear approval / habit / progress sections,
- no need to imitate the child's fantasy UI.

## Visual principles

1. **World first. UI second.** The child should notice the place and companion before panels.
2. **Less boxes.** Prefer spacing, typography and surface contrast over a border around every fact.
3. **Recognizable planets.** Surface language, ring / crater / landform silhouettes and palette identify a planet.
4. **Motion with purpose.** No arcade spectacle, constant shake, giant flashes or noisy reward effects.
5. **Calm premium target.** Think polished illustrated product, not viral browser-game spectacle.
6. **Responsive by composition.** Build against live portrait dimensions rather than one fixed phone size.
7. **Procedural where useful.** Phaser shapes, generated texture, particles and filters can reduce art load, but they must support—not replace—good illustration.
8. **Arabic remains crisp.** Important Arabic UI stays in DOM overlays unless canvas text is clearly superior and fully tested.

## Galaxy runtime

The Galaxy uses Phaser for:

- star depth,
- nebula atmosphere,
- orbit lines,
- planet bodies,
- ambient motion,
- hover / tap feedback,
- cinematic camera transition when selecting a world.

React owns:

- parent entry,
- companion identity chip,
- Arabic world labels / status,
- accessibility semantics.

## Skills grounding

This direction was grounded in the repository skills for:

- `game-designer`
- `cameras`
- `tweens`
- `graphics-and-shapes`
- `particles`
- `filters-and-postfx`
- `render-textures`
- `scale-and-responsive`
- `v4-new-features`

The product vision overrides generic skill guidance where they conflict. In particular, KidsHabits intentionally rejects high-frequency spectacle, constant shake, giant combo text, and other arcade-oriented polish patterns.

## Current scope rule

Do not add companion calling, deeper planet story days, or unrelated platform features during this pass.

First make the screens already built feel excellent on real phones. Then resume platform milestones.
