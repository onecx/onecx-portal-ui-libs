import z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { PrimaryCloseMessageSchema } from './primary-close'
import { SecondaryCloseMessageSchema } from './secondary-close'

export class CloseButtonMessageSchema {
  private static readonly closeBaseTokens = {
    width: z.string().default('{{primitives.icon.size.md}}'),
    height: z.string().default('{{primitives.icon.size.md}}'),
    focusRing: z
      .object({
        width: z.string().default('{{primitives.focusRing.width.md}}'),
        style: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}'),
        offset: z.string().default('{{primitives.focusRing.offset.md}}'),
        shadow: z.string().default('{{primitives.focusRing.shadow.none}}'),
      })
      .prefault({}),
    border: z
      .object({
        radius: z.string().default('{{primitives.radius.md}}'),
        width: z.string().default('{{primitives.border.width.md}}'),
      })
      .prefault({}),
  }

  static readonly schema = z
    .object({
      ...this.closeBaseTokens,
      primary: PrimaryCloseMessageSchema.schema as typeof PrimaryCloseMessageSchema.schema,
      secondary: SecondaryCloseMessageSchema.schema as typeof SecondaryCloseMessageSchema.schema,
    })
    .register(themeSchemaRegistry, { id: 'messageCloseButton' })
}
