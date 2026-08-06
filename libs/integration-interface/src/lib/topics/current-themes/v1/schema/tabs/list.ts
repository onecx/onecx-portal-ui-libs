import { withRef, bg, color, icon, border } from "../primitives"
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { TabsNavButtonSchema } from "./navButton"
import { TabsListContentSchema } from "./listContent"


/**
 * Tabs list component schema definition. Tab list contains all tabs and allows to scroll through them if they don't fit into the viewport. 
 */
export class TabsTabListSchema {
    private static readonly tabslistborderTokens = {
        width: "{{primitives.border.width.none}}",
        radius: "{{primitives.border.radius.none}}",
        offset: "{{primitives.border.offset.none}}",
        style: "{{primitives.border.style}}",
        color: "{{primitives.border.color}}",
    }

    private static readonly tokens = {
        background: z
        .union([bg, withRef(z.string())])
        .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
        color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
        gap: withRef(z.string()).default('{{primitives.space.md}}'),
        paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
        paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
        border: border.default(this.tabslistborderTokens),
    }

    static readonly schema = z
        .object({
        ...this.tokens,
        content: (TabsListContentSchema.schema as typeof TabsListContentSchema.schema).prefault({}),
        })
        .register(themeSchemaRegistry, { id: "tabsTabList" })
}