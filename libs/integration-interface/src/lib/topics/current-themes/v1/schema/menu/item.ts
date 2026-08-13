import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { bg, border, color, font, withRef } from "../primitives"

export class MenuItemSchema {
    static readonly tokens = {
        backgroundColor: bg.pick({color: true}).default({color: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg.color}}'}),
        color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
        padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
        gap: withRef(z.string()).default('{{primitives.spacing.sm}}'),
        border: border.pick({color: true, radius: true}).default({
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}', 
            radius: '{{primitives.border.radius.md}}'
        }),
    }

    static readonly label = {
        font: font.pick({family: true, size: true, weight: true}).default({
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size.md}}',
            weight: '{{primitives.font.weight.normal}}'
        }),
    }

    static readonly iconFocus = {
        color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    }

    static readonly iconHover = {
        color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    }

    static readonly icon = {
        color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
        focus: this.iconFocus,
        hover: this.iconHover,
        size: withRef(z.string()).default('{{primitives.icon.size.md}}'),
    }

    static readonly focusTokens = {
        backgroundColor: bg.pick({color: true}).default({color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}'}),
        color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
    }

    static readonly hoverTokens = {
        backgroundColor: bg.pick({color: true}).default({color: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg.color}}'}),
        color: color.default('{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}'),
    }

    static readonly subMenuTokens = {
       padding: withRef(z.string()).default('{{primitives.spacing.sm}}'),
       font: font.pick({family: true, size: true, weight: true}).default({
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size.md}}',
            weight: '{{primitives.font.weight.normal}}'
        }),
        backgroundColor: bg.pick({color: true}).default({color: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg.color}}'}),
        color: color.default('{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}'),
        icon: this.icon,
    }

    static readonly separatorTokens = {
        border: border.pick({color: true, width: true}).default({
            width: '{{primitives.border.width.sm}}',
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'
        }),
    }

    static readonly schema = z.object({
        ...this.tokens,
        label: z.object({
            ...this.label,
        }).prefault({}),
        focus: z.object({
            ...this.focusTokens,
        }).prefault({}),
        hover: z.object({
            ...this.hoverTokens,
        }).prefault({}),
    }).register(themeSchemaRegistry, { id: 'menu-item' })
}