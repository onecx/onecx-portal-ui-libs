import { expectDefaultsMatchShape } from '../test-utils'
import { chip, chipDefaults } from './chip'

describe('chip schema', () => {
  const parsed = chip.parse({})

  it('parses an empty object', () => {
    expect(chip.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(chip, chipDefaults)
  })
})