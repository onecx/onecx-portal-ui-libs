import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  loadingIndicator,
  loadingIndicatorOverlay,
  loadingIndicatorSpinner,
} from './loading-indicator'

describe('loadingIndicator schema', () => {
  it('parses an empty object', () => {
    const result = loadingIndicator.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('loading indicator tokens', () => {
    it('should apply defaults', () => {
      const result = loadingIndicator.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, loadingIndicator.shape, [])
      expectExactTokens(value, {
        overlay: expect.any(Object),
        spinner: expect.any(Object),
      })
    })

    describe('overlay', () => {
      it('should apply defaults', () => {
        const result = loadingIndicator.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.overlay, loadingIndicatorOverlay.shape, [])
        expectExactTokens(value?.overlay, {
          background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        })
      })
    })

    describe('spinner', () => {
      it('should apply defaults', () => {
        const result = loadingIndicator.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.spinner, loadingIndicatorSpinner.shape, [])
        expectExactTokens(value?.spinner, {
          size: '{{primitives.space.lg}}',
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            trackColor: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            width: '{{primitives.border.width.md}}',
          },
          animationDuration: '{{primitives.transition.duration}}',
        })
      })
    })
  })
})
