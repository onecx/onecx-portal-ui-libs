import { expectDefaultsMatchShape } from '../test-utils'

import { message, messageDefaults } from './message'

describe('message schema', () => {
  const parsed = message.parse({})

  it('parses an empty object', () => {
    expect(message.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(message, messageDefaults)
  })
})
