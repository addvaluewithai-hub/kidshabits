import { clearWorldLayers, type WorldPresentation } from '../../world-runtime/presentation';

export const drawSproutWorld: WorldPresentation = ({ width: w, height: h, progress, revealFlag, layers }) => {
  clearWorldLayers(layers);
  const revealed = Boolean(progress.flags[revealFlag]);
  const atRiver = progress.locationId === 'river-clearing';
  const { sky, far, mid, ground, detail } = layers;

  sky.fillStyle(atRiver ? 0xeff6ef : revealed ? 0xf2f7ee : 0xeaf2ec, 1).fillRect(-80, -80, w + 160, h + 160);
  sky.fillStyle(0xdfece1, 0.46).fillEllipse(w * 0.16, h * 0.16, w * 1.02, h * 0.42);
  sky.fillStyle(revealed ? 0xffefbd : 0xf5efd8, 0.28).fillCircle(w * 0.82, h * 0.13, Math.max(80, w * 0.25));

  far.fillStyle(atRiver ? 0xd4e7d9 : 0xd4e5d6, 0.96).fillEllipse(w * 0.12, h * 0.36, w * 1.08, h * 0.36);
  far.fillStyle(atRiver ? 0xc4ddce : 0xc9dfcc, 0.94).fillEllipse(w * 0.88, h * 0.4, w * 1.22, h * 0.4);
  far.fillStyle(0xb9d3c0, 0.42).fillEllipse(w * 0.52, h * 0.49, w * 1.5, h * 0.3);

  if (atRiver) {
    mid.fillStyle(0x86b493, 1).fillEllipse(w * 0.1, h * 0.68, w * 0.78, h * 0.31);
    mid.fillStyle(0x79a989, 1).fillEllipse(w * 0.92, h * 0.72, w * 0.92, h * 0.32);
    ground.fillStyle(0x6ea2a2, 1).fillRoundedRect(-w * 0.1, h * 0.63, w * 1.2, h * 0.26, 58);
    ground.fillStyle(0x87bebe, 0.92).fillRoundedRect(-w * 0.08, h * 0.665, w * 1.16, h * 0.07, 28);
    ground.fillStyle(0x73a07e, 1).fillEllipse(w * 0.08, h * 0.85, w * 0.75, h * 0.28);
    ground.fillStyle(0x7cab86, 1).fillEllipse(w * 0.94, h * 0.92, w * 0.86, h * 0.3);

    detail.lineStyle(3, 0x668f69, 0.82);
    for (let i = 0; i < 11; i += 1) {
      const x = w * (0.03 + i * 0.035);
      detail.beginPath();
      detail.moveTo(x, h * 0.7);
      detail.lineTo(x + (i % 2 ? 5 : -4), h * (0.59 - (i % 3) * 0.013));
      detail.strokePath();
    }
    detail.fillStyle(0xe7e4ce, 0.72).fillEllipse(w * 0.69, h * 0.64, 34, 16);
    detail.fillStyle(0xffffff, 0.3).fillEllipse(w * 0.69, h * 0.635, 20, 6);
    return { focusPoint: { x: w * 0.69, y: h * 0.62 }, ambientTint: 0xd9efdf };
  }

  mid.fillStyle(revealed ? 0xa8cbb0 : 0xa5bfa9, 1).fillEllipse(w * 0.15, h * 0.7, w * 0.95, h * 0.36);
  mid.fillStyle(revealed ? 0x94bea0 : 0x91ab99, 1).fillEllipse(w * 0.83, h * 0.71, w * 1.16, h * 0.39);
  ground.fillStyle(revealed ? 0x7fab8d : 0x789988, 1).fillEllipse(w * 0.5, h * 0.98, w * 1.5, h * 0.42);
  ground.fillStyle(revealed ? 0x8fbea0 : 0x86a993, 0.92).fillEllipse(w * 0.05, h * 0.9, w * 0.72, h * 0.24);

  const treeX = w * 0.22;
  const treeY = h * 0.71;
  detail.fillStyle(0x806f56, 1).fillRoundedRect(treeX - 12, treeY - 126, 25, 145, 11);
  detail.fillStyle(revealed ? 0x719d77 : 0x718d78, 1).fillCircle(treeX - 25, treeY - 137, 48);
  detail.fillStyle(revealed ? 0x7eaa80 : 0x77947c, 1).fillCircle(treeX + 25, treeY - 151, 56);
  detail.fillStyle(revealed ? 0x8ab68a : 0x809d82, 1).fillCircle(treeX + 7, treeY - 111, 47);

  for (let i = 0; i < 18; i += 1) {
    const x = (i / 17) * w;
    const y = h * (0.83 + (i % 4) * 0.018);
    const tint = i % 3 === 0 ? 0xf7e5a8 : i % 3 === 1 ? 0xe8d8ed : 0xdceecf;
    detail.fillStyle(tint, revealed ? 0.86 : 0.4).fillCircle(x, y, 2.5 + (i % 2));
  }

  if (revealed) {
    detail.lineStyle(11, 0xe7dfb6, 0.38);
    detail.beginPath();
    detail.moveTo(w * 0.51, h * 0.92);
    detail.lineTo(w * 0.61, h * 0.79);
    detail.lineTo(w * 0.72, h * 0.62);
    detail.lineTo(w * 0.79, h * 0.45);
    detail.strokePath();
  }

  return { focusPoint: { x: w * 0.79, y: h * 0.44 }, ambientTint: revealed ? 0xfff0b8 : 0xd9efdf };
};
