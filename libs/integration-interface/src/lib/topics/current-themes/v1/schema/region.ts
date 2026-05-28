import * as z from "zod";
import { withRef } from "./primitives";

export const fontWithDefaults = z
  .object({
    family: withRef(z.string()).default("{{primitives.font.family}}"),
    size: withRef(z.string()).default("{{primitives.font.size}}"),
    weight: withRef(z.string()).default("{{primitives.font.weight}}"),
    lineHeight: withRef(z.string()).default("{{primitives.font.lineHeight}}"),
    letterSpacing: withRef(z.string()).default(
      "{{primitives.font.letterSpacing}}"
    ),
    style: withRef(z.string()).default("{{primitives.font.style}}"),
  })
  .meta({ id: "fontWithDefaults" });

  /**
   * Contains settings that should be applied to the current theme region (e.g. body or slot group). Contains stuff like background color, typography etc.
   */
export const region = z
  .object({
    font: fontWithDefaults.optional(),
  })
  .meta({ id: "region" });
