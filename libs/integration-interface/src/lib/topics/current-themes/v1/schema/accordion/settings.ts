import z from 'zod'
import { themeSchemaRegistry } from '../registry'

export class AccordionSettingsSchema {
  static readonly token = {
    defaultExpanded: z.boolean().optional().default(false),
    expandMultiple: z.boolean().optional().default(false),
    expandIconName: z.string().optional().default('chevron-down'),
    collapseIconName: z.string().optional().default('chevron-up'),
  }

  static readonly schema = z
    .object({
      ...this.token,
    })
    .register(themeSchemaRegistry, { id: 'accordionSettings' })
}
