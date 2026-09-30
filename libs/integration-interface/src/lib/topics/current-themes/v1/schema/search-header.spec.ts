import { expectDefaultsMatchShape } from './test-utils'
import { searchHeader, searchHeaderDefaults } from './search-header'

describe('searchHeader schema', () => {
  const parsed = searchHeader.parse({})

  it('parses an empty object', () => {
    expect(searchHeader.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(searchHeader, searchHeaderDefaults)
  })
})