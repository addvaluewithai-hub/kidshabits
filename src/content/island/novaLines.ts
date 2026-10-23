import type { IslandSnapshot, WorldFocus } from '../../domain/island/model';

/** Authored, state-aware preview lines. No live AI authority in Session 01. */
const ACTION_LINES: Record<Exclude<WorldFocus, 'idle'>, string> = {
  cottage: 'يا سلام! البيت بدأ يصحى تاني! شفتي النور اللي ظهر في الشبابيك؟ عندك ذوق خطير.',
  garden: 'واااو! أول زهرة في جزيرتنا! تخيّلي لما يبقى هنا حديقة كاملة من اختيارك.',
};

export function getNovaLine(island: IslandSnapshot, focus: WorldFocus): string {
  if (focus !== 'idle') return ACTION_LINES[focus];
  const cottage = island.cottage === 'restored';
  const garden = island.garden === 'blooming';

  if (cottage && garden) return 'رجعتي لجزيرتك! بصّي، البيت منوّر والزهرة لسه جميلة. كل حاجة زي ما اختارتيها. نكمل نكتشف مع بعض؟';
  if (cottage) return 'أهلًا برجوعك! البيت اللي صلّحتيه لسه منوّر. تحبي نزرع أول زهرة في الحديقة؟';
  if (garden) return 'رجعتي! زهرتك لسه مستنياكي في مكانها. تحبي نبص على البيت القديم كمان؟';
  return 'أخيرًا وصلنا! بس... هو إحنا هنعيش فين؟ بصّي البيت القديم ده! أنا عندي فكرة... إيه رأيك نخلي الجزيرة دي بتاعتنا؟';
}

export function getNovaTeaser(island: IslandSnapshot, focus: WorldFocus): string {
  if (focus === 'cottage') return 'البيت بدأ يرجع للحياة! ✨';
  if (focus === 'garden') return 'أول زهرة... إنتِ اللي زرعتيها! 🌸';
  if (island.cottage === 'restored' && island.garden === 'blooming') return 'جزيرتك لسه زي ما سبتيها! ✨';
  if (island.cottage === 'restored') return 'البيت منوّر! ✨';
  if (island.garden === 'blooming') return 'زهرتك لسه هنا! 🌸';
  return 'نبدأ من البيت ولا من الحديقة؟';
}
