import * as z from 'zod'
import { themeSchemaRegistry } from '../registry'
import { buttonSeverityGroupDefaults, buttonSeverityGroupShape } from './severity'

/**
 * The interaction-state axis shared by every "stateful" button node (a color variant's
 * own root, and each shape-variant): the severity-less/severity-bearing baseline lives
 * under `defaultState`, and `hover`/`active`/`focus`/`disabled` are flat siblings — each
 * itself a full severity group.
 */
export const buttonStatefulShape = z
  .object({
    defaultState: buttonSeverityGroupShape.prefault({}),
    hover: buttonSeverityGroupShape.prefault({}),
    active: buttonSeverityGroupShape.prefault({}),
    focus: buttonSeverityGroupShape.prefault({}),
    disabled: buttonSeverityGroupShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'buttonStatefulShape' })

/**
 * Builds the defaults for a full stateful node, referencing
 * `primitives.<colorPrefix>.defaultState...` / `primitives.<colorPrefix>.state.<name>...`.
 */
export function buttonStatefulDefaults(
  colorPrefix: string,
  radius = '{{primitives.radius.md}}',
  shadow = '{{primitives.shadow.none}}'
) {
  return {
    defaultState: buttonSeverityGroupDefaults(colorPrefix, 'defaultState', radius, shadow),
    hover: buttonSeverityGroupDefaults(colorPrefix, 'state.hover', radius, shadow),
    active: buttonSeverityGroupDefaults(colorPrefix, 'state.active', radius, shadow),
    focus: buttonSeverityGroupDefaults(colorPrefix, 'state.focus', radius, shadow),
    disabled: buttonSeverityGroupDefaults(colorPrefix, 'state.disabled', radius, shadow),
  }
}
