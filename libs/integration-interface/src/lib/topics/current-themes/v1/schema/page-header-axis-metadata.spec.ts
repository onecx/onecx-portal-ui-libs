import { collectAxisScopes } from './test-utils'

const PAGE_HEADER = 'v2.usages.pageHeader'

// The page header is a static container (flat root tokens, `settings`, `breadcrumbWrapper`, and the
// `header`/`content` sub-shapes) with no variant/state/severity anywhere, so its tokens carry no
// relaxed-axis fallback. Zero scopes is correct.
describe('pageHeader axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(PAGE_HEADER).size).toBe(0)
  })
})
