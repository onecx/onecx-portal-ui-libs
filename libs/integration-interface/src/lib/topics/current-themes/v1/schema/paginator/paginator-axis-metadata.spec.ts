import { collectAxisScopes } from '../test-utils'

const PAGINATOR = 'v2.usages.paginator'

// The paginator is a static container. Its `button` spreads the default tokens inline (no
// `defaultState` wrapper) next to flat `hover`/`active` partial overrides, so there is no default
// member to relax to and no axis marker applies. Zero fallback scopes is correct.
describe('paginator axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(PAGINATOR).size).toBe(0)
  })
})
