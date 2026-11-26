import { collectAxisScopes } from './test-utils'

const REGION = 'v2.usages.region'

// A region is a static token slot (font only) with no variant/state/severity, so its tokens carry no
// relaxed-axis fallback. Zero scopes is correct.
describe('region axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(REGION).size).toBe(0)
  })
})
