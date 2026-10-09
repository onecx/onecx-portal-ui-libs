/**
 * Multiselect overlay (dropdown panel) schema. Flat — no own variant/state/severity axis
 * (uses the shared `area.overlay` primitive region instead).
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { borderWithShadow, color, withRef } from '../primitives'
import { multiselectFilterDefaults, multiselectFilterShape } from './filter'
import { multiselectListItemsDefaults, multiselectListItemsShape } from './listitems'

export const multiselectOverlayShape = z
  .object({
    filter: multiselectFilterShape.prefault({}),
    listItems: multiselectListItemsShape.prefault({}),
    background: z.union([z.string(), withRef(z.string())]).optional(),
    color: color.optional(),
    border: borderWithShadow.optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectOverlayShape' })

export const multiselectOverlayDefaults = {
  filter: multiselectFilterDefaults,
  listItems: multiselectListItemsDefaults,
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.border.radius.md}}',
    shadow: '{{primitives.border.shadow.none}}',
  },
  paddingX: '{{primitives.space.md}}',
  paddingY: '{{primitives.space.md}}',
}
