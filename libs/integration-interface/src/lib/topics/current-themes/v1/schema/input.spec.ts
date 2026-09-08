import { expectDefaultsMatchShape, at, expectLeafAtTokenPath, expectNoGroupingWrapperKeys } from './test-utils'

import { input, inputShape, inputDefaults } from './input'

/**
 * Spec for the generic `input` usage (restructured to the shape/defaults
 * separation pattern; see docs/theme-schema-audits/input.md).
 *
 * Strategy — snapshot the values, hand-assert the invariants:
 *
 * - The **exact resolved key/value tree** is locked in with a Jest snapshot
 *   (`toMatchSnapshot()` on `input.parse({})`), never by hand-transcribed
 *   literals (which would duplicate the `inputDefaults` tree and drift).
 * - The **structural invariants** the audit confirmed are asserted
 *   explicitly: the default token path
 *   (`defaultVariant.defaultState.defaultSeverity.<token>`), the static
 *   input tokens (`transitionDuration`, `font`, `padding`, `focusRing`, `sm`,
 *   `lg`) living on the baseline severity block rather than the input root,
 *   the `active` state's background default, and the `filled` variant being a
 *   **partial override** (only the tokens that differ from `defaultVariant`
 *   are filled; static tokens + `border` resolve via the runtime fallback).
 * - **Shape/defaults parity** (`expectDefaultsMatchShape`) catches wiring bugs
 *   (typos, renames) independently of the resolved values.
 */

describe('input schema', () => {
  const parsed = input.parse({})
  const baseline = at(parsed, ['defaultVariant', 'defaultState', 'defaultSeverity'])

  it('parses an empty object', () => {
    expect(input.safeParse({}).success).toBe(true)
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(inputShape, inputDefaults)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('resolves a baseline leaf through the default token path (defaultVariant.defaultState.defaultSeverity)', () => {
    expectLeafAtTokenPath(
      parsed,
      ['defaultVariant', 'defaultState', 'defaultSeverity', 'background'],
      '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
    )
  })

  it('keeps the static input tokens (transitionDuration, font, padding, focusRing, sm, lg) on the baseline severity block, not the input root', () => {
    for (const token of ['transitionDuration', 'font', 'padding', 'focusRing', 'sm', 'lg']) {
      expect(baseline[token]).toBeDefined()
    }
    // None of them sit at the input root (siblings of defaultVariant/filled).
    expect(at(parsed, ['focusRing'])).toBeUndefined()
    expect(at(parsed, ['sm'])).toBeUndefined()
  })

  it('does not wrap the default slots in grouping-wrapper keys (variant/state/severity)', () => {
    expectNoGroupingWrapperKeys(inputShape)
  })

  it('resolves the active state background default', () => {
    expect(at(parsed, ['defaultVariant', 'active', 'defaultSeverity', 'background'])).toBe(
      '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}'
    )
  })

  it('applies the filled variant as a partial override (differs only in background/color/placeholder; border + static tokens resolve via fallback)', () => {
    const filledBaseline = at(parsed, ['filled', 'defaultState', 'defaultSeverity'])
    expect(filledBaseline.background).toBe('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}')
    expect(filledBaseline.color).toBe('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}')
    expect(filledBaseline.placeholder).toStrictEqual({
      color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
    })
    // The filled variant does not re-declare border or the static tokens —
    // those stay undefined here and resolve via the runtime fallback from defaultVariant.
    expect(filledBaseline.border).toBeUndefined()
    expect(filledBaseline.focusRing).toBeUndefined()
    expect(filledBaseline.padding).toBeUndefined()
  })
})
