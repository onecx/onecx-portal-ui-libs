import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { withRef } from "../primitives"

/**
 * Tabs viewport component schema definition 
 * 
*/
export class TabsViewportSchema {
    private static readonly tokens = {
        scrollBehavior: withRef(z.string()).default("smooth"),
        overscrollBehavior: withRef(z.string()).default("contain auto"),
        scrollbarWidth: withRef(z.string()).default("none"),
        webkitScrollbarDisplay: withRef(z.string()).default("none"),
    }

    static readonly schema = z
        .object({
            ...this.tokens,
        })
        .register(themeSchemaRegistry, { id: 'tabsViewport' })
}   