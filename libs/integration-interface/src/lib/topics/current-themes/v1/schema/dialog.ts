import * as z from 'zod'
import { bg, bgContrast, border, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

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

export const dialogRootShape = bgContrast.extend({
  bg: z.union([bg, withRef(z.string())]).optional(),
  contrast: color.optional(),
  border: border.optional(),
  radius: withRef(z.string()).optional(),
  shadow: withRef(z.string()).optional(),
})

export const dialogRootDefaults = {
  bg: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
  contrast: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
  border: {
    color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
    style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
    width: '{{primitives.border.width.none}}',
    radius: '{{primitives.border.radius.md}}',
    offset: '{{primitives.border.offset.none}}',
  },
  radius: '{{primitives.radius.md}}',
  shadow: '{{primitives.shadow.md}}',
}

export const dialogRoot = applyDefaultsRecursive(dialogRootShape, dialogRootDefaults).register(themeSchemaRegistry, {
  id: 'dialogRoot',
})

const dialogHeaderShape = z.object({
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  alignItems: withRef(z.string()).optional(),
  justifyContent: withRef(z.string()).optional(),
})

const dialogTitleShape = z.object({
  fontSize: withRef(z.string()).optional(),
  fontWeight: withRef(z.string()).optional(),
})

const dialogContentShape = z.object({
  padding: withRef(z.string()).optional(),
})

const dialogFooterShape = z.object({
  padding: withRef(z.string()).optional(),
  gap: withRef(z.string()).optional(),
  justifyContent: withRef(z.string()).optional(),
})

export const dialogShape = z.object({
  settings: (dialogSettings as typeof dialogSettings).optional(),
  root: dialogRootShape.prefault({}),
  header: dialogHeaderShape.prefault({}),
  title: dialogTitleShape.prefault({}),
  content: dialogContentShape.prefault({}),
  footer: dialogFooterShape.prefault({}),
})

export const dialogDefaults = {
  root: dialogRootDefaults,
  header: {
    padding: '{{primitives.space.md}}',
    gap: '{{primitives.space.sm}}',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '{{primitives.font.size}}',
    fontWeight: '{{primitives.font.weight}}',
  },
  content: {
    padding: '{{primitives.space.md}}',
  },
  footer: {
    padding: '{{primitives.space.md}}',
    gap: '{{primitives.space.sm}}',
    justifyContent: 'flex-end',
  },
}

export const dialog = applyDefaultsRecursive(dialogShape, dialogDefaults).register(themeSchemaRegistry, {
  id: 'dialog',
})
