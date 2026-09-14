import { BreadcrumbSchema } from './breadcrumb/index'
import { BreadcrumbItemSchema } from './breadcrumb/item'
import { expectExactTokens, expectExactUndefinedTokens, expectUndefinedTokens } from './test-utils'

const BREADCRUMB_ITEM_BASE_TOKENS = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
  border: { 
    radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
    width: '{{primitives.border.width.md}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  },
  gap: '{{primitives.space.sm}}',
  icon: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    size: '{{primitives.icon.md}}',
  },
  label: {
    font: {
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
  },
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    width: '{{primitives.focusRing.width.md}}',
    offset: '{{primitives.focusRing.offset.md}}',
    radius: '{{primitives.focusRing.radius.md}}',
    shadow: '{{primitives.focusRing.shadow.md}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
}
describe('breadcrumb schema', () => {
  it('parses an empty object', () => {
    const result = BreadcrumbSchema.schema.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('settings', () => {
    it('should apply default settings', () => {
      const settingsValue = BreadcrumbSchema.schema.safeParse({ settings: {} }).data
      expectUndefinedTokens(settingsValue, [])
      expectExactTokens(settingsValue?.settings, {
        homeIcon: 'home',
        showTooltip: true,
        separator: '/',
      })
    })
  })

  describe('container tokens', () => {
    it('base tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, BreadcrumbSchema.schema.shape, [])
      expectExactTokens(value, {
        padding: '{{primitives.space.md}}',
        background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
        gap: '{{primitives.space.md}}',
        transition: { duration: '{{primitives.transition.duration}}' },
        settings: expect.any(Object),
        item: expect.any(Object),
        separator: expect.any(Object),
      })
    })

    it('separator tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.separator
      expectExactUndefinedTokens(value, BreadcrumbSchema.separator.shape, [])
      expectExactTokens(value, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        width: '{{primitives.border.width.md}}',
      })
    })
  })

  describe('item tokens - should test', () => {
    it('base tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item
      expectExactUndefinedTokens(value, BreadcrumbItemSchema.schema.shape, [])
      expectExactTokens(value, {
        ...BREADCRUMB_ITEM_BASE_TOKENS,
        hover: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        active: expect.any(Object),
      })
    })

    it('hover tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item.hover
      expectExactUndefinedTokens(value, BreadcrumbItemSchema.itemHover.shape, [])
      expectExactTokens(value, {
        background: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
        },
        icon: {
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        },
      })
    })

    it('focus tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item.focus
      expectExactUndefinedTokens(value, BreadcrumbItemSchema.itemFocus.shape, [])
      expectExactTokens(value, {
        background: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
        },
        icon: {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        },
      })
    })

    it('active tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item.active
      expectExactUndefinedTokens(value, BreadcrumbItemSchema.itemActive.shape, [])
      expectExactTokens(value, {
        background: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
        },
        icon: {
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        },
      })
    })

    it('disabled tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item.disabled
      expectExactUndefinedTokens(value, BreadcrumbItemSchema.itemDisabled.shape, [])
      expectExactTokens(value, {
        background: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
        },
        icon: {
          color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        },
      })
    })
  })
})
