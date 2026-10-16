/**
 * Filter component schema inside the multiselect overlay. Contains the filter text input and
 * the select-all checkbox (both are flat children, dependency: nothing).
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { multiselectCheckboxDefaults, multiselectCheckboxShape } from './checkbox'
import { multiselectFilterInputDefaults, multiselectFilterInputShape } from './input'
import { icon, withRef } from '../primitives'

export const multiselectFilterShape = z
  .object({
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    checkbox: multiselectCheckboxShape.prefault({}),
    input: multiselectFilterInputShape.prefault({}),
    filterIcon: icon.optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectFilterShape' })

export const multiselectFilterDefaults = {
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  checkbox: multiselectCheckboxDefaults,
  input: multiselectFilterInputDefaults,
  filterIcon: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    size: '{{primitives.icon.size.sm}}',
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  },
}
