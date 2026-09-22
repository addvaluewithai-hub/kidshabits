import type { WorldManifest } from '../types';

export const moonGardenManifest: WorldManifest = {
  id: 'moon-garden',
  folder: 'moon-garden',
  nameAr: 'حديقة القمر',
  subtitleAr: 'حديقة فضية فوق ضوء النجوم',
  descriptionAr: 'عالم تجريبي بسيط نستخدمه دلوقتي عشان نثبت إن KidsHabits يقدر يحمل أكتر من كوكب من غير ما نغيّر الـcore app.',
  glyph: '🌙',
  totalDays: 30,
  startingLocationId: 'moon-terrace',
  locations: {
    'moon-terrace': { id: 'moon-terrace', nameAr: 'شرفة القمر' },
    'crater-garden': { id: 'crater-garden', nameAr: 'حديقة الفوهة' },
  },
  dayOne: {
    revealSequenceId: 'first-starlight',
    revealEventId: 'day1.first-starlight',
    revealFlag: 'firstStarlightRevealed',
    primaryAction: {
      id: 'follow-starlight',
      labelAr: 'اتبع ضوء النجمة',
      hintAr: 'ناحية الحديقة',
      fromLocationId: 'moon-terrace',
      toLocationId: 'crater-garden',
      sequenceId: 'crater-arrival',
      eventId: 'day1.crater-arrival',
      requiresFlag: 'firstStarlightRevealed',
    },
    copy: {
      beforeRevealAr: 'لما عادات النهارده تكتمل، هنشوف أول علامة حياة على القمر.',
      revealingAr: 'نجمة صغيرة نورت الأرض…',
      afterRevealAr: 'الضوء رسم طريق فضي ناحية فوهة بعيدة.',
      secondLocationAr: 'وصلنا لحديقة صغيرة جوه الفوهة. ده مجرد أول يوم تجريبي للعالم.',
    },
  },
  presentationId: 'moon-garden',
  availability: 'preview',
};
