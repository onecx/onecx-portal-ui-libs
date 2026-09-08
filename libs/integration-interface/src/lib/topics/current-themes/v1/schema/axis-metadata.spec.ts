import * as z from 'zod'
import { introspectThemeAxisMetadata, themeAxisMetadata } from './axis-metadata'
import { theme } from '../current-themes.schema'
import { colorVariants, severityVariants, stateVariants, themeRef } from './primitives'
import { themeSchemaRegistry } from './registry'
import { MessageSettingsSchema } from './message/settings'

// Leaf paths are rooted at the top-level `theme` schema, which nests the v2 token
// schema under the `v2` key (theme = { v2: themePropertiesV2, v1: record }).
const DEFAULT_STATE_INFO_BG_COLOR = 'v2.primitives.variant.primary.defaultState.severity.info.bg.color'
const HOVER_SUCCESS_BG_COLOR = 'v2.primitives.variant.primary.state.hover.severity.success.bg.color'
const FONT_FAMILY = 'v2.primitives.font.family'
const MESSAGE_CLOSE_WIDTH = 'v2.usages.message.close.width'

describe('schema node marker', () => {
  it('classifies colorVariants as variant', () => {
    const entry = themeSchemaRegistry.get(colorVariants)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('variant')
  })

  it('classifies severityVariants as severity', () => {
    const entry = themeSchemaRegistry.get(severityVariants)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('severity')
  })

  it('classifies stateVariants as state', () => {
    const entry = themeSchemaRegistry.get(stateVariants)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('state')
  })

  it('classifies messageSettings as child', () => {
    const entry = themeSchemaRegistry.get(MessageSettingsSchema.schema)
    expect(entry).toBeDefined()
    expect(entry?.axis).toEqual('child')
  })
})

describe('per-leaf axis metadata', () => {
  const metadata = introspectThemeAxisMetadata(theme)

  it('extracts variant and severity names for a nested color leaf', () => {
    const entry = metadata[DEFAULT_STATE_INFO_BG_COLOR]
    expect(entry.variants).toEqual(['primary'])
    expect(entry.severities).toEqual(['info'])
    expect(entry.states).toEqual([])
  })

  it('extracts variant, state, and severity names for a hover-state leaf', () => {
    const entry = metadata[HOVER_SUCCESS_BG_COLOR]
    expect(entry.variants).toEqual(['primary'])
    expect(entry.states).toEqual(['hover'])
    expect(entry.severities).toEqual(['success'])
  })

  it('produces an empty axis-name set for a leaf outside any axis group', () => {
    const entry = metadata[FONT_FAMILY]
    expect(entry.variants).toEqual([])
    expect(entry.states).toEqual([])
    expect(entry.severities).toEqual([])
    expect(entry.groups).toEqual([])
  })
})

describe('child boundary detection', () => {
  it('records a child group for a leaf nested inside a component sub-schema', () => {
    const metadata = introspectThemeAxisMetadata(theme)
    const entry = metadata[MESSAGE_CLOSE_WIDTH]
    // The `close` sub-schema (messageCloseButton) is the child boundary; the leaf is selected
    // under it, so the boundary's path is the group path and the token key is the member name.
    const childGroup = entry.groups.find((group) => group.kind === 'child' && group.groupPath === MESSAGE_CLOSE_WIDTH.split('.').slice(0, -1).join('.'))
    expect(childGroup).toEqual({ kind: 'child', memberName: 'width', groupPath: 'v2.usages.message.close' })
  })
})

describe('nested axis-group boundary ordering', () => {
  it('orders groups innermost-first across a variant-then-severity path', () => {
    const metadata = introspectThemeAxisMetadata(theme)
    const entry = metadata[HOVER_SUCCESS_BG_COLOR]
    const kinds = entry.groups.map((group) => group.kind)
    const severityIndex = kinds.indexOf('severity')
    const variantIndex = kinds.lastIndexOf('variant')
    expect(severityIndex).toBeLessThan(variantIndex)
  })
})

describe('precomputed export', () => {
  it('matches a fresh introspection of the same schema for a sampled leaf', () => {
    const fresh = introspectThemeAxisMetadata(theme)
    const sampledPath = DEFAULT_STATE_INFO_BG_COLOR
    expect(themeAxisMetadata[sampledPath]).toEqual(fresh[sampledPath])
  })
})

// Edge-case coverage for the introspection walker. These exercise synthetic schemas so the
// `themeRef`-only union and the non-object (record) container branches of `walk` are covered.
describe('introspection edge cases', () => {
  it('treats a themeRef-only union as a leaf', () => {
    // A union whose only members are registered `themeRef` strings has no non-ref concrete
    // member, so the resolver returns the union unchanged and the walker records a leaf.
    const otherRef = z.string().register(themeSchemaRegistry, { id: 'themeRef', axis: 'none' })
    const synthetic = z.object({ leaf: z.union([themeRef, otherRef]) })
    const metadata = introspectThemeAxisMetadata(synthetic)
    expect(metadata['leaf']).toEqual({
      leafPath: 'leaf',
      variants: [],
      states: [],
      severities: [],
      groups: [],
    })
  })

  it('skips free-form record containers without recording a leaf', () => {
    const synthetic = z.object({ v1: z.record(z.string(), z.string()) })
    const metadata = introspectThemeAxisMetadata(synthetic)
    expect(metadata).toEqual({})
  })
})
