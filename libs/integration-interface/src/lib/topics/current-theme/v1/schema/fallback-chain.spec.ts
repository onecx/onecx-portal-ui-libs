/**
 * @jest-environment node
 */

import { cartesianCombos, comboPathSegment, parentCombo, parentOfFullCombo, type Combo } from './fallback-chain';
import { buildFallbackChain, buildFallbackChainForLeaves, cssVariableName } from './fallback-chain';
import { buttonUsageSchema } from './button.schema';
import { inputUsageSchema } from './input.schema';
import { type AxisGroupMetadata, type LeafAxisMetadata } from './axis.model';
import { deriveLeafAxisMetadata } from './metadata';
import { markAxis } from './theme-properties-v2.schema';
import { z } from 'zod';

const inputLeaf = deriveLeafAxisMetadata(inputUsageSchema)[0];
const buttonLeaves = deriveLeafAxisMetadata(buttonUsageSchema);
const colorLeafCandidate = buttonLeaves.find((leaf) => leaf.path[leaf.path.length - 1] === 'color');
if (!colorLeafCandidate) {
  throw new Error('Expected a color leaf for the button usage schema');
}
const colorLeaf = colorLeafCandidate;

function findLeaf(leaves: LeafAxisMetadata[], field: string): LeafAxisMetadata {
  const leaf = leaves.find((candidate) => candidate.path[candidate.path.length - 1] === field);
  if (!leaf) {
    throw new Error(`Expected a leaf for field "${field}"`);
  }
  return leaf;
}

describe('cssVariableName', () => {
  it('should build a CSS variable name from a prefix and path segments', () => {
    expect(cssVariableName('onecx-theme-input', ['outlined', 'hover', 'success', 'background'])).toBe(
      '--onecx-theme-input-outlined-hover-success-background',
    );
  });
});

describe('cartesianCombos', () => {
  const group: AxisGroupMetadata = {
    variants: ['v1', 'v2'],
    states: ['s1', 's2'],
    severities: ['t1'],
    defaultVariant: 'v1',
    defaultState: 's1',
    defaultSeverity: 't1',
  };

  it('should enumerate every variant/state/severity triple with variants as the outermost loop', () => {
    const combos = cartesianCombos(group);

    expect(combos).toEqual([
      { variant: 'v1', state: 's1', severity: 't1' },
      { variant: 'v1', state: 's2', severity: 't1' },
      { variant: 'v2', state: 's1', severity: 't1' },
      { variant: 'v2', state: 's2', severity: 't1' },
    ]);
  });

  it('should normalize empty variant and state dimensions to their defaults while keeping severities intact', () => {
    const combos = cartesianCombos({
      variants: [],
      states: [],
      severities: ['high', 'low'],
      defaultVariant: 'v1',
      defaultState: 's1',
      defaultSeverity: 't1',
    });

    expect(combos).toEqual([
      { variant: 'v1', state: 's1', severity: 'high' },
      { variant: 'v1', state: 's1', severity: 'low' },
    ]);
  });
});

describe('comboPathSegment', () => {
  it('should reduce a combo to its variant/state/severity name segments', () => {
    expect(comboPathSegment({ variant: 'a', state: 'b', severity: 'c' })).toEqual(['a', 'b', 'c']);
  });
});

describe('parentCombo', () => {
  const group: AxisGroupMetadata = {
    variants: ['v1', 'v2'],
    states: ['s1', 's2'],
    severities: ['t1', 't2'],
    defaultVariant: 'v1',
    defaultState: 's1',
    defaultSeverity: 't1',
  };

  it('should reset the first differing axis (in relax order) to its default', () => {
    expect(parentCombo({ variant: 'v2', state: 's2', severity: 't2' } as Combo, group, ['state', 'variant', 'severity'])).toEqual({
      variant: 'v2',
      state: 's1',
      severity: 't2',
    });
  });

  it('should skip the child axis and continue to the next axis in the relax order', () => {
    const relaxed = parentCombo({ variant: 'v2', state: 's1', severity: 't1' } as Combo, group, [
      'child',
      'variant',
      'state',
      'severity',
    ]);

    expect(relaxed).toEqual({ variant: 'v1', state: 's1', severity: 't1' });
  });

  it('should fall through to the severity axis when the earlier axes already equal their defaults', () => {
    expect(parentCombo({ variant: 'v1', state: 's1', severity: 't2' } as Combo, group, [
      'state',
      'variant',
      'severity',
    ])).toEqual({ variant: 'v1', state: 's1', severity: 't1' });
  });

  it('should return undefined for a combination that already equals its base combination', () => {
    expect(parentCombo({ variant: 'v1', state: 's1', severity: 't1' } as Combo, group, [
      'state',
      'variant',
      'severity',
    ])).toBeUndefined();
  });
});

