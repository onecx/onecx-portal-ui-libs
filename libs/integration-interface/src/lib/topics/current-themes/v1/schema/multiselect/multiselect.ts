import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectSettingsSchema } from './settings'
import { MultiselectFilledSchema } from './filled'
import { MultiselectOverlaySchema } from './overlay'
import { MultiselectLabelContainerSchema } from './labelcontainer'

/**
 * Multiselect component schema.
 */
export class MultiselectSchema {
  static readonly schema = z
    .object({
      settings: (MultiselectSettingsSchema.schema as typeof MultiselectSettingsSchema.schema).optional(),
      filled: (MultiselectFilledSchema.schema as typeof MultiselectFilledSchema.schema).prefault({}),
      labelContainer: (
        MultiselectLabelContainerSchema.schema as typeof MultiselectLabelContainerSchema.schema
      ).prefault({}),
      overlay: (MultiselectOverlaySchema.schema as typeof MultiselectOverlaySchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'multiselect' })
}
