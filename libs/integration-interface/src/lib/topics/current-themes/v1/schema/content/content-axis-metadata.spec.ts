import { collectAxisScopes } from '../test-utils'

const CONTENT = 'v2.usages.content'

// The content card is a static container (no variant/state/severity anywhere), so its tokens carry
// no relaxed-axis fallback. The correct result is zero fallback scopes.
describe('content axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(CONTENT).size).toBe(0)
  })
})
