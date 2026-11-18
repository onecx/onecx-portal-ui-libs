/**
 * The chip's remove ('x') icon button. Generic child (Step 3, Option 1): extends the generic
 * button usage's `iconOnly` shape/defaults verbatim (reused directly, like `badge` is reused
 * as-is in `button/color-variant.ts`) rather than reinventing an ad-hoc icon-button shape.
 */
import { buttonIconOnlyDefaults, buttonIconOnlyShape } from '../button/icon-only'
import { themeSchemaRegistry } from '../registry'

// Re-registered as a distinct instance (no-op `.extend({})`) so the child boundary does not leak
// into the shared `buttonIconOnlyShape`, which is a plain state node inside the button usage.
export const multiselectChipRemoveIconShape = buttonIconOnlyShape
  .extend({})
  .register(themeSchemaRegistry, { id: 'multiselectChipRemoveIconShape', axis: 'state', child: true })

export const multiselectChipRemoveIconDefaults = buttonIconOnlyDefaults('defaultVariant')
