import z from 'zod'
import { bg, bgContrast, border, borderWithShadow, color, font, space, transition, withRef } from './primitives'

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

const settings = z.object({
  toggleable: z.boolean(),
})

const transitionStyles = transition.extend({
  duration: withRef(z.number()),
})

const icon = z.object({
  name: withRef(z.string()).optional(),
  url: withRef(z.string()).optional(),
  size: withRef(z.string()),
  color: withRef(z.string()),
  bg: withRef(z.string()),
})

const textBaseStyles = z.object({
  font: font.optional().default(FONT_DEFAULT),
  padding: withRef(z.string()).default(DEFAULT_PADDING),
  color: color.optional().default(CONTAINER_DEFAULT.contrast),
  border: border.optional().default(BORDER_DEFAULT),
})

const textBaseStyleWithButton = textBaseStyles.extend({
  icon: icon.optional(),
  bg: withRef(z.string()).optional().default(CONTAINER_DEFAULT.bg),
  gap: space.optional(),
})

const containerBaseStyle = bgContrast.extend({
  bg: withRef(z.string()).default(CONTAINER_DEFAULT.bg),
  contrast: color.default(CONTAINER_DEFAULT.contrast),
  font: font.optional().default(FONT_DEFAULT),
  border: border.optional().default(BORDER_DEFAULT),
  padding: space.optional().default(CONTAINER_DEFAULT.padding),
  transition: transitionStyles.optional().default(CONTAINER_DEFAULT.transition),
})

const defaultLegendVariant = textBaseStyles.extend({
  padding: withRef(z.string()).default(DEFAULT_PADDING),
})

const withIcon = textBaseStyles.extend({
  icon: icon.optional(),
  bg: bg.default({color: CONTAINER_DEFAULT.bg}).optional(),
})

const withImage = z.object({
  url: withRef(z.string()).optional(),
  objectFit: withRef(
    z.union([z.literal('contain'), z.literal('cover'), z.literal('fill'), z.literal('none'), z.literal('scale-down')])
  ).default('cover'),
})

const legend = z.object({
  defaultVariant: defaultLegendVariant.optional(),
  variant: z
    .object({
      withIcon: withIcon.optional(),
      withImage: withImage.optional(),
    })
    .optional(),
})

const defaultSeverity = z.object({
  container: containerBaseStyle.optional(),
  legend: legend.optional(),
  content: textBaseStyles.optional(),
})

const defaultState = z.object({
  defaultSeverity: defaultSeverity.optional(),
})

const defaultVariant = z.object({
  defaultState: defaultState.optional(),
})

const baseState = z.object({
  container: containerBaseStyle.optional(),
  legend: textBaseStyleWithButton.optional(),
  content: textBaseStyles.optional(),
})

const focusState = baseState.extend({
  focusRing: borderWithShadow.optional(),
})

const activeState = baseState.extend({
  focusRing: borderWithShadow.optional(),
})

const hoverState = baseState.extend({
  focusRing: borderWithShadow.optional(),
})

const withToggle = z.object({
  defaultState: baseState.optional(),
  hover: hoverState.optional(),
  focus: focusState.optional(),
  active: activeState.optional(),
  disabled: baseState.extend({opacity: withRef(z.number())}).optional(),
  expanded: baseState.optional(),
  collapsed: baseState.optional(),
})

export const fieldset = z.object({
  settings: settings.optional(),
  defaultVariant: defaultVariant.optional(),
  variant: z
    .object({
      withToggle: withToggle.optional(),
    })
    .optional(),
})
