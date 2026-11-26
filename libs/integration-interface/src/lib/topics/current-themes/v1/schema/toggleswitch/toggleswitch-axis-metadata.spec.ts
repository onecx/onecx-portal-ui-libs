import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const TOGGLESWITCH = 'v2.usages.toggleswitch'

// The toggleswitch is checked for its axis metadata and for how the resolver uses it: a non-default
// key falls back to its default, and a fully-default leaf has no fallback (no parent scope).
// Fallback paths are relative to TOGGLESWITCH.
describe('toggleswitch axis metadata', () => {
  const scopes = collectAxisScopes(TOGGLESWITCH)

  it('opens a scope only for the toggleswitch root', () => {
    expect([...scopes.keys()]).toEqual([TOGGLESWITCH])
  })

  describe('root', () => {
    it('has its variants and states (settings opted out, per-state slider content unmarked)', () => {
      expectAxes(scopes, TOGGLESWITCH, {
        variant: ['defaultVariant', 'checked'],
        state: ['defaultState', 'hover', 'disabled', 'invalid'],
      })
    })

    it('checked + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(TOGGLESWITCH, {
        from: 'checked.defaultState.slider.width',
        to: 'defaultVariant.defaultState.slider.width',
      })
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(TOGGLESWITCH, {
        from: 'defaultVariant.hover.slider.width',
        to: 'defaultVariant.defaultState.slider.width',
      })
    })

    it('defaultVariant + defaultState has no fallback (no parent scope)', () => {
      expectFallback(TOGGLESWITCH, { from: 'defaultVariant.defaultState.slider.width', to: undefined })
    })
  })
})
