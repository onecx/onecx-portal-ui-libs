import z from "zod"
import type { ElementRef, TemplateRef } from "@angular/core"
import { bgContrast, border, borderWithShadow, font, icon, variantWithStates, withRef } from "./primitives"
import { themeSchemaRegistry } from "./registry"
import { link } from "./link"

export type MenuAppendToTarget = HTMLElement | ElementRef | TemplateRef<any> | "self" | "body" | null | undefined

const setting = z.object({
    appendTo: z.custom<MenuAppendToTarget>().optional(),
    autoZIndex: withRef(z.boolean()).optional(),
    baseZIndex: withRef(z.number()).optional(),
}).optional().register(themeSchemaRegistry, { id: 'menuSettings' })

const container = bgContrast.extend({
    border: borderWithShadow.optional(),
    transition: z.object({}).optional(),
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
}).optional()

const item = bgContrast.extend({
    state: variantWithStates.optional(),
    font: font.optional(),
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    border: border.optional(),
    icon: icon.optional(),
    link: link.optional(),
}).optional()

const submenu = item.optional()

const menuSeparator = border.optional()

type MenuShape = {
    settings: typeof setting
    container: typeof container
    item: typeof item
    submenu: typeof submenu
    menuSeparator: typeof menuSeparator
}

const menuShape: MenuShape = {
    settings: setting,
    container: container,
    item: item,
    submenu: submenu,
    menuSeparator,
}

export const menu = z
  .object(menuShape)
  .optional()
  .register(themeSchemaRegistry, { id: "menu" })