import z from "zod"
import { themeSchemaRegistry } from "../registry"

export class MenuSchema {
   static readonly tokens = {}

   static readonly schema = z.object({}).register(themeSchemaRegistry, { id: 'menu' })
}