import { expectDefaultsMatchShape } from '../test-utils'

import { calendar, calendarDefaults } from './calendar'

describe('calendar schema', () => {
  const parsed = calendar.parse({})

  it('parses an empty object', () => {
    expect(calendar.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(calendar, calendarDefaults)
  })
})
