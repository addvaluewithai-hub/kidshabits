import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

class LandingMeadowScene extends Phaser.Scene {
  private backdrop?: Phaser.GameObjects.Graphics;
  private light?: Phaser.GameObjects.Arc;

  constructor() {
    super('landing-meadow');
  }

  create() {
    this.backdrop = this.add.graphics();
    this.light = this.add.circle(0, 0, 9, 0xffe9a8, 0.92);
    this.light.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: this.light, alpha: 0.35, scale: 2.2, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.scale.on('resize', this.redraw, this);
    this.redraw();
    this.cameras.main.fadeIn(700, 239, 246, 235);
  }

  private redraw = () => {
    if (!this.backdrop || !this.light) return;
    const w = this.scale.width;
    const h = this.scale.height;
    const g = this.backdrop;
    g.clear();

    g.fillStyle(0xeaf3eb, 1).fillRect(0, 0, w, h);
    g.fillStyle(0xd8e7df, 1).fillEllipse(w * 0.15, h * 0.34, w * 0.9, h * 0.32);
    g.fillStyle(0xcadfcf, 1).fillEllipse(w * 0.85, h * 0.38, w * 1.15, h * 0.38);
    g.fillStyle(0x9fc5aa, 1).fillRect(0, h * 0.58, w, h * 0.42);
    g.fillStyle(0x82b494, 1).fillEllipse(w * 0.5, h * 0.72, w * 1.35, h * 0.42);

    g.fillStyle(0x7aa9a0, 1);
    g.fillRoundedRect(w * 0.02, h * 0.63, w * 0.96, Math.max(18, h * 0.075), 30);
    g.fillStyle(0xadd5ca, 1);
    g.fillRoundedRect(w * 0.02, h * 0.645, w * 0.96, Math.max(7, h * 0.028), 20);

    const treeX = w * 0.23;
    const treeY = h * 0.6;
    g.fillStyle(0x7d6f54, 1).fillRoundedRect(treeX - 12, treeY - 105, 24, 120, 10);
    g.fillStyle(0x6f9f78, 1).fillCircle(treeX - 26, treeY - 114, 48);
    g.fillCircle(treeX + 24, treeY - 128, 54);
    g.fillStyle(0x85ad82, 1).fillCircle(treeX + 8, treeY - 88, 45);

    for (let i = 0; i < 14; i += 1) {
      const x = (i / 13) * w;
      const y = h * 0.82 + Math.sin(i * 1.7) * 10;
      g.fillStyle(i % 3 === 0 ? 0xffefb2 : 0xe7d6ee, 0.9).fillCircle(x, y, 3 + (i % 2));
    }

    this.light.setPosition(w * 0.78, h * 0.43);
  };

  shutdown() {
    this.scale.off('resize', this.redraw, this);
  }
}

export function WorldHost() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      transparent: true,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      render: { antialias: true, roundPixels: false },
      scene: [LandingMeadowScene],
    });
    return () => game.destroy(true);
  }, []);

  return <div ref={host} className="world-canvas" aria-label="مرج الوصول في كوكب البراعم" />;
}
