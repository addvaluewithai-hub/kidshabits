/** Visual assets may be replaced without changing saved island choices. */
export interface IslandArtPack {
  id: string;
  layers: {
    backdrop: string;
    cottage: string;
    restoredCottage: string;
    tree: string;
    nova: string;
    flower: string;
  };
  colors: {
    glow: number;
    ambient: number;
  };
}

export const STORYBOOK_ART: IslandArtPack = {
  id: 'moonlit-storybook-v1',
  layers: {
    backdrop: '/art/island-landscape.svg',
    cottage: '/art/old-cottage.svg',
    restoredCottage: '/art/restored-cottage.svg',
    tree: '/art/ancient-tree.svg',
    nova: '/art/nova.svg',
    flower: '/art/luminous-flower.svg',
  },
  colors: { glow: 0xffd78f, ambient: 0xa6ffd6 },
};
