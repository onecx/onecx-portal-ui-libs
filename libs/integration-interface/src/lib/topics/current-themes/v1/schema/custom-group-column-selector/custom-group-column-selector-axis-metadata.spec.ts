import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const CUSTOM_GROUP_COLUMN_SELECTOR = 'v2.usages.customGroupColumnSelector'

// The usage itself is a structural container; the only relaxed axis is the nested `button`
// state slot. This test guards against accidental axis expansion or state fallback regressions.
describe('custom group column selector axis metadata', () => {
  const scopes = collectAxisScopes(CUSTOM_GROUP_COLUMN_SELECTOR)

  it('opens a scope only for button', () => {
    const names = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...names].sort()).toEqual(['button'])
  })

  describe('button', () => {
    it('exposes only the expected states', () => {
      expectAxes(scopes, 'button', { state: ['defaultState', 'hover', 'active', 'disabled'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CUSTOM_GROUP_COLUMN_SELECTOR, {
        from: 'button.hover.color',
        to: 'button.defaultState.color',
      })
    })

    it('active falls back to defaultState', () => {
      expectFallback(CUSTOM_GROUP_COLUMN_SELECTOR, {
        from: 'button.active.background',
        to: 'button.defaultState.background',
      })
    })

    it('disabled falls back to defaultState', () => {
      expectFallback(CUSTOM_GROUP_COLUMN_SELECTOR, {
        from: 'button.disabled.color',
        to: 'button.defaultState.color',
      })
    })

    it('defaultState has no fallback', () => {
      expectFallback(CUSTOM_GROUP_COLUMN_SELECTOR, {
        from: 'button.defaultState.background',
        to: undefined,
      })
    })
  })
})
