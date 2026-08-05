import z from "zod"
import { themeSchemaRegistry } from "../registry"

export class SecondaryMessageSchema {
    private static readonly tokens = {}
    static readonly schema = z
        .object({
            ...this.tokens,
        }).register(themeSchemaRegistry, { id: 'secondaryMessage' })
}