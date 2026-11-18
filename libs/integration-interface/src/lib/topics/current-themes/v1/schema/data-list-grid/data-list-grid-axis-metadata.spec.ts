import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const DATA_LIST_GRID = 'v2.usages.dataListGrid'

// The data list grid root is a static container (no variant/state wrapper). Only the state-scoped
// child components `itemCard` and `itemRow` open fallback scopes: a non-default state falls back
// to `defaultState` on the item's own level, and `defaultState` has no fallback.
describe('data list grid axis metadata', () => {
  const scopes = collectAxisScopes(DATA_LIST_GRID)

  it('opens scopes only for the state-scoped item components', () => {
    const names = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...names].sort()).toEqual(['itemCard', 'itemRow'])
  })

  describe.each(['itemCard', 'itemRow'])('%s', (item) => {
    it('exposes only the expected states', () => {
      expectAxes(scopes, item, { state: ['defaultState', 'hover', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(DATA_LIST_GRID, { from: `${item}.hover.background`, to: `${item}.defaultState.background` })
    })

    it('focus falls back to defaultState', () => {
      expectFallback(DATA_LIST_GRID, { from: `${item}.focus.border.color`, to: `${item}.defaultState.border.color` })
    })

    it('defaultState has no fallback', () => {
      expectFallback(DATA_LIST_GRID, { from: `${item}.defaultState.background`, to: undefined })
    })
  })

  it('root tokens have no fallback', () => {
    expectFallback(DATA_LIST_GRID, { from: 'background', to: undefined })
  })
})
