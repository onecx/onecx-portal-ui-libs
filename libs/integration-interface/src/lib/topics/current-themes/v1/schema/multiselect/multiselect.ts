import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MultiselectSettingsSchema } from './settings'
import { MultiselectVariantSchema } from './variant'

/**
 * Multiselect component schema.
 */
export class MultiselectSchema {
  static readonly schema = z
    .object({
      settings: (MultiselectSettingsSchema.schema as typeof MultiselectSettingsSchema.schema).optional(),
      filled: (MultiselectVariantSchema.schema as typeof MultiselectVariantSchema.schema).prefault({}),
      ...MultiselectVariantSchema.schema.shape,
    })
    .register(themeSchemaRegistry, { id: 'multiselect' })
}
