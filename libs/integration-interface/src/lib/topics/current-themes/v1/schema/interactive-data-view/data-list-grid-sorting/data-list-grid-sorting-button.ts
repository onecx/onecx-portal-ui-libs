import * as z from 'zod'
import { applyDefaultsRecursive } from '../../defaults-helper'
import { border, icon } from '../../primitives'
import { themeSchemaRegistry } from '../../registry'

const defaultBorderDefaults = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
}

const hoverBorderDefaults = {
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
}

const focusBorderDefaults = {
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
}

// All states of the sorting button share the same token shape (mandatory so the
// theming fallback works across states); they differ only in which tokens carry
// a default.
const dataListGridSortingButtonStateShape = z.object({
  border: border.optional(),
  icon: icon.pick({ color: true }).optional(),
})

export const dataListGridSortingButtonShape = z.object({
  defaultState: dataListGridSortingButtonStateShape.optional(),
  hover: dataListGridSortingButtonStateShape.optional(),
  focus: dataListGridSortingButtonStateShape.optional(),
})

export const dataListGridSortingButtonDefaults = {
  // `icon` is picked to `color` only in the shape, so only `color` carries a
  // default here — size/content/url are not modeled at this level.
  defaultState: {
    border: defaultBorderDefaults,
    icon: {
      color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
    },
  },
  hover: {
    border: hoverBorderDefaults,
    icon: {
      color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
    },
  },
  focus: {
    border: focusBorderDefaults,
  },
}

export const dataListGridSortingButton = applyDefaultsRecursive(
  dataListGridSortingButtonShape,
  dataListGridSortingButtonDefaults
).register(themeSchemaRegistry, { id: 'dataListGridSortingButton' })

export class DataListGridSortingButtonSchema {
  static readonly schema = dataListGridSortingButton
}
