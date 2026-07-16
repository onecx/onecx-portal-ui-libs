import z from 'zod'
import { themeSchemaRegistry } from './registry'
import { bgContrast, border, color, font, withRef } from './primitives'

const DEFAULT_SPACE = '{{primitives.space.md}}'
const DEFAULT_LEGEND_BG = '{{primitives.variant.primary.defaultState.defaultVariant.bg.color}}'
const DEFAULT_LEGEND_CONTRAST = '{{primitives.variant.primary.defaultState.defaultVariant.contrast}}'
const HOVER_LEGEND_BG = '{{primitives.variant.primary.state.hover.defaultVariant.bg.color}}'
const HOVER_LEGEND_CONTRAST = '{{primitives.variant.primary.state.hover.defaultVariant.contrast}}'
const ACTIVE_LEGEND_BG = '{{primitives.variant.primary.state.active.defaultVariant.bg.color}}'
const ACTIVE_LEGEND_CONTRAST = '{{primitives.variant.primary.state.active.defaultVariant.contrast}}'
const FOCUS_LEGEND_BG = '{{primitives.variant.primary.state.focus.defaultVariant.bg.color}}'
const FOCUS_LEGEND_CONTRAST = '{{primitives.variant.primary.state.focus.defaultVariant.contrast}}'
const DEFAULT_FONT = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

const LEGEND_SHARED_DEFAULTS = {
  font: DEFAULT_FONT,
  gap: DEFAULT_SPACE,
  padding: DEFAULT_SPACE,
}

const DEFAULT_LEGEND = {
  bg: DEFAULT_LEGEND_BG,
  contrast: DEFAULT_LEGEND_CONTRAST,
  ...LEGEND_SHARED_DEFAULTS,
}

const HOVER_LEGEND = {
  bg: HOVER_LEGEND_BG,
  contrast: HOVER_LEGEND_CONTRAST,
  ...LEGEND_SHARED_DEFAULTS,
}

const ACTIVE_LEGEND = {
  bg: ACTIVE_LEGEND_BG,
  contrast: ACTIVE_LEGEND_CONTRAST,
  ...LEGEND_SHARED_DEFAULTS,
}

const FOCUS_LEGEND = {
  bg: FOCUS_LEGEND_BG,
  contrast: FOCUS_LEGEND_CONTRAST,
  ...LEGEND_SHARED_DEFAULTS,
}

const iconState = z.object({
  color: color.optional(),
  bg: color.optional(),
})

const iconBase = z.object({
  iconName: withRef(z.string()).optional(),
  size: withRef(z.enum(['x', 'sm', 'md', 'lg'])).optional(),
  defaultState: iconState.optional(),
  hover: iconState.optional(),
})

const settings = z.object({
  toggleable: z.boolean().default(true),
  collapsed: z.boolean().default(false),
})

const container = bgContrast
  .extend({
    borderRadius: withRef(z.string()).default('{{primitives.radius.sm}}'),
    borderColor: color.default('{{primitives.border.defaultVariant.color}}'),
    transition: z.object({
      duration: withRef(z.number()).default('{{primitives.transition.duration}}'),
    }),
    gap: withRef(z.string()).default(DEFAULT_SPACE),
    padding: z.string().default(DEFAULT_SPACE),
    font: font.default(DEFAULT_FONT),
  })
  .optional()

const legendBaseStyles = z.object({
  bg: z.string().default(DEFAULT_LEGEND_BG),
  contrast: color.default(DEFAULT_LEGEND_CONTRAST),
  border: border.optional(), // sometimes we don't want border just plain legend
  font: font.default(DEFAULT_FONT),
  gap: withRef(z.string()).default(DEFAULT_SPACE),
  padding: z.string().default(DEFAULT_SPACE),
})

const legendStates = z.object({
  defaultState: legendBaseStyles
    .default(DEFAULT_LEGEND)
    .optional(),
  hover: legendBaseStyles
    .default(HOVER_LEGEND)
    .optional(),
  active: legendBaseStyles
    .default(ACTIVE_LEGEND)
    .optional(),
  focus: legendBaseStyles
    .default(FOCUS_LEGEND)
    .optional(),
  disabled: legendBaseStyles.extend({
    opacity: withRef(z.number()).default(0.5),
  }),
})

const legendBaseStylesWithIcon = legendBaseStyles.extend({
  icon: iconBase.optional(),
  states: legendStates.optional(),
})

const legendsWithToggle = z.object({
  defaultStateWithToggle: legendBaseStylesWithIcon.optional(),
  expandedStateWithToggle: legendBaseStylesWithIcon.optional(),
  collapseStateWithToggle: legendBaseStylesWithIcon.optional(),
})

const legendsWithoutToggle = legendBaseStyles.optional()

const legend = z
  .object({
    withToggle: legendsWithToggle.optional(),
    withoutToggle: legendsWithoutToggle.optional(),
  })
  .optional()

export const fieldset = z
  .object({
    settings,
    container,
    legend,
  })
  .register(themeSchemaRegistry, { id: 'fieldset' })
