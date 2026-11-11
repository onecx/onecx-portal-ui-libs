import { expectDefaultsMatchShape } from '../test-utils'
import { customGroupColumnSelector, customGroupColumnSelectorDefaults } from './custom-group-column-selector'

describe('custom-group-column-selector schema', () => {
  const parsed = customGroupColumnSelector.parse({})

  it('parses an empty object', () => {
    expect(customGroupColumnSelector.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(customGroupColumnSelector, customGroupColumnSelectorDefaults)
  })
})