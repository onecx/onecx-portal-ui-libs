import * as z from 'zod'
import {
  assertAxisContiguity,
  DEFAULT_SEGMENTS,
  introspectThemeAxisMetadata,
  themeAxisMetadata,
  type LeafFallbackMetadata,
} from './axis-metadata'
import { theme } from '../current-themes.schema'
import { colorVariants, severityVariants, states, themeRef } from '../schema/primitives'
import { themeSchemaRegistry } from '../schema/registry'
import { MessageSettingsSchema } from '../schema/message/settings'
import { input } from '../schema/input'

// Leaf paths are rooted at the top-level `theme` schema, which nests the v2 token
// schema under the `v2` key (theme = { v2: themePropertiesV2, v1: record }).
describe('schema node marker', () => {
  it('classifies colorVariants as variant', () => {
    const entry = themeSchemaRegistry.get(colorVariants)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('variant')
  })

  it('classifies severityVariants as severity', () => {
    const entry = themeSchemaRegistry.get(severityVariants)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('severity')
  })

  it('classifies states as state', () => {
    const entry = themeSchemaRegistry.get(states)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('state')
  })

  it('classifies messageSettings as a structural pass-through (axis de-assigned)', () => {
    const entry = themeSchemaRegistry.get(MessageSettingsSchema.schema)
    expect(entry).toBeDefined()
    expect(entry?.axis).toBeUndefined()
  })

  it('classifies the flattened input root as a variant container', () => {
    // The input shape is flattened (variant names are the root keys), so the component
    // root itself is the `variant` axis container, unlike the primitives `variantWithStates`
    // model where a nested `variant` object carries the marker.
    const entry = themeSchemaRegistry.get(input)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('variant')
  })
})

describe('baseline default segments', () => {
  it('exports the single-segment baseline slot name for each relaxed axis', () => {
    expect(DEFAULT_SEGMENTS).toEqual({
      variant: ['defaultVariant'],
      state: ['defaultState'],
      severity: ['defaultSeverity'],
    })
  })
})

// The primitives subtree uses the `variantWithStates` model: a `defaultVariant` baseline
// sibling and a named `variant` (colorVariants) container, each holding states and severities.
// A scope is anchored at the `v2.primitives` variant root, and entries are emitted
// innermost-first with **relative** segment deltas (the variant delta from the scope anchor,
// the state delta from the variant, the severity delta from the state).
describe('per-leaf axis metadata (primitives)', () => {
  it('records severity, state, and variant for a named-variant hover leaf (innermost-first)', () => {
    const hoverSuccessBgColor = 'v2.primitives.variant.primary.state.hover.severity.success.bg.color'
    const entry = themeAxisMetadata[hoverSuccessBgColor]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.primitives',
        entries: [
          { kind: 'severity', segments: ['severity', 'success'] },
          { kind: 'state', segments: ['state', 'hover'] },
          { kind: 'variant', segments: ['variant', 'primary'] },
        ],
      },
    ])
  })

  it('records a named severity on the defaultVariant baseline leaf', () => {
    const severityOverrideBgColor = 'v2.primitives.defaultVariant.defaultState.severity.success.bg.color'
    const entry = themeAxisMetadata[severityOverrideBgColor]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.primitives',
        entries: [
          { kind: 'severity', segments: ['severity', 'success'] },
          { kind: 'state', segments: ['defaultState'] },
          { kind: 'variant', segments: ['defaultVariant'] },
        ],
      },
    ])
  })

  it('records all-default entries on the fully-baseline leaf', () => {
    const baselineBgColor = 'v2.primitives.defaultVariant.defaultState.defaultSeverity.bg.color'
    const entry = themeAxisMetadata[baselineBgColor]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.primitives',
        entries: [
          { kind: 'severity', segments: ['defaultSeverity'] },
          { kind: 'state', segments: ['defaultState'] },
          { kind: 'variant', segments: ['defaultVariant'] },
        ],
      },
    ])
  })

  it('records a named severity on the default-state of a named variant', () => {
    const defaultStateInfoBgColor = 'v2.primitives.variant.primary.defaultState.severity.info.bg.color'
    const entry = themeAxisMetadata[defaultStateInfoBgColor]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.primitives',
        entries: [
          { kind: 'severity', segments: ['severity', 'info'] },
          { kind: 'state', segments: ['defaultState'] },
          { kind: 'variant', segments: ['variant', 'primary'] },
        ],
      },
    ])
  })

  it('records the area leaf with a multi-segment state delta (area keys are structural)', () => {
    // `area` and `canvas` are structural pass-through keys (no axis; `areas` and `area` carry no
    // variant marker), so they are NOT a variant member. The area leaf models state + severity
    // only, with no variant entry — so the `defaultState` member's delta spans the anchor across
    // the structural `area`/`canvas` keys, measured from the `v2.primitives` scope anchor.
    const areaCanvasBgColor = 'v2.primitives.area.canvas.defaultState.defaultSeverity.bg.color'
    const entry = themeAxisMetadata[areaCanvasBgColor]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.primitives',
        entries: [
          { kind: 'severity', segments: ['defaultSeverity'] },
          { kind: 'state', segments: ['area', 'canvas', 'defaultState'] },
        ],
      },
    ])
  })

  it('omits a static leaf that crosses no relaxed axis member', () => {
    // `font.family` sits directly under the primitives object (axis none) and never crosses
    // a variant/state/severity member, so there is nothing to relax and no metadata is emitted.
    expect(themeAxisMetadata['v2.primitives.font.family']).toBeUndefined()
  })
})

