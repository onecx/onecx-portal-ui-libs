import { ZodObject } from 'zod'
import {
  expectExactTokens,
  expectExactUndefinedTokens,
  expectTokens,
} from './test-utils'
import { picklist } from './picklist'
import { PicklistPanelSchema } from './picklist/panel'
import { PicklistPanelHeaderSchema } from './picklist/header'
import { PicklistPanelItemsSchema } from './picklist/items'
import { PicklistPanelItemSchema } from './picklist/item'
import { PicklistSchema } from './picklist/picklist'
import { PicklistControlButtonsSchema } from './picklist/controlbuttons'

describe('picklist schema', () => {
  it('parses an empty object', () => {
    const result = picklist.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('picklist tokens', () => {
    it('should apply defaults', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, picklist.shape, ['settings'])
      expectExactTokens(value, {
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        panel: expect.any(Object),
        sourceControlButtons: expect.any(Object),
        transferControlButtons: expect.any(Object),
        targetControlButtons: expect.any(Object),
      })
    })
  })

  describe('picklist panel', () => {
    it('should apply defaults', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel, PicklistPanelSchema.schema.shape, [])
      expectExactTokens(value?.panel, {
        header: expect.any(Object),
        items: expect.any(Object),
      })
    })

    describe('picklist panel header', () => {
      it('should apply defaults', () => {
        const result = picklist.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.panel.header, PicklistPanelHeaderSchema.schema.shape, [])
        expectExactTokens(value?.panel?.header, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.sm}}',
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.none}}',
          },
          font: {
            weight: '{{primitives.font.weight}}',
          },
        })
      })
    })

    describe('picklist panel items', () => {
      it('should apply defaults', () => {
        const result = picklist.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.panel.items, PicklistPanelItemsSchema.schema.shape, [])
        expectExactTokens(value?.panel?.items, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          paddingX: '{{primitives.space.sm}}',
          paddingY: '{{primitives.space.sm}}',
          gap: '{{primitives.space.none}}',
          item: expect.any(Object),
        })
      })

      describe('picklist panel item', () => {
        it('should apply defaults for default state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel.items.item, PicklistPanelItemSchema.schema.shape, [])
          expectExactTokens(value?.panel?.items?.item, {
            background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
            hover: expect.any(Object),
            selected: expect.any(Object),
            focus: expect.any(Object),
            disabled: expect.any(Object),
          })
        })

        it('should apply defaults for hover state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel.items.item.hover, PicklistPanelItemSchema.hoverTokens.shape, [])
          expectExactTokens(value?.panel?.items?.item?.hover, {
            background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })

        it('should apply defaults for selected state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel.items.item.selected, PicklistPanelItemSchema.selectedTokens.shape, [])
          expectExactTokens(value?.panel?.items?.item?.selected, {
            background: '{{primitives.primary.state.selected.defaultSeverity.bg}}',
            color: '{{primitives.primary.state.selected.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.primary.state.selected.defaultSeverity.border.color}}',
              style: '{{primitives.primary.state.selected.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })

        it('should apply defaults for focus state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel.items.item.focus, PicklistPanelItemSchema.focusTokens.shape, [])
          expectExactTokens(value?.panel?.items?.item?.focus, {
            background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })

        it('should apply defaults for disabled state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel.items.item.disabled, PicklistPanelItemSchema.disabledTokens.shape, [])
          expectExactTokens(value?.panel?.items?.item?.disabled, {
            background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
            border: {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.none}}',
            },
          })
        })
      })
    })
  })
})

describe('picklist control buttons', () => {
  it('should apply defaults', () => {
    const result = picklist.safeParse({})

    expect(result.success).toBe(true)

    const value = result.data
    expectExactUndefinedTokens(value, PicklistSchema.schema.shape, ['settings'])
    expectTokens(value, {
      sourceControlButtons: expect.any(Object),
      transferControlButtons: expect.any(Object),
      targetControlButtons: expect.any(Object),
    })
  })

  describe('picklist control button', () => {
    it('should apply defaults for source', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.sourceControlButtons, PicklistControlButtonsSchema.schema.shape, [])
      expect(value?.sourceControlButtons).toBeDefined()
    })

    it('should apply defaults for transfer', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.sourceControlButtons, PicklistControlButtonsSchema.schema.shape, [])
      expect(value?.transferControlButtons).toBeDefined()
    })

    it('should apply defaults for target', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.sourceControlButtons, PicklistControlButtonsSchema.schema.shape, [])
      expect(value?.targetControlButtons).toBeDefined()
    })
  })
})
