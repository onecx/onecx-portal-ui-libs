import { expectDefaultsMatchShape } from './test-utils'
import { diagram, diagramDefaults } from './diagram'

describe('diagram schema', () => {
  const parsed = diagram.parse({})

  it('parses an empty object', () => {
    expect(diagram.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(diagram, diagramDefaults)
  })
})