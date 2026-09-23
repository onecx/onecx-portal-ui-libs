/**
 * Schema for the PrimeNG SelectButton usage.
 */
import * as z from 'zod'
import { color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'
import { togglebuttonShape, togglebuttonDefaults } from './togglebutton'

// ------------------------------------------------------------------
// SHAPE — all keys optional, no defaults baked in
// ------------------------------------------------------------------

const selectbuttonSettingsShape = z.object({
  size: withRef(z.enum(['small', 'large'])).optional(),
  multiple: withRef(z.boolean()).optional(),
  allowEmpty: withRef(z.boolean()).optional(),
})

export const selectbuttonShape = z.object({
  settings: selectbuttonSettingsShape.optional(),
  border: z
    .object({
      radius: withRef(z.string()).optional(),
    })
    .prefault({}),
  invalid: z
    .object({
      border: z
        .object({
          color: color.optional(),
        })
        .optional(),
    })
    .prefault({}),
  button: togglebuttonShape.prefault({}),
})

// ------------------------------------------------------------------
// DEFAULTS
// ------------------------------------------------------------------

export const selectbuttonDefaults = {
  border: {
    radius: '{{primitives.border.radius.md}}',
  },
  invalid: {
    border: {
      color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
    },
  },
  button: togglebuttonDefaults,
}

export const selectbutton = applyDefaultsRecursive(selectbuttonShape, selectbuttonDefaults).register(
  themeSchemaRegistry,
  { id: 'selectbutton' }
)
