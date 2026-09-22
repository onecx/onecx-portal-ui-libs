import * as z from 'zod'
import { applyDefaultsRecursive } from './defaults-helper'
import { bg, border, color, font, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const diagramTextShape = z.object({
    font: font.optional(),
})

export const diagramContainerShape = z.object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
})

const diagramSelectButtonIconShape = z.object({
    color: color.optional(),
})

const diagramSelectButtonStateShape = z.object({
    background: z.union([bg, withRef(z.string())]).optional(),
    border: border.optional(),
    color: color.optional(),
    icon: diagramSelectButtonIconShape.optional(),
})

const diagramSelectButtonButtonShape = diagramSelectButtonStateShape.extend({
    hover: diagramSelectButtonStateShape.optional(),
    selected: diagramSelectButtonStateShape.optional(),
    focus: diagramSelectButtonStateShape.optional(),
})

export const diagramSelectButtonShape = z.object({
    gap: withRef(z.string()).optional(),
    border: border.optional(),
    button: diagramSelectButtonButtonShape.optional(),
})

export const diagramShape = z.object({
    container: diagramContainerShape.optional(),
    header: diagramTextShape.optional(),
    description: diagramTextShape.optional(),
    selectButton: diagramSelectButtonShape.optional(),
    footer: diagramTextShape.optional(),
})

const textDefaults = {
    font: {
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
    },
}

export const diagramDefaults = {
    container: {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
    },
    header: textDefaults,
    description: textDefaults,
    selectButton: {
        gap: '{{primitives.space.xs}}',
        border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            radius: '{{primitives.border.radius.md}}',
        },
        button: {
            background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            border: {
                color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
                style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
                width: '{{primitives.border.width.sm}}',
                radius: '{{primitives.border.radius.md}}',
            },
            icon: {
                color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            },
            hover: {
                background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
                border: {
                    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
                    style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
                    width: '{{primitives.border.width.sm}}',
                    radius: '{{primitives.border.radius.md}}',
                },
                icon: {
                    color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
                },
            },
            selected: {
                background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
                color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
                border: {
                    color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
                    style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
                    width: '{{primitives.border.width.sm}}',
                    radius: '{{primitives.border.radius.md}}',
                },
                icon: {
                    color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
                },
            },
            focus: {
                background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
                color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
                border: {
                    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
                    style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
                    width: '{{primitives.border.width.sm}}',
                    radius: '{{primitives.border.radius.md}}',
                },
                icon: {
                    color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
                },
            },
        },
    },
    footer: textDefaults,
}

export const diagram = applyDefaultsRecursive(diagramShape, diagramDefaults).register(themeSchemaRegistry, {
    id: 'diagram',
})