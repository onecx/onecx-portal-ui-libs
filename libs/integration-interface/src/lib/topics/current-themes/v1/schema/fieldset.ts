import z from 'zod'
import { themeSchemaRegistry } from './registry'
import { bgContrast, border, color, font, layout, shadow, transition, withRef } from './primitives'

export const settings = z
  .object({
    toggleable: withRef(z.boolean()).default(false),
    collapsed: withRef(z.boolean()).default(false),
  })
  .register(themeSchemaRegistry, { id: 'fieldSetSettings' })

export const container = bgContrast
  .extend({
    border: border.optional(),
    padding: withRef(z.string()).optional(),
    transition: (transition as typeof transition).default({ duration: 300 }),
  })
  .register(themeSchemaRegistry, { id: 'fieldSetContainer' })

export const legend = bgContrast
  .extend({
    border: border.optional(),
    padding: withRef(z.string()).optional(),
    layout: layout.optional(),
    font: font.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldSetLegend' })

export const legendHover = bgContrast.register(themeSchemaRegistry, { id: 'fieldSetLegendHover' })

export const legendFocusRing = border
  .extend({
    shadow: withRef(z.string()).default('{{primitives.shadow.none}}'),
  })
  .register(themeSchemaRegistry, { id: 'fieldSetLegendFocusRing' })

export const toggleIcon = bgContrast
  .extend({
    opacity: withRef(z.number()).optional(),
    size: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldSetToggleIcon' })

export const toggleIconHover = bgContrast.register(themeSchemaRegistry, { id: 'fieldSetToggleIconHover' })

export const contentContainer = bgContrast.optional().register(themeSchemaRegistry, { id: 'fieldSetContentContainer' })

export const content = layout
  .extend({
    font: font.optional(),
    padding: withRef(z.string()).optional(),
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'fieldSetContent' })

export const fieldset = z.object({
  settings,
  container,
  legend,
  legendHover,
  legendFocusRing,
  content,
  toggleIcon,
  toggleIconHover,
  contentContainer,
})
