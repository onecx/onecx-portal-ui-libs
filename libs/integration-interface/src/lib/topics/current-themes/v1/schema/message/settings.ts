import z from "zod";
import { themeSchemaRegistry } from "../registry";

export class MessageSettingsSchema {
  static readonly schema = z
    .object({
        closable: z.boolean().default(false),
        delay: z.number().default(300),
        showMultiple: z.boolean().default(true),
    }).register(themeSchemaRegistry, { id: 'messageSettings' })
}