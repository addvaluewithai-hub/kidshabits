# Galaxy Journey

The galaxy is the child's **meta-journey**, not a flat world-select menu and not a fixed list of ten levels.

## Product model

- The first visit is guided by the selected companion **inside the galaxy**.
- The companion explains that each planet is a different living story and that verified real-life habits move the current story forward.
- The explanation is a short, bounded authored-role Live session. It must not become free chat, invent objectives, ask the child to choose a habit, or change progression.
- The guide finishes by directing attention to the current planet. Entering that planet durably marks the one-time companion introduction complete.
- Later visits open directly as a hub focused on the current / last meaningful world.

## Spatial model

The galaxy is a vertically scrollable **journey path in depth**:

- planets alternate left / right around a constrained central corridor;
- the current planet is visually dominant and softly pulsing;
- completed worlds remain alive and revisitable;
- future worlds are dimmer, smaller and softly locked;
- the path continues into faint distant stars instead of ending in a wall of giant locks;
- camera and parallax preserve the feeling of space while the vertical direction communicates progression.

This deliberately avoids both extremes:

1. a radial free-choice galaxy where every world looks equally available;
2. a conventional vertical mobile-game level list full of padlocks.

## Journey state

`src/worlds/journey.ts` derives presentation state from the registry and durable world progress:

- `completed`
- `current`
- `future`

A previously started preview remains accessible so development / migrated saves are not stranded.

Future unlock rules should become explicit content / product policy as planet completion is implemented. The visual layer must not own unlock truth.

## Registry rule

Never hard-code "10 planets" into the core UI.

`WORLD_MANIFESTS` is ordered journey content. If the registry contains 6, 10, or 14 worlds, the same galaxy runtime lays them out along the journey. Unregistered future content is represented only by the path fading into mystery, not fake planet definitions.

## Companion rule

The companion is a participant in the galaxy, not a header chip or modal presenter.

First-visit guide responsibilities:

1. greet the child;
2. explain that planets contain different stories and places;
3. name the child's configured habits and the daily threshold;
4. explain that habits move the story/world rather than buying points;
5. direct the child to the current planet;
6. stop speaking.

The companion never unlocks a world, approves a habit, or mutates progression.

## Rendering split

Phaser owns:
- stars / nebula;
- journey path;
- planet bodies and lock treatment;
- parallax, camera scroll and selection transition;
- world-node interaction.

React owns:
- Arabic typography;
- parent entry;
- the current-world action card;
- companion Live controls / accessibility text;
- locked-world explanatory toast.

The galaxy remains mobile portrait first, while wide screens keep the planet journey inside a constrained central corridor instead of scattering planets across the entire viewport.
