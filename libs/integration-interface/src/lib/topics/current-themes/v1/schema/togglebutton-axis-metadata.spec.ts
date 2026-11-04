import { collectAxisScopes } from './test-utils'

const TOGGLEBUTTON = 'v2.usages.togglebutton'

// The togglebutton is a static container: its tokens sit flat with no variant/state/severity
// wrapper. The default (unchecked) tokens live inline at the root (e.g. `background`/`color`)
// rather than behind a `defaultVariant`/`defaultState`/`defaultSeverity` wrapper, and `hover`/
// `focus`/`disabled`/`invalid`/`checked` are flat token partial-overrides (alongside the base
// tokens) — not named-axis containers. Its `sm`/`lg`/`icon`/`content` siblings and the empty
// `settings` block (opted out with `axis: 'setting'`) likewise open no scope. With no default
// member for any axis, the relaxed-axis fallback has nothing to relax to, so its tokens carry no
// fallback. Zero scopes is correct.
describe('togglebutton axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(TOGGLEBUTTON).size).toBe(0)
  })
})
