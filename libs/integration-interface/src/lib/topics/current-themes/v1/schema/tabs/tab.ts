/**
 * Tabs tab component schema definition
 */
import * as z from 'zod'
import { bg, border, color, focusRingShape, font, icon, withRef } from '../primitives'
import { tooltipDefaults, tooltipShape } from '../tooltip'
import { tabsActiveBarDefaults, tabsActiveBarShape } from './activeBar'

const tabBorderCommonTokens = {
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.none}}',
    offset: '{{primitives.border.offset.none}}',
}

const tabStateShape = z.object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    cursor: withRef(z.string()).optional(),
    border: border.optional(),
    font: font.pick({ weight: true }).optional(),
})

export const tabsTabShape = z.object({
    background: z.union([bg, withRef(z.string())]).optional(),
    color: color.optional(),
    paddingX: withRef(z.string()).optional(),
    paddingY: withRef(z.string()).optional(),
    alignItems: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    icon: icon.optional(),
    activeBar: tabsActiveBarShape.prefault({}),
    tooltip: tooltipShape.prefault({}),
    border: border.optional(),
    focusRing: focusRingShape.optional(),
    hover: tabStateShape.prefault({}),
    focus: tabStateShape.prefault({}),
    active: tabStateShape.prefault({}),
    disabled: tabStateShape.prefault({}),
})

export const tabsTabDefaults = {
    background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    paddingX: '{{primitives.space.md}}',
    paddingY: '{{primitives.space.md}}',
    alignItems: '{{primitives.layout.alignItems}}',
    gap: '{{primitives.space.md}}',
    icon: {
        size: '{{primitives.icon.size.sm}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        font: { weight: '{{primitives.font.weight}}' },
    },
    activeBar: tabsActiveBarDefaults,
    tooltip: tooltipDefaults,
    border: {
        ...tabBorderCommonTokens,
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    },
    focusRing: {
        radius: '{{primitives.focusRing.radius}}',
        offset: '{{primitives.focusRing.offset}}',
        width: '{{primitives.focusRing.width}}',
        shadow: '{{primitives.focusRing.shadow}}',
    },
    hover: {
        background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        cursor: '{{primitives.defaultVariant.state.hover.defaultSeverity.cursor}}',
        border: {
            ...tabBorderCommonTokens,
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
        },
        font: { weight: '{{primitives.font.weight}}' },
    },
    focus: {
        background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        border: {
            ...tabBorderCommonTokens,
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
        },
        font: { weight: '{{primitives.font.weight}}' },
    },
    active: {
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        border: {
            ...tabBorderCommonTokens,
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
        },
        font: { weight: '{{primitives.font.weight}}' },
    },
    disabled: {
        background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
        cursor: '{{primitives.defaultVariant.state.disabled.defaultSeverity.cursor}}',
    },
}
