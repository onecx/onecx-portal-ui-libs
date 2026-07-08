import * as z from 'zod'
import {
  bgContrast,
  border,
  borderWithShadow,
  color,
  font,
  space,
  transition,
  variantWithStates,
  withRef,
} from './primitives'
import { themeSchemaRegistry } from './registry'
import { expand } from 'rxjs'

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

export const stateVariant = bgContrast
  .extend({
    border: border.optional(),
  })
  .register(themeSchemaRegistry, { id: 'dropdownStateVariant' })

const optionalStateVariant = (stateVariant as typeof stateVariant).optional()

export const stateVariants = z
  .object({
    disable: optionalStateVariant,
    hover: optionalStateVariant,
    focus: optionalStateVariant,
    expanded: optionalStateVariant,
  })
  .register(themeSchemaRegistry, { id: 'dropdownStateVariants' })

export const container = bgContrast
  .extend({
    space: space.optional(),
    states: (stateVariants as typeof stateVariants).optional(),
    placeholder: bgContrast.optional(),
    invalidPlaceholder: bgContrast.optional(),
    border: borderWithShadow.optional(),
    focusRing: borderWithShadow.optional(),
    transition: transition.optional(),
    font: font.optional(),
    width: withRef(z.string()).optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownContainer' })

export const overlay = bgContrast
  .extend({
    border: borderWithShadow.optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownOverlay' })

export const list = font
  .extend({
    space: space.optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownList' })

const tokenString = withRef(z.string()).optional()

const optionTone = bgContrast.optional()

const optionBorder = borderWithShadow.optional()

const optionFont = font.optional()

const optionSelectedFont = font.optional()

const icon = z
  .object({
    size: withRef(z.string()).optional(),
    font: font.optional(),
    state: variantWithStates.optional(),
    url: z.string().optional(),
    content: z.string().optional(),
  })
  .register(themeSchemaRegistry, { id: 'icon' })

const selectedOption = bgContrast
  .extend({
    font: optionSelectedFont,
    focus: optionTone,
  })
  .optional()

const groupedOption = bgContrast
  .extend({
    font: optionFont,
    padding: tokenString,
  })
  .optional()

export const option = z
  .object({
    color: color.optional(),
    padding: tokenString,
    border: optionBorder,
    font: optionFont,
    focus: optionTone,
    selected: selectedOption,
    group: groupedOption,
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownOption' })

export const clear = z
  .object({
    icon: icon.optional(),
    states: z
      .object({
        default: bgContrast.optional(),
        hover: bgContrast.optional(),
        disabled: bgContrast.optional(),
      })
      .optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownClear' })

export const checkmark = z
  .object({
    color: tokenString,
    gutter: z
      .object({
        start: tokenString,
        end: tokenString,
      })
      .optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownCheckmark' })

export const empty = z
  .object({
    message: z
      .object({
        padding: tokenString,
      })
      .optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'dropdownEmpty' })

export const dropdown = z
  .object({
    settings: (settings as typeof settings).optional(),
    container,
    overlay,
    list,
    option,
    clear,
    checkmark,
    empty,
  })
  .register(themeSchemaRegistry, { id: 'dropdown' })
