import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const CHIP = 'v2.usages.chip'

describe('chip axis metadata', () => {
  const scopes = collectAxisScopes(CHIP)

  it('opens only the chip root scope', () => {
    expect([...scopes.keys()]).toEqual([CHIP])
  })

  it('has variant and state members (settings opted out)', () => {
    expectAxes(scopes, CHIP, {
      variant: ['defaultVariant', 'filled'],
      state: ['defaultState', 'disabled', 'hover'],
    })
  })

  it('filled hover falls back to filled defaultState first', () => {
    expectFallback(CHIP, {
      from: 'filled.hover.background',
      to: 'filled.defaultState.background',
    })
  })

  it('filled defaultState then falls back to defaultVariant defaultState', () => {
    expectFallback(CHIP, {
      from: 'filled.defaultState.background',
      to: 'defaultVariant.defaultState.background',
    })
  })

  it('settings carry no relaxed-axis fallback', () => {
    expectFallback(CHIP, {
      from: 'settings.disabled',
      to: undefined,
    })
  })
})
