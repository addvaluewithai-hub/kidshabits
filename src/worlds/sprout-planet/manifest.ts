import type { WorldManifest } from '../types';

export const sproutPlanetManifest: WorldManifest = {
  id: 'sprout',
  folder: 'sprout-planet',
  nameAr: 'كوكب البراعم',
  subtitleAr: 'عالم أخضر بيصحى معاك',
  descriptionAr: 'مرج هادي، نهر بعيد، وحياة بتظهر خطوة بخطوة مع تقدمك الحقيقي.',
  glyph: '🌱',
  totalDays: 30,
  startingLocationId: 'landing-meadow',
  locations: {
    'landing-meadow': { id: 'landing-meadow', nameAr: 'مرج الوصول' },
    'river-clearing': { id: 'river-clearing', nameAr: 'فسحة النهر' },
  },
  dayOne: {
    revealSequenceId: 'first-light',
    revealEventId: 'day1.first-light',
    revealFlag: 'firstLightRevealed',
    primaryAction: {
      id: 'follow-first-light',
      labelAr: 'اتبع النور',
      hintAr: 'ناحية النهر',
      fromLocationId: 'landing-meadow',
      toLocationId: 'river-clearing',
      sequenceId: 'river-arrival',
      eventId: 'day1.river-arrival',
      requiresFlag: 'firstLightRevealed',
    },
    copy: {
      beforeRevealAr: 'كمّل عادات النهارده ونشوف أول حاجة هتصحى في المكان.',
      revealingAr: 'استنى… الكوكب بيصحى.',
      afterRevealAr: 'النور بان بين الشجر. واضح إنه بيقودنا لمكان تاني.',
      secondLocationAr: 'وصلنا عند النهر. النور وقف هنا وكأنه مستني حاجة.',
    },
  },
  presentationId: 'sprout',
  availability: 'available',
};
