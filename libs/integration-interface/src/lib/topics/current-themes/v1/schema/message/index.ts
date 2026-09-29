import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { MessageSettingsSchema } from './settings'
import { CloseButtonMessageSchema } from './close-button'
import { PrimaryMessageSchema } from './primary-message'
import { SecondaryMessageSchema } from './secondary-message'
import { MessageSizeSchema } from './size'
import { withRef } from '../primitives'

export class MessageSchema {
  private static readonly tokens = {
    border: z
      .object({
        radius: withRef(z.string()).default('{{primitives.radius.md}}'),
        width: withRef(z.string()).default('{{primitives.border.width.md}}'),
      })
      .prefault({}),
    transition: z
      .object({
        duration: withRef(z.number()).default('{{primitives.transition.duration}}'),
      })
      .prefault({}),
    padding: withRef(z.string()).default('{{primitives.space.md}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    font: z
      .object({
        size: withRef(z.string()).default('{{primitives.font.size.md}}'),
        weight: withRef(z.string()).default('{{primitives.font.weight.medium}}'),
      })
      .prefault({}),
    icon: z
      .object({
        size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
      })
      .prefault({}),
  }

  private static readonly sizeTokens = MessageSizeSchema.sizeTokens

  static readonly schema = z
    .object({
      ...this.tokens,
      ...this.sizeTokens,
      settings: (MessageSettingsSchema.schema as typeof MessageSettingsSchema.schema).optional(),
      close: (CloseButtonMessageSchema.schema as typeof CloseButtonMessageSchema.schema).prefault({}),
      primary: (PrimaryMessageSchema.schema as typeof PrimaryMessageSchema.schema).prefault({}),
      secondary: (SecondaryMessageSchema.schema as typeof SecondaryMessageSchema.schema).prefault({}),
    })
    .register(themeSchemaRegistry, { id: 'message' })
}
