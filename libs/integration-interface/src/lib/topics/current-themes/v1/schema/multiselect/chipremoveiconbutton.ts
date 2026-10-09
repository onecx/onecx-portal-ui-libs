/**
 * The chip's remove ('x') icon button. Generic child (Step 3, Option 1): extends the generic
 * button usage's `iconOnly` shape/defaults verbatim (reused directly, like `badge` is reused
 * as-is in `button/color-variant.ts`) rather than reinventing an ad-hoc icon-button shape.
 */
import { buttonIconOnlyDefaults, buttonIconOnlyShape } from '../button/icon-only'

export const multiselectChipRemoveIconShape = buttonIconOnlyShape

export const multiselectChipRemoveIconDefaults = buttonIconOnlyDefaults('defaultVariant')
