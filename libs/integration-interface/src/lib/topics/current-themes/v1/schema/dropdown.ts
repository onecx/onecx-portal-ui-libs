/**
 * This file defines the schema for dropdown theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 *
 * Dropdown is a composite component consisting of:
 * - Input container (defaultVariant area — the visible input field)
 *   - Clear icon (sits inside input)
 * - Panel (overlay area — the dropdown popup)
 *   - Filter (optional search input inside panel)
 *   - Item list
 *     - Header (group separator — non-clickable, bolder typography)
 *     - Option (with states, checkmark for multi-select)
 * - Size variants (sm, md, lg — padding, font size, icon size for input)
 *
 * Structure: input { clearIcon, states } | panel { filter, itemList { header, option { checkmark, states } } }
 * States: hover, focus, disabled, invalid.
 */
import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

// ===========================================================================
// Settings (non-styled configuration, optional at root)
// ===========================================================================
export const settings = z
  .object({
    fluid: withRef(z.boolean()).optional(),
    variant: withRef(z.enum(['filled', 'outlined'])).optional(),
    scrollHeight: withRef(z.string()),
    filter: withRef(z.boolean()).optional(),
    readonly: withRef(z.boolean()).optional(),
    editable: withRef(z.boolean()).optional(),
    loadingIcon: withRef(z.string()).optional(),
    filterLocale: withRef(z.string()).optional(),
    resetFilterOnHide: withRef(z.boolean()),
    showClear: withRef(z.boolean()).optional(),
    virtualScroll: withRef(z.boolean()).optional(),
    virtualScrollItemSize: withRef(z.number()).optional(),
    selectOnFocus: withRef(z.boolean()),
    autoOptionFocus: withRef(z.boolean()),
    appendTo: withRef(z.enum(['self', 'body'])).optional(),
    lazyLoading: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dropdownSettings' })

// ===========================================================================
// Size variants (padding, font size, icon size for input element)
// ===========================================================================
// Font for size variants — only size
const sizeFont = font.pick({
  size: true,
})

export const dropdownSize = z
  .object({
    font: (sizeFont as typeof sizeFont).optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dropdownSize' })

// Size defaults
const smSize = {
  font: {
    size: '{{primitives.font.size}}',
  },
  paddingX: '{{primitives.space.xs}}',
  paddingY: '{{primitives.space.xs}}',
}

const mdSize = {
  font: {
    size: '{{primitives.font.size}}',
  },
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
}

const lgSize = {
  font: {
    size: '{{primitives.font.size}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
}

export const size = z
  .object({
    sm: (dropdownSize as typeof dropdownSize).default(smSize),
    md: (dropdownSize as typeof dropdownSize).default(mdSize),
    lg: (dropdownSize as typeof dropdownSize).default(lgSize),
  })
  .register(themeSchemaRegistry, { id: 'dropdownSizeVariants' })

// ===========================================================================
// Input states (defaultVariant area — NOT overlay)
// ===========================================================================

export const inputHoverState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownInputHoverState' })

export const inputFocusState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownInputFocusState' })

export const inputDisabledState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownInputDisabledState' })

export const inputInvalidState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownInputInvalidState' })

// ===========================================================================
// Clear icon size variants
// ===========================================================================
export const clearIconSize = z
  .object({
    size: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIconSize' })

const clearIconSizeSm = {
  size: '16px',
}

const clearIconSizeMd = {
  size: '20px',
}

const clearIconSizeLg = {
  size: '24px',
}

export const clearIconSizeVariants = z
  .object({
    sm: (clearIconSize as typeof clearIconSize).default(clearIconSizeSm),
    md: (clearIconSize as typeof clearIconSize).default(clearIconSizeMd),
    lg: (clearIconSize as typeof clearIconSize).default(clearIconSizeLg),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIconSizeVariants' })

// ===========================================================================
// Clear icon states (defaultVariant area — sits inside input)
// ===========================================================================

export const clearIconHoverState = z
  .object({
    color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIconHoverState' })

export const clearIconFocusState = z
  .object({
    color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIconFocusState' })

export const clearIconDisabledState = z
  .object({
    color: color.default('{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIconDisabledState' })

export const clearIconInvalidState = z
  .object({
    color: color.default('{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIconInvalidState' })

// ===========================================================================
// Clear icon root (defaultVariant area — nested inside input)
// ===========================================================================
export const clearIcon = z
  .object({
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    size: (clearIconSizeVariants as typeof clearIconSizeVariants).prefault({}),
    hover: (clearIconHoverState as typeof clearIconHoverState).prefault({}),
    focus: (clearIconFocusState as typeof clearIconFocusState).prefault({}),
    disabled: (clearIconDisabledState as typeof clearIconDisabledState).prefault({}),
    invalid: (clearIconInvalidState as typeof clearIconInvalidState).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdownClearIcon' })

// ===========================================================================
// Input root (defaultVariant area — contains clear icon)
// ===========================================================================
export const input = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
    border: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    transition: withRef(z.string()).default('{{primitives.transition.duration}}'),
    size: (size as typeof size).prefault({}),
    clearIcon: (clearIcon as typeof clearIcon).prefault({}),
    hover: (inputHoverState as typeof inputHoverState).prefault({}),
    focus: (inputFocusState as typeof inputFocusState).prefault({}),
    disabled: (inputDisabledState as typeof inputDisabledState).prefault({}),
    invalid: (inputInvalidState as typeof inputInvalidState).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdownInput' })

// ===========================================================================
// Filter states (inside overlay — optional search input in panel)
// ===========================================================================

export const filterHoverState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownFilterHoverState' })

export const filterFocusState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownFilterFocusState' })

// ===========================================================================
// Filter root (inside overlay — nested inside panel)
// ===========================================================================
export const filter = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    border: border.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
    }),
    focusRing: borderWithShadow.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    }),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    hover: (filterHoverState as typeof filterHoverState).prefault({}),
    focus: (filterFocusState as typeof filterFocusState).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdownFilter' })

// ===========================================================================
// Option states (inside overlay)
// ===========================================================================

export const optionHoverState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.hover.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownOptionHoverState' })

export const optionFocusState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.focus.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownOptionFocusState' })

export const optionDisabledState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.disabled.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownOptionDisabledState' })

export const optionInvalidState = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.state.invalid.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.state.invalid.defaultSeverity.contrast}}'),
  })
  .register(themeSchemaRegistry, { id: 'dropdownOptionInvalidState' })

// ===========================================================================
// Checkmark (inside overlay — nested inside option)
// ===========================================================================
export const checkmark = z
  .object({
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    size: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dropdownCheckmark' })

// ===========================================================================
// Option root (inside overlay — nested inside itemList, contains checkmark)
// ===========================================================================
export const option = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    checkmark: (checkmark as typeof checkmark).prefault({}),
    hover: (optionHoverState as typeof optionHoverState).prefault({}),
    focus: (optionFocusState as typeof optionFocusState).prefault({}),
    disabled: (optionDisabledState as typeof optionDisabledState).prefault({}),
    invalid: (optionInvalidState as typeof optionInvalidState).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdownOption' })

// ===========================================================================
// Item list header (inside overlay — group separator, non-clickable)
// ===========================================================================
export const itemListHeader = z
  .object({
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    font: font.default({
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '600',
      lineHeight: '{{primitives.font.lineHeight}}',
      letterSpacing: '{{primitives.font.letterSpacing}}',
      style: '{{primitives.font.style}}',
    }),
    cursor: withRef(z.string()).default('default'),
    border: border.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.none}}',
    }),
  })
  .register(themeSchemaRegistry, { id: 'dropdownItemListHeader' })

// ===========================================================================
// Item list (inside overlay — nested inside panel, contains header + options)
// ===========================================================================
export const itemList = z
  .object({
    padding: withRef(z.string()).default('{{primitives.space.sm}}'),
    gap: withRef(z.string()).default('{{primitives.space.none}}'),
    header: (itemListHeader as typeof itemListHeader).prefault({}),
    option: (option as typeof option).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdownItemList' })

// ===========================================================================
// Panel (overlay area — dropdown popup, contains filter and itemList)
// ===========================================================================
export const panel = z
  .object({
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    border: borderWithShadow.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.sm}}',
      shadow: '{{primitives.shadow.sm}}',
    }),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    filter: (filter as typeof filter).prefault({}),
    itemList: (itemList as typeof itemList).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdownPanel' })

// ===========================================================================
// Root dropdown schema
// ===========================================================================
export const dropdown = z
  .object({
    settings: (settings as typeof settings).optional(),
    input: (input as typeof input).prefault({}),
    panel: (panel as typeof panel).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dropdown' })
