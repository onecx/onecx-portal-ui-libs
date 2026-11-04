import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const CAROUSEL = 'v2.usages.carousel'

// Each component is checked for its axis metadata and for how the resolver uses it: a non-default
// key falls back to its default on the component's own level, a fully-default component falls back
// on the first ancestor with a non-default key, and there is no fallback when every level is
// default. The flat container/content/item token groups carry no states of their own and stay in
// the carousel root scope. Fallback paths are relative to CAROUSEL.
describe('carousel axis metadata', () => {
  const scopes = collectAxisScopes(CAROUSEL)

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['carousel', 'indicator', 'navigationButton'])
  })

  describe('root', () => {
    it('has only defaultVariant as a variant (settings and transitionDuration opted out)', () => {
      expectAxes(scopes, CAROUSEL, { variant: ['defaultVariant'] })
    })

    it('a fully-default leaf has no fallback (no parent scope)', () => {
      expectFallback(CAROUSEL, {
        from: 'defaultVariant.content.gap',
        to: undefined,
      })
    })
  })

  describe('navigationButton', () => {
    it('has its variant and states (padding and focusRing opted out)', () => {
      expectAxes(scopes, 'navigationButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'disabled'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CAROUSEL, {
        from: 'defaultVariant.navigationButton.defaultVariant.hover.color',
        to: 'defaultVariant.navigationButton.defaultVariant.defaultState.color',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CAROUSEL, {
        from: 'defaultVariant.navigationButton.defaultVariant.defaultState.color',
        to: undefined,
      })
    })
  })

  describe('indicator', () => {
    it('has its variant and states (width, height and focusRing opted out)', () => {
      expectAxes(scopes, 'indicator', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'active', 'focus'],
      })
    })

    it('active falls back to defaultState', () => {
      expectFallback(CAROUSEL, {
        from: 'defaultVariant.indicator.defaultVariant.active.background',
        to: 'defaultVariant.indicator.defaultVariant.defaultState.background',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CAROUSEL, {
        from: 'defaultVariant.indicator.defaultVariant.defaultState.background',
        to: undefined,
      })
    })
  })
})
