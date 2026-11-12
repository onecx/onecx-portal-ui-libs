import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const TOGGLEBUTTON = 'v2.usages.togglebutton'

// `checked` is modelled as the `selected` state of the single `defaultVariant`, not a variant of its own.
describe('togglebutton axis metadata', () => {
  const scopes = collectAxisScopes(TOGGLEBUTTON)

  it('opens a scope only for the togglebutton itself', () => {
    expect([...scopes.keys()]).toEqual([TOGGLEBUTTON])
  })

  it('has one variant and the interaction states (settings and sizes opted out)', () => {
    expectAxes(scopes, TOGGLEBUTTON, {
      variant: ['defaultVariant'],
      state: ['defaultState', 'disabled', 'hover', 'invalid', 'selected'],
    })
  })

  it('hover falls back to defaultState', () => {
    expectFallback(TOGGLEBUTTON, {
      from: 'defaultVariant.hover.background',
      to: 'defaultVariant.defaultState.background',
    })
  })

  it('selected falls back to defaultState, also for nested content tokens', () => {
    expectFallback(TOGGLEBUTTON, {
      from: 'defaultVariant.selected.content.background',
      to: 'defaultVariant.defaultState.content.background',
    })
  })

  it('has no fallback once the state is at its default', () => {
    expectFallback(TOGGLEBUTTON, { from: 'defaultVariant.defaultState.background', to: undefined })
  })

  it('size tokens do not take part in any fallback', () => {
    expectFallback(TOGGLEBUTTON, { from: 'sm.padding', to: undefined })
  })
})
