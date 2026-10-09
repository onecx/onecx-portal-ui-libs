/**
 * Input field in the filter component of the multiselect overlay schema.
 * Specific (Step 3, Option 2): kept independent of the generic top-level `input` usage.
 * `paddingX`/`paddingY`/`font`/`focusRing`, plus border width/offset/radius, are static (same
 * regardless of state) and only live on `defaultState`; named states only carry the tokens
 * that actually differ (background/color/border.color/border.style).
 */
// TODO: Refactor to relevant tokens from input usage tokens
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef, font, bg, color, border, borderWithShadow } from '../primitives'

const multiselectFilterInputStateShape = z
  .object({
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    font: font.pick({ family: true, size: true, weight: true }).optional(),
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: border.optional(),
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectFilterInputStateShape' })

export const multiselectFilterInputShape = z
  .object({
    defaultState: multiselectFilterInputStateShape.prefault({}),
    hover: multiselectFilterInputStateShape.prefault({}),
    focus: multiselectFilterInputStateShape.prefault({}),
    active: multiselectFilterInputStateShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectFilterInputShape', axis: 'state' })

const commonBorder = {
  width: '{{primitives.border.width.md}}',
  radius: '{{primitives.border.radius.md}}',
  offset: '{{primitives.border.offset.none}}',
}

export const multiselectFilterInputDefaults = {
  defaultState: {
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    font: {
      family: '{{primitives.font.family}}',
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
    },
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    border: {
      ...commonBorder,
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    },
    focusRing: {
      ...commonBorder,
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
      shadow: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.shadow}}',
    },
  },
  // Named states only carry border.color/style — width/offset/radius are static and only
  // live on `defaultState`.
  hover: {
    background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    border: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
    },
  },
  focus: {
    background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
    border: {
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
    },
  },
  active: {
    background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
    border: {
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
    },
  },
}
