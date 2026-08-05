import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MessageSettingsSchema } from './settings'
import { CloseButtonMessageSchema } from './close-button'
import { PrimaryMessageSchema } from './primary'
import { SecondaryMessageSchema } from './secondary'
import { MessageSizeSchema } from './size'
import { withRef } from '../primitives'

export class MessageSchema {
  private static readonly tokens = {
    border: z.object({
      radius: withRef(z.string()).default('{{primitives.radius.md}}').optional(),
      width: withRef(z.string()).default('{{primitives.border.width.md}}').optional(),
    }).default({
       radius: '{{primitives.radius.md}}',
       width: '{{primitives.border.width.md}}',
    }).optional(),
    transition: z.object({
        duration: withRef(z.number()).default('{{primitives.transition.duration}}').optional(),
    }).default({duration: '{{primitives.transition.duration}}'}).optional(),
    padding: withRef(z.string()).default('{{primitives.space.md}}').optional(),
    gap: withRef(z.string()).default('{{primitives.space.md}}').optional(),
    font: z.object({
      size: withRef(z.string()).default('{{primitives.font.size.md}}').optional(),
      weight: withRef(z.string()).default('{{primitives.font.weight.md}}').optional(),
    }),
    icon: z.object({
      size: withRef(z.string()).default('{{primitives.icon.size.md}}').optional(),
    })
    .optional()
  }

  private static readonly sizeTokens = MessageSizeSchema.sizeTokens
  static readonly schema = z
    .object({
      ...this.tokens,
      ...this.sizeTokens,
      settings: (MessageSettingsSchema.schema as typeof MessageSettingsSchema.schema).optional(),
      closeButton: (CloseButtonMessageSchema.schema as typeof CloseButtonMessageSchema.schema).optional(),
      primary: (PrimaryMessageSchema.schema as typeof PrimaryMessageSchema.schema).optional(),
      secondary: (SecondaryMessageSchema.schema as typeof SecondaryMessageSchema.schema).optional(),
      size: z.object({}).optional(),
    })
    .register(themeSchemaRegistry, { id: 'message' })
}
