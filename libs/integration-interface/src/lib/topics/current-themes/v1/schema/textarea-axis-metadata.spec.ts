import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'

const TEXTAREA = 'v2.usages.textarea'

// The textarea is flat (no `variant`/`state` wrappers, unlike primitives `variantWithStates`): the
// root's own keys are the variants and each variant's keys are the states. Like the input, each
// state block carries its leaf tokens directly (no `defaultSeverity` wrapper). It is checked for
// its axis metadata and for how the resolver uses it: a non-default key falls back to its default,
// and a fully-default leaf has no fallback (the textarea has no parent scope). Fallback paths are
// relative to TEXTAREA.
describe('textarea axis metadata', () => {
  const scopes = collectAxisScopes(TEXTAREA)

  it('opens a scope only for the textarea root', () => {
    expect([...scopes.keys()]).toEqual([TEXTAREA])
  })

  describe('root', () => {
    it('has its variants and states (settings opted out, token content unmarked)', () => {
      expectAxes(scopes, TEXTAREA, {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'disabled', 'invalid'],
      })
    })

    it('filled + hover falls back to filled + defaultState', () => {
      expectFallback(TEXTAREA, {
        from: 'filled.hover.background',
        to: 'filled.defaultState.background',
      })
    })

    it('filled + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(TEXTAREA, {
        from: 'filled.defaultState.background',
        to: 'defaultVariant.defaultState.background',
      })
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(TEXTAREA, {
        from: 'defaultVariant.hover.border.color',
        to: 'defaultVariant.defaultState.border.color',
      })
    })

    it('defaultVariant + defaultState has no fallback (no parent scope)', () => {
      expectFallback(TEXTAREA, { from: 'defaultVariant.defaultState.background', to: undefined })
    })
  })
})