describe('parentOfFullCombo', () => {
  const outer: AxisGroupMetadata = {
    variants: ['v1', 'v2'],
    states: ['s1'],
    severities: ['t1'],
    defaultVariant: 'v1',
    defaultState: 's1',
    defaultSeverity: 't1',
  };
  const inner: AxisGroupMetadata = {
    variants: ['w1'],
    states: ['x1', 'x2'],
    severities: ['z1'],
    defaultVariant: 'w1',
    defaultState: 'x1',
    defaultSeverity: 'z1',
  };

  it('should relax the innermost group first, leaving the outer group untouched', () => {
    const result = parentOfFullCombo(
      [outer, inner],
      [
        { variant: 'v2', state: 's1', severity: 't1' },
        { variant: 'w1', state: 'x2', severity: 'z1' },
      ],
      ['state', 'variant', 'severity'],
    );

    expect(result).toEqual([
      { variant: 'v2', state: 's1', severity: 't1' },
      { variant: 'w1', state: 'x1', severity: 'z1' },
    ]);
  });

  it('should return undefined when every group is already fully relaxed', () => {
    expect(
      parentOfFullCombo(
        [outer, inner],
        [
          { variant: 'v1', state: 's1', severity: 't1' },
          { variant: 'w1', state: 'x1', severity: 'z1' },
        ],
        ['state', 'variant', 'severity'],
      ),
    ).toBeUndefined();
  });
});

describe('buildFallbackChain (input usage, single axis group)', () => {
  const prefix = 'onecx-theme-input';

  it('should use a real value directly when one is provided for a combination', () => {
    const realValues = new Map<string, string>();
    realValues.set('--onecx-theme-input-outlined-hover-success-background', 'red');

    const chain = buildFallbackChain(inputLeaf, realValues, prefix);

    expect(chain.get('--onecx-theme-input-outlined-hover-success-background')).toBe('red');
  });

  it('should relax the state axis first (default order) to the default state', () => {
    const chain = buildFallbackChain(inputLeaf, new Map(), prefix);

    expect(chain.get('--onecx-theme-input-outlined-hover-defaultSeverity-background')).toBe(
      'var(--onecx-theme-input-outlined-defaultState-defaultSeverity-background)',
    );
  });

  it('should emit no entry for the fully-relaxed base combination when it has no real value', () => {
    const chain = buildFallbackChain(inputLeaf, new Map(), prefix);

    expect(chain.has('--onecx-theme-input-outlined-defaultState-defaultSeverity-background')).toBe(false);
  });

  it('should relax the variant axis first when fallbackOrder is [variant, state, severity]', () => {
    const chain = buildFallbackChain(inputLeaf, new Map(), prefix, ['variant', 'state', 'severity']);

    expect(chain.get('--onecx-theme-input-filled-defaultState-defaultSeverity-background')).toBe(
      'var(--onecx-theme-input-outlined-defaultState-defaultSeverity-background)',
    );
  });

  it('should produce an identical map whether fallbackOrder is omitted or set to the default', () => {
    const realValues = new Map<string, string>([
      ['--onecx-theme-input-filled-hover-success-background', 'green'],
    ]);

    const omitted = buildFallbackChain(inputLeaf, realValues, prefix);
    const explicit = buildFallbackChain(inputLeaf, realValues, prefix, ['state', 'variant', 'severity']);

    expect(omitted.size).toBe(explicit.size);
    for (const [key, value] of omitted) {
      expect(explicit.get(key)).toBe(value);
    }
  });
});

describe('buildFallbackChain (button usage, nested child axis group)', () => {
  const prefix = 'onecx-theme-button';
  const colorLeafFieldName = 'color';
  const baseKey = `--onecx-theme-button-outlined-defaultState-defaultSeverity-defaultVariant-defaultState-defaultSeverity-${colorLeafFieldName}`;

  it('should emit no entry for the fully-relaxed combination across both groups when it has no real value', () => {
    const chain = buildFallbackChain(colorLeaf, new Map(), prefix);

    expect(chain.has(baseKey)).toBe(false);
  });

  it('should keep the default variant (outlined) as the target for an outlined source, never the sibling text variant', () => {
    const chain = buildFallbackChain(colorLeaf, new Map(), prefix);

    const source = `--onecx-theme-button-outlined-hover-defaultSeverity-defaultVariant-defaultState-defaultSeverity-${colorLeafFieldName}`;
    expect(chain.get(source)).toBe(`var(${baseKey})`);
  });

  it('should relax the text sibling variant back to the default variant rather than to each other', () => {
    const chain = buildFallbackChain(colorLeaf, new Map(), prefix);

    const source = `--onecx-theme-button-text-defaultState-defaultSeverity-defaultVariant-defaultState-defaultSeverity-${colorLeafFieldName}`;
    expect(chain.get(source)).toBe(`var(${baseKey})`);
  });
});

describe('buildFallbackChain (derived severity-only group)', () => {
  const prefix = 'onecx-theme-severity-only';
  const severityOnlySchema = z.object({
    severity: markAxis(z.object({ background: z.string().optional() }), 'severity', 'only').optional(),
  });
  const severityOnlyLeaf = findLeaf(deriveLeafAxisMetadata(severityOnlySchema), 'background');
  const baseKey = '--onecx-theme-severity-only-defaultVariant-defaultState-only-background';

  it('should build a valid variable key for a real severity-only leaf value', () => {
    const realValues = new Map<string, string>([[baseKey, 'purple']]);

    const chain = buildFallbackChain(severityOnlyLeaf, realValues, prefix);

    expect(chain.get(baseKey)).toBe('purple');
  });

  it('should still omit the fully-relaxed severity-only base combination when no real value exists', () => {
    const chain = buildFallbackChain(severityOnlyLeaf, new Map(), prefix);

    expect(chain.has(baseKey)).toBe(false);
  });
});

describe('buildFallbackChainForLeaves', () => {
  it('should merge multiple leaves into a single non-empty map', () => {
    const merged = buildFallbackChainForLeaves(buttonLeaves, new Map(), 'onecx-theme-button');

    expect(merged.size).toBeGreaterThan(0);
    expect(merged.has('--onecx-theme-button-outlined-hover-success-background')).toBe(true);
  });

  it('should not throw when two leaves compute the identical value for the same key', () => {
    const merged = buildFallbackChainForLeaves([inputLeaf, inputLeaf], new Map(), 'onecx-theme-input');

    expect(merged.size).toBeGreaterThan(0);
  });

  it('should throw a collision error when two leaves compute different values for the same key', () => {
    const sharedAxes = { variants: ['a', 'b'], states: ['s1', 's2'], severities: ['t'] };
    const leafA: LeafAxisMetadata = {
      path: ['a', 's1', 't', 'bg'],
      groups: [{ ...sharedAxes, defaultVariant: 'a', defaultState: 's2', defaultSeverity: 't' }],
    };
    const leafB: LeafAxisMetadata = {
      path: ['a', 's1', 't', 'bg'],
      groups: [{ ...sharedAxes, defaultVariant: 'b', defaultState: 's1', defaultSeverity: 't' }],
    };

    expect(() => buildFallbackChainForLeaves([leafA, leafB], new Map(), 'p')).toThrow(/collision/);
  });
});
