import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { bg, border, borderWithShadow, color, transition, withRef } from "../primitives"

export class MenuSchema {
   static readonly tokens = {
      backgroundColor: bg.pick({color: true})
      .default({color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'}),
      border: borderWithShadow.pick({color: true, radius: true, shadow: true})
      .default({
         color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}', 
         radius: '{{primitives.border.radius.md}}',
         shadow: '{{primitives.shadow.md}}'
      }),
      color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
      transition: transition.pick({duration: true}).default({duration: '{{primitives.transition.duration}}'}),
      padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
      gap: withRef(z.string()).default('{{primitives.spacing.sm}}'),

   }

   static readonly schema = z.object({
      ...this.tokens,
   }).register(themeSchemaRegistry, { id: 'menu' })
}