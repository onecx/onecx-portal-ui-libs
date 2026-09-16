import * as z from 'zod'
import { bg, border, color, withRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { applyDefaultsRecursive } from './defaults-helper'

export const dialogSettingsShape = z
  .object({
    closable: withRef(z.boolean()).optional(),
    modal: withRef(z.boolean()).optional(),
    draggable: withRef(z.boolean()).optional(),
    resizable: withRef(z.boolean()).optional(),
    dismissableMask: withRef(z.boolean()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dialogSettings' })

export const dialogSettingsDefaults = {
  closable: true,
  modal: false,
  draggable: true,
  resizable: true,
  dismissableMask: false,
}

// TODO: Replace with the generic `button` usage once it exists.
export const dialogButtonShape = z.object({}).register(themeSchemaRegistry, { id: 'dialogButton' })

export const dialogButtonDefaults = {}

export const dialogRootShape = z
  .object({
    bg: z.union([bg, withRef(z.string())]).optional(),
    contrast: color.optional(),
    border: border.optional(),
    radius: withRef(z.string()).optional(),
    shadow: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dialogRootShape' })

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

const dialogHeaderShape = z
  .object({
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    alignItems: withRef(z.string()).optional(),
    justifyContent: withRef(z.string()).optional(),
    closeButton: dialogButtonShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dialogHeaderShape' })

const dialogHeaderDefaults = {
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.sm}}',
  alignItems: 'center',
  justifyContent: 'space-between',
  closeButton: dialogButtonDefaults,
}

const dialogTitleShape = z
  .object({
    fontSize: withRef(z.string()).optional(),
    fontWeight: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dialogTitleShape' })

const dialogTitleDefaults = {
  fontSize: '{{primitives.font.size}}',
  fontWeight: '{{primitives.font.weight}}',
}

const dialogContentShape = z
  .object({
    padding: withRef(z.string()).optional(),
  })
  .register(themeSchemaRegistry, { id: 'dialogContentShape' })

const dialogContentDefaults = {
  padding: '{{primitives.space.md}}',
}

const dialogFooterShape = z
  .object({
    padding: withRef(z.string()).optional(),
    gap: withRef(z.string()).optional(),
    justifyContent: withRef(z.string()).optional(),
    primaryActionButton: dialogButtonShape.prefault({}),
    secondaryActionButton: dialogButtonShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dialogFooterShape' })

const dialogFooterDefaults = {
  padding: '{{primitives.space.md}}',
  gap: '{{primitives.space.sm}}',
  justifyContent: 'flex-end',
  primaryActionButton: dialogButtonDefaults,
  secondaryActionButton: dialogButtonDefaults,
}

export const dialogShape = z
  .object({
    settings: dialogSettingsShape.prefault({}),
    root: dialogRootShape.prefault({}),
    header: dialogHeaderShape.prefault({}),
    title: dialogTitleShape.prefault({}),
    content: dialogContentShape.prefault({}),
    footer: dialogFooterShape.prefault({}),
  })
  .register(themeSchemaRegistry, { id: 'dialogShape' })

export const dialogDefaults = {
  settings: dialogSettingsDefaults,
  root: dialogRootDefaults,
  header: dialogHeaderDefaults,
  title: dialogTitleDefaults,
  content: dialogContentDefaults,
  footer: dialogFooterDefaults,
}

export const dialog = applyDefaultsRecursive(dialogShape, dialogDefaults).register(themeSchemaRegistry, {
  id: 'dialog',
})
