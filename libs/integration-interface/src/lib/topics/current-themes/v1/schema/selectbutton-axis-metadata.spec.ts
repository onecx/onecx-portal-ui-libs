import { collectAxisScopes } from './test-utils'

const SELECTBUTTON = 'v2.usages.selectbutton'

// The selectbutton is a static container: its tokens sit flat with no variant/state/severity
// wrapper. `settings` is behavioral options (opted out with `axis: 'setting'`) and `gap`/`border`
// are static siblings of the axis members (opted out with `axis: 'none'`). Its `button` is an
// embedded togglebutton component — a child boundary (`child: true`) that re-roots the fallback but
// a flat static container with no `defaultVariant`/`defaultState`/`defaultSeverity` wrapper, so it
// opens no relaxed-axis scope of its own (a standalone togglebutton likewise has zero scopes). With
// no default member for any axis there is nothing to relax to, so the correct result is zero
// fallback scopes.
describe('selectbutton axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(SELECTBUTTON).size).toBe(0)
  })
})
