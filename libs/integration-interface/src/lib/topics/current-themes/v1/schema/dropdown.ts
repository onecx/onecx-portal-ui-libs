import * as z from 'zod'
import { bg, borderWithShadow, color, font, icon, space, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

const dropdownSettingsShape = z.object({
  fluid: withRef(z.boolean()).optional(),
  scrollHeight: withRef(z.string()).optional(),
  filter: withRef(z.boolean()).optional(),
  readonly: withRef(z.boolean()).optional(),
  editable: withRef(z.boolean()).optional(),
  loadingIcon: withRef(z.string()).optional(),
  filterLocale: withRef(z.string()).optional(),
  showClear: withRef(z.boolean()).optional(),
  virtualScroll: withRef(z.boolean()).optional(),
  virtualScrollItemSize: withRef(z.number()).optional(),
  selectOnFocus: withRef(z.boolean()).optional(),
  autoOptionFocus: withRef(z.boolean()).optional(),
})

const dropdownContainerStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: borderWithShadow.optional(),
  focusRing: borderWithShadow.optional(),
  placeholder: z.object({
    color: color.optional(),
  }).optional(),
  invalidPlaceholder: z.object({
    color: color.optional(),
  }).optional(),
  triggerIcon: icon.optional(),
  width: withRef(z.string()).optional(),
  font: font.optional(),
  space: space.optional(),
})

const dropdownContainerVariantShape = z.object({
  defaultState: dropdownContainerStateShape.prefault({}),
  hover: dropdownContainerStateShape.prefault({}),
  focus: dropdownContainerStateShape.prefault({}),
  active: dropdownContainerStateShape.prefault({}),
  disabled: dropdownContainerStateShape.prefault({}),
  invalid: dropdownContainerStateShape.prefault({}),
})

const dropdownContainerShape = z.object({
  defaultVariant: dropdownContainerVariantShape.prefault({}),
  filled: dropdownContainerVariantShape.prefault({}),
})

const dropdownClearStateShape = z.object({
  icon: icon.optional(),
  color: color.optional(),
})

const dropdownClearShape = z.object({
  defaultState: dropdownClearStateShape.prefault({}),
  hover: dropdownClearStateShape.prefault({}),
  focus: dropdownClearStateShape.prefault({}),
  disabled: dropdownClearStateShape.prefault({}),
})

const dropdownOverlayShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: borderWithShadow.optional(),
})

const dropdownListShape = z.object({
  space: space.optional(),
  font: font.optional(),
})

const dropdownOptionStateShape = z.object({
  background: z.union([bg, withRef(z.string())]).optional(),
  color: color.optional(),
  border: borderWithShadow.optional(),
  font: font.optional(),
  padding: withRef(z.string()).optional(),
})

const dropdownOptionShape = z.object({
  defaultState: dropdownOptionStateShape.prefault({}),
  hover: dropdownOptionStateShape.prefault({}),
  focus: dropdownOptionStateShape.prefault({}),
  selected: dropdownOptionStateShape.prefault({}),
  disabled: dropdownOptionStateShape.prefault({}),
  group: z
    .object({
      background: z.union([bg, withRef(z.string())]).optional(),
      color: color.optional(),
      font: font.optional(),
      padding: withRef(z.string()).optional(),
    })
    .prefault({}),
})

const dropdownCheckmarkShape = z.object({
  color: color.optional(),
  space: space.optional(),
})

const dropdownEmptyShape = z.object({
  message: z.object({
    font: font.optional(),
  }).optional(),
  space: space.optional(),
})

export const dropdownShape = z.object({
  settings: dropdownSettingsShape.optional(),
  container: dropdownContainerShape.prefault({}),
  clear: dropdownClearShape.prefault({}),
  overlay: dropdownOverlayShape.prefault({}),
  list: dropdownListShape.prefault({}),
  option: dropdownOptionShape.prefault({}),
  checkmark: dropdownCheckmarkShape.prefault({}),
  empty: dropdownEmptyShape.prefault({}),
})

