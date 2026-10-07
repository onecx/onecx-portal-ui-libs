import * as z from 'zod'
import { color, font, withRef } from '../primitives'
import { themeSchemaRegistry } from '../registry'

/**
 * Title of the content card — the distinct heading `OcxContentDirective` prepends (id
 * `ocx_content_title_element`) when a `title` is passed. Only color + font differ from the
 * card's own typography, so this is a minimal, specific child: it does not reuse a generic usage.
 */
export const contentTitleShape = z.object({
  color: color.optional(),
  font: font.optional(),
})

export const contentTitleDefaults = {
  color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
  font: {
    family: '{{primitives.font.family}}',
    size: '{{primitives.font.size.lg}}',
    weight: '{{primitives.font.weight.medium}}',
    lineHeight: '{{primitives.font.lineHeight}}',
    letterSpacing: '{{primitives.font.letterSpacing}}',
    style: '{{primitives.font.style}}',
  },
}

// Registered independently (as `contentTitle` was before this refactor) so the registry id is
// preserved for build-time axis introspection.
export const contentTitle = contentTitleShape.register(themeSchemaRegistry, { id: 'contentTitle' })
