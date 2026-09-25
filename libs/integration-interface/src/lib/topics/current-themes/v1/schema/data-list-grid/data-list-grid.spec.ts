import { expectDefaultsMatchShape } from '../test-utils'
import { dataListGrid, dataListGridDefaults } from './data-list-grid'

describe('data-list-grid schema', () => {
  const parsed = dataListGrid.parse({})

  it('parses an empty object', () => {
    expect(dataListGrid.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(dataListGrid, dataListGridDefaults)
  })
})