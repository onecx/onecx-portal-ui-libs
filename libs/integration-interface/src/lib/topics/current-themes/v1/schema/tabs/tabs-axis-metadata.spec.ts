import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const TABS = 'v2.usages.tabs'

// The tabs root carries no variant axis (no `defaultVariant` key), so it opens no scope of its
// own; the static token groups (root background/color/gap/shadow, `tablist`, `tabpanel`) and the
// `settings`/`viewport` configuration opt out. Only the state-scoped child components `tab` and
// `navButton` open fallback scopes. Each is checked for its axis metadata and for how the resolver
// uses it: a non-default state falls back to its default on the component's own level, and a
// fully-default state has no fallback (there is no parent scope). Fallback paths are relative to
// TABS.
describe('tabs axis metadata', () => {
  const scopes = collectAxisScopes(TABS)

  it('opens scopes only for the state-scoped child components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['navButtons', 'tab'])
  })

  describe('tab', () => {
    it('has its states (per-state content unmarked)', () => {
      expectAxes(scopes, 'tab', {
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(TABS, {
        from: 'tab.hover.background',
        to: 'tab.defaultState.background',
      })
    })

    it('a nested per-state token (activeBar) falls back to defaultState', () => {
      expectFallback(TABS, {
        from: 'tab.active.activeBar.background',
        to: 'tab.defaultState.activeBar.background',
      })
    })

    it('defaultState has no fallback (no parent scope)', () => {
      expectFallback(TABS, { from: 'tab.defaultState.background', to: undefined })
    })
  })

  describe('navButtons', () => {
    it('has its states (per-state content unmarked)', () => {
      expectAxes(scopes, 'navButtons', {
        state: ['defaultState', 'hover'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(TABS, {
        from: 'navButtons.hover.color',
        to: 'navButtons.defaultState.color',
      })
    })

    it('defaultState has no fallback (no parent scope)', () => {
      expectFallback(TABS, { from: 'navButtons.defaultState.color', to: undefined })
    })
  })
})
