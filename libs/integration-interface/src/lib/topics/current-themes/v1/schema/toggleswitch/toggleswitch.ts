import * as z from 'zod'
import { withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { toggleSwitchSliderShape, toggleSwitchSliderDefaults } from './slider'

const toggleSwitchStateShape = z.object({
  slider: toggleSwitchSliderShape.prefault({}),
})

// The keys are the switch's named states; the per-state content (slider) stays unmarked so its
// tokens fall back within the enclosing variant's state scope.
const toggleSwitchVariantShape = z
  .object({
    defaultState: toggleSwitchStateShape.prefault({}),
    hover: toggleSwitchStateShape.prefault({}),
    disabled: toggleSwitchStateShape.prefault({}),
    invalid: toggleSwitchStateShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'toggleSwitchVariantShape', axis: 'state' })

const toggleSwitchSettingsShape = z
  .object({
    autoload: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'toggleSwitchSettingsShape', axis: 'setting' })

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
      background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
      border: {
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
      },
    },
  },
  disabled: {
    slider: {
      background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
      handle: {
        background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
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

// The root's keys are the switch's variants (`defaultVariant`, `checked`); `settings` opts out.
// The marker sits on the final export because `applyDefaultsRecursive` rebuilds the root object
// fresh, so a marker registered on `toggleSwitchShape` would be discarded.
export const toggleswitch = applyDefaultsRecursive(toggleSwitchShape, toggleswitchDefaults).register(
  themeSchemaRegistry,
  { id: 'toggleswitch', axis: 'variant' }
)