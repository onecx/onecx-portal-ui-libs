/**
 * Multiselect component schema.
 *
 * Shape/defaults are separated: `multiselectShape` is a pure (all-optional) shape,
 * `multiselectDefaults` is a plain defaults tree, and `multiselect` applies the defaults via
 * `applyDefaultsRecursive`.
 *
 * `defaultVariant` and `filled` are full siblings sharing `multiselectVariantShape` (the whole
 * `labelContainer`+`overlay` subtree, per Step 3/7 of the theme-schema-audit). Only
 * `labelContainer`'s own leaf tokens actually differ between the two (background/placeholder/
 * icon colors) — `overlay` and everything nested inside it (filter, listItems, ...) is shared
 * by reference and falls back to `defaultVariant` for `filled`.
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { applyDefaultsRecursive } from '../defaults-helper'
import { multiselectSettingsShape } from './settings'
import { multiselectVariantShape } from './variant'
import { multiselectLabelContainerDefaults, multiselectLabelContainerFilledStateDefaults } from './labelcontainer'
import { multiselectOverlayDefaults } from './overlay'

// ------------------------------------------------------------------
// SHAPE — pure, all keys optional, no defaults baked in
// ------------------------------------------------------------------

export const multiselectShape = z
  .object({
    settings: multiselectSettingsShape.optional(),
    defaultVariant: multiselectVariantShape.prefault({}),
    filled: multiselectVariantShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectShape' })

// ------------------------------------------------------------------
// DEFAULTS — plain object mirroring the shape; only keys that should have a
// default are present (the rest resolve via the runtime fallback).
// ------------------------------------------------------------------

const multiselectFilledLabelContainerDefaults = {
  defaultState: multiselectLabelContainerFilledStateDefaults('defaultState'),
  hover: multiselectLabelContainerFilledStateDefaults('hover'),
  focus: multiselectLabelContainerFilledStateDefaults('focus'),
  invalid: multiselectLabelContainerFilledStateDefaults('invalid'),
  disabled: multiselectLabelContainerFilledStateDefaults('disabled'),
}

export const multiselectDefaults = {
  defaultVariant: {
    labelContainer: multiselectLabelContainerDefaults,
    overlay: multiselectOverlayDefaults,
  },
  // Partial override of defaultVariant: only labelContainer's distinct tokens are filled;
  // overlay (and its full subtree) has no filled-specific defaults and falls back to
  // defaultVariant.overlay.
  filled: {
    labelContainer: multiselectFilledLabelContainerDefaults,
  },
}

// ------------------------------------------------------------------
// EXPORT — shape + defaults applied once
// ------------------------------------------------------------------

export const multiselect = applyDefaultsRecursive(multiselectShape, multiselectDefaults).register(themeSchemaRegistry, {
  id: 'multiselect',
  axis: 'variant',
})
