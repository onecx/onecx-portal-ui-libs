import { expectDefaultsMatchShape, expectExactUndefinedTokens } from './test-utils'

import { badge, badgeShape, badgeDefaults, badgeSizeShape, badgeDotShape } from './badge'

describe('badge schema', () => {
  const parsed = badge.parse({})

  it('parses an empty object', () => {
    expect(badge.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('shape and defaults stay in sync', () => {
    expectDefaultsMatchShape(badgeShape, badgeDefaults)
  })

  describe('special tokens (sizes + dot)', () => {
    it.each(['sm', 'lg', 'xl'] as const)('%s tokens all have a default value', (size) => {
      expectExactUndefinedTokens(parsed[size] as object | undefined, badgeSizeShape.shape, [])
    })

    it('dot tokens all have a default value', () => {
      expectExactUndefinedTokens(parsed['dot'] as object | undefined, badgeDotShape.shape, [])
    })
  })
})
