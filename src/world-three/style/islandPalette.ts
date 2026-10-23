/** Presentation only: same renderer-independent island state in both engines. */
export interface ThreePalette {
  id: string;
  grass: string;
  grassLight: string;
  soil: string;
  rock: string;
  wood: string;
  plaster: string;
  roof: string;
  foliage: string[];
  goldenLight: string;
  cloud: string;
  novaBody: string;
}
export const WARM_STORYBOOK: Readonly<ThreePalette> = {
  id: 'handcrafted-warm-v1',
  grass: '#5d997c',
  grassLight: '#95ba82',
  soil: '#775548',
  rock: '#46616a',
  wood: '#936d55',
  plaster: '#e8d7ae',
  roof: '#55728c',
  foliage: ['#356f61','#4d8a69','#6e9b78','#94b18b'],
  goldenLight: '#ffe1a4',
  cloud: '#bddecc',
  novaBody: '#fff1d1',
};
