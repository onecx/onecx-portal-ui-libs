import { withRef, bg, color, border } from "../primitives"
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { TabsTabSchema } from "./tab"

/**
 * Tabs list content component schema definition. Represents the content area of the tabs list containing tabs.
 */
export class TabsListContentSchema {
  private static readonly listContentBorder = {
    width: "{{primitives.border.width.none}}",
    style: "{{primitives.border.style.solid}}",
    color: "{{primitives.defaultVariant.defaultState.defaultSeverity.border}}",
    offset: "{{primitives.border.offset.none}}",
    radius: "{{primitives.border.radius.sm}}",
  }

  private static readonly tokens = {
    background: z
      .union([bg, withRef(z.string())])
      .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
    gap: withRef(z.string()).default('{{primitives.space.md}}'), 
    border: border.default(this.listContentBorder),
  }

  static readonly schema = z
    .object({
      ...this.tokens,
    })
    .register(themeSchemaRegistry, { id: "tabsListContent" })
}