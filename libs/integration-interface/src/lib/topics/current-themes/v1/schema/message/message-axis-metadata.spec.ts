import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const MESSAGE = 'v2.usages.message'

// The message is flattened (no `state` wrapper, unlike primitives `variantWithStates`): the root's
// own keys are the named variants (`defaultVariant`/`outlined`/`simple`) and each variant's keys are
// the severities. So there is a single fallback scope at the root carrying both the variant and
// severity axes. `settings` (`axis: 'setting'`) and `sm`/`lg` (`axis: 'none'`) opt out, so their
// tokens carry no fallback. A non-default variant or severity falls back to its default on the same
// level (variant before severity in the default relaxation order); a fully-default leaf has none.
// Fallback paths are relative to MESSAGE.
describe('message axis metadata', () => {
  const scopes = collectAxisScopes(MESSAGE)

  it('opens a scope only for the message root', () => {
    expect([...scopes.keys()]).toEqual([MESSAGE])
  })

  describe('root', () => {
    it('has its variants and severity members (settings and sizes opted out)', () => {
      expectAxes(scopes, MESSAGE, {
        variant: ['defaultVariant', 'outlined', 'simple'],
        severity: ['contrast', 'danger', 'defaultSeverity', 'info', 'secondary', 'success', 'warning'],
      })
    })

    it('a named severity falls back to defaultSeverity (variant already default)', () => {
      expectFallback(MESSAGE, {
        from: 'defaultVariant.info.background',
        to: 'defaultVariant.defaultSeverity.background',
      })
    })

    it('a named variant falls back to defaultVariant (severity already default)', () => {
      expectFallback(MESSAGE, {
        from: 'outlined.defaultSeverity.color',
        to: 'defaultVariant.defaultSeverity.color',
      })
    })

    it('defaultVariant + defaultSeverity has no fallback (no parent scope)', () => {
      expectFallback(MESSAGE, { from: 'defaultVariant.defaultSeverity.color', to: undefined })
    })

    it('a size token (axis: none) has no fallback', () => {
      expectFallback(MESSAGE, { from: 'sm.content.padding', to: undefined })
    })
  })
})
