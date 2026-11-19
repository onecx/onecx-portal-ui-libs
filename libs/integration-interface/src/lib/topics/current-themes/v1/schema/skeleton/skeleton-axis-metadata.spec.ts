import { collectAxisScopes } from '../test-utils'

const SKELETON = 'v2.usages.skeleton'

// The skeleton only holds flat static tokens (border radius, background, animation background)
// with no variant/state/severity members. Zero fallback scopes is correct.
describe('skeleton axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(SKELETON).size).toBe(0)
  })
})
