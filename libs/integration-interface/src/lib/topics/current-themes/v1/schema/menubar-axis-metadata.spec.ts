import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'

const MENUBAR = 'v2.usages.menubar'

// The menubar root is a `variant` container (a single `defaultVariant` slot), so it opens a scope.
// Three nested components re-root the fallback as children: `item`, `submenu` and `mobileButton` —
// each uses the primitives `variantWithStates` shape (an unmarked `defaultVariant` slot holding a
// `defaultState` baseline plus a named `state` group). Static tokens (`padding`/`gap`/`focusRing`/
// `tooltip`) and behavioral `settings` opt out (axis: none/setting), so their tokens carry no
// fallback. Fallback paths are relative to MENUBAR.
describe('menubar axis metadata', () => {
  const scopes = collectAxisScopes(MENUBAR)

  it('opens a scope for the root and each re-rooted component', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['item', 'menubar', 'mobileButton', 'submenu'])
  })

  it('root has its default variant/state/severity members only', () => {
    expectAxes(scopes, 'menubar', {
      variant: ['defaultVariant'],
      state: ['defaultState'],
      severity: ['defaultSeverity'],
    })
  })

  describe('item', () => {
    it('has its variants, states (via the `state` group) and severity', () => {
      expectAxes(scopes, 'item', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'state.active', 'state.focus'],
        severity: ['defaultSeverity'],
      })
    })

    it('focus/active fall back to defaultState', () => {
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.focus.defaultSeverity.color',
        to: 'defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.color',
      })
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.item.defaultVariant.state.active.defaultSeverity.color',
        to: 'defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.color',
      })
    })

    it('defaultState has no fallback (item re-roots, no parent scope member)', () => {
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.item.defaultVariant.defaultState.defaultSeverity.color',
        to: undefined,
      })
    })

    it('static `padding` (axis: none) has no fallback', () => {
      expectFallback(MENUBAR, { from: 'defaultVariant.defaultState.defaultSeverity.item.padding', to: undefined })
    })
  })

  describe('submenu', () => {
    it('has its variants, states (via the `state` group) and severity', () => {
      expectAxes(scopes, 'submenu', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'state.active', 'state.focus'],
        severity: ['defaultSeverity'],
      })
    })

    it('active/focus fall back to defaultState', () => {
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.state.active.defaultSeverity.color',
        to: 'defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.color',
      })
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.state.focus.defaultSeverity.color',
        to: 'defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.color',
      })
    })

    it('defaultState has no fallback (submenu re-roots)', () => {
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.submenu.defaultVariant.defaultState.defaultSeverity.color',
        to: undefined,
      })
    })
  })

  describe('mobileButton', () => {
    it('has its variants, states (via the `state` group) and severity', () => {
      expectAxes(scopes, 'mobileButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'state.hover'],
        severity: ['defaultSeverity'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.state.hover.defaultSeverity.color',
        to: 'defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.defaultState.defaultSeverity.color',
      })
    })

    it('defaultState has no fallback (mobileButton re-roots)', () => {
      expectFallback(MENUBAR, {
        from: 'defaultVariant.defaultState.defaultSeverity.mobileButton.defaultVariant.defaultState.defaultSeverity.color',
        to: undefined,
      })
    })
  })
})
