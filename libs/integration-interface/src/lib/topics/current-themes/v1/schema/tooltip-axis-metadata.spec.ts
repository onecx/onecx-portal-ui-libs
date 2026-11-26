import { collectAxisScopes } from './test-utils'

const TOOLTIP = 'v2.usages.tooltip'

// The tooltip is a static container (flat tokens + a `settings` behavioral block) with no
// variant/state/severity, so its tokens carry no relaxed-axis fallback. Zero scopes is correct.
describe('tooltip axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(TOOLTIP).size).toBe(0)
  })
})
