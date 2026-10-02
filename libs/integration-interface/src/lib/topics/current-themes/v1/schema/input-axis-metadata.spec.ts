import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'

const INPUT = 'v2.usages.input'

// The input is checked for its axis metadata and for how the resolver uses it: a non-default key
// falls back to its default, and a fully-default leaf has no fallback (the input has no parent scope).
// Fallback paths are relative to INPUT.
describe('input axis metadata', () => {
  const scopes = collectAxisScopes(INPUT)

  it('opens a scope only for the input root', () => {
    expect([...scopes.keys()]).toEqual([INPUT])
  })

  describe('root', () => {
    it('has its variants, states and severity (token content unmarked)', () => {
      expectAxes(scopes, INPUT, {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
        severity: ['defaultSeverity'],
      })
    })

    it('filled + hover falls back to filled + defaultState', () => {
      expectFallback(INPUT, {
        from: 'filled.hover.defaultSeverity.background',
        to: 'filled.defaultState.defaultSeverity.background',
      })
    })

    it('filled + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(INPUT, {
        from: 'filled.defaultState.defaultSeverity.background',
        to: 'defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(INPUT, {
        from: 'defaultVariant.hover.defaultSeverity.background',
        to: 'defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultVariant + defaultState has no fallback (no parent scope)', () => {
      expectFallback(INPUT, { from: 'defaultVariant.defaultState.defaultSeverity.background', to: undefined })
    })
  })
})
