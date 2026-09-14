import z from 'zod'
import { themeSchemaRegistry } from '../registry'

export class FieldsetSettingsSchema {
  static schema = z
    .object({
      toggleable: z.boolean().default(true),
      collapsed: z.boolean().default(true),
    })
    .register(themeSchemaRegistry, { id: 'fieldsetSettings' })
}
