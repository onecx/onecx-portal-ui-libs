import { expectDefaultsMatchShape } from './test-utils'

import { selectbutton, selectbuttonShape, selectbuttonDefaults } from './selectbutton'

describe('selectbutton schema', () => {
  const parsed = selectbutton.parse({})

  it('parses an empty object', () => {
    expect(selectbutton.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(selectbuttonShape, selectbuttonDefaults)
  })
})
