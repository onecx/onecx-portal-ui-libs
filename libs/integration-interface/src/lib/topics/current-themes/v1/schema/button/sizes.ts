import * as z from 'zod'
import { font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

// Size-variant tokens (sm/md/lg) are identical across every color variant — they only
// scale font-size and padding, none of which depend on color/severity — so they're
// defined once here and reused directly (self-defaulting, not part of any defaults tree).

export const smButtonShape = z
  .object({
    font: font.pick({ size: true }).default({ size: '{{primitives.font.size.sm}}' }),
    paddingX: withRef(z.string()).default('{{primitives.space.sm}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.xs}}'),
  })
  .register(themeSchemaRegistry, { id: 'smButtonShape' })

export const mdButtonShape = z
  .object({
    font: font.pick({ size: true }).default({ size: '{{primitives.font.size.md}}' }),
    paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.sm}}'),
  })
  .register(themeSchemaRegistry, { id: 'mdButtonShape' })

export const lgButtonShape = z
  .object({
    font: font.pick({ size: true }).default({ size: '{{primitives.font.size.lg}}' }),
    paddingX: withRef(z.string()).default('{{primitives.space.lg}}'),
    paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
  })
  .register(themeSchemaRegistry, { id: 'lgButtonShape' })
