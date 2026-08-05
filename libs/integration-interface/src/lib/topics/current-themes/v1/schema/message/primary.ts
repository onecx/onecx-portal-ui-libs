import z from "zod"
import { themeSchemaRegistry } from "../registry"

export class PrimaryMessageSchema {
    private static readonly tokens = {
        
    }
    static readonly schema = z
        .object({
            ...this.tokens,
        }).register(themeSchemaRegistry, { id: 'primaryMessage' })
}