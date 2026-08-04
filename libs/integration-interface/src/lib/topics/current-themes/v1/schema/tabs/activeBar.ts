import z from "zod"
import { bg, withRef, transition } from "../primitives"
import { themeSchemaRegistry } from "../registry"

/**
 * Tabs active bar component schema definition. Represents the active tab indicator for each tab.
 */
export class TabsActiveBarSchema {
    private static readonly tabsActiveBarTransitionTokens = {
        duration: "{{primitives.transition.duration}}",
    }

    private static readonly tokens = {
        background: z
            .union([bg, withRef(z.string())])
            .default('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'),
        height: withRef(z.string()).default("{{primitives.border.width.sm}}"),
        position: withRef(z.enum(['top', 'bottom', 'left', 'right'])).default('bottom'),
        positionOffset: withRef(z.string()).default("{{primitives.space.none}}"),
        transition: transition.default(this.tabsActiveBarTransitionTokens),
        shadow: withRef(z.string()).default("{{primitives.shadow.none}}"),
    }

    static readonly schema = z
        .object({
            ...this.tokens,
        })
        .register(themeSchemaRegistry, { id: 'tabsActiveBar' })
}