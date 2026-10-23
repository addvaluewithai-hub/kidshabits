import { describe, it, expect } from 'vitest';
import { INITIAL_ISLAND, parseIslandSnapshot, reduceIsland } from '../../src/domain/island/model';

describe('clean island domain', () => {
  it('records cottage and garden actions independently', () => {
    const withCottage = reduceIsland({ ...INITIAL_ISLAND }, { type: 'restore-cottage' });
    const both = reduceIsland(withCottage, { type: 'plant-garden' });
    expect(both).toMatchObject({ cottage: 'restored', garden: 'blooming' });
    expect(INITIAL_ISLAND).toMatchObject({ cottage: 'sleeping', garden: 'empty' });
  });
  it('repeating the same action does not mutate the result', () => {
    const once = reduceIsland({ ...INITIAL_ISLAND }, { type: 'restore-cottage' });
    expect(reduceIsland(once, { type: 'restore-cottage' })).toEqual(once);
  });
  it('rejects malformed or future save versions safely', () => {
    expect(parseIslandSnapshot({ schemaVersion: 99 })).toEqual(INITIAL_ISLAND);
    expect(parseIslandSnapshot({ schemaVersion: 1, garden: 'hacked', cottage: 'restored' })).toEqual(INITIAL_ISLAND);
  });
  it('reset returns the clean starting island', () => {
    const changed = reduceIsland({ ...INITIAL_ISLAND }, { type: 'plant-garden' });
    expect(reduceIsland(changed, { type: 'reset-island' })).toEqual(INITIAL_ISLAND);
  });
});
