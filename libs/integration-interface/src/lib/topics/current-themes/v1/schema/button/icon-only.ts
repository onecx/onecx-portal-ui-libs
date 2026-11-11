import * as z from 'zod'
import { icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { buttonStatefulDefaults, buttonStatefulShape } from './stateful'

/** The icon-only shape variant: a stateful node plus its fixed square `width` and `icon` styling. */
export const buttonIconOnlyShape = buttonStatefulShape
  .extend({
    width: withRef(z.string().register(themeSchemaRegistry, { id: 'buttonIconOnlyWidth', axis: 'none' })).optional(),
    // `icon` reuses the shared `icon` primitive's shape but is re-registered under its own id
    // (via a no-op `.extend({})`, which produces a distinct schema instance) rather than tagging
    // the shared `icon` export itself — tagging the shared export would leak `axis: 'none'` into
    // every other component that reuses it.
    icon: icon.extend({}).register(themeSchemaRegistry, { id: 'buttonIconOnlyIcon', axis: 'none' }).prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonIconOnlyShape', axis: 'state' })

export function buttonIconOnlyDefaults(colorPrefix: string) {
  return {
    ...buttonStatefulDefaults(`${colorPrefix}.variant.iconOnly`),
    icon: {
      color: `{{primitives.${colorPrefix}.variant.iconOnly.defaultState.defaultSeverity.contrast}}`,
      size: '{{primitives.icon.size.sm}}',
    },
  }
}
