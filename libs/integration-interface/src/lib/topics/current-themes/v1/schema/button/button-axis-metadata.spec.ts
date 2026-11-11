import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

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
})
