/**
 * Multiselect listItems schema: the list of options, its group headers, and the empty message.
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { multiselectListItemDefaults, multiselectListItemShape } from './listitem'
import { withRef } from '../primitives'
import { multiselectGroupHeaderDefaults, multiselectGroupHeaderShape } from './groupheader'
import { multiselectEmptyMessageDefaults, multiselectEmptyMessageShape } from './emptymessage'

export const multiselectListItemsShape = z
  .object({
    item: multiselectListItemShape.prefault({}),
    groupHeader: multiselectGroupHeaderShape.prefault({}),
    emptyMessage: multiselectEmptyMessageShape.prefault({}),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'multiselectListItemsShape' })

export const multiselectListItemsDefaults = {
  item: multiselectListItemDefaults,
  groupHeader: multiselectGroupHeaderDefaults,
  emptyMessage: multiselectEmptyMessageDefaults,
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
}
