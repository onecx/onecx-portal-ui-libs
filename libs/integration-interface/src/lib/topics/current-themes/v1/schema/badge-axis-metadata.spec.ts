import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'

const BADGE = 'v2.usages.badge'

// The badge has a single fallback scope at its root: one variant (`defaultVariant`) and the
// severity members (the baseline `defaultSeverity` plus the named overrides). `sm`/`lg`/`xl`
// and `dot` are static size/dot tokens (`axis: 'none'`), so they carry no fallback.
describe('badge axis metadata', () => {
  const scopes = collectAxisScopes(BADGE)

  it('opens a scope only for the badge root', () => {
    expect([...scopes.keys()]).toEqual([BADGE])
  })

  describe('root', () => {
    it('has its variant and severity members (sizes and dot opted out)', () => {
      expectAxes(scopes, BADGE, {
        variant: ['defaultVariant'],
        severity: ['contrast', 'danger', 'defaultSeverity', 'info', 'primary', 'secondary', 'success', 'warning'],
      })
    })

    it('a named severity falls back to defaultSeverity', () => {
      expectFallback(BADGE, {
        from: 'defaultVariant.primary.background',
        to: 'defaultVariant.defaultSeverity.background',
      })
    })

    it('a contrast severity color falls back to defaultSeverity', () => {
      expectFallback(BADGE, {
        from: 'defaultVariant.contrast.color',
        to: 'defaultVariant.defaultSeverity.color',
      })
    })

    it('defaultSeverity has no fallback (no parent scope)', () => {
      expectFallback(BADGE, { from: 'defaultVariant.defaultSeverity.background', to: undefined })
    })

    it('a size token (axis: none) has no fallback', () => {
      expectFallback(BADGE, { from: 'sm.fontSize', to: undefined })
    })
  })
})
