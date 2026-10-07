import { expectDefaultsMatchShape } from '../test-utils'
import { content, contentDefaults } from './content'

describe('content schema', () => {
  const parsed = content.parse({})

  it('parses an empty object', () => {
    expect(content.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(content, contentDefaults)
  })
})
