import { clearWorldLayers, type WorldPresentation } from '../../world-runtime/presentation';

export const drawMoonGarden: WorldPresentation = ({ width: w, height: h, progress, revealFlag, layers }) => {
  clearWorldLayers(layers);
  const revealed = Boolean(progress.flags[revealFlag]);
  const atGarden = progress.locationId === 'crater-garden';
  const { sky, far, mid, ground, detail } = layers;

  sky.fillStyle(atGarden ? 0x17182f : 0x12152b, 1).fillRect(-80, -80, w + 160, h + 160);
  sky.fillStyle(0x34365c, 0.6).fillEllipse(w * 0.12, h * 0.22, w * 1.0, h * 0.5);
  sky.fillStyle(0x4c4772, 0.35).fillEllipse(w * 0.87, h * 0.3, w * 1.1, h * 0.48);
  sky.fillStyle(0xf5f1d8, 0.92).fillCircle(w * 0.78, h * 0.16, Math.max(42, w * 0.12));
  sky.fillStyle(0xbab7ce, 0.22).fillCircle(w * 0.75, h * 0.14, Math.max(10, w * 0.025));

  for (let i = 0; i < 30; i += 1) {
    const x = w * ((i * 0.137) % 0.98);
    const y = h * (0.05 + ((i * 0.083) % 0.48));
    const alpha = 0.32 + (i % 5) * 0.1;
    sky.fillStyle(i % 6 === 0 ? 0xfff0bb : 0xdedaf5, alpha).fillCircle(x, y, i % 4 === 0 ? 2.2 : 1.2);
  }

  far.fillStyle(0x343751, 1).fillEllipse(w * 0.17, h * 0.58, w * 1.05, h * 0.28);
  far.fillStyle(0x292d49, 1).fillEllipse(w * 0.86, h * 0.61, w * 1.18, h * 0.31);
  mid.fillStyle(0x4b4d67, 1).fillEllipse(w * 0.22, h * 0.78, w * 0.9, h * 0.34);
  mid.fillStyle(0x5a5a72, 1).fillEllipse(w * 0.82, h * 0.8, w * 1.1, h * 0.36);
  ground.fillStyle(atGarden ? 0x4a5264 : 0x41495c, 1).fillEllipse(w * 0.5, h * 1.01, w * 1.55, h * 0.45);

  for (let i = 0; i < 8; i += 1) {
    const x = w * (0.08 + i * 0.12);
    const y = h * (0.78 + (i % 3) * 0.055);
    detail.fillStyle(0x272b42, 0.5).fillEllipse(x, y, 26 + (i % 3) * 7, 10 + (i % 2) * 4);
  }

  if (atGarden) {
    detail.fillStyle(0x696d82, 0.9).fillEllipse(w * 0.66, h * 0.72, w * 0.56, h * 0.22);
    detail.lineStyle(3, 0xb2a9df, 0.8);
    for (let i = 0; i < 8; i += 1) {
      const x = w * (0.49 + i * 0.055);
      const y = h * (0.73 + (i % 2) * 0.02);
      detail.beginPath();
      detail.moveTo(x, y + 30);
      detail.lineTo(x + (i % 2 ? 7 : -5), y);
      detail.strokePath();
      detail.fillStyle(i % 2 ? 0xd8c5ff : 0xb8e5df, 0.86).fillCircle(x + (i % 2 ? 7 : -5), y - 2, 4);
    }
    return { focusPoint: { x: w * 0.67, y: h * 0.7 }, ambientTint: 0xd8c5ff };
  }

  if (revealed) {
    detail.lineStyle(8, 0xcac4ef, 0.28);
    detail.beginPath();
    detail.moveTo(w * 0.44, h * 0.93);
    detail.lineTo(w * 0.54, h * 0.77);
    detail.lineTo(w * 0.67, h * 0.59);
    detail.lineTo(w * 0.75, h * 0.44);
    detail.strokePath();
  }

  detail.fillStyle(revealed ? 0xffefa8 : 0xa9a6c5, revealed ? 0.88 : 0.28).fillCircle(w * 0.75, h * 0.43, revealed ? 7 : 3);
  return { focusPoint: { x: w * 0.75, y: h * 0.43 }, ambientTint: revealed ? 0xffefa8 : 0xb6b5d8 };
};