// The `input` usage is the first component marked under the flattened shape/defaults model:
// the component root holds the variants (`defaultVariant`/`filled`), each variant holds the
// states, and each state holds the single severity. This locks in the variant/state/severity
// propagation for that structure end to end, anchored at the `v2.usages.input` variant root.
describe('per-leaf axis metadata for the input usage', () => {
  const inputBg = (variant: string, state: string) =>
    `v2.usages.input.${variant}.${state}.defaultSeverity.background.color`

  it('records the fully-baseline leaf with single-segment default entries', () => {
    const entry = themeAxisMetadata[inputBg('defaultVariant', 'defaultState')]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.usages.input',
        entries: [
          { kind: 'severity', segments: ['defaultSeverity'] },
          { kind: 'state', segments: ['defaultState'] },
          { kind: 'variant', segments: ['defaultVariant'] },
        ],
      },
    ])
  })

  it('records the named state on a state leaf', () => {
    const entry = themeAxisMetadata[inputBg('defaultVariant', 'hover')]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.usages.input',
        entries: [
          { kind: 'severity', segments: ['defaultSeverity'] },
          { kind: 'state', segments: ['hover'] },
          { kind: 'variant', segments: ['defaultVariant'] },
        ],
      },
    ])
  })

  it('records the custom `filled` variant as the variant member', () => {
    const entry = themeAxisMetadata[inputBg('filled', 'defaultState')]
    expect(entry.scopes).toEqual([
      {
        scopePath: 'v2.usages.input',
        entries: [
          { kind: 'severity', segments: ['defaultSeverity'] },
          { kind: 'state', segments: ['defaultState'] },
          { kind: 'variant', segments: ['filled'] },
        ],
      },
    ])
  })
})

// Setting-only leaves (the interactive-data-view `settings` sub-tree) cross no relaxed-axis
// member — `interactiveDataView` (no axis) and its `settings` object (axis `setting`) are pass-throughs.
// Under the locked shape they carry no fallback metadata, so they are omitted (undefined)
// rather than emitted with an empty entry set.
describe('per-leaf axis metadata for setting-only leaves', () => {
  const IDS_SETTINGS = 'v2.usages.interactiveDataView.settings'

  it('omits the enum-valued setting leaves (no relaxed axis crossed)', () => {
    expect(themeAxisMetadata[`${IDS_SETTINGS}.sortDirection`]).toBeUndefined()
    expect(themeAxisMetadata[`${IDS_SETTINGS}.layout`]).toBeUndefined()
  })

  it('omits the array-valued setting leaf (pageSizes)', () => {
    expect(themeAxisMetadata[`${IDS_SETTINGS}.pageSizes`]).toBeUndefined()
  })
})

