import { collectAxisScopes } from './test-utils'

const BREADCRUMB = 'v2.usages.breadcrumb'

// The breadcrumb is a static container: its root and `item` tokens sit flat (with `settings`
// marked `axis: 'setting'`), and the item's `hover`/`focus`/`disabled`/`active` groups are flat
// token partial-overrides alongside the base tokens — not `variant`/`state`/`severity` containers.
// There is no axis wrapper anywhere, so its tokens carry no relaxed-axis fallback. Zero scopes is
// correct.
describe('breadcrumb axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(BREADCRUMB).size).toBe(0)
  })
})
