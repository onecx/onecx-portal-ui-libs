import { expectDefaultsMatchShape } from '../test-utils'
import { dataview, dataviewDefaults } from './dataview'

describe('dataview schema', () => {
  const parsed = dataview.parse({})

  it('parses an empty object', () => {
    expect(dataview.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(dataview, dataviewDefaults)
  })
})
