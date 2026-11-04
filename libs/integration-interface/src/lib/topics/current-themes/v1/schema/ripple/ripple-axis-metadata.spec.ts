import { collectAxisScopes } from '../test-utils'

const RIPPLE = 'v2.usages.ripple'

// Ripple is a static directive: the `ink` circle is the sole visual element and `settings` carries
// behavioral options — neither has a variant/state/severity. The correct result is zero scopes.
describe('ripple axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(RIPPLE).size).toBe(0)
  })
})
