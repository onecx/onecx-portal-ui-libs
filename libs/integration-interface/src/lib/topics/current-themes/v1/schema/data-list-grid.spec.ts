import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { dataListGrid } from './data-list-grid/data-list-grid'
import { DataListGridItemCardSchema } from './data-list-grid/data-list-grid-item-card'
import { DataListGridItemRowSchema } from './data-list-grid/data-list-grid-item-row'

const defaultBorderTokens = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const hoverBorderTokens = {
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const focusBorderTokens = {
  color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const focusRingTokens = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.none}}',
  radius: '{{primitives.focusRing.radius.none}}',
  offset: '{{primitives.focusRing.offset.none}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

describe('data-list-grid schema', () => {
  it('parses an empty object', () => {
    const result = dataListGrid.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('data-list-grid root tokens', () => {
    it('should apply defaults', () => {
      const result = dataListGrid.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, dataListGrid.shape, [])
      expectExactTokens(value, {
        border: defaultBorderTokens,
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        justifyContent: 'flex-start',
        itemCard: expect.any(Object),
        itemRow: expect.any(Object),
      })
    })
  })

  describe('data-list-grid item-card', () => {
    it('should apply defaults', () => {
      const result = dataListGrid.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.itemCard, DataListGridItemCardSchema.schema.shape, [])
      expectExactTokens(value?.itemCard, {
        border: defaultBorderTokens,
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        gap: '{{primitives.space.sm}}',
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('item-card hover state', () => {
      it('should apply defaults', () => {
        const result = dataListGrid.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.itemCard?.hover, {
          border: hoverBorderTokens,
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        })
      })
    })

    describe('item-card focus state', () => {
      it('should apply defaults', () => {
        const result = dataListGrid.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.itemCard?.focus, {
          border: focusBorderTokens,
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          focusRing: focusRingTokens,
        })
      })
    })
  })

  describe('data-list-grid item-row', () => {
    it('should apply defaults', () => {
      const result = dataListGrid.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.itemRow, DataListGridItemRowSchema.schema.shape, [])
      expectExactTokens(value?.itemRow, {
        border: defaultBorderTokens,
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        gap: '{{primitives.space.sm}}',
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('item-row hover state', () => {
      it('should apply defaults', () => {
        const result = dataListGrid.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.itemRow?.hover, {
          border: hoverBorderTokens,
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        })
      })
    })

    describe('item-row focus state', () => {
      it('should apply defaults', () => {
        const result = dataListGrid.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.itemRow?.focus, {
          border: focusBorderTokens,
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          focusRing: focusRingTokens,
        })
      })
    })
  })
})
