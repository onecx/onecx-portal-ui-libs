/**
 * This file defines the schema for carousel theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { iconBaseStyles } from "./table";

export const diagramSettings = z.object({
    size: withRef(z.enum(["small", "large"])).default("large")
})
    .register(themeSchemaRegistry, { id: "diagramSettings" })

export const header = z.object({
    font: z.object({
        size: withRef(z.string()).default('{{primitives.font.size}}'),
        weight: withRef(z.string()).default('{{primitives.font.weight}}')
    }).optional()
})
    .register(themeSchemaRegistry, { id: "diagramHeader" })

export const description = z.object({
    font: z.object({
        size: withRef(z.string()).default('{{primitives.font.size}}'),
        weight: withRef(z.string()).default('{{primitives.font.weight}}')
    }).optional()
})
    .register(themeSchemaRegistry, { id: "diagramDescription" })


export const selectButtonStyles = z.object({
    bg: withRef(z.string()).default("{{primitives.area.surface.defaultState.defaultVariant.bg}}").optional(),
    contrast: withRef(z.string()).default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}").optional()
}).register(themeSchemaRegistry, { id: "diagramSelectButtonState" })

export const selectButtonState = z
    .object({
        defaultState: (selectButtonStyles as typeof selectButtonStyles),
        state: z
            .object({
                hover: (selectButtonStyles as typeof selectButtonStyles),
                active: (selectButtonStyles as typeof selectButtonStyles),
                selected: (selectButtonStyles as typeof selectButtonStyles),
                focus: (selectButtonStyles as typeof selectButtonStyles),
            })
            .optional(),
    })
    .register(themeSchemaRegistry, { id: 'selectButtonWithStates' })

export const selectButton = z.object({
    icon: iconBaseStyles.optional(),
    border: withRef(z.string()).default("{{primitives.border.defaultVariant.color}}").optional(),
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}").optional(),
    backgroundColor: withRef(z.string()).default("{{primitives.area.surface.defaultState.defaultVariant.bg}}").optional(),
    color: withRef(z.string()).default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}").optional(),
    selectButtonState: (selectButtonState as typeof selectButtonState).optional()
})
    .register(themeSchemaRegistry, { id: "diagramSelectButton" })

export const container = z.object({
    bg: withRef(z.string()).default("{{primitives.area.surface.defaultState.defaultVariant.bg}}").optional(),
    contrast: withRef(z.string()).default("{{primitives.area.surface.defaultState.defaultVariant.contrast}}").optional(),
}).optional()
    .register(themeSchemaRegistry, { id: "diagramContainer" })


export const footer = z.object({
    font: z.object({
        size: withRef(z.string()).default('{{primitives.font.size}}').optional(),
        weight: withRef(z.string()).default('{{primitives.font.weight}}').optional(),
    }).optional()
})
    .register(themeSchemaRegistry, { id: "diagramFooter" })

export const diagram = z.object({
    settings: (diagramSettings as typeof diagramSettings).optional(),
    header: (header as typeof header).optional(),
    description: (description as typeof description).optional(),
    selectButton: (selectButton as typeof selectButton).optional(),
    container: (container as typeof container).optional(),
    footer: (footer as typeof footer).optional()
})
    .register(themeSchemaRegistry, { id: "diagram" })