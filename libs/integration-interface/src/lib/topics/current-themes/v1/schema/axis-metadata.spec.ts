import * as z from 'zod'
import { deriveLeafAxisMetadata, themeAxisMetadata } from './axis-metadata'
import type { LeafAxisMetadata } from './axis-metadata'
import { themeSchemaRegistry } from './registry'

const find = (meta: LeafAxisMetadata[], path: string): LeafAxisMetadata | undefined => meta.find((m) => m.path === path)

describe('deriveLeafAxisMetadata', () => {
  it('records each branch of a variant group as its own leaf entry', () => {
    const leaf = z.string()
    const variant = z
      .object({
        primary: leaf.optional(),
        secondary: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'variant', kind: 'variant' })
    const root = z.object({ variant })

    const result = deriveLeafAxisMetadata(root)

    expect(result).toHaveLength(2)
    const primary = find(result, 'variant.primary')
    expect(primary?.variants).toEqual(['primary'])
    const secondary = find(result, 'variant.secondary')
    expect(secondary?.variants).toEqual(['secondary'])
    expect(primary).not.toBe(secondary)
  })

  it('records each branch of a state group as its own leaf entry', () => {
    const leaf = z.string()
    const state = z
      .object({
        hover: leaf.optional(),
        active: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'state', kind: 'state' })
    const root = z.object({ state })

    const result = deriveLeafAxisMetadata(root)

    expect(find(result, 'state.hover')?.states).toEqual(['hover'])
    expect(find(result, 'state.active')?.states).toEqual(['active'])
  })

  it('records each branch of a severity group as its own leaf entry', () => {
    const leaf = z.string()
    const severity = z
      .object({
        success: leaf.optional(),
        danger: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'severity', kind: 'severity' })
    const root = z.object({ severity })

    const result = deriveLeafAxisMetadata(root)

    expect(find(result, 'severity.success')?.severities).toEqual(['success'])
    expect(find(result, 'severity.danger')?.severities).toEqual(['danger'])
  })

  it('reports innermost-first group boundaries around a leaf', () => {
    const leaf = z.string()
    const variant = z
      .object({
        primary: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'variant', kind: 'variant' })
    const child = z
      .object({
        variant: variant.optional(),
      })
      .register(themeSchemaRegistry, { id: 'child', kind: 'child' })
    const root = z.object({ child })

    const entry = find(deriveLeafAxisMetadata(root), 'child.variant.primary')

    expect(entry?.groups).toHaveLength(2)
    expect(entry?.groups[0]).toMatchObject({ kind: 'variant', id: 'variant', selected: 'primary' })
    expect(entry?.groups[1]).toMatchObject({ kind: 'child', id: 'child' })
  })

  it('orders a variant group nested inside a state group innermost-first', () => {
    const leaf = z.string()
    const variant = z
      .object({
        primary: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'variant', kind: 'variant' })
    const state = z
      .object({
        hover: variant.optional(),
      })
      .register(themeSchemaRegistry, { id: 'state', kind: 'state' })
    const root = z.object({ state })

    const entry = find(deriveLeafAxisMetadata(root), 'state.hover.primary')

    expect(entry?.groups.map((g) => g.kind)).toEqual(['variant', 'state'])
    expect(entry?.groups[0].id).toBe('variant')
    expect(entry?.groups[0].selected).toBe('primary')
    expect(entry?.groups[1].id).toBe('state')
    expect(entry?.groups[1].selected).toBe('hover')
  })

  it('exposes an independent state group per child of a child group', () => {
    const leaf = z.string()
    const hoverGroup = z
      .object({
        hover: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'hoverGroup', kind: 'state' })
    const focusGroup = z
      .object({
        focus: leaf.optional(),
      })
      .register(themeSchemaRegistry, { id: 'focusGroup', kind: 'state' })
    const container = z
      .object({
        alpha: hoverGroup.optional(),
        beta: focusGroup.optional(),
      })
      .register(themeSchemaRegistry, { id: 'container', kind: 'child' })
    const root = z.object({ container })

    const result = deriveLeafAxisMetadata(root)

    expect(find(result, 'container.alpha.hover')?.states).toEqual(['hover'])
    expect(find(result, 'container.beta.focus')?.states).toEqual(['focus'])
    expect(find(result, 'container.alpha.hover')?.states).not.toContain('focus')
    expect(find(result, 'container.beta.focus')?.states).not.toContain('hover')
  })

  it('leaves all axis arrays empty for a flat object with no kind', () => {
    const root = z.object({ value: z.string() })

    const entry = find(deriveLeafAxisMetadata(root), 'value')

    expect(entry?.variants).toEqual([])
    expect(entry?.states).toEqual([])
    expect(entry?.severities).toEqual([])
    expect(entry?.groups).toEqual([])
  })

  it('terminates on a self-referential object without emitting duplicate leaves', () => {
    const shape: { value?: z.ZodType; self?: z.ZodType } = { value: z.string() }
    const self = z.object(shape)
    shape.self = self

    const result = deriveLeafAxisMetadata(self)

    expect(result).toHaveLength(1)
    expect(result[0].path).toBe('value')
  })

  it('emits a single entry for a leaf wrapped in a scalar union', () => {
    const leaf = z.union([z.enum(['a', 'b']), z.literal(false)])
    const root = z.object({ value: leaf.optional() })

    const result = deriveLeafAxisMetadata(root)

    expect(result).toHaveLength(1)
    expect(result[0].path).toBe('value')
  })
})

describe('themeAxisMetadata', () => {
  it('is a non-empty array of per-leaf entries', () => {
    expect(Array.isArray(themeAxisMetadata)).toBe(true)
    expect(themeAxisMetadata.length).toBeGreaterThan(0)
  })

  it('assigns each variant leaf its own variant name', () => {
    const primary = themeAxisMetadata.find((m) => m.path === 'v2.primitives.variant.primary.bg.color')
    const secondary = themeAxisMetadata.find((m) => m.path === 'v2.primitives.variant.secondary.bg.color')

    expect(primary?.variants).toEqual(['primary'])
    expect(secondary?.variants).toEqual(['secondary'])
  })

  it('records the usages child boundary for table leaves', () => {
    const tableLeaf = themeAxisMetadata.find((m) => m.path.startsWith('v2.usages.table.'))

    expect(tableLeaf).toBeDefined()
    expect(tableLeaf?.groups.some((g) => g.kind === 'child' && g.id === 'usages')).toBe(true)
  })

  it('records its own child boundary for the leaves of every registered root component', () => {
    // Guards against a future component whose root schema is added without the
    // required `.register(..., { kind: 'child' })` marker — that would silently
    // drop its component boundary from the derived leaf metadata.
    const rootComponentIds: Record<string, string> = {
      dialog: 'dialog',
      badge: 'badge',
      menubar: 'menubar',
      region: 'region',
      table: 'table',
      tooltip: 'tooltip',
      carousel: 'carousel',
      tabs: 'tabs',
      fieldset: 'fieldset',
      diagram: 'diagram',
      dropdown: 'dropdown',
      toggleswitch: 'toggleswitch',
      textarea: 'textarea',
      picklist: 'picklist',
      calendar: 'calendar',
    }

    for (const [usageName, registeredId] of Object.entries(rootComponentIds)) {
      const leaves = themeAxisMetadata.filter((m) => m.path.startsWith(`v2.usages.${usageName}.`))
      expect(leaves.length).toBeGreaterThan(0)

      // Any leaf that lacks its own component boundary is reported by path so a
      // failure pinpoints exactly which leaf (and which component) is missing it.
      const missingBoundary = leaves
        .filter((leaf) => !leaf.groups.some((g) => g.kind === 'child' && g.id === registeredId))
        .map((leaf) => leaf.path)
      expect(missingBoundary).toEqual([])
    }
  })
})
