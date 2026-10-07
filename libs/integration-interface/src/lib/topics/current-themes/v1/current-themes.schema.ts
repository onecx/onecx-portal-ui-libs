import * as z from 'zod'
import { dialog } from './schema/dialog'
import { menubar, menubarShape } from './schema/menubar'
import { primitives } from './schema/primitives'
import { badge } from './schema/badge'
import { badgeShape } from './schema/badge'
import { region } from './schema/region'
import { dataTable, dataTableShape } from './schema/data-table/data-table'
import { tooltip } from './schema/tooltip'
import { tooltipShape } from './schema/tooltip'
import { carousel } from './schema/carousel'
import { toggleswitch, toggleSwitchShape } from './schema/toggleswitch'
import { tabs, tabsShape } from './schema/tabs'
import { themeSchemaRegistry } from './schema/registry'
import { FALLBACK_ORDER_DEFAULT, type RelaxedAxisKind } from './utils/axis-metadata'
import { diagram, diagramShape } from './schema/diagram'
import { groupByCountDiagram, groupByCountDiagramShape } from './schema/group-by-count-diagram'
import { fieldset, fieldsetShape } from './schema/fieldset'
import { dropdown, dropdownShape } from './schema/dropdown'
import { textarea, textareaShape } from './schema/textarea'
import { input, inputShape } from './schema/input'
import { picklist } from './schema/picklist'
import { togglebutton } from './schema/togglebutton'
import { calendar } from './schema/calendar'
import type { CalendarShapeInput } from './schema/calendar'
import { interactiveDataView } from './schema/interactive-data-view'
import { interactiveDataViewShape } from './schema/interactive-data-view/interactive-data-view'
import { accordion } from './schema/accordion'
import { message } from './schema/message'
import { messageShape } from './schema/message/message'
import { selectbutton } from './schema/selectbutton'
import { loadingIndicator } from './schema/loading-indicator'
import { ripple, rippleShape } from './schema/ripple'
import { panelmenu } from './schema/panelmenu'
import type { PanelMenuShapeInput } from './schema/panelmenu'
import { menu } from './schema/menu'
import { breadcrumb } from './schema/breadcrumb'
import { content } from './schema/content'
import { pageHeader } from './schema/page-header'
import { dataview } from './schema/dataview'
import { dataviewShape } from './schema/dataview/dataview'
import { chip, chipShape } from './schema/chip'
import { customGroupColumnSelector, customGroupColumnSelectorShape } from './schema/custom-group-column-selector'
import { dataListGrid, dataListGridShape } from './schema/data-list-grid'
import { paginator, paginatorShape } from './schema/paginator'
import { skeleton, skeletonShape } from './schema/skeleton'
import { pageHeaderShape } from './schema/page-header/index'
import { button, ButtonShapeInput } from './schema/button'

type UsagesInput = {
  dialog?: z.input<typeof dialog>
  badge?: z.input<typeof badgeShape>
  menubar?: z.input<typeof menubarShape>
  region?: z.input<typeof region>
  dataTable?: z.input<typeof dataTableShape>
  tooltip?: z.input<typeof tooltipShape>
  carousel?: z.input<typeof carousel>
  fieldset?: z.input<typeof fieldsetShape>
  dropdown?: z.input<typeof dropdownShape>
  diagram?: z.input<typeof diagramShape>
  groupByCountDiagram?: z.input<typeof groupByCountDiagramShape>
  tabs?: z.input<typeof tabsShape>
  toggleswitch?: z.input<typeof toggleSwitchShape>
  textarea?: z.input<typeof textareaShape>
  input?: z.input<typeof inputShape>
  picklist?: z.input<typeof picklist>
  togglebutton?: z.input<typeof togglebutton>
  calendar?: CalendarShapeInput
  interactiveDataView?: z.input<typeof interactiveDataViewShape>
  accordion?: z.input<typeof accordion>
  message?: z.input<typeof messageShape>
  selectbutton?: z.input<typeof selectbutton>
  loadingIndicator?: z.input<typeof loadingIndicator>
  ripple?: z.input<typeof rippleShape>
  panelmenu?: PanelMenuShapeInput
  menu?: z.input<typeof menu>
  breadcrumb?: z.input<typeof breadcrumb>
  pageHeader?: z.input<typeof pageHeaderShape>
  content?: z.input<typeof content>
  dataview?: z.input<typeof dataviewShape>
  chip?: z.input<typeof chipShape>
  customGroupColumnSelector?: z.input<typeof customGroupColumnSelectorShape>
  dataListGrid?: z.input<typeof dataListGridShape>
  paginator?: z.input<typeof paginatorShape>
  skeleton?: z.input<typeof skeletonShape>
  // Hand-written concrete type (mirrors `CalendarShapeInput`/`PanelMenuShapeInput`) — the loose
  // `applyDefaultsRecursive` output would expose no keys and collapse the `usages.button` arm of
  // `ThemePath`. See `ButtonShapeInput` in schema/button.
  button?: ButtonShapeInput
}

type UsageSettingsInput<TUsage> = TUsage extends { settings?: infer TSettings } ? TSettings : never

const usages: z.ZodType<UsagesInput> = z
  .object({
    dialog: (dialog as typeof dialog).optional(),
    badge: (badge as typeof badge).optional(),
    menubar: (menubar as typeof menubar).optional(),
    region: (region as typeof region).optional(),
    dataTable: (dataTable as typeof dataTableShape).optional(),
    tooltip: (tooltip as typeof tooltip).optional(),
    carousel: (carousel as typeof carousel).optional(),
    tabs: (tabs as typeof tabs).optional(),
    fieldset: (fieldset as typeof fieldsetShape).optional(),
    diagram: (diagram as typeof diagram).optional(),
    groupByCountDiagram: (groupByCountDiagram as typeof groupByCountDiagram).optional(),
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
    chip: (chip as typeof chip).optional(),
    customGroupColumnSelector: (customGroupColumnSelector as typeof customGroupColumnSelector).optional(),
    dataListGrid: (dataListGrid as typeof dataListGrid).optional(),
    paginator: (paginator as typeof paginator).optional(),
    skeleton: (skeleton as typeof skeleton).optional(),
    button: (button as typeof button).optional(),
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
    fallbackOrder: z.array(z.enum(['state', 'variant', 'severity'])).default(FALLBACK_ORDER_DEFAULT),
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
  fallbackOrder?: RelaxedAxisKind[]
}

export type ThemeUsageName = keyof UsagesInput
export type ThemeUsageNameWithSettings = {
  [TUsage in ThemeUsageName]: UsageSettingsInput<NonNullable<UsagesInput[TUsage]>> extends never ? never : TUsage
}[ThemeUsageName]
export type ThemeUsageSettings<TUsage extends ThemeUsageNameWithSettings> = UsageSettingsInput<
  NonNullable<UsagesInput[TUsage]>
>

export type ThemeProperties = {
  v2?: ThemePropertiesV2
  v1?: Record<string, Record<string, string>>
}
