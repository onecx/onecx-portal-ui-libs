import { expectDefaultsMatchShape } from './test-utils'

import { dropdown, dropdownShape, dropdownDefaults } from './dropdown'

describe('dropdown schema', () => {
  const parsed = dropdown.parse({})

  it('parses an empty object', () => {
    expect(dropdown.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(dropdownShape, dropdownDefaults)
  })
})
