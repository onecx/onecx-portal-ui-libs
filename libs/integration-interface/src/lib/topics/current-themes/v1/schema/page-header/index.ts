import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { PageHeaderSettingsSchema } from "./settings"
import { breadcrumb } from "../breadcrumb"
import { PageHeaderSchema as PageHeader } from "./header"
import { withRef } from "../primitives"

export class PageHeaderSchema {
    private static readonly tokens = {
        border: z.object({
            width: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}'),
            color: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'),
            radius: z.string().default('{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}'),
        }).prefault({}),
        padding: z.string().default('{{primitives.space.md}}'),
        shadow: withRef(z.string()).default('{{primitives.focusRing.shadow.md}}'),
    }
    
    static readonly schema = z.object({
        settings: (PageHeaderSettingsSchema.schema as typeof PageHeaderSettingsSchema.schema).prefault({}),
        breadcrumb: (breadcrumb as typeof breadcrumb).prefault({}),
        header: (PageHeader.schema as typeof PageHeader.schema).prefault({}),
    }).register(themeSchemaRegistry, { id: 'pageHeader' })
}