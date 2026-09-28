import { collectAxisScopes, expectAxes } from './test-utils'

const INPUT = 'v2.usages.input'

describe('input axis metadata', () => {
  const scopes = collectAxisScopes(INPUT)

  it('opens a scope only for the input root', () => {
    expect([...scopes.keys()]).toEqual([INPUT])
  })

  it('input has its variants, states and severity (token content unmarked)', () => {
    expectAxes(scopes, INPUT, {
      variant: ['defaultVariant', 'filled'],
      state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
      severity: ['defaultSeverity'],
    })
  })
})
