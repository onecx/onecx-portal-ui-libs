import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { toggleSwitchSliderShape, toggleSwitchSliderDefaults } from './slider'

const toggleSwitchStateShape = z.object({
  slider: toggleSwitchSliderShape.prefault({}),
})

const toggleSwitchVariantShape = z.object({
  defaultState: toggleSwitchStateShape.prefault({}),
  hover: toggleSwitchStateShape.prefault({}),
  disabled: toggleSwitchStateShape.prefault({}),
  invalid: toggleSwitchStateShape.prefault({}),
})

const toggleSwitchSettingsShape = z
  .object({
    autoload: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'toggleSwitchSettingsShape' })

export const toggleSwitchShape = z.object({
  settings: toggleSwitchSettingsShape.prefault({}),
  defaultVariant: toggleSwitchVariantShape.prefault({}),
  checked: toggleSwitchVariantShape.prefault({}),
})

const defaultVariantDefaults = {
  defaultState: {
    slider: toggleSwitchSliderDefaults,
  },
  hover: {
    slider: {
      background: '{{primitives.area.surface.state.hover.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.area.surface.state.hover.defaultSeverity.border.color}}',
      },
    },
  },
  disabled: {
    slider: {
      background: '{{primitives.area.surface.state.disabled.defaultSeverity.bg}}',
      handle: {
        background: '{{primitives.area.surface.state.disabled.defaultSeverity.contrast}}',
      },
    },
  },
  invalid: {
    slider: {
      border: {
        color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
      },
    },
  },
}

const checkedDefaults = {
  defaultState: {
    slider: {
      background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
      },
    },
  },
  hover: {
    slider: {
      background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
      },
    },
  },
}

export const toggleswitchDefaults = {
  settings: { autoload: false },
  defaultVariant: defaultVariantDefaults,
  checked: checkedDefaults,
}

export const toggleswitch = applyDefaultsRecursive(toggleSwitchShape, toggleswitchDefaults).register(
  themeSchemaRegistry,
  { id: 'toggleswitch' }
)