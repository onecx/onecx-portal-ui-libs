import { collectAxisScopes } from './test-utils'

const GROUP_BY_COUNT_DIAGRAM = 'v2.usages.groupByCountDiagram'

// groupByCountDiagram reuses the (static) diagram shape via `.extend({})` — no variant/state/severity,
// so its tokens carry no relaxed-axis fallback. Zero scopes is correct.
describe('groupByCountDiagram axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(GROUP_BY_COUNT_DIAGRAM).size).toBe(0)
  })
})
