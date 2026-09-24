import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { bg, border, font, transition, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { FieldsetSettingsSchema } from './settings'

const contentShape = z.object({
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  font: font.pick({ weight: true, family: true, size: true }).optional(),
})

const toggleIconShape = z.object({
  size: withRef(z.string()).optional(),
  color: withRef(z.string()).optional(),
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
})

const legendButtonStateShape = z.object({
  background: bg.pick({ color: true }).optional(),
  color: withRef(z.string()).optional(),
  border: border.optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  font: font.pick({ weight: true, family: true, size: true }).optional(),
  focusRing: border.optional(),
  opacity: withRef(z.number()).optional(),
  toggleIcon: toggleIconShape.prefault({}),
})

const legendButtonShape = z.object({
  defaultState: legendButtonStateShape.prefault({}),
  hover: legendButtonStateShape.prefault({}),
  focus: legendButtonStateShape.prefault({}),
  active: legendButtonStateShape.prefault({}),
  disabled: legendButtonStateShape.prefault({}),
})

const fieldsetVariantShape = z.object({
  background: bg.pick({ color: true }).optional(),
  border: border.pick({ color: true, radius: true }).optional(),
  color: withRef(z.string()).optional(),
  paddingX: withRef(z.string()).optional(),
  paddingY: withRef(z.string()).optional(),
  transition: transition.pick({ duration: true }).optional(),
})

export const fieldsetShape = z.object({
  defaultVariant: fieldsetVariantShape.prefault({}),
  content: contentShape.prefault({}),
  settings: FieldsetSettingsSchema.schema.prefault({}),
  legendButton: legendButtonShape.prefault({}),
})

export const fieldsetDefaults = {
  defaultVariant: {
    background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
    border: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
      radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
    },
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    transition: { duration: '{{primitives.transition.duration}}' },
  },
  content: {
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    gap: '{{primitives.space.md}}',
    font: {
      size: '{{primitives.font.size}}',
      weight: '{{primitives.font.weight}}',
      family: '{{primitives.font.family}}',
    },
  },
  legendButton: {
    defaultState: {
      background: { color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}' },
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
      border: {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
        width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
        offset: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.offset}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
      },
      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
      gap: '{{primitives.space.md}}',
      font: {
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
        family: '{{primitives.font.family}}',
      },
      focusRing: {
        width: '{{primitives.focusRing.width}}',
        style: '{{primitives.focusRing.style}}',
        offset: '{{primitives.focusRing.offset}}',
        shadow: '{{primitives.focusRing.shadow}}',
      },
      toggleIcon: {
        size: '{{primitives.icon.size}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        width: '{{primitives.icon.size}}',
        height: '{{primitives.icon.size}}',
      },
    },
    hover: {
      background: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}' },
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
      border: { color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}' },
      toggleIcon: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'
      },
    },
    focus: {
      background: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}' },
      color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
      border: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}' },
      focusRing: { color: '{{primitives.defaultVariant.state.focus.defaultSeverity.focusRing.color}}' },
    },
    active: {
      background: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.bg.color}}' },
      color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
      border: { color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}' },
    },
    disabled: {
      background: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg.color}}' },
      color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
      border: { color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}' },
      opacity: '0.5',
    },
  },
}

export const fieldset = applyDefaultsRecursive(fieldsetShape, fieldsetDefaults).register(themeSchemaRegistry, {
  id: 'fieldset',
})

export class FieldsetSchema {
  static readonly schema = fieldset
}
