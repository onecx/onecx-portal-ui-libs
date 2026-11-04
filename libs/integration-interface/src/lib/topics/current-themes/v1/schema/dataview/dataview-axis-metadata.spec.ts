import { collectAxisScopes } from '../test-utils'

const DATAVIEW = 'v2.usages.dataview'

// The dataview is a static container: its tokens (root, header, content, footer) sit flat with no
// variant/state/severity wrapper, and its `settings` block is behavioral options (opted out with
// `axis: 'setting'`). It therefore carries no relaxed-axis fallback — the correct result is zero
// fallback scopes.
describe('dataview axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(DATAVIEW).size).toBe(0)
  })
})
