import { collectAxisScopes } from '../test-utils'

const CONTENT = 'v2.usages.content'

// Regression guard: `content` is intentionally axis-agnostic.
// If schema metadata accidentally introduces variant/state/severity handling,
// collectAxisScopes would become non-empty and this test should fail.
describe('content axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(CONTENT).size).toBe(0)
  })
})
