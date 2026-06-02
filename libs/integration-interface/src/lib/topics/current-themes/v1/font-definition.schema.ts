import * as z from "zod";
import { themeSchemaRegistry } from "./schema/registry";

export const fontSourceDefinition = z
  .object({
    url: z.string().optional(),
    format: z.string().optional(),
    local: z.string().optional(),
  })
  .register(themeSchemaRegistry, { id: "fontSourceDefinition" });

export const fontDefinition = z
  .object({
    fontFamily: z.string(),
    src: z.union([
      z.string(),
      fontSourceDefinition,
      z.array(fontSourceDefinition),
    ]),
    fontDisplay: z.string().optional(),
    fontStretch: z.string().optional(),
    fontStyle: z.string().optional(),
    fontWeight: z.string().optional(),
    fontFeatureSettings: z.string().optional(),
    fontVariationSettings: z.string().optional(),
    unicodeRange: z.string().optional(),
    ascentOverride: z.string().optional(),
    descentOverride: z.string().optional(),
    lineGapOverride: z.string().optional(),
    sizeAdjust: z.string().optional(),
  })
  .register(themeSchemaRegistry, { id: "fontDefinition" });

export const fontDefinitions = z.array(fontDefinition).register(themeSchemaRegistry, { id: "fontDefinitions" });
