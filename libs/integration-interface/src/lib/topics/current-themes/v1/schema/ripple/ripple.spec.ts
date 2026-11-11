import { expectDefaultsMatchShape } from '../test-utils'
import { ripple, rippleDefaults } from './ripple'

describe('ripple schema', () => {
  const parsed = ripple.parse({})

  it('parses an empty object', () => {
    expect(ripple.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(ripple, rippleDefaults)
  })
})
