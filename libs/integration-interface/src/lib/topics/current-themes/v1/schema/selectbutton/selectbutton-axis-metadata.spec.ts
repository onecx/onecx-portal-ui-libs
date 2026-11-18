import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const SELECTBUTTON = 'v2.usages.selectbutton'
const BUTTON_SCOPE = `${SELECTBUTTON}.button`

// The selectbutton has no axis of its own; its `button` child is the reused togglebutton shape.
describe('selectbutton axis metadata', () => {
  const scopes = collectAxisScopes(SELECTBUTTON)

  it('opens a scope only for the reused togglebutton child', () => {
    expect([...scopes.keys()]).toEqual([BUTTON_SCOPE])
  })

  it('the button child has the togglebutton variant and state axes', () => {
    expectAxes(scopes, BUTTON_SCOPE, {
      variant: ['defaultVariant'],
      state: ['defaultState', 'disabled', 'hover', 'invalid', 'selected'],
    })
  })

  it('a button state falls back to the button defaultState', () => {
    expectFallback(SELECTBUTTON, {
      from: 'button.defaultVariant.selected.background',
      to: 'button.defaultVariant.defaultState.background',
    })
  })

  it('the selectbutton root tokens do not take part in any fallback', () => {
    expectFallback(SELECTBUTTON, { from: 'invalid.border.color', to: undefined })
  })
})
