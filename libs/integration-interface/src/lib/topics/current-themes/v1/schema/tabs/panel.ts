/**
 * Tabs panel component schema definition
 */

import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { bg, color, font, withRef } from "../primitives"

export class TabsPanelSchema {
    private static readonly panelFontTokens = {
        size: "{{primitives.font.size.md}}",
        weight: "{{primitives.font.weight.normal}}",
        lineHeight: "{{primitives.font.lineHeight.md}}",
    }

    private static readonly tokens = {
        font: font.pick({size: true, weight: true, lineHeight: true}).default(this.panelFontTokens),
        background: z.union([bg, withRef(z.string())]).default("{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}"),
        color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}"),
        paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
        paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
        alignItems: withRef(z.string()).default("{{primitives.layout.alignItems}}"),
        justifyContent: withRef(z.string()).default("{{primitives.layout.justifyContent}}"),
    }

    static readonly schema = z
        .object({
        ...this.tokens,
        })
        .register(themeSchemaRegistry, { id: 'tabsPanel' })
}