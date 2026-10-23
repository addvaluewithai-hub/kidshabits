import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { IslandScene } from './scenes/IslandScene';
import { STORYBOOK_ART } from '../content/island/artPacks';
import type { IslandSnapshot, WorldFocus } from '../domain/island/model';

/** React owns lifecycle. Phaser owns presentation. Domain owns truth. */
export function WorldHost({ island, focus }: { island: IslandSnapshot; focus: WorldFocus }) {
  const container = useRef<HTMLDivElement>(null);
  const scene = useRef<IslandScene | null>(null);
  const latest = useRef({ island, focus });
  latest.current = { island, focus };

  useEffect(() => {
    if (!container.current) return;
    const worldScene = new IslandScene(STORYBOOK_ART, latest.current.island);
    scene.current = worldScene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      transparent: true,
      parent: container.current,
      width: 900,
      height: 1150,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 900, height: 1150 },
      scene: [worldScene],
      render: { antialias: true },
    });
    const sync = () => worldScene.applySnapshot(latest.current.island, latest.current.focus);
    worldScene.events.on(Phaser.Scenes.Events.CREATE, sync);
    return () => {
      worldScene.events.off(Phaser.Scenes.Events.CREATE, sync);
      scene.current = null;
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    scene.current?.applySnapshot(island, focus);
  }, [island, focus]);

  return <div className="world-canvas" ref={container} aria-hidden="true" />;
}
