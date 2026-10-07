import { expectDefaultsMatchShape } from '../test-utils'

import { panelmenu, panelMenuDefaults } from './panelmenu'

describe('panelmenu schema', () => {
  const parsed = panelmenu.parse({})

  it('parses an empty object', () => {
    expect(panelmenu.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(panelmenu, panelMenuDefaults)
  })
})
