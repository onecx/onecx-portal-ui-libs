import { MenuSchema } from './menu/index'
import { MenuItemSchema } from './menu/item'
import { expectExactTokens, expectExactUndefinedTokens, expectUndefinedTokens } from './test-utils'

const BASE_TOKENS = {
  background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.shadow.md}}',
  },
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  transition: { duration: '{{primitives.transition.duration}}' },
  padding: '{{primitives.spacing.sm}}',
  gap: '{{primitives.spacing.sm}}',
}

const MENU_ITEM_BASE_TOKENS = {
  background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  padding: '{{primitives.spacing.sm}}',
  gap: '{{primitives.spacing.sm}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    radius: '{{primitives.border.radius.md}}',
  },
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    width: '{{primitives.focusRing.width.md}}',
    offset: '{{primitives.focusRing.offset.md}}',
    radius: '{{primitives.focusRing.radius.md}}',
    shadow: '{{primitives.focusRing.shadow.md}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  },
  label: {
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight.normal}}',
    },
  },
  focus: expect.any(Object),
  hover: expect.any(Object),
  separator: {
    border: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      width: '{{primitives.border.width.sm}}',
    },
  },
  subMenuItem: {
    padding: '{{primitives.spacing.sm}}',
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight.normal}}',
    },
    background: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' },
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    icon: expect.any(Object),
  },
  icon: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    focus: expect.any(Object),
    hover: expect.any(Object),
    size: '{{primitives.icon.md}}',
  },
}

describe('menu schema - should validate following default tokens', () => {
  it('empty object', () => {
    const result = MenuSchema.schema.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('settings', () => {
    it('default settings', () => {
      const value = MenuSchema.schema.safeParse({ settings: {} }).data
      expectUndefinedTokens(value, [])
      expectExactTokens(value?.settings, {
        hasPopup: false,
        appendTo: 'body',
        autoZIndex: true,
        baseZIndex: 1000,
      })
    })
  })

  describe('main layout', () => {
    it('base tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value, MenuSchema.schema.shape, [])
      expectExactTokens(value, {
        ...BASE_TOKENS,
        settings: expect.any(Object),
        item: expect.any(Object),
        submenuLabel: expect.any(Object),
        submenuIcon: expect.any(Object),
        separator: expect.any(Object),
      })
    })
  })

  describe('menuItem', () => {
    it('base tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value?.item, MenuItemSchema.schema.shape, [])
      expectExactTokens(value?.item, MENU_ITEM_BASE_TOKENS)
    })

    it('hover tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value?.item?.hover, MenuItemSchema.hoverTokens, [])
      expectExactTokens(value?.item?.hover, {
        background: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      })
    })

    it('focus tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value?.item?.focus, MenuItemSchema.focusTokens, [])
      expectExactTokens(value?.item?.focus, {
        background: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' },
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
      })
    })

    describe('icon tokens', () => {
      it('base tokens', () => {
        const value = MenuSchema.schema.safeParse({}).data

        expectExactUndefinedTokens(value?.item?.icon, MenuItemSchema.icon, [])
        expectExactTokens(value?.item?.icon, {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          focus: {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          },
          hover: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          },
          size: '{{primitives.icon.md}}',
        })
      })

      it('focus tokens', () => {
        const value = MenuSchema.schema.safeParse({}).data
        expectExactUndefinedTokens(value?.item?.icon.focus, MenuItemSchema.iconFocus, [])
        expectExactTokens(value?.item?.icon.focus, {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        })
      })

      it('hover tokens', () => {
        const value = MenuSchema.schema.safeParse({}).data

        expectExactUndefinedTokens(value?.item?.icon.hover, MenuItemSchema.iconHover, [])
        expectExactTokens(value?.item?.icon.hover, {
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        })
      })
    })
  })

  describe('submenuLabel', () => {
    it('base tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value?.submenuLabel, MenuSchema.submenuLabel.shape, [])
      expectExactTokens(value?.submenuLabel, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
        padding: '{{primitives.spacing.sm}}',
        font: {
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight.normal}}',
        },
      })
    })
  })

  describe('submenuIcon', () => {
    it('base tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value?.submenuIcon, MenuSchema.submenuIcon.shape, [])
      expectExactTokens(value?.submenuIcon, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        focus: {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        },
        size: '{{primitives.icon.md}}',
      })
    })
  })

  describe('separator', () => {
    it('base tokens', () => {
      const value = MenuSchema.schema.safeParse({}).data

      expectExactUndefinedTokens(value?.separator, MenuSchema.separator.shape, [])
      expectExactTokens(value?.separator, {
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          width: '{{primitives.border.width.sm}}',
        },
      })
    })
  })
})
