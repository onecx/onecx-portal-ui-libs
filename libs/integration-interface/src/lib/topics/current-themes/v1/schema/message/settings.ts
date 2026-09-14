import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { withRef } from '../primitives'

export class MessageSettingsSchema {
  static readonly schema = z
    .object({
      closable: withRef(z.boolean()).default(false),
      delay: withRef(z.number()).default(300),
      showMultiple: withRef(z.boolean()).default(true),
    })
    .register(themeSchemaRegistry, { id: 'messageSettings' })
}