const dropdownContainerStateTokens = (state: 'defaultState' | 'hover' | 'focus' | 'active' | 'disabled' | 'invalid') => {
  const ref = state === 'defaultState' ? 'defaultState' : `state.${state}`
  return {
    background: `{{primitives.defaultVariant.${ref}.defaultSeverity.bg}}`,
    color: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
    border: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.border.color}}`,
      style: `{{primitives.defaultVariant.${ref}.defaultSeverity.border.style}}`,
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    },
    focusRing: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
      style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
      width: '{{primitives.border.width.md}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.radius.md}}',
      shadow: '{{primitives.shadow.none}}',
    },
    placeholder: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
    },
    invalidPlaceholder: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
    },
    triggerIcon: {
      color: `{{primitives.defaultVariant.${ref}.defaultSeverity.contrast}}`,
      size: '{{primitives.icon.size.sm}}',
      paddingX: '{{primitives.space.sm}}',
      paddingY: '{{primitives.space.sm}}',
    },
    font: {
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    },
    space: {
      sm: '{{primitives.space.sm}}',
      md: '{{primitives.space.md}}',
      lg: '{{primitives.space.lg}}',
    },
    width: '{{primitives.space.xl}}',
  }
}

const dropdownDefaultVariantDefaults = {
  defaultState: dropdownContainerStateTokens('defaultState'),
  hover: dropdownContainerStateTokens('hover'),
  focus: dropdownContainerStateTokens('focus'),
  active: dropdownContainerStateTokens('active'),
  disabled: dropdownContainerStateTokens('disabled'),
  invalid: dropdownContainerStateTokens('invalid'),
}

const dropdownFilledVariantDefaults = (state: 'defaultState' | 'hover' | 'focus' | 'active' | 'disabled' | 'invalid') => ({
  background: `{{primitives.variant.primary.${state}.defaultSeverity.bg}}`,
  color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
  placeholder: {
    color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
  },
  triggerIcon: {
    color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
    size: '{{primitives.icon.size.sm}}',
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  },
})

const dropdownClearStateTokens = (state: 'defaultState' | 'hover' | 'focus' | 'disabled') => ({
  color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
  icon: {
    color: `{{primitives.variant.primary.${state}.defaultSeverity.contrast}}`,
    size: '{{primitives.icon.size.sm}}',
    paddingX: '{{primitives.space.sm}}',
    paddingY: '{{primitives.space.sm}}',
  },
})

const dropdownOptionStateTokens = (
  state: 'defaultState' | 'hover' | 'focus' | 'selected' | 'disabled'
): Record<string, unknown> => {
  const base = state === 'selected' || state === 'focus' ? 'hover' : 'defaultState'
  return {
    background: `{{primitives.area.overlay.${base}.defaultSeverity.bg}}`,
    color: `{{primitives.area.overlay.${base}.defaultSeverity.contrast}}`,
    font: {
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    },
    padding: '{{primitives.space.md}}',
  }
}

export const dropdownDefaults = {
  settings: {
    scrollHeight: '{{primitives.space.xl}}',
  },

  container: {
    defaultVariant: dropdownDefaultVariantDefaults,
    filled: {
      defaultState: dropdownFilledVariantDefaults('defaultState'),
      hover: dropdownFilledVariantDefaults('hover'),
      focus: dropdownFilledVariantDefaults('focus'),
      active: dropdownFilledVariantDefaults('active'),
      disabled: dropdownFilledVariantDefaults('disabled'),
      invalid: dropdownFilledVariantDefaults('invalid'),
    },
  },

  clear: {
    defaultState: dropdownClearStateTokens('defaultState'),
    hover: dropdownClearStateTokens('hover'),
    focus: dropdownClearStateTokens('focus'),
    disabled: dropdownClearStateTokens('disabled'),
  },

  overlay: {
    background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
    border: {
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.sm}}',
      offset: '{{primitives.border.offset.none}}',
      radius: '{{primitives.border.radius.md}}',
      shadow: '{{primitives.shadow.md}}',
    },
  },

  list: {
    space: {
      md: '{{primitives.space.md}}',
      sm: '{{primitives.space.sm}}',
    },
    font: {
      weight: '{{primitives.font.weight}}',
      size: '{{primitives.font.size}}',
    },
  },

  option: {
    defaultState: dropdownOptionStateTokens('defaultState'),
    hover: dropdownOptionStateTokens('hover'),
    focus: dropdownOptionStateTokens('focus'),
    selected: dropdownOptionStateTokens('selected'),
    disabled: dropdownOptionStateTokens('disabled'),
    group: {
      background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      font: {
        weight: '{{primitives.font.weight}}',
        size: '{{primitives.font.size}}',
      },
      padding: '{{primitives.space.md}}',
    },
  },

  checkmark: {
    color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
    space: {
      sm: '{{primitives.space.sm}}',
      md: '{{primitives.space.md}}',
    },
  },

  empty: {
    message: {
      font: {
        weight: '{{primitives.font.weight}}',
        size: '{{primitives.font.size}}',
      },
    },
    space: {
      md: '{{primitives.space.md}}',
    },
  },
}

export const dropdown = applyDefaultsRecursive(dropdownShape, dropdownDefaults).register(themeSchemaRegistry, {
  id: 'dropdown',
})
