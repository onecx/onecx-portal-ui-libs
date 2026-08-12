import z from "zod"
import { withRef } from "../primitives"

export class BreadcrumbSettingsSchema{
    static readonly schema = z.object({
        homeIcon: withRef(z.string()).default('home'),
        showTooltip: withRef(z.boolean()).default(true),
        separator: withRef(z.string()).default('/'),
    })
}