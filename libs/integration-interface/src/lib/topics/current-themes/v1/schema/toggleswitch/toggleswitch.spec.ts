import { expectDefaultsMatchShape } from '../test-utils'
import { toggleswitch, toggleswitchDefaults } from './toggleswitch'

describe('toggleswitch schema', () => {
  const parsed = toggleswitch.parse({})

  it('parses an empty object', () => {
    expect(toggleswitch.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(toggleswitch, toggleswitchDefaults)
  })
})
