import { expectDefaultsMatchShape } from './test-utils'

import { badge, badgeShape, badgeDefaults } from './badge'

describe('badge schema', () => {
  const parsed = badge.parse({})

  it('parses an empty object', () => {
    expect(badge.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(badgeShape, badgeDefaults)
  })
})
