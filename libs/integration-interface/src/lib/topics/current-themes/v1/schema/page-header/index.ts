import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { PageHeaderSettingsSchema } from "./settings"
import { PageHeaderSchema as PageHeader } from "./header"
import { border, withRef } from "../primitives"
import { PageHeaderContentSchema } from "./content"
import { BreadcrumbSchema } from "../breadcrumb/index"
import { tooltip } from "../tooltip"

export class PageHeaderSchema {
    private static readonly tokens = {
        border: border.default({
            width: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.width}}',
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            radius: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.radius}}',
        }),
        padding: withRef(z.string()).default('{{primitives.space.md}}'),
        shadow: withRef(z.string()).default('{{primitives.shadow.md}}'),
    }
    
    static readonly schema = z.object({
        ...this.tokens,
        settings: (PageHeaderSettingsSchema.schema as typeof PageHeaderSettingsSchema.schema).prefault({}),
        breadcrumb: (BreadcrumbSchema.schema as typeof BreadcrumbSchema.schema).prefault({}),
        header: (PageHeader.schema as typeof PageHeader.schema).prefault({}),
        content: (PageHeaderContentSchema.schema as typeof PageHeaderContentSchema.schema).prefault({}),
        tooltip: tooltip.prefault({}), // TODO: revisit this once everything else is done
        menu: z.object({}).optional(), // TODO: revisit this once everything else is done
    }).register(themeSchemaRegistry, { id: 'pageHeader' })
}

// TODO 1 - Revise again from container
// TODO 2 - Add info related to existing primitives
// TODO 3 - add content schema and add to the page header schema
// TODO 4 - define menubar spec - https://primeng.dev/menu 