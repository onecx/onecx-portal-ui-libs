import * as z from 'zod'
import { bg, color, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { tabsSettingsDefaults, tabsSettingsShape } from './settings'
import { tabsListDefaults, tabsListShape } from './list'
import { tabsViewportDefaults, tabsViewportShape } from './viewport'
import { tabsPanelDefaults, tabsPanelShape } from './panel'
import { tabsNavButtonDefaults, tabsNavButtonShape } from './navButton'
import { tabsTabDefaults, tabsTabShape } from './tab'

export const tabsShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  gap: withRef(z.string()).optional(),
  shadow: withRef(z.string()).optional(),
  settings: tabsSettingsShape.prefault({}),
  tablist: tabsListShape.prefault({}),
  viewport: tabsViewportShape.prefault({}),
  tabpanel: tabsPanelShape.prefault({}),
  navButtons: tabsNavButtonShape.prefault({}),
  tab: tabsTabShape.prefault({}),
})

export const tabsDefaults = {
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  gap: '{{primitives.space.md}}',
  shadow: '{{primitives.shadow.none}}',
  settings: tabsSettingsDefaults,
  tablist: tabsListDefaults,
  viewport: tabsViewportDefaults,
  tabpanel: tabsPanelDefaults,
  navButtons: tabsNavButtonDefaults,
  tab: tabsTabDefaults,
}

// The tabs root has no variant axis (no `defaultVariant` key), so it stays unmarked here —
// adding `axis: 'variant'` would spuriously open a root scope. Its children are either settings
// (`settings`/`viewport`, `axis: 'setting'`) or the state-scoped child components `tab`/`navButton`
// (`axis: 'state', child: true`); the static token groups (`tablist`, `tabpanel` and the root
// background/color/gap/shadow) are left unmarked.
export const tabs = applyDefaultsRecursive(tabsShape, tabsDefaults).register(themeSchemaRegistry, {
  id: 'tabs',
})

export class TabsSchema {
  static readonly schema = tabs
}
