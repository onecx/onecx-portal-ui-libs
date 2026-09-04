import { tooltip, tooltipSettings } from './tooltip'
import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'

describe('tooltip schema', () => {
  it('parses an empty object', () => {
    const result = tooltip.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('tooltip tokens', () => {
    it('should apply defaults', () => {
      const result = tooltip.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, tooltip.shape, ['settings'])
      expectExactTokens(value, {
        maxWidth: '{{primitives.layout.overlayMaxWidth}}',
        gutter: '{{primitives.space.sm}}',
        shadow: '{{primitives.shadow.md}}',
        padding: '{{primitives.space.md}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.sm}}',
          radius: '{{primitives.border.radius.md}}',
        },
        background: '{{primitives.area.overlay.defaultState.defaultVariant.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultVariant.contrast}}',
      })
    })
  })

  describe('tooltip settings', () => {
    it('should apply defaults when settings are provided', () => {
      const result = tooltip.safeParse({ settings: {} })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.settings, tooltipSettings.shape, [])
      expectExactTokens(value?.settings, {
        position: 'top',
        showDelay: 0,
        hideDelay: 0,
      })
    })

    it('should allow custom settings values', () => {
      const result = tooltip.safeParse({
        settings: {
          position: 'bottom',
          showDelay: 100,
          hideDelay: 200,
        },
      })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.settings, {
        position: 'bottom',
        showDelay: 100,
        hideDelay: 200,
      })
    })
  })
})
