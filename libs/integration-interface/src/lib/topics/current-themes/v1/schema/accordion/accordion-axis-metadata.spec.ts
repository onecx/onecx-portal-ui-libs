import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const ACCORDION = 'v2.usages.accordion'

// Each component (root, panel, header) is checked for its axis metadata and for how the resolver
// uses it: a non-default key falls back to its default on the component's own level, a fully-default
// component falls back on the first ancestor with a non-default key, and there is no fallback when
// every level is default. Fallback paths are relative to ACCORDION.
describe('accordion axis metadata', () => {
  const scopes = collectAxisScopes(ACCORDION)

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['accordion', 'header', 'panel'])
  })

  describe('root', () => {
    it('has only defaultVariant as a variant (panel re-roots as a child)', () => {
      expectAxes(scopes, ACCORDION, { variant: ['defaultVariant'] })
    })

    it('a fully-default leaf has no fallback (no parent scope)', () => {
      expectFallback(ACCORDION, {
        from: 'defaultVariant.panel.defaultVariant.defaultState.content.color',
        to: undefined,
      })
    })
  })

  describe('panel', () => {
    it('has its variant and states (content/header static tokens carried within the state)', () => {
      expectAxes(scopes, 'panel', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'active', 'disabled'],
      })
    })

    it('active falls back to defaultState', () => {
      expectFallback(ACCORDION, {
        from: 'defaultVariant.panel.defaultVariant.active.content.color',
        to: 'defaultVariant.panel.defaultVariant.defaultState.content.color',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(ACCORDION, {
        from: 'defaultVariant.panel.defaultVariant.defaultState.content.color',
        to: undefined,
      })
    })
  })

  describe('header', () => {
    it('has its variant and states (focusRing opted out)', () => {
      expectAxes(scopes, 'header', { variant: ['defaultVariant'], state: ['defaultState', 'hover'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(ACCORDION, {
        from: 'defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.hover.color',
        to: 'defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.color',
      })
    })

    it('defaultState falls back on the panel state', () => {
      expectFallback(ACCORDION, {
        from: 'defaultVariant.panel.defaultVariant.active.header.defaultVariant.defaultState.color',
        to: 'defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.color',
      })
    })

    it('defaultState has no fallback when the panel is default', () => {
      expectFallback(ACCORDION, {
        from: 'defaultVariant.panel.defaultVariant.defaultState.header.defaultVariant.defaultState.color',
        to: undefined,
      })
    })
  })
})
