/**
 * @jest-environment node
 */

import { AxisKind, DEFAULT_FALLBACK_ORDER } from './axis.model';

describe('axis.model', () => {
  it('should expose the default fallback order as state, variant, severity', () => {
    expect(DEFAULT_FALLBACK_ORDER).toEqual(['state', 'variant', 'severity']);
  });

  it('should define exactly the four axis kinds', () => {
    const kinds: AxisKind[] = ['variant', 'state', 'severity', 'child'];
    expect(kinds).toHaveLength(4);
    expect(kinds).toEqual(['variant', 'state', 'severity', 'child']);
  });
});
