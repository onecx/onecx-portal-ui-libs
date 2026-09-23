import { expectDefaultsMatchShape } from './test-utils'

import { togglebutton, togglebuttonShape, togglebuttonDefaults } from './togglebutton'

describe('togglebutton schema', () => {
  const parsed = togglebutton.parse({})

  it('parses an empty object', () => {
    expect(togglebutton.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(togglebuttonShape, togglebuttonDefaults)
  })
})
