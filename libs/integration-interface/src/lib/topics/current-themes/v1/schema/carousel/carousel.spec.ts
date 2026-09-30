import { expectDefaultsMatchShape } from '../test-utils'

import { carousel, carouselShape, carouselDefaults } from './carousel'

describe('carousel schema', () => {
  const parsed = carousel.parse({})

  it('parses an empty object', () => {
    expect(carousel.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(carouselShape, carouselDefaults)
  })
})
