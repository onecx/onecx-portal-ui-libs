/**
 * Tabs tab component schema definition
 */
import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { bg, border, color, font, icon, withRef } from "../primitives"
import { tooltip } from "../tooltip"
import { TabsActiveBarSchema } from "./activeBar"

export class TabsTabSchema {

    private static tabBorderCommonTokens = {
        width: "{{primitives.border.width.none}}",
        radius: "{{primitives.border.radius.none}}", 
        offset: "{{primitives.border.offset.none}}",
    }

    private static readonly tabDefaultStateTokens = {
        background: z.union([bg, withRef(z.string())]).default("{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}"),
        color: color.default("{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}"),
        paddingX: withRef(z.string()).default('{{primitives.space.md}}'),
        paddingY: withRef(z.string()).default('{{primitives.space.md}}'),
        alignItems: withRef(z.string()).default("{{primitives.layout.alignItems}}"),
        gap: withRef(z.string()).default("{{primitives.space.md}}"),
        icon: icon.default({
            size: "{{primitives.icon.size.sm}}",
            color: "{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}",
            content: "{{primitives.icon.content}}",
            url: "{{primitives.icon.url}}",
            font: {weight: "{{primitives.font.weight.normal}}"},
        }),
        activeBar: (TabsActiveBarSchema.schema as typeof TabsActiveBarSchema.schema).prefault({}),
        tooltip: tooltip.prefault({}),
        border: border.default({
            ...this.tabBorderCommonTokens,
            style: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}",
            color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}",
        }),
    }

    private static readonly tabHoverStateTokens = z.object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}"),
        color: color.default("{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}"),
        cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}"),
        border: border.default({
            ...this.tabBorderCommonTokens,
            color: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}",
        }),
        font: font.pick({weight: true}).default({
            weight: "{{primitives.defaultVariant.state.hover.defaultSeverity.font.weight}}",
        }),
    });

    private static readonly tabFocusStateTokens = z.object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.defaultVariant.focusedState.defaultSeverity.bg}}"),
        color: color.default("{{primitives.defaultVariant.focusedState.defaultSeverity.contrast}}"),
        border: border.default({
            ...this.tabBorderCommonTokens,
            color: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}",
            style: "{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}",
        }),
        font: font.pick({weight: true}).default({
            weight: "{{primitives.defaultVariant.state.focus.defaultSeverity.font.weight}}",
        }),
    });

    private static readonly tabActiveStateTokens = z.object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.primary.activeState.defaultSeverity.bg}}"),
        color: color.default("{{primitives.primary.activeState.defaultSeverity.contrast}}"),
        border: border.default({
            ...this.tabBorderCommonTokens,
            color: "{{primitives.primary.state.active.defaultSeverity.border.color}}",
            style: "{{primitives.primary.state.active.defaultSeverity.border.style}}",
        }),
        font: font.pick({weight: true}).default({
            weight: "{{primitives.defaultVariant.state.active.defaultSeverity.font.weight}}",
        }),
    });

    private static readonly tabDisabledStateTokens = z.object({
        background: z.union([bg, withRef(z.string())]).default("{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}"),
        color: color.default("{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}"),
        cursor: withRef(z.string()).default("{{primitives.defaultVariant.state.disabled.defaultSeverity.cursor}}"),
    });

    static readonly schema = z
        .object({
            ...this.tabDefaultStateTokens,
            hover: this.tabHoverStateTokens.prefault({}),
            focus: this.tabFocusStateTokens.prefault({}),
            active: this.tabActiveStateTokens.prefault({}),
            disabled: this.tabDisabledStateTokens.prefault({}),
        })
        .register(themeSchemaRegistry, { id: 'tabsTab' })
}