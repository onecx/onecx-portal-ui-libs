import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'
import { button } from './button'

const BUTTON = 'v2.usages.button'

// Button nests two independent `variant` axes in a single scope: a color variant
// (`defaultVariant`/`primary`/`secondary`) and, inside each color variant, a shape variant
// (`defaultVariant`/`rounded`/`raised`/`text`/`textRaised`/`outlined`/`iconOnly`). Both layers
// share the `variant` kind and live in the same fallback scope (no nested scope boundary between
// them), so they appear merged in `expectAxes` — the relaxation order is driven by entry order
// (innermost/shape first, outermost/color second), not by kind alone. `state` and `severity` sit
// in the same scope too, exactly like the calendar `input` component.
describe('button axis metadata', () => {
  const scopes = collectAxisScopes(BUTTON)

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['badge', 'button'])
  })

  describe('root', () => {
    it('has both variant layers, the interaction states and the severities (sizes opted out)', () => {
      expectAxes(scopes, BUTTON, {
        variant: [
          'defaultVariant',
          'iconOnly',
          'outlined',
          'primary',
          'raised',
          'rounded',
          'secondary',
          'text',
          'textRaised',
        ],
        state: ['active', 'defaultState', 'disabled', 'focus', 'hover'],
        severity: ['contrast', 'danger', 'defaultSeverity', 'help', 'info', 'success', 'warning'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(BUTTON, {
        from: 'primary.raised.hover.success.color',
        to: 'primary.raised.defaultState.success.color',
      })
    })

    it('a non-default shape falls back to the color variant\u2019s own defaultVariant shape', () => {
      expectFallback(BUTTON, {
        from: 'primary.raised.defaultState.success.color',
        to: 'primary.defaultVariant.defaultState.success.color',
      })
    })

    it('a non-default color variant falls back to the root defaultVariant color', () => {
      expectFallback(BUTTON, {
        from: 'primary.defaultVariant.defaultState.success.color',
        to: 'defaultVariant.defaultVariant.defaultState.success.color',
      })
    })

    it('severity falls back last, once both variant layers and state are already default', () => {
      expectFallback(BUTTON, {
        from: 'defaultVariant.defaultVariant.defaultState.success.color',
        to: 'defaultVariant.defaultVariant.defaultState.defaultSeverity.color',
      })
    })

    it('has no fallback once every axis is at its default', () => {
      expectFallback(BUTTON, { from: 'defaultVariant.defaultVariant.defaultState.defaultSeverity.color', to: undefined })
    })

    it('a default-colored, non-default shape with a non-default state relaxes state first', () => {
      expectFallback(BUTTON, {
        from: 'defaultVariant.iconOnly.focus.info.color',
        to: 'defaultVariant.iconOnly.defaultState.info.color',
      })
    })

    it('the icon-only width/icon fields are not classified themselves, but still inherit the enclosing shape-variant fallback', () => {
      expectFallback(BUTTON, { from: 'defaultVariant.iconOnly.width', to: 'defaultVariant.defaultVariant.width' })
    })
  })

  describe('badge', () => {
    it('has its own variant + severity axes, reused verbatim across color variants', () => {
      expectAxes(scopes, 'badge', {
        variant: ['defaultVariant'],
        severity: ['contrast', 'danger', 'defaultSeverity', 'info', 'primary', 'secondary', 'success', 'warning'],
      })
    })

    it('a non-default badge severity override falls back to its own defaultSeverity', () => {
      expectFallback(BUTTON, {
        from: 'primary.badge.defaultVariant.success.color',
        to: 'primary.badge.defaultVariant.defaultSeverity.color',
      })
    })

    it('a size token falls back through the button color variant, not a badge-local one', () => {
      expectFallback(BUTTON, { from: 'primary.badge.sm.fontSize', to: 'defaultVariant.badge.sm.fontSize' })
    })
  })

  describe('font weight (selected-state semibold vs. a single-property severity override)', () => {
    // The button font carries weight but intentionally omits `size` (set globally / per-usage),
    // so a severity that "changes only size" is expressed as a severity font override that touches
    // only a non-weight property. The guarded invariant is the same either way: severity relaxes
    // LAST (see `resolveLeafFallback` / `FALLBACK_ORDER_DEFAULT`), so the selected-state weight is
    // inherited through the severity axis rather than being reset by a severity override that does
    // not set weight.

    it('a non-default state with a non-default severity relaxes the state before the severity', () => {
      expectFallback(BUTTON, {
        from: 'defaultVariant.defaultVariant.hover.danger.font.weight',
        to: 'defaultVariant.defaultVariant.defaultState.danger.font.weight',
      })
    })

    it('a baseline-state weight at a non-default severity relaxes the severity to its default last', () => {
      expectFallback(BUTTON, {
        from: 'defaultVariant.defaultVariant.defaultState.danger.font.weight',
        to: 'defaultVariant.defaultVariant.defaultState.defaultSeverity.font.weight',
      })
    })

    it('the baseline (default state + default severity) weight leaf has no further fallback', () => {
      expectFallback(BUTTON, {
        from: 'defaultVariant.defaultVariant.defaultState.defaultSeverity.font.weight',
        to: undefined,
      })
    })

    it('keeps the selected-state weight when a severity font override changes only a non-weight property', () => {
      const parsed: any = button.parse({
        defaultVariant: {
          defaultVariant: {
            defaultState: {
              // The established baseline weight — the "selected-state semibold".
              defaultSeverity: { font: { weight: '600' } },
              // A `danger` severity override that changes only a non-weight property: the
              // `danger` leaf must not materialize a new global normal weight over the baseline.
              danger: { font: { lineHeight: '2.0' } },
            },
          },
        },
      })
      const baseline = parsed.defaultVariant.defaultVariant.defaultState.defaultSeverity.font
      const danger = parsed.defaultVariant.defaultVariant.defaultState.danger.font
      // The baseline weight survives (explicit values win over defaults; nothing resets it).
      expect(baseline.weight).toBe('600')
      // The severity override stays sparse: it supplies only what it set, so the weight falls
      // through to the baseline rather than a synthesized global normal.
      expect(danger.lineHeight).toBe('2.0')
      expect(danger.weight).toBeUndefined()
    })
  })
})
