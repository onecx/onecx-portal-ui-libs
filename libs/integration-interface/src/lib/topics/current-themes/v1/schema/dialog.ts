import * as z from 'zod'
import { bg, bgContrast, border, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'

export const dialogSettings = z
  .object({
    closable: withRef(z.boolean()).optional(),
    closeOnEscape: withRef(z.boolean()).optional(),
    autoZIndex: withRef(z.boolean()).optional(),
    baseZIndex: withRef(z.number()).optional(),
    blockScroll: withRef(z.boolean()).optional(),
    minX: withRef(z.string()).optional(),
    minY: withRef(z.string()).optional(),
    focusOnShow: withRef(z.boolean()).optional(),
    focusTrap: withRef(z.boolean()).optional(),
    closeIcon: withRef(z.string()).optional(),
    closeAriaLabel: withRef(z.string()).optional(),
    minimizeIcon: withRef(z.string()).optional(),
    maximizeIcon: withRef(z.string()).optional(),
    draggable: withRef(z.boolean()).optional(),
    dismissableMask: withRef(z.boolean()).optional(),
    modal: withRef(z.boolean()).optional(),
    maximizable: withRef(z.boolean()).optional(),
    resizable: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dialogSettings' })

export const dialogRoot = bgContrast
  .extend({
    bg: z.union([bg, withRef(z.string())]).default('{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'),
    contrast: color.default('{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'),
    border: border.default({
      color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
      style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
      width: '{{primitives.border.width.none}}',
      radius: '{{primitives.border.radius.md}}',
      offset: '{{primitives.border.offset.none}}',
    }),
    radius: withRef(z.string()).default('{{primitives.radius.md}}'),
    shadow: withRef(z.string()).default('{{primitives.shadow.md}}'),
  })
  .register(themeSchemaRegistry, { id: 'dialogRoot' })

export const dialog = z
  .object({
    settings: (dialogSettings as typeof dialogSettings).optional(),
    root: (dialogRoot as typeof dialogRoot).prefault({}),
    header: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.md}}'),
        gap: withRef(z.string()).default('{{primitives.space.sm}}'),
        alignItems: withRef(z.string()).default('center'),
        justifyContent: withRef(z.string()).default('space-between'),
      })
      .prefault({}),
    title: z
      .object({
        fontSize: withRef(z.string()).default('{{primitives.font.size}}'),
        fontWeight: withRef(z.string()).default('{{primitives.font.weight}}'),
      })
      .prefault({}),
    content: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.md}}'),
      })
      .prefault({}),
    footer: z
      .object({
        padding: withRef(z.string()).default('{{primitives.space.md}}'),
        gap: withRef(z.string()).default('{{primitives.space.sm}}'),
        justifyContent: withRef(z.string()).default('flex-end'),
      })
      .prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dialog' })
