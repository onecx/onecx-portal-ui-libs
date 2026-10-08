/**
 * Multiselect chip schema for selected items in the multiselect's label container.
 * Specific (Step 3, Option 2): kept independent of the generic top-level `chip` usage.
 * Only `defaultState`/`hover`/`focus` are modeled (no `disabled`/`selected` — a selected
 * chip's own disabled/selected look isn't a distinct concept here). Static tokens
 * (padding/gap/transitionDuration/font/focusRing, plus border width/offset/radius) live on
 * `defaultState` only; named states only carry the tokens that actually differ
 * (background/color/border.color/border.style).
 */
import * as z from 'zod'
import { bg, border, borderWithShadow, color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { multiselectChipRemoveIconDefaults, multiselectChipRemoveIconShape } from './chipremoveiconbutton'

const multiselectChipStateShape = z
  .object({
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    transitionDuration: withRef(z.string()).optional(),
    font: font.pick({ weight: true, size: true }).optional(),
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    border: border.optional(),
    focusRing: borderWithShadow.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectChipStateShape' })

export const multiselectChipShape = z
  .object({
    defaultState: multiselectChipStateShape.prefault({}),
    hover: multiselectChipStateShape.prefault({}),
    focus: multiselectChipStateShape.prefault({}),
    chipRemoveIcon: multiselectChipRemoveIconShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectChipShape', axis: 'state' })

export const multiselectChipDefaults = {
  defaultState: {
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
    gap: '{{primitives.space.xs}}',
    transitionDuration: '{{primitives.transition.duration}}',
    font: {
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    },
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    border: {
      width: '{{primitives.border.width.none}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.none}}',
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    },
    focusRing: {
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.border.shadow.none}}',
    },
  },
  // Named states only carry border.color/style — width/offset/radius are static and only
  // live on `defaultState`, resolving via the runtime fallback (and, in practice, the normal
  // CSS cascade) for the rest.
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
  chipRemoveIcon: multiselectChipRemoveIconDefaults,
}
