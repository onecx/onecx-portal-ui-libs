import { collectAxisScopes } from './test-utils'

const LOADING_INDICATOR = 'v2.usages.loadingIndicator'

// The loading indicator is a static container (overlay + spinner) with no variant/state/severity, so
// its tokens carry no relaxed-axis fallback. Zero scopes is correct.
describe('loadingIndicator axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(LOADING_INDICATOR).size).toBe(0)
  })
})
