import * as z from 'zod'
import { icon, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'
import { buttonStatefulDefaults, buttonStatefulShape } from './stateful'

/** The icon-only shape variant: a stateful node plus its fixed square `width` and `icon` styling. */
export const buttonIconOnlyShape = buttonStatefulShape
  .extend({
    width: withRef(z.string()).optional(),
    icon: icon.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonIconOnlyShape' })

export function buttonIconOnlyDefaults(colorPrefix: string) {
  return {
    ...buttonStatefulDefaults(`${colorPrefix}.variant.iconOnly`),
    icon: {
      color: `{{primitives.${colorPrefix}.variant.iconOnly.defaultState.defaultSeverity.contrast}}`,
      size: '{{primitives.icon.size.sm}}',
    },
  }
}
