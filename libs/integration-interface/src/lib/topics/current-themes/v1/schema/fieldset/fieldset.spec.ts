import { expectDefaultsMatchShape } from '../test-utils'
import { fieldset, fieldsetDefaults } from './index'

describe('fieldset schema', () => {
  const parsed = fieldset.parse({})

  it('parses an empty object', () => {
    expect(fieldset.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('keeps defaults aligned with the shape', () => {
    expectDefaultsMatchShape(fieldset, fieldsetDefaults)
  })
})