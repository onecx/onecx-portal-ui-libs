import { expectDefaultsMatchShape } from '../test-utils'

import { dataTable, dataTableDefaults } from './data-table'

describe('data-table schema', () => {
  const parsed = dataTable.parse({})

  it('parses an empty object', () => {
    expect(dataTable.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(dataTable, dataTableDefaults)
  })
})
