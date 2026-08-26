import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { dataListGridSorting } from './data-list-grid-sorting/data-list-grid-sorting'
import { DataListGridSortingFloatLabelSchema } from './data-list-grid-sorting/data-list-grid-sorting-float-label'
import { DataListGridSortingButtonSchema } from './data-list-grid-sorting/data-list-grid-sorting-button'

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

describe('data-list-grid-sorting schema', () => {
  it('parses an empty object', () => {
    const result = dataListGridSorting.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('data-list-grid-sorting root tokens', () => {
    it('should apply defaults', () => {
      const result = dataListGridSorting.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, dataListGridSorting.shape, [])
      expectExactTokens(value, {
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.radius.sm}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        space: '{{primitives.space.md}}',
        floatLabel: expect.any(Object),
        dropdown: expect.any(Object),
        button: expect.any(Object),
      })
    })
  })

  describe('data-list-grid-sorting float-label', () => {
    it('should apply defaults', () => {
      const result = dataListGridSorting.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(
        value?.floatLabel,
        DataListGridSortingFloatLabelSchema.schema.shape,
        []
      )
      expectExactTokens(value?.floatLabel, {
        font: {
          weight: '{{primitives.font.weight}}',
        },
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        focus: expect.any(Object),
        active: expect.any(Object),
      })
    })

    describe('float-label focus state', () => {
      it('should apply defaults', () => {
        const result = dataListGridSorting.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.floatLabel?.focus, {
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        })
      })
    })

    describe('float-label active state', () => {
      it('should apply defaults', () => {
        const result = dataListGridSorting.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.floatLabel?.active, {
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          font: {
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
          border: defaultBorderTokens,
          paddingX: '{{primitives.space.sm}}',
          paddingY: '{{primitives.space.sm}}',
        })
      })
    })
  })

  describe('data-list-grid-sorting button', () => {
    it('should apply defaults', () => {
      const result = dataListGridSorting.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.button, DataListGridSortingButtonSchema.schema.shape, [])
      expectExactTokens(value?.button, {
        border: defaultBorderTokens,
        focusRing: focusRingTokens,
        icon: {
          size: '{{primitives.iconSizes.sm}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          content: '',
          url: '',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('button hover state', () => {
      it('should apply defaults', () => {
        const result = dataListGridSorting.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.button?.hover, {
          border: hoverBorderTokens,
          icon: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('button focus state', () => {
      it('should apply defaults', () => {
        const result = dataListGridSorting.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.button?.focus, {
          border: focusBorderTokens,
          focusRing: focusRingTokens,
        })
      })
    })
  })
})
