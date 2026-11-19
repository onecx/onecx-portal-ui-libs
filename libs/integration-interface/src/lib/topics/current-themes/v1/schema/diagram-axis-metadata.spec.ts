import { collectAxisScopes } from './test-utils'

const DIAGRAM = 'v2.usages.diagram'

// The diagram is a static aggregator (container/header/description/selectButton/footer) with no
// variant/state/severity, so its tokens carry no relaxed-axis fallback. Zero scopes is correct.
describe('diagram axis metadata', () => {
  it('opens no fallback scopes (static container)', () => {
    expect(collectAxisScopes(DIAGRAM).size).toBe(0)
  })
})
