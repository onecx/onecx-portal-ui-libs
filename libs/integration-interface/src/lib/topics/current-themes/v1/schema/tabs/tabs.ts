import z from "zod"
import { themeSchemaRegistry } from "../registry"
import { bg, color, focusRingShape, withRef } from "../primitives"
import { TabsPanelSchema } from "./panel"
import { TabsViewportSchema } from "./viewport"
import { TabsSettingsSchema } from "./settings"
import { TabsTabListSchema } from "./list"
import { TabsNavButtonSchema } from "./navButton"
import { TabsTabSchema } from "./tab"
  
/**
 * Tabs component schema definition
 */
export class TabsSchema {

  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    color: color.default('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'),
    // Gap between controls/lists elements.
    gap: withRef(z.string()).default('{{primitives.space.md}}'),
    shadow: withRef(z.string()).default('{{primitives.shadow.none}}'),
  }

  static readonly schema = z
    .object({
        settings: (TabsSettingsSchema.schema as typeof TabsSettingsSchema.schema).prefault({}),
        tablist: (TabsTabListSchema.schema as typeof TabsTabListSchema.schema).prefault({}),
        viewport: (TabsViewportSchema.schema as typeof TabsViewportSchema.schema).prefault({}),
        tabpanel: (TabsPanelSchema.schema as typeof TabsPanelSchema.schema).prefault({}),
        navButtons: (TabsNavButtonSchema.schema as typeof TabsNavButtonSchema.schema).prefault({}),
        tab: (TabsTabSchema.schema as typeof TabsTabSchema.schema).prefault({}),
        ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: 'tabs' })
}