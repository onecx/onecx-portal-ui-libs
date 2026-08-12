import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { ripple, rippleSettings } from './ripple'

describe('ripple schema', () => {
  it('parses an empty object', () => {
    const result = ripple.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('ripple tokens', () => {
    it('should apply defaults', () => {
      const result = ripple.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, ripple.shape, ['settings'])
      expectExactTokens(value, {
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
      })
    })

    describe('settings', () => {
      it('should apply defaults', () => {
        const result = ripple.safeParse({ settings: {} })

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.settings, rippleSettings.shape, ['radius'])
        expectExactTokens(value?.settings, {
          disabled: false,
          unbounded: false,
          centered: false,
        })
      })
    })
  })
})
