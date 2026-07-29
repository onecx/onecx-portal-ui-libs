import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectLabelContainerSchema } from './labelcontainer'
import { MultiselectOverlaySchema } from './overlay'

/**
 * Multiselect filled variant schema.
 */
export class MultiselectFilledSchema {
  static readonly schema = z
    .object({
      labelContainer: (
        MultiselectLabelContainerSchema.schema as typeof MultiselectLabelContainerSchema.schema
      ).prefault({}),
      overlay: (MultiselectOverlaySchema.schema as typeof MultiselectOverlaySchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselectFilled' })
}
