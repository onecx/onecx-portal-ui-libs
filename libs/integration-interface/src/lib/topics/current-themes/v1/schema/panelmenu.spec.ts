import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  panelmenu,
  PanelMenuSchema,
  PanelMenuSettingsSchema,
  PanelMenuHeaderSchema,
  PanelMenuContentSchema,
  PanelMenuItemSchema,
} from './panelmenu'

// Common test constants for reusability
const COMMON_PADDING = {
  header: { paddingX: '{{primitives.space.md}}', paddingY: '{{primitives.space.sm}}' },
  item: { paddingX: '{{primitives.space.md}}', paddingY: '{{primitives.space.sm}}' },
  content: { paddingX: '{{primitives.space.sm}}', paddingY: '{{primitives.space.sm}}' },
}

const COMMON_FONT = {
  full: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size}}',
    weight: '{{primitives.font.weight}}',
  },
}

const COMMON_BORDER = {
  header: (primitive: string) => ({
    color: `{{primitives.${primitive}.border.color}}`,
    style: `{{primitives.${primitive}.border.style}}`,
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.sm}}',
    radius: '{{primitives.border.radius.md}}',
  }),
  item: (primitive: string) => ({
    color: `{{primitives.${primitive}.border.color}}`,
    style: `{{primitives.${primitive}.border.style}}`,
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
  }),
  root: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.sm}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
  },
  content: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.none}}',
  },
}

const COMMON_FOCUS_RING = {
  color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.border.width.md}}',
  offset: '{{primitives.border.offset.none}}',
  radius: '{{primitives.border.radius.md}}',
  shadow: '{{primitives.shadow.none}}',
}

const ICON_TOKENS = {
  default: (primitive: string) => ({
    color: `{{primitives.${primitive}.contrast}}`,
    rotate: '0deg',
  }),
}

describe('panelmenu schema', () => {
  it('parses an empty object', () => {
    const result = panelmenu.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('panelmenu tokens', () => {
    it('should apply defaults and auto-populate nested elements', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, PanelMenuSchema.schema.shape, ['settings'])

      expectExactTokens(value, {
        gap: '{{primitives.space.sm}}',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: COMMON_BORDER.root,
        header: expect.any(Object),
        content: expect.any(Object),
      })
    })
  })

  describe('settings', () => {
    it('should apply default settings', () => {
      const result = panelmenu.safeParse({
        settings: {},
      })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.settings, {
        multiple: false,
      })
    })
  })

  describe('header', () => {
    it('should apply defaults for default state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header, PanelMenuHeaderSchema.schema.shape, [])

      expectExactTokens(value?.header, {
        ...COMMON_PADDING.header,
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: COMMON_BORDER.header('area.overlay.defaultState.defaultSeverity'),
        font: COMMON_FONT.full,
        focusRing: COMMON_FOCUS_RING,
        hover: expect.any(Object),
        active: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        toggleIcon: expect.any(Object),
      })
    })

    it('should apply defaults for hover state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.hover, PanelMenuHeaderSchema.hoverTokens.shape, [])

      expectExactTokens(value?.header?.hover, {
        ...COMMON_PADDING.header,
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
        border: COMMON_BORDER.header('area.overlay.state.hover.defaultSeverity'),
      })
    })

    it('should apply defaults for active state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.active, PanelMenuHeaderSchema.activeTokens.shape, [])

      expectExactTokens(value?.header?.active, {
        ...COMMON_PADDING.header,
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
        border: COMMON_BORDER.header('variant.primary.defaultState.defaultSeverity'),
      })
    })

    it('should apply defaults for focus state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.focus, PanelMenuHeaderSchema.focusTokens.shape, [])

      expectExactTokens(value?.header?.focus, {
        ...COMMON_PADDING.header,
        color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
        border: COMMON_BORDER.header('area.overlay.state.focus.defaultSeverity'),
      })
    })

    it('should apply defaults for disabled state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.disabled, PanelMenuHeaderSchema.disabledTokens.shape, [])

      expectExactTokens(value?.header?.disabled, {
        ...COMMON_PADDING.header,
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
        border: COMMON_BORDER.header('defaultVariant.state.disabled.defaultSeverity'),
      })
    })

    it('should apply defaults for toggleIcon', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.toggleIcon, PanelMenuHeaderSchema.toggleIconTokens.shape, [])

      expect(value?.header?.toggleIcon?.color).toEqual(
        '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'
      )
      expect(value?.header?.toggleIcon?.rotate).toEqual('0deg')
      expect(value?.header?.toggleIcon?.hover).toBeDefined()
      expect(value?.header?.toggleIcon?.active).toBeDefined()
      expect(value?.header?.toggleIcon?.focus).toBeDefined()
      expect(value?.header?.toggleIcon?.disabled).toBeDefined()
    })

    it('should apply defaults for toggleIcon hover state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.toggleIcon.hover, PanelMenuHeaderSchema.toggleIconHoverTokens.shape, [])

      expectExactTokens(
        value?.header?.toggleIcon?.hover,
        ICON_TOKENS.default('area.overlay.state.hover.defaultSeverity')
      )
    })

    it('should apply defaults for toggleIcon active state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(
        value?.header.toggleIcon.active,
        PanelMenuHeaderSchema.toggleIconActiveTokens.shape,
        []
      )

      expectExactTokens(
        value?.header?.toggleIcon?.active,
        ICON_TOKENS.default('variant.primary.defaultState.defaultSeverity')
      )
    })

    it('should apply defaults for toggleIcon focus state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header.toggleIcon.focus, PanelMenuHeaderSchema.toggleIconFocusTokens.shape, [])

      expectExactTokens(
        value?.header?.toggleIcon?.focus,
        ICON_TOKENS.default('area.overlay.state.focus.defaultSeverity')
      )
    })

    it('should apply defaults for toggleIcon disabled state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(
        value?.header.toggleIcon.disabled,
        PanelMenuHeaderSchema.toggleIconDisabledTokens.shape,
        []
      )

      expectExactTokens(
        value?.header?.toggleIcon?.disabled,
        ICON_TOKENS.default('defaultVariant.state.disabled.defaultSeverity')
      )
    })
  })

  describe('content', () => {
    it('should apply defaults', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content, PanelMenuContentSchema.schema.shape, [])

      expectExactTokens(value?.content, {
        ...COMMON_PADDING.content,
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: COMMON_BORDER.content,
        item: expect.any(Object),
      })
    })
  })

  describe('item', () => {
    it('should apply defaults for default state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item, PanelMenuItemSchema.schema.shape, [])

      expectExactTokens(value?.content?.item, {
        ...COMMON_PADDING.item,
        gap: '{{primitives.space.sm}}',
        font: COMMON_FONT.full,
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: COMMON_BORDER.item('area.overlay.defaultState.defaultSeverity'),
        focusRing: COMMON_FOCUS_RING,
        hover: expect.any(Object),
        active: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        icon: expect.any(Object),
      })
    })

    it('should apply defaults for hover state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.hover, PanelMenuItemSchema.hoverTokens.shape, [])

      expectExactTokens(value?.content?.item?.hover, {
        ...COMMON_PADDING.item,
        gap: '{{primitives.space.sm}}',
        font: COMMON_FONT.full,
        color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
        border: COMMON_BORDER.item('area.overlay.state.hover.defaultSeverity'),
      })
    })

    it('should apply defaults for active state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.active, PanelMenuItemSchema.activeTokens.shape, [])

      expectExactTokens(value?.content?.item?.active, {
        ...COMMON_PADDING.item,
        gap: '{{primitives.space.sm}}',
        font: COMMON_FONT.full,
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
        border: COMMON_BORDER.item('variant.primary.defaultState.defaultSeverity'),
      })
    })

    it('should apply defaults for focus state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.focus, PanelMenuItemSchema.focusTokens.shape, [])

      expectExactTokens(value?.content?.item?.focus, {
        ...COMMON_PADDING.item,
        gap: '{{primitives.space.sm}}',
        font: COMMON_FONT.full,
        color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
        border: COMMON_BORDER.item('area.overlay.state.focus.defaultSeverity'),
      })
    })

    it('should apply defaults for disabled state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.disabled, PanelMenuItemSchema.disabledTokens.shape, [])

      expectExactTokens(value?.content?.item?.disabled, {
        ...COMMON_PADDING.item,
        gap: '{{primitives.space.sm}}',
        font: COMMON_FONT.full,
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
        border: COMMON_BORDER.item('defaultVariant.state.disabled.defaultSeverity'),
      })
    })

    it('should apply defaults for icon', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.icon, PanelMenuItemSchema.iconTokens.shape, [])

      expect(value?.content?.item?.icon?.color).toEqual(
        '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'
      )
      expect(value?.content?.item?.icon?.rotate).toEqual('0deg')
      expect(value?.content?.item?.icon?.hover).toBeDefined()
      expect(value?.content?.item?.icon?.active).toBeDefined()
      expect(value?.content?.item?.icon?.focus).toBeDefined()
      expect(value?.content?.item?.icon?.disabled).toBeDefined()
    })

    it('should apply defaults for icon hover state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.icon.hover, PanelMenuItemSchema.iconHoverTokens.shape, [])

      expectExactTokens(
        value?.content?.item?.icon?.hover,
        ICON_TOKENS.default('area.overlay.state.hover.defaultSeverity')
      )
    })

    it('should apply defaults for icon active state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.icon.active, PanelMenuItemSchema.iconActiveTokens.shape, [])

      expectExactTokens(
        value?.content?.item?.icon?.active,
        ICON_TOKENS.default('variant.primary.defaultState.defaultSeverity')
      )
    })

    it('should apply defaults for icon focus state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.icon.focus, PanelMenuItemSchema.iconFocusTokens.shape, [])

      expectExactTokens(
        value?.content?.item?.icon?.focus,
        ICON_TOKENS.default('area.overlay.state.focus.defaultSeverity')
      )
    })

    it('should apply defaults for icon disabled state', () => {
      const result = panelmenu.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.content?.item.icon.disabled, PanelMenuItemSchema.iconDisabledTokens.shape, [])

      expectExactTokens(
        value?.content?.item?.icon?.disabled,
        ICON_TOKENS.default('defaultVariant.state.disabled.defaultSeverity')
      )
    })
  })
})
