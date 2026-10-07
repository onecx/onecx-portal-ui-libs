import { expectDefaultsMatchShape } from './test-utils'

import { tooltip, tooltipDefaults } from './tooltip'

describe('tooltip schema', () => {
  const parsed = tooltip.parse({})

  it('parses an empty object', () => {
    expect(tooltip.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(tooltip, tooltipDefaults)
  })
})
