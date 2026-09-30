import { expectDefaultsMatchShape } from '../test-utils'
import { breadcrumb, breadcrumbDefaults } from './breadcrumb'

describe('breadcrumb schema', () => {
  const parsed = breadcrumb.parse({})

  it('parses an empty object', () => {
    expect(breadcrumb.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(breadcrumb, breadcrumbDefaults)
  })
})
