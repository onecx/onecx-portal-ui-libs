import z from 'zod'
import { breadcrumbs } from './breadcrumbs'
import { bgContrast, border, color, font, icon, variantWithStates, withRef } from './primitives'
import { dropdown } from './dropdown'
import { themeSchemaRegistry } from './registry'

const spacing = z
  .object({
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
  })
  .optional()

const settings = z
  .object({
    mode: withRef(z.enum(['basic', 'advanced'])).optional(),
    showBreadcrumbs: withRef(z.boolean()).optional(),
    manualBreadcrumbs: withRef(z.boolean()).optional(),
    loading: withRef(z.boolean()).optional(),
    disableDefaultActions: withRef(z.boolean()).optional(),
    gridLayoutDesktopColumns: withRef(
      z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(6), z.literal(12)])
    ).optional(),
  })
  .optional()

const header = z
  .object({
    font: font.optional(),
    icons: z
      .object({
        infoIcon: icon.optional(),
      })
      .optional(),
    text: z
      .object({
        title: font.extend({color: color.optional()}).optional(),
        subtitle: font.extend({color: color.optional()}).optional(),
      })
      .optional(),
    color: color.optional(),
    spacing,
  })
  .optional()

const actionButton = icon
  .extend({
    border: border.optional(),
  })
  .optional()

const actionAlignment = z
  .object({
    horizontal: withRef(z.enum(['start', 'center', 'end', 'space-between'])).optional(),
    vertical: withRef(z.enum(['top', 'center', 'bottom'])).optional(),
  })
  .optional()

const headerActions = z
  .object({
    alignment: actionAlignment,
    button: actionButton,
    buttonStates: (variantWithStates as typeof variantWithStates).optional(),
  })
  .optional()

const searchInput = z
  .object({
    container: bgContrast.optional(),
    label: font.optional(),
    value: font.optional(),
    placeholder: font.optional(),
    spacing,
    border: border.optional(),
  })
  .optional()

type ContentInput = {
  panel?: z.input<typeof bgContrast>
  input?: z.input<typeof searchInput>
  dropdown?: z.input<typeof dropdown>
  spacing?: z.input<typeof spacing>
}

const content: z.ZodOptional<z.ZodType<ContentInput>> = z
  .object({
    panel: bgContrast.optional(),
    input: searchInput,
    dropdown: dropdown.optional(),
    spacing,
  })
  .optional()

const basicSearchPanel = z
  .object({
    inputPanel: bgContrast.optional(),
  })
  .optional()

const footerButton = z
  .object({
    button: actionButton,
    states: (variantWithStates as typeof variantWithStates).optional(),
    spacing,
  })
  .optional()

const footerActions = z
  .object({
    alignment: actionAlignment,
    reverseOrder: withRef(z.boolean()).optional(),
    searchButton: footerButton,
    resetButton: footerButton,
    spacing,
  })
  .optional()

type SearchHeaderShape = {
  settings: typeof settings
  breadCrumbs: typeof breadcrumbs
  header: typeof header
  headerActions: typeof headerActions
  content: typeof content
  basicSearchPanel: typeof basicSearchPanel
  footerActions: typeof footerActions
}

const searchHeaderSchema: SearchHeaderShape = {
  settings,
  breadCrumbs: breadcrumbs,
  header,
  headerActions,
  content,
  basicSearchPanel,
  footerActions,
}

export const searchHeader = z
  .object(searchHeaderSchema)
  .optional()
  .register(themeSchemaRegistry, { id: 'searchHeader' })
