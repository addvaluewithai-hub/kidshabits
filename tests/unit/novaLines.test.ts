import { describe, expect, it } from 'vitest';
import { INITIAL_ISLAND } from '../../src/domain/island/model';
import { getNovaLine, getNovaTeaser } from '../../src/content/island/novaLines';

describe('Nova knows discovered island state', () => {
  it('starts with an arrival line for a new island', () => {
    expect(getNovaLine({ ...INITIAL_ISLAND }, 'idle')).toContain('أخيرًا وصلنا');
  });
  it('recognizes the house and flower after a saved return', () => {
    const restored = { ...INITIAL_ISLAND, cottage: 'restored' as const, garden: 'blooming' as const };
    expect(getNovaLine(restored, 'idle')).toContain('البيت منوّر');
    expect(getNovaLine(restored, 'idle')).toContain('الزهرة');
    expect(getNovaTeaser(restored, 'idle')).toContain('جزيرتك');
    expect(getNovaLine(restored, 'idle')).not.toContain('أخيرًا وصلنا');
  });
  it('the live focus cue does not lose authored interaction voice', () => {
    expect(getNovaLine({ ...INITIAL_ISLAND }, 'garden')).toContain('أول زهرة');
    expect(getNovaLine({ ...INITIAL_ISLAND }, 'cottage')).toContain('البيت بدأ');
  });
});
