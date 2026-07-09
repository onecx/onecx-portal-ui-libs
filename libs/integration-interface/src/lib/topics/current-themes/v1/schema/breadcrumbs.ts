import z from "zod"
import { themeSchemaRegistry } from "./registry"
import { bg, border, borderWithShadow, color, font, icon, link, space, transition, variantWithStates } from "./primitives"

const settings = z.object({
    homeIcon: icon.optional(),
})

const breadcrumbItem = font.extend({
    color: color.optional(),
    space: space.optional(),
    border: border.optional(),
    link: link.optional(),
}).register(themeSchemaRegistry, { id: 'breadcrumbItem' })

const breadcrumbItemStates = variantWithStates.optional()

export const breadcrumbs = z.object({
    settings,
    breadcrumbItem: breadcrumbItem.optional(),
    breadcrumbItemStates,
    space: space.optional(),
    bg: bg.optional(),
    separator: z.object({
        color: color.optional(),
        space: space.optional(),
    }).optional(),
    font: font.optional(),
    transition: transition.optional(),
    focusRing: borderWithShadow.optional(),
    border: border.optional(),
    icon: icon.optional()   

}).register(themeSchemaRegistry, { id: 'breadcrumbs' }).optional()
