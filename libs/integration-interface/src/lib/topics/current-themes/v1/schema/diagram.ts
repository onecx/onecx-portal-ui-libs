/**
 * This file defines the schema for carousel theming. It, by default, uses primitives for default values but allows overriding any of them with custom values.
 */
import * as z from "zod";
import { bgContrast, font, withRef } from "./primitives";
import { themeSchemaRegistry } from "./registry";
import { iconBaseStyles } from "./table";

export const diagramTextStyles = z
    .object({
        font: font.default({
            family: "{{primitives.font.family}}",
            size: "{{primitives.font.size.md}}",
            weight: "{{primitives.font.weight.regular}}"
        })
    })
    .register(themeSchemaRegistry, { id: "diagramTextStyles" });

export const diagramSettings = z.object({
    size: withRef(z.enum(["small", "large"])).default("large")
})
    .register(themeSchemaRegistry, { id: "diagramSettings" })


export const selectButtonStyles = bgContrast.optional().register(themeSchemaRegistry, { id: "diagramSelectButtonState" })

export const selectButtonState = z
    .object({
        defaultState: (selectButtonStyles as typeof selectButtonStyles).optional(),
        state: z
            .object({
                hover: (selectButtonStyles as typeof selectButtonStyles).optional(),
                active: (selectButtonStyles as typeof selectButtonStyles).optional(),
                selected: (selectButtonStyles as typeof selectButtonStyles).optional(),
                focus: (selectButtonStyles as typeof selectButtonStyles).optional(),
            })
            .optional(),
    })
    .register(themeSchemaRegistry, { id: 'selectButtonWithStates' })

export const selectButton = z.object({
    icon: iconBaseStyles.optional(),
    border: withRef(z.string()).default("{{primitives.border.defaultVariant.color}}"),
    borderRadius: withRef(z.string()).default("{{primitives.radius.md}}"),
    bgContrast: bgContrast.optional(),
    selectButtonState: (selectButtonState as typeof selectButtonState)
})
    .register(themeSchemaRegistry, { id: "diagramSelectButton" })

export const container = z.object({
    bgContrast: bgContrast.default({
        bg: {
            color: {
                dark: "{{primitives.area.surface.defaultState.defaultVariant.bg.color.dark}}",
                light: "{{primitives.area.surface.defaultState.defaultVariant.bg.color.light}}"
            }
        },
        contrast: "{{primitives.area.surface.defaultState.defaultVariant.contrast}}"
    })
})
    .register(themeSchemaRegistry, { id: "diagramContainer" })

export const diagram = z.object({
    settings: (diagramSettings as typeof diagramSettings).optional(),
    header: (diagramTextStyles as typeof diagramTextStyles).optional(),
    description: (diagramTextStyles as typeof diagramTextStyles).optional(),
    selectButton: (selectButton as typeof selectButton).optional(),
    container: (container as typeof container).optional(),
    footer: (diagramTextStyles as typeof diagramTextStyles).optional(),
})
    .register(themeSchemaRegistry, { id: "diagram" })