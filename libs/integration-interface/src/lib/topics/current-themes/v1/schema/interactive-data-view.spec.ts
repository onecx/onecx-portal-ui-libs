import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { interactiveDataView } from './interactive-data-view'
import { InteractiveDataViewSchema } from './interactive-data-view/interactive-data-view'
import { FilterViewSchema } from './interactive-data-view/filter-view'
import { FilterViewChipSchema } from './interactive-data-view/filter-view-chip'
import { FilterViewChipRemoveIconButtonSchema } from './interactive-data-view/filter-view-chip-remove-icon-button'
import { DataViewSchema } from './interactive-data-view/data-view'
import { DataViewContentSchema } from './interactive-data-view/data-view-content'
import { CustomGroupColumnSelectorSchema } from './interactive-data-view/custom-group-column-selector'
import { CustomGroupColumnSelectorSkeletonSchema } from './interactive-data-view/custom-group-column-selector-skeleton'

describe('interactive-data-view schema', () => {
  it('parses an empty object', () => {
    const result = interactiveDataView.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('root tokens', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, InteractiveDataViewSchema.schema.shape, [])
      expectExactTokens(value, {
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          width: '{{primitives.border.width.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        settings: expect.any(Object),
        filterView: expect.any(Object),
        dataListGridSorting: expect.any(Object),
        dataView: expect.any(Object),
        customGroupColumnSelector: expect.any(Object),
      })
    })
  })

  describe('settings', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.settings, {
        emptyResultsMessage: '',
        sortDirection: 'NONE',
        layout: 'table',
        paginator: true,
        pageSizes: [10, 25, 50],
        allowSelectAll: true,
        checkboxColumnPosition: 'start',
      })
    })
  })
})

describe('filter-view schema', () => {
  describe('filter-view root tokens', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.filterView, FilterViewSchema.schema.shape, [])
      expectExactTokens(value?.filterView, {
        settings: expect.any(Object),
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.border.radius.none}}',
          offset: '{{primitives.border.offset.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        justifyContent: 'flex-end',
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        chip: expect.any(Object),
      })
    })
  })

  describe('filter-view settings', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.filterView?.settings, {
        filterViewEnabled: false,
        filterViewDisplayMode: 'button',
        maxDisplayedChips: 3,
      })
    })
  })

  describe('filter-view chip', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.filterView?.chip, FilterViewChipSchema.schema.shape, [])
      expectExactTokens(value?.filterView?.chip, {
        settings: expect.any(Object),
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.border.radius.none}}',
          offset: '{{primitives.border.offset.none}}',
        },
        focusRing: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.focusRing.width.none}}',
          radius: '{{primitives.focusRing.radius.none}}',
          offset: '{{primitives.focusRing.offset.none}}',
          shadow: '{{primitives.focusRing.shadow.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.xs}}',
        icon: {
          size: '{{primitives.iconSizes.sm}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          content: '',
          url: '',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
            lineHeight: '{{primitives.font.lineHeight}}',
            letterSpacing: '{{primitives.font.letterSpacing}}',
            style: '{{primitives.font.style}}',
          },
        },
        removeIconButton: expect.any(Object),
        hover: expect.any(Object),
        disabled: expect.any(Object),
      })
    })

    describe('chip settings', () => {
      it('should apply defaults', () => {
        const result = interactiveDataView.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.filterView?.chip?.settings, {
          unstyled: false,
          disabled: false,
          removable: false,
        })
      })
    })

    describe('chip hover state', () => {
      it('should apply defaults', () => {
        const result = interactiveDataView.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.filterView?.chip?.hover, {
          border: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            radius: '{{primitives.border.radius.none}}',
            offset: '{{primitives.border.offset.none}}',
          },
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          cursor: 'pointer',
        })
      })
    })

    describe('chip disabled state', () => {
      it('should apply defaults', () => {
        const result = interactiveDataView.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.filterView?.chip?.disabled, {
          border: {
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            radius: '{{primitives.border.radius.none}}',
            offset: '{{primitives.border.offset.none}}',
          },
          background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          cursor: 'not-allowed',
        })
      })
    })

    describe('chip remove-icon-button', () => {
      it('should apply defaults', () => {
        const result = interactiveDataView.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(
          value?.filterView?.chip?.removeIconButton,
          FilterViewChipRemoveIconButtonSchema.schema.shape,
          []
        )
        expectExactTokens(value?.filterView?.chip?.removeIconButton, {
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            radius: '{{primitives.border.radius.none}}',
            offset: '{{primitives.border.offset.none}}',
          },
          focusRing: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.focusRing.width.none}}',
            radius: '{{primitives.focusRing.radius.none}}',
            offset: '{{primitives.focusRing.offset.none}}',
            shadow: '{{primitives.focusRing.shadow.none}}',
          },
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

      describe('remove-icon-button hover state', () => {
        it('should apply defaults', () => {
          const result = interactiveDataView.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.filterView?.chip?.removeIconButton?.hover, {
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              radius: '{{primitives.border.radius.none}}',
              offset: '{{primitives.border.offset.none}}',
            },
            icon: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('remove-icon-button focus state', () => {
        it('should apply defaults', () => {
          const result = interactiveDataView.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.filterView?.chip?.removeIconButton?.focus, {
            border: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              radius: '{{primitives.border.radius.none}}',
              offset: '{{primitives.border.offset.none}}',
            },
            focusRing: {
              color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
              style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
              width: '{{primitives.focusRing.width.none}}',
              radius: '{{primitives.focusRing.radius.none}}',
              offset: '{{primitives.focusRing.offset.none}}',
              shadow: '{{primitives.focusRing.shadow.none}}',
            },
          })
        })
      })
    })
  })
})

describe('data-view schema', () => {
  describe('data-view root tokens', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.dataView, DataViewSchema.schema.shape, [])
      expectExactTokens(value?.dataView, {
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.border.radius.none}}',
          offset: '{{primitives.border.offset.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        dataListGrid: expect.any(Object),
        dataViewContent: expect.any(Object),
        dataTable: expect.any(Object),
      })
    })
  })

  describe('data-view content', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(
        value?.dataView?.dataViewContent,
        DataViewContentSchema.schema.shape,
        []
      )
      expectExactTokens(value?.dataView?.dataViewContent, {
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.border.radius.none}}',
          offset: '{{primitives.border.offset.none}}',
        },
        focusRing: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.focusRing.width.none}}',
          radius: '{{primitives.focusRing.radius.none}}',
          offset: '{{primitives.focusRing.offset.none}}',
          shadow: '{{primitives.focusRing.shadow.none}}',
        },
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        gap: '{{primitives.space.sm}}',
        justifyContent: 'center',
        alignContent: 'center',
      })
    })
  })
})

describe('custom-group-column-selector schema', () => {
  describe('custom-group-column-selector root tokens', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(
        value?.customGroupColumnSelector,
        CustomGroupColumnSelectorSchema.schema.shape,
        []
      )
      expectExactTokens(value?.customGroupColumnSelector, {
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          radius: '{{primitives.border.radius.none}}',
          offset: '{{primitives.border.offset.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        gap: '{{primitives.space.md}}',
        font: {
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        picklist: expect.any(Object),
        skeleton: expect.any(Object),
      })
    })
  })

  describe('custom-group-column-selector skeleton', () => {
    it('should apply defaults', () => {
      const result = interactiveDataView.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(
        value?.customGroupColumnSelector?.skeleton,
        CustomGroupColumnSelectorSkeletonSchema.schema.shape,
        []
      )
      expectExactTokens(value?.customGroupColumnSelector?.skeleton, {
        border: {
          radius: '{{primitives.border.radius.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        animationBackground: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
      })
    })
  })
})
