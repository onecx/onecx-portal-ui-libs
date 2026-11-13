import { BreadcrumbSchema } from './breadcrumb/index'
import { BreadcrumbItemSchema } from './breadcrumb/item'
import { expectExactTokens, expectExactUndefinedTokens, expectUndefinedTokens } from './test-utils'

const BREADCRUMB_ITEM_BASE_TOKENS = {
  defaultVariant: {
    defaultState: {
      defaultSeverity: {
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
      },
    },
    hover: {
      defaultSeverity: {
        background: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        border: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}' },
        icon: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}' },
        label: {},
      },
    },
    focus: {
      defaultSeverity: {
        background: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        border: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}' },
        icon: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}' },
        label: {},
      },
    },
    active: {
      defaultSeverity: {
        background: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        border: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}' },
        icon: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}' },
        label: {},
      },
    },
    disabled: {
      defaultSeverity: {
        background: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        border: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}' },
        icon: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}' },
        label: {},
      },
    },
  },
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
      })
    })

    it('hover tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item?.defaultVariant?.hover?.defaultSeverity
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
        label: {},
      })
    })

    it('focus tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item?.defaultVariant?.focus?.defaultSeverity
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
        label: {},
      })
    })

    it('active tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item?.defaultVariant?.active?.defaultSeverity
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
        label: {},
      })
    })

    it('disabled tokens', () => {
      const result = BreadcrumbSchema.schema.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data?.item?.defaultVariant?.disabled?.defaultSeverity
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
        label: {},
      })
    })
  })
})
