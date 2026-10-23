import Phaser from 'phaser';
import type { WorldFocus } from '../../domain/island/model';

const POSITIONS: Record<WorldFocus, { x: number; y: number }> = {
  idle: { x: 442, y: 467 },
  cottage: { x: 520, y: 450 },
  garden: { x: 408, y: 640 },
};

/** Only presentation intent. Never mutates world state. */
export class NovaActor {
  private readonly container: Phaser.GameObjects.Container;
  private readonly glow: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    const start = POSITIONS.idle;
    this.container = scene.add.container(start.x, start.y).setDepth(30);
    this.glow = scene.add.circle(0, 0, 95, 0xffdea1, 0.1);
    const body = scene.add.image(0, 0, 'nova').setDisplaySize(170, 195);
    this.container.add([this.glow, body]);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) scene.tweens.add({
      targets: body,
      y: -13,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 2300,
    });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) scene.tweens.add({
      targets: this.glow,
      alpha: 0.28,
      scale: 1.28,
      yoyo: true,
      repeat: -1,
      duration: 2800,
    });
  }

  lookAt(scene: Phaser.Scene, focus: WorldFocus): void {
    scene.tweens.killTweensOf(this.container);
    const destination = POSITIONS[focus];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.container.setPosition(destination.x, destination.y);
      this.container.setAngle(focus === 'cottage' ? 9 : focus === 'garden' ? -8 : 0);
      return;
    }
    scene.tweens.add({
      targets: this.container,
      x: destination.x,
      y: destination.y,
      duration: focus === 'idle' ? 520 : 980,
      ease: 'Cubic.easeInOut',
    });
    scene.tweens.add({
      targets: this.container,
      angle: focus === 'cottage' ? 9 : focus === 'garden' ? -8 : 0,
      duration: 680,
    });
  }
}
