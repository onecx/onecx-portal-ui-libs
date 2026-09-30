import { expectDefaultsMatchShape } from '../test-utils'
import { skeleton, skeletonDefaults } from './skeleton'

describe('skeleton schema', () => {
  const parsed = skeleton.parse({})

  it('parses an empty object', () => {
    expect(skeleton.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(skeleton, skeletonDefaults)
  })
})