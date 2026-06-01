import * as z from "zod";

export const fontSourceDefinition = z
  .object({
    url: z.string().optional(),
    format: z.string().optional(),
    local: z.string().optional(),
  })
  .meta({ id: "fontSourceDefinition" });

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
  .meta({ id: "fontDefinition" });

export const fontDefinitions = z.array(fontDefinition).meta({ id: "fontDefinitions" });
