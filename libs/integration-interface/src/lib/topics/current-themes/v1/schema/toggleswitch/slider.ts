import * as z from 'zod'
import { bg, border, borderWithShadow, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { toggleSwitchHandleShape, toggleSwitchHandleDefaults } from './handle'

export const toggleSwitchSliderShape = z
  .object({
  width: withRef(z.string()).optional(),
  height: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  shadow: withRef(z.string()).optional(),
  transitionDuration: withRef(z.string()).optional(),
  slideDuration: withRef(z.string()).optional(),
  focusRing: borderWithShadow.optional(),
    background: z.union([bg, withRef(z.string())]).optional(),
    border: border.optional(),
    handle: toggleSwitchHandleShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'toggleSwitchSliderShape' })

export const toggleSwitchSliderDefaults = {
  width: '2.5rem',
  height: '1.5rem',
  gap: '{{primitives.layout.gap}}',
  shadow: '{{primitives.shadow.sm}}',
  transitionDuration: '{{primitives.transition.duration}}',
  slideDuration: '{{primitives.transition.duration}}',
  focusRing: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
    width: '{{primitives.focusRing.width}}',
    offset: '{{primitives.focusRing.offset}}',
    radius: '{{primitives.focusRing.radius}}',
    shadow: '{{primitives.focusRing.shadow}}',
  },
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  border: {
    color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.md}}',
    offset: '{{primitives.border.offset.none}}',
    radius: '{{primitives.radius.full}}',
  },
  handle: toggleSwitchHandleDefaults,
}