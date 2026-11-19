import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const PANELMENU = 'v2.usages.panelmenu'

// Each component (root, header, item) is checked for its axis metadata and for how the resolver
// uses it: a non-default key falls back to its default on the component's own level, a fully-default
// component falls back on the first ancestor with a non-default key, and there is no fallback when
// every level is default. The `panel` box is a static container (no states of its own), so its
// tokens carry only the root's variant axis. Fallback paths are relative to PANELMENU.
describe('panelmenu axis metadata', () => {
  const scopes = collectAxisScopes(PANELMENU)

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['header', 'item', 'panelmenu'])
  })

  describe('root', () => {
    it('has only defaultVariant as a variant (settings and gap/transitionDuration opted out)', () => {
      expectAxes(scopes, PANELMENU, { variant: ['defaultVariant'] })
    })

    it('a fully-default leaf has no fallback (root has only the default variant)', () => {
      expectFallback(PANELMENU, {
        from: 'defaultVariant.panel.color',
        to: undefined,
      })
    })
  })

  describe('header', () => {
    it('has its variant and states (per-state content unmarked)', () => {
      expectAxes(scopes, 'header', { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'selected', 'disabled'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(PANELMENU, {
        from: 'defaultVariant.header.defaultVariant.hover.color',
        to: 'defaultVariant.header.defaultVariant.defaultState.color',
      })
    })

    it('defaultState has no fallback (root has only the default variant)', () => {
      expectFallback(PANELMENU, {
        from: 'defaultVariant.header.defaultVariant.defaultState.color',
        to: undefined,
      })
    })
  })

  describe('item', () => {
    it('has its variant and states (submenu and per-state content opted out / unmarked)', () => {
      expectAxes(scopes, 'item', { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'selected', 'disabled'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(PANELMENU, {
        from: 'defaultVariant.item.defaultVariant.hover.color',
        to: 'defaultVariant.item.defaultVariant.defaultState.color',
      })
    })

    it('defaultState has no fallback (root has only the default variant)', () => {
      expectFallback(PANELMENU, {
        from: 'defaultVariant.item.defaultVariant.defaultState.color',
        to: undefined,
      })
    })
  })
})
