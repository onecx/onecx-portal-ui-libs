import { expectDefaultsMatchShape } from '../test-utils'

import { tabs, tabsShape, tabsDefaults } from './tabs'

describe('tabs schema', () => {
  const parsed = tabs.parse({})

  it('parses an empty object', () => {
    expect(tabs.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(tabsShape, tabsDefaults)
  })
})
