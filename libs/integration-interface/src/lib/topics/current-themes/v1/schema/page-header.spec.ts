
import { pageHeader, pageHeaderDefaults, pageHeaderShape } from "./page-header/index"
import { expectDefaultsMatchShape } from "./test-utils"

describe('page header schema', () => {
  const parsed = pageHeader.parse({})

  it('parses an empty object', () => {
    expect(pageHeader.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('keeps defaults aligned with the shape', () => {
    expectDefaultsMatchShape(pageHeaderShape, pageHeaderDefaults)
  })
})