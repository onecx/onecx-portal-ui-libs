import * as z from "zod";
import { dialog } from "./schema/dialog";
import { menubar } from "./schema/menubar";
import { primitives } from "./schema/primitives";
import { badge } from "./schema/badge";
import { region } from "./schema/region";
import { table } from "./schema/table";
import { tooltip } from "./schema/tooltip";
import { carousel } from "./schema/carousel";
import { toggleswitch } from "./schema/toggleswitch";
import { tabs } from "./schema/tabs";
import { themeSchemaRegistry } from "./schema/registry";
import { fieldset } from "./schema/fieldset";
import { diagram } from "./schema/diagram";
import { dropdown } from "./schema/dropdown";

type UsagesInput = {
  dialog?: z.input<typeof dialog>
  badge?: z.input<typeof badge>
  menubar?: z.input<typeof menubar>
  region?: z.input<typeof region>
  table?: z.input<typeof table>
  tooltip?: z.input<typeof tooltip>
  carousel?: z.input<typeof carousel>
  fieldset?: z.input<typeof fieldset>
  diagram?: z.input<typeof diagram>
  dropdown?: z.input<typeof dropdown>
}

const usages: z.ZodType<UsagesInput> = z
  .object({
    dialog: (dialog as typeof dialog).optional(),
    badge: (badge as typeof badge).optional(),
    menubar: (menubar as typeof menubar).optional(),
    region: (region as typeof region).optional(),
    table: (table as typeof table).optional(),
    tooltip: (tooltip as typeof tooltip).optional(),
    carousel: (carousel as typeof carousel).optional(),
    tabs: (tabs as typeof tabs).optional(),
    fieldset: (fieldset as typeof fieldset).optional(),
    diagram: (diagram as typeof diagram).optional(),    
    toggleswitch: (toggleswitch as typeof toggleswitch).optional(),
    dropdown: (dropdown as typeof dropdown).optional(),    
  })
  .register(themeSchemaRegistry, { id: "usages" }) as any;

type PrimitivesInput = z.input<typeof primitives>

type RegionOverrideInput = {
  primitives?: PrimitivesInput
  usages?: UsagesInput
}

// Explicit type annotation breaks the inference chain to avoid TS2589
// (regionOverrides repeats this schema 7 times, causing depth explosion)
const regionOverride: z.ZodOptional<z.ZodType<RegionOverrideInput>> = z
  .object({
    primitives: primitives.optional(),
    usages: usages.optional(),
  }).optional()
  .register(themeSchemaRegistry, { id: "regionOverride" }) as any;

const regionOverrides = z
  .object({
    header: regionOverride as typeof regionOverride,
    subHeader: regionOverride as typeof regionOverride,
    bodyStart: regionOverride as typeof regionOverride,
    bodyHeader: regionOverride as typeof regionOverride,
    bodyFooter: regionOverride as typeof regionOverride,
    bodyEnd: regionOverride as typeof regionOverride,
    footer: regionOverride as typeof regionOverride,
  }).optional()
  .register(themeSchemaRegistry, { id: "regionOverrides" });

export const themePropertiesV2 = z
  .object({
    primitives: primitives as typeof primitives,
    usages: usages.optional(),
    regionOverrides: regionOverrides as typeof regionOverrides,
  })
  .register(themeSchemaRegistry, { id: 'themePropertiesV2' })

export const theme = z
  .object({
    v2: themePropertiesV2.optional(),
    v1: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  })
  .register(themeSchemaRegistry, { id: 'theme' })

export const regionKeys = ["header", "subHeader", "bodyStart", "bodyHeader", "bodyFooter", "bodyEnd", "footer"] as const
export type RegionOverridesInput = Partial<Record<typeof regionKeys[number], RegionOverrideInput>>

export type ThemePropertiesV2 = {
  primitives?: PrimitivesInput
  usages?: UsagesInput
  regionOverrides?: RegionOverridesInput
}

export type ThemeProperties = {
  v2?: ThemePropertiesV2
  v1?: Record<string, Record<string, string>>
};