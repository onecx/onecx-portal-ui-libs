import * as z from 'zod'
import { dialog, dialogSettings } from './schema/dialog'
import { menubar, menubarSettings } from './schema/menubar'
import { primitives } from './schema/primitives'
import { badge, badgeSettings } from './schema/badge'
import { region } from './schema/region'
import { table, tableSettings } from './schema/table'
import { tooltip, tooltipSettings } from './schema/tooltip'
import { carousel, carouselSettings } from './schema/carousel'
import { toggleswitch, toggleswitchSettings } from './schema/toggleswitch'
import { tabs } from './schema/tabs'
import { themeSchemaRegistry } from './schema/registry'
import { fieldset } from './schema/fieldset'
import { diagram, diagramSettings } from './schema/diagram'
import { dropdown, settings as dropdownSettings } from './schema/dropdown'
import { textarea, textareaSettings } from './schema/textarea'
import { input } from './schema/input'
import { picklist } from './schema/picklist'
import { togglebutton, togglebuttonSettings } from './schema/togglebutton'
import { calendar } from './schema/calendar'
import { interactiveDataView } from './schema/interactive-data-view'
import { accordion } from './schema/accordion'
import { message } from './schema/message'
import { selectbutton, selectbuttonSettings } from './schema/selectbutton'
import { loadingIndicator } from './schema/loading-indicator'
import { ripple, rippleSettings } from './schema/ripple'
import { panelmenu } from './schema/panelmenu'
import { menu } from './schema/menu'
import { breadcrumb } from './schema/breadcrumb'
import { pageHeader } from './schema/page-header'
import { content } from './schema/content'
import { dataview } from './schema/dataview'
import { calendarSettingsShape } from './schema/calendar/settings'

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
  tabs?: z.input<typeof tabs>
  toggleswitch?: z.input<typeof toggleswitch>
  textarea?: z.input<typeof textarea>
  input?: z.input<typeof input>
  picklist?: z.input<typeof picklist>
  togglebutton?: z.input<typeof togglebutton>
  calendar?: z.input<typeof calendar>
  interactiveDataView?: z.input<typeof interactiveDataView>
  accordion?: z.input<typeof accordion>
  message?: z.input<typeof message>
  selectbutton?: z.input<typeof selectbutton>
  loadingIndicator?: z.input<typeof loadingIndicator>
  ripple?: z.input<typeof ripple>
  panelmenu?: z.input<typeof panelmenu>
  menu?: z.input<typeof menu>
  breadcrumb?: z.input<typeof breadcrumb>
  pageHeader?: z.input<typeof pageHeader>
  content?: z.input<typeof content>
  dataview?: z.input<typeof dataview>
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
    input: (input as typeof input).optional(),
    dropdown: (dropdown as typeof dropdown).optional(),
    toggleswitch: (toggleswitch as typeof toggleswitch).optional(),
    textarea: (textarea as typeof textarea).optional(),
    picklist: (picklist as typeof picklist).optional(),
    togglebutton: (togglebutton as typeof togglebutton).optional(),
    calendar: (calendar as typeof calendar).optional(),
    interactiveDataView: (interactiveDataView as typeof interactiveDataView).optional(),
    accordion: (accordion as typeof accordion).optional(),
    message: (message as typeof message).optional(),
    selectbutton: (selectbutton as typeof selectbutton).optional(),
    loadingIndicator: (loadingIndicator as typeof loadingIndicator).optional(),
    ripple: (ripple as typeof ripple).optional(),
    panelmenu: (panelmenu as typeof panelmenu).optional(),
    menu: (menu as typeof menu).optional(),
    breadcrumb: (breadcrumb as typeof breadcrumb).optional(),
    pageHeader: (pageHeader as typeof pageHeader).optional(),
    content: (content as typeof content).optional(),
    dataview: (dataview as typeof dataview).optional(),
  })
  .register(themeSchemaRegistry, { id: 'usages' })

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
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'regionOverride' }) as any

const regionOverrides = z
  .object({
    header: regionOverride as typeof regionOverride,
    subHeader: regionOverride as typeof regionOverride,
    bodyStart: regionOverride as typeof regionOverride,
    bodyHeader: regionOverride as typeof regionOverride,
    bodyFooter: regionOverride as typeof regionOverride,
    bodyEnd: regionOverride as typeof regionOverride,
    footer: regionOverride as typeof regionOverride,
  })
  .optional()
  .register(themeSchemaRegistry, { id: 'regionOverrides' })

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

export const regionKeys = ['header', 'subHeader', 'bodyStart', 'bodyHeader', 'bodyFooter', 'bodyEnd', 'footer'] as const
export type RegionOverridesInput = Partial<Record<(typeof regionKeys)[number], RegionOverrideInput>>

export type ThemePropertiesV2 = {
  primitives?: PrimitivesInput
  usages?: UsagesInput
  regionOverrides?: RegionOverridesInput
}

export type ThemeUsageName = keyof UsagesInput

/**
 * Flat map of each settings-bearing usage to the *input* type of its `settings` sub-schema.
 *
 * Each usage declares `settings: (<flat settings schema>).optional()` — a small, separate schema
 * (e.g. `tableSettings`, `carouselSettings`) that is entirely independent of that usage's deep
 * token tree (`row`, `header`, variant/state wrappers, …). Sourcing the settings type from these
 * flat schemas (rather than from `z.input<typeof <usage>>['settings']`) avoids walking the deep
 * tree, which is what overflows TS's instantiation-depth budget (TS2589) under ng-packagr's
 * partial-compilation mode once usages such as `table`/`calendar` nest their state wrappers.
 *
 * This is type-identical to `z.input<typeof <usage>>['settings']`, because the usage's
 * `settings` field *is* exactly this flat schema.
 */
type UsageSettingsSchemas = {
  badge: z.input<typeof badgeSettings>
  carousel: z.input<typeof carouselSettings>
  dialog: z.input<typeof dialogSettings>
  dropdown: z.input<typeof dropdownSettings>
  menubar: z.input<typeof menubarSettings>
  table: z.input<typeof tableSettings>
  toggleswitch: z.input<typeof toggleswitchSettings>
  togglebutton: z.input<typeof togglebuttonSettings>
  selectbutton: z.input<typeof selectbuttonSettings>
  tooltip: z.input<typeof tooltipSettings>
  textarea: z.input<typeof textareaSettings>
  diagram: z.input<typeof diagramSettings>
  ripple: z.input<typeof rippleSettings>
  calendar: z.input<typeof calendarSettingsShape>
}

/**
 * Names of the usages that define a `settings` block.
 *
 * A flat `keyof` over the shallow {@link UsageSettingsSchemas} map — deliberately NOT a mapped
 * type over `UsagesInput` (whose members are the full, deep `z.input` types). Evaluating the deep
 * members to test for a `settings` key is exactly what exceeds TS's depth budget under ngc.
 */
export type ThemeUsageNameWithSettings = keyof UsageSettingsSchemas

/**
 * The `settings` object type of a usage, or `never` for usages without a `settings` block.
 *
 * A plain indexed access into the shallow {@link UsageSettingsSchemas} map. Indexed access with a
 * (possibly generic) type argument is deferred, so this never materializes a deep usage type; it
 * resolves to a single flat settings type when a concrete usage name is substituted.
 */
export type ThemeUsageSettings<TUsage extends ThemeUsageNameWithSettings> = UsageSettingsSchemas[TUsage]

export type ThemeProperties = {
  v2?: ThemePropertiesV2
  v1?: Record<string, Record<string, string>>
}