// Enum and array values are leaf tokens (not containers the walker should descend into). A
// non-scalar leaf that sits INSIDE a relaxed-axis chain must still be captured; the only way
// to distinguish "recognized as a leaf" from "skipped as a container" is to place it under a
// variant root, where it would be emitted iff it was recognized as a leaf.
describe('leaf detection for non-scalar tokens (synthetic)', () => {
  it('captures enum and array leaves nested inside a relaxed-axis chain', () => {
    const severity = z.object({ list: z.array(z.number()), pick: z.enum(['a', 'b']) })
    const state = z.object({ defaultSeverity: severity })
    const variant = z.object({ defaultState: state })
    const root = z
      .object({ defaultVariant: variant })
      .register(themeSchemaRegistry, { id: 'specNonScalarRoot' })
    const synthetic = z
      .object({ primitives: root })
      .register(themeSchemaRegistry, { id: 'specNonScalarTop' })
    const metadata = introspectThemeAxisMetadata(synthetic)
    const expected = [
      { kind: 'severity', segments: ['defaultSeverity'] },
      { kind: 'state', segments: ['defaultState'] },
      { kind: 'variant', segments: ['defaultVariant'] },
    ]
    expect(metadata['primitives.defaultVariant.defaultState.defaultSeverity.list']?.scopes).toEqual([
      { scopePath: 'primitives', entries: expected },
    ])
    expect(metadata['primitives.defaultVariant.defaultState.defaultSeverity.pick']?.scopes).toEqual([
      { scopePath: 'primitives', entries: expected },
    ])
  })

  it('omits enum and array leaves that cross no relaxed axis', () => {
    const synthetic = z.object({ enumLeaf: z.enum(['a', 'b']), arrayLeaf: z.array(z.number()) })
    const metadata = introspectThemeAxisMetadata(synthetic)
    expect(metadata).toEqual({})
  })
})

// A Model A `child: true` node is a boundary read by its parent's walker: the parent opens a
// new inner scope anchored at the boundary node and re-roots classification of the child's own
// keys by the child's own `axis`. This is the mechanism that lets a component's own axis
// members (e.g. its states) classify inside a scope anchored at the component.
describe('child boundary detection (synthetic)', () => {
  it('opens a scope at a child-boundary node and re-roots the child own keys', () => {
    const childComp = z
      .object({ hover: z.object({ color: z.string() }) })
      .register(themeSchemaRegistry, { id: 'specChildComp', axis: 'state', child: true })
    const synthetic = z
      .object({ comp: childComp })
      .register(themeSchemaRegistry, { id: 'specBoundaryTop' })
    const metadata = introspectThemeAxisMetadata(synthetic)
    expect(metadata['comp.hover.color']?.scopes).toEqual([
      { scopePath: 'comp', entries: [{ kind: 'state', segments: ['hover'] }] },
    ])
  })

  it('omits a leaf nested inside a structural pass-through node (message close width)', () => {
    // `message.close` (messageCloseButton) is a structural pass-through node (its axis is
    // de-assigned): `width` crosses no variant/state/severity member, so the leaf carries no
    // fallback metadata.
    expect(themeAxisMetadata['v2.usages.message.close.width']).toBeUndefined()
  })
})

// Within a scope, entries are emitted innermost-first: the severity member precedes the state
// member, which precedes the variant member.
describe('entry ordering (innermost-first)', () => {
  it('orders severity before state before variant for a full-axis leaf', () => {
    const hoverSuccessBgColor = 'v2.primitives.variant.primary.state.hover.severity.success.bg.color'
    const entry = themeAxisMetadata[hoverSuccessBgColor]
    const kinds = entry.scopes[0].entries.map((e) => e.kind)
    expect(kinds).toEqual(['severity', 'state', 'variant'])
  })
})

// Composing the relative entry deltas outer-to-inner must reconstruct the leaf's absolute
// path: start from the scope anchor, append each entry's segments in variant -> state ->
// severity order, and the result is the leaf path minus the non-axis tail (the token object
// keys such as `bg.color`).
describe('relative-delta composition', () => {
  it('reconstructs the member prefix by splicing entries onto the scope anchor', () => {
    const hoverSuccessBgColor = 'v2.primitives.variant.primary.state.hover.severity.success.bg.color'
    const entry = themeAxisMetadata[hoverSuccessBgColor]
    const scope = entry.scopes[0]
    const segmentsByKind: Record<'variant' | 'state' | 'severity', string[]> = {
      variant: scope.entries.find((e) => e.kind === 'variant')!.segments,
      state: scope.entries.find((e) => e.kind === 'state')!.segments,
      severity: scope.entries.find((e) => e.kind === 'severity')!.segments,
    }
    let abs = scope.scopePath
    abs += '.' + segmentsByKind.variant.join('.')
    abs += '.' + segmentsByKind.state.join('.')
    abs += '.' + segmentsByKind.severity.join('.')
    expect(abs).toBe('v2.primitives.variant.primary.state.hover.severity.success')
    expect(hoverSuccessBgColor).toBe(`${abs}.bg.color`)
  })
})

describe('precomputed export', () => {
  it('matches a fresh introspection of the same schema for a sampled leaf', () => {
    const hoverSuccessBgColor = 'v2.primitives.variant.primary.state.hover.severity.success.bg.color'
    const inputBgColor = 'v2.usages.input.defaultVariant.hover.defaultSeverity.background.color'
    const fresh = introspectThemeAxisMetadata(theme)
    expect(themeAxisMetadata[hoverSuccessBgColor]).toEqual(fresh[hoverSuccessBgColor])
    expect(themeAxisMetadata[inputBgColor]).toEqual(fresh[inputBgColor])
  })
})

// Edge-case coverage for the introspection walker. These exercise synthetic schemas so the
// `themeRef`-only union and the non-object (record) container branches of `walk` are covered.
describe('introspection edge cases', () => {
  it('omits a themeRef-only union leaf (a leaf, but not inside a relaxed axis)', () => {
    // A union whose only members are registered `themeRef` strings has no non-ref concrete
    // member, so the resolver returns the union unchanged and the walker records a leaf. It
    // crosses no relaxed-axis member, so it carries no fallback metadata and is omitted.
    const otherRef = z.string().register(themeSchemaRegistry, { id: 'specThemeRef2' })
    const synthetic = z.object({ leaf: z.union([themeRef, otherRef]) })
    const metadata = introspectThemeAxisMetadata(synthetic)
    expect(metadata).toEqual({})
  })

  it('skips free-form record containers without recording a leaf', () => {
    const synthetic = z.object({ v1: z.record(z.string(), z.string()) })
    const metadata = introspectThemeAxisMetadata(synthetic)
    expect(metadata).toEqual({})
  })
})

// The contiguity invariant (per the theme-schema-audit skill, Step 5/7): within a scope, a
// severity entry implies a state entry. The test suite is the canonical enforcement — the
// source no longer asserts at import, so a non-contiguous subtree fails CI here rather than
// crashing the `integration-interface` import. A state entry does NOT imply a variant entry:
// structural subtrees (e.g. the `area`/`canvas` leaves) model state + severity without a
// variant member.
describe('axis contiguity assertion', () => {
  it('enforces contiguity for the real in-scope primitives and input subtrees', () => {
    expect(() => assertAxisContiguity(themeAxisMetadata, ['v2.primitives', 'v2.usages.input'])).not.toThrow()
  })

  it('throws on a severity entry without an enclosing state entry', () => {
    const violating: Record<string, LeafFallbackMetadata> = {
      'a.severity.danger.color': {
        scopes: [{ scopePath: 'a', entries: [{ kind: 'severity', segments: ['severity', 'danger'] }] }],
      },
    }
    expect(() => assertAxisContiguity(violating, ['a'])).toThrow('severity without state')
  })

  it('does not throw on a state entry without a variant entry (structural leaves)', () => {
    // Area-style leaves model state + severity with no variant member; the state-only entry is valid.
    const statelessVariant: Record<string, LeafFallbackMetadata> = {
      'a.state.hover.color': {
        scopes: [{ scopePath: 'a', entries: [{ kind: 'state', segments: ['state', 'hover'] }] }],
      },
    }
    expect(() => assertAxisContiguity(statelessVariant, ['a'])).not.toThrow()
  })

  it('does not throw on a contiguous severity/state/variant chain', () => {
    const ok: Record<string, LeafFallbackMetadata> = {
      'a.variant.p.state.h.severity.s.color': {
        scopes: [
          {
            scopePath: 'a',
            entries: [
              { kind: 'severity', segments: ['severity', 's'] },
              { kind: 'state', segments: ['state', 'h'] },
              { kind: 'variant', segments: ['variant', 'p'] },
            ],
          },
        ],
      },
    }
    expect(() => assertAxisContiguity(ok, ['a'])).not.toThrow()
  })

  it('ignores leaves outside the named scope prefixes', () => {
    const outOfScope: Record<string, LeafFallbackMetadata> = {
      'elsewhere.severity.danger.color': {
        scopes: [{ scopePath: 'elsewhere', entries: [{ kind: 'severity', segments: ['severity', 'danger'] }] }],
      },
    }
    // The violating leaf is under `elsewhere`, which is not in the scope prefixes, so the
    // scoped pass must not flag it.
    expect(() => assertAxisContiguity(outOfScope, ['v2.primitives'])).not.toThrow()
  })
})
