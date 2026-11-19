import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const FIELDSET = 'v2.usages.fieldset'

// The fieldset is checked for its axis metadata and for how the resolver uses it: the root carries
// the single `defaultVariant` member (with `content`/`settings` opted out), and the legend button —
// a sibling of `defaultVariant` at the root — re-roots as a child whose keys are its named states.
// A non-default state falls back to `defaultState` on its own level, and a fully-default leaf has
// no fallback. Fallback paths are relative to FIELDSET.
describe('fieldset axis metadata', () => {
  const scopes = collectAxisScopes(FIELDSET)

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...scopeNames].sort()).toEqual(['fieldset', 'legendButton'])
  })

  describe('root', () => {
    it('has only defaultVariant as a variant (content/settings opted out, legendButton re-roots as a child)', () => {
      expectAxes(scopes, FIELDSET, { variant: ['defaultVariant'] })
    })

    it('a fully-default leaf has no fallback (no parent scope)', () => {
      expectFallback(FIELDSET, { from: 'defaultVariant.color', to: undefined })
    })
  })

  describe('legendButton', () => {
    it('has its states (state content unmarked)', () => {
      expectAxes(scopes, 'legendButton', {
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(FIELDSET, {
        from: 'legendButton.hover.color',
        to: 'legendButton.defaultState.color',
      })
    })

    it('disabled falls back to defaultState', () => {
      expectFallback(FIELDSET, {
        from: 'legendButton.disabled.opacity',
        to: 'legendButton.defaultState.opacity',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(FIELDSET, { from: 'legendButton.defaultState.color', to: undefined })
    })
  })
})
