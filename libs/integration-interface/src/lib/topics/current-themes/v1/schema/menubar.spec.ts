import { expectDefaultsMatchShape } from './test-utils'

import { menubar, menubarShape, menubarDefaults } from './menubar'

describe('menubar schema', () => {
  const parsed = menubar.parse({})

  it('parses an empty object', () => {
    expect(menubar.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(menubarShape, menubarDefaults)
  })
})
