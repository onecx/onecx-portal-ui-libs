/**
 * The content shared by `defaultVariant` and `filled` (see `./multiselect.ts`): `labelContainer`
 * and `overlay`. Only the shape is shared here — defaults differ per variant and are composed
 * in `multiselect.ts`.
 */
import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { multiselectLabelContainerShape } from './labelcontainer'
import { multiselectOverlayShape } from './overlay'

export const multiselectVariantShape = z
  .object({
    labelContainer: multiselectLabelContainerShape.prefault({}),
    overlay: multiselectOverlayShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'multiselectVariantShape' })
