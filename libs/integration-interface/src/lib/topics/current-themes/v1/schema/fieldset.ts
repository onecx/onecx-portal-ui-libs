import z from 'zod'
import { bg, bgContrast, border, borderWithShadow, color, font, space, transition, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

const DEFAULT_PADDING = '{{primitives.space.md}}'
const CONTAINER_DEFAULT = {
  bg: '{{primitives.area.surface.defaultState.defaultVariant.bg}}',
  contrast: '{{primitives.area.surface.defaultState.defaultVariant.contrast}}',
  padding: {
    md: '{{primitives.space.md}}',
  },
  transition: {
    duration: '{{primitives.transition.duration}}',
  },
}
const FONT_DEFAULT = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}
const BORDER_DEFAULT = {
  color: '{{primitives.border.defaultVariant.color}}',
  width: '{{primitives.border.defaultVariant.width}}',
  style: '{{primitives.border.defaultVariant.style}}',
  radius: '{{primitives.border.defaultVariant.radius}}',
}

const settings = z
  .object({
    toggleable: z.boolean(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetSettings' })

const transitionStyles = transition
  .extend({
    duration: withRef(z.number()),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetTransitionStyles' })

const icon = z
  .object({
    name: withRef(z.string()).optional(),
    url: withRef(z.string()).optional(),
    size: withRef(z.string()),
    color: withRef(z.string()),
    bg: withRef(z.string()),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetIcon' })

const textBaseStyles = z
  .object({
    font: font.optional().default(FONT_DEFAULT),
    padding: withRef(z.string()).default(DEFAULT_PADDING),
    color: color.optional().default(CONTAINER_DEFAULT.contrast),
    border: border.optional().default(BORDER_DEFAULT),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetTextBaseStyles' })

const textBaseStyleWithButton = textBaseStyles
  .extend({
    icon: icon.optional(),
    bg: withRef(z.string()).optional().default(CONTAINER_DEFAULT.bg),
    gap: space.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetTextBaseStyleWithButton' })

const containerBaseStyle = bgContrast
  .extend({
    bg: withRef(z.string()).default(CONTAINER_DEFAULT.bg),
    contrast: color.default(CONTAINER_DEFAULT.contrast),
    font: font.optional().default(FONT_DEFAULT),
    border: border.optional().default(BORDER_DEFAULT),
    padding: space.optional().default(CONTAINER_DEFAULT.padding),
    transition: transitionStyles.optional().default(CONTAINER_DEFAULT.transition),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetContainerBaseStyle' })

const defaultLegendVariant = textBaseStyles
  .extend({
    padding: withRef(z.string()).default(DEFAULT_PADDING),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetDefaultLegendVariant' })

const withIcon = textBaseStyles
  .extend({
    icon: icon.optional(),
    bg: bg.default({ color: CONTAINER_DEFAULT.bg }).optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetWithIcon' })

const withImage = z
  .object({
    url: withRef(z.string()).optional(),
    objectFit: withRef(
      z.union([z.literal('contain'), z.literal('cover'), z.literal('fill'), z.literal('none'), z.literal('scale-down')])
    ).default('cover'),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetWithImage' })

const legend = z
  .object({
    defaultVariant: defaultLegendVariant.optional(),
    variant: z
      .object({
        withIcon: withIcon.optional(),
        withImage: withImage.optional(),
      })
      .optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetLegend' })

const defaultSeverity = z
  .object({
    container: containerBaseStyle.optional(),
    legend: legend.optional(),
    content: textBaseStyles.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetDefaultSeverity' })

const defaultState = z
  .object({
    defaultSeverity: defaultSeverity.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetDefaultState' })

const defaultVariant = z
  .object({
    defaultState: defaultState.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetDefaultVariant' })

const baseState = z
  .object({
    container: containerBaseStyle.optional(),
    legend: textBaseStyleWithButton.optional(),
    content: textBaseStyles.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetBaseState' })

const focusState = baseState
  .extend({
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetFocusState' })

const activeState = baseState
  .extend({
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetActiveState' })

const hoverState = baseState
  .extend({
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetHoverState' })

const withToggle = z
  .object({
    defaultState: baseState.optional(),
    hover: hoverState.optional(),
    focus: focusState.optional(),
    active: activeState.optional(),
    disabled: baseState.extend({ opacity: withRef(z.number()) }).optional(),
    expanded: baseState.optional(),
    collapsed: baseState.optional(),
  })
  .register(themeSchemaRegistry, { id: 'fieldsetWithToggle' })

export const fieldset = z.object({
  settings: settings.optional(),
  defaultVariant: defaultVariant.optional(),
  variant: z
    .object({
      withToggle: withToggle.optional(),
    })
    .optional(),
}).register(themeSchemaRegistry, { id: 'fieldset' })
