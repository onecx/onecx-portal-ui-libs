import { expectDefaultsMatchShape } from '../test-utils'
import { multiselect, multiselectDefaults } from './multiselect'

describe('multiselect schema', () => {
  const parsed = multiselect.parse({})

  it('parses an empty object', () => {
    expect(multiselect.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(multiselect, multiselectDefaults)
  })
})
