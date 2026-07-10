import * as z from 'zod'
import { bg, bgContrast, border, color, font, icon, variantWithStates, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { tooltip } from './tooltip'
import { menu } from './menu'
import { breadcrumbs } from './breadcrumbs'

const settings = z
    .object({
        loading: withRef(z.boolean()).optional(),
        showBreadcrumbs: withRef(z.boolean()).optional(),
        disableDefaultActions: withRef(z.boolean()).optional(),
        manualBreadcrumbs: withRef(z.boolean()).optional(),
        gridLayoutDesktopColumns: withRef(z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6), z.literal(12)])).optional(),
    }).optional()

const header = z.object({
    font: font.optional(),
    icons: z.object({
        icon: icon.optional(),
        infoIcon: icon.optional(),
        actionIcon: icon.optional(),
    }).optional(),
    text: z.object({
        title: font.optional(),
        subtitle: font.optional(),       
    }).optional(),
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
}).optional()

const subHeader = z.object({
    font: font.optional(),
    icons: z.object({
        icon: icon.optional(),
        infoIcon: icon.optional(),
        actionIcon: icon.optional(),
    }).optional(),
    text: z.object({
        title: font.optional(),
        subtitle: font.optional(),       
    }).optional(),
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
}).optional()

const headerActions = z.object({
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    button: icon.extend({
        bg: bg.optional(),
        color: color.optional(),
    }).optional(),
    buttonStates: (variantWithStates as typeof variantWithStates).optional(),
    horizontalAlignment: z.enum(["left", "center", "right"]).optional(),
    verticalAlignment: z.enum(["top", "middle", "bottom"]).optional(),
    icon: icon.optional(),
    font: font.optional(),
    tooltip: tooltip.optional(),
})

const contentLabel = font.extend({
    color: color.optional(),
}).optional()

const contentValue = font.extend({
    color: color.optional(),
    infoIcon: icon.optional(),
    actionIcon: icon.optional(),
}).optional()

export const content = bgContrast
  .extend({
    font: font.optional(),
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    contentLabel,
    contentValue,
  })
  .optional()

type PageHeaderShape = {
    settings: typeof settings
    breadCrumbs: typeof breadcrumbs
    header: typeof header
    subHeader: typeof subHeader
    headerActions: typeof headerActions
    tooltip: typeof tooltip
    contextMenu: typeof menu
    focusRing: z.ZodOptional<typeof border>
    content: typeof content
}

const pageHeaderShape: PageHeaderShape = {
    settings,
    breadCrumbs: breadcrumbs,
    header,
    subHeader,
    headerActions,
    tooltip,
    contextMenu: menu,
    focusRing: border.optional(),
    content,
}

export const pageHeader = z
  .object(pageHeaderShape)
  .optional()
  .register(themeSchemaRegistry, { id: "pageHeader" })
