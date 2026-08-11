import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { dataTable } from './data-table/data-table'
import { DataTableStylesSchema } from './data-table/data-table-styles'
import { DataTableRowSchema } from './data-table/data-table-row'
import { DataTableRowWithStatesSchema } from './data-table/data-table-row-with-states'
import { DataTableHeaderRowSchema } from './data-table/data-table-header-row'
import { DataTableCellWithStatesSchema } from './data-table/data-table-cell-with-states'
import { DataTableHeaderCellSchema } from './data-table/data-table-header-cell'
import { DataTableSortIconStylesSchema } from './data-table/data-table-icon-styles'
import { DataTableFilterIconStylesSchema } from './data-table/data-table-icon-styles'
import { DataTableColumnTitleSchema } from './data-table/data-table-column-title'

const defaultBorderTokens = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const defaultFontTokens = {
  family: '{{primitives.font.family}}',
  size: '{{primitives.font.size}}',
  weight: '{{primitives.font.weight}}',
  lineHeight: '{{primitives.font.lineHeight}}',
  letterSpacing: '{{primitives.font.letterSpacing}}',
  style: '{{primitives.font.style}}',
}

const hoverBorderTokens = {
  color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const activeBorderTokens = {
  color: '{{primitives.defaultVariant.state.active.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.active.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const selectedBorderTokens = {
  color: '{{primitives.defaultVariant.state.selected.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.state.selected.defaultSeverity.border.style}}',
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

describe('data-table schema', () => {
  it('parses an empty object', () => {
    const result = dataTable.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('data-table tokens', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, dataTable.shape, [])
      expectExactTokens(value, {
        base: expect.any(Object),
        header: expect.any(Object),
        footer: expect.any(Object),
        row: expect.any(Object),
        columnTitle: expect.any(Object),
        settings: expect.any(Object),
      })
    })
  })

  describe('data-table settings', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.settings, {
        checkboxColumnPosition: 'start',
        actionColumnPosition: 'end',
        actionColumnSticky: false,
      })
    })
  })

  describe('data-table base styles', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.base, DataTableStylesSchema.schema.shape, [])
      expectExactTokens(value?.base, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
        border: defaultBorderTokens,
        paddingX: '{{primitives.space.md}}',
        paddingY: '{{primitives.space.md}}',
        font: defaultFontTokens,
        textAlign: 'left',
        borderCollapse: 'separate',
        shadow: '{{primitives.shadow.none}}',
      })
    })
  })

  describe('data-table columnTitle', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.columnTitle, DataTableColumnTitleSchema.schema.shape, [])
      expectExactTokens(value?.columnTitle, {
        font: {
          weight: '{{primitives.font.weight}}',
        },
      })
    })
  })
})

describe('data-table row schema', () => {
  it('should apply defaults', () => {
    const result = dataTable.safeParse({})
    expect(result.success).toBe(true)

    const value = result.data
    expectExactUndefinedTokens(value?.row, DataTableRowSchema.schema.shape, [])
    expectExactTokens(value?.row, {
      background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
      border: defaultBorderTokens,
      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
      font: defaultFontTokens,
      textAlign: 'left',
      height: '2.5rem',
      cell: expect.any(Object),
      odd: expect.any(Object),
      even: expect.any(Object),
      hover: expect.any(Object),
      active: expect.any(Object),
      selected: expect.any(Object),
      focus: expect.any(Object),
    })
  })

  describe('row odd', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.row?.odd, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
      })
    })
  })

  describe('row even', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.row?.even, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
      })
    })
  })

  describe('row hover', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.row?.hover, {
        background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        border: hoverBorderTokens,
      })
    })
  })

  describe('row active', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.row?.active, {
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        border: activeBorderTokens,
      })
    })
  })

  describe('row selected', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.row?.selected, {
        background: '{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
        border: selectedBorderTokens,
      })
    })
  })

  describe('row focus', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.row?.focus, {
        background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        border: focusBorderTokens,
      })
    })
  })

  describe('row cell', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.row?.cell, DataTableCellWithStatesSchema.schema.shape, [])
      expectExactTokens(value?.row?.cell, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
        border: defaultBorderTokens,
        paddingX: '{{primitives.space.md}}',
        paddingY: '{{primitives.space.md}}',
        font: defaultFontTokens,
        textAlign: 'left',
        verticalAlign: 'middle',
        truncate: false,
        hover: expect.any(Object),
        active: expect.any(Object),
        selected: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('cell hover', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.row?.cell?.hover, {
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          border: hoverBorderTokens,
        })
      })
    })

    describe('cell active', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.row?.cell?.active, {
          background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          border: activeBorderTokens,
        })
      })
    })

    describe('cell selected', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.row?.cell?.selected, {
          background: '{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
          border: selectedBorderTokens,
        })
      })
    })

    describe('cell focus', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.row?.cell?.focus, {
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          border: focusBorderTokens,
        })
      })
    })
  })
})

describe('data-table footer (row with states) schema', () => {
  it('should apply defaults', () => {
    const result = dataTable.safeParse({})
    expect(result.success).toBe(true)

    const value = result.data
    expectExactUndefinedTokens(value?.footer, DataTableRowWithStatesSchema.schema.shape, [])
    expectExactTokens(value?.footer, {
      background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
      border: defaultBorderTokens,
      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
      font: defaultFontTokens,
      textAlign: 'left',
      height: '2.5rem',
      cell: expect.any(Object),
      hover: expect.any(Object),
      active: expect.any(Object),
      selected: expect.any(Object),
      focus: expect.any(Object),
    })
  })

  describe('footer hover', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.footer?.hover, {
        background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        border: hoverBorderTokens,
      })
    })
  })

  describe('footer active', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.footer?.active, {
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        border: activeBorderTokens,
      })
    })
  })

  describe('footer selected', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.footer?.selected, {
        background: '{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
        border: selectedBorderTokens,
      })
    })
  })

  describe('footer focus', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.footer?.focus, {
        background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        border: focusBorderTokens,
      })
    })
  })

  describe('footer cell', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.footer?.cell, DataTableCellWithStatesSchema.schema.shape, [])
      expectExactTokens(value?.footer?.cell, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
        border: defaultBorderTokens,
        paddingX: '{{primitives.space.md}}',
        paddingY: '{{primitives.space.md}}',
        font: defaultFontTokens,
        textAlign: 'left',
        verticalAlign: 'middle',
        truncate: false,
        hover: expect.any(Object),
        active: expect.any(Object),
        selected: expect.any(Object),
        focus: expect.any(Object),
      })
    })
  })
})

describe('data-table header row schema', () => {
  it('should apply defaults', () => {
    const result = dataTable.safeParse({})
    expect(result.success).toBe(true)

    const value = result.data
    expectExactUndefinedTokens(value?.header, DataTableHeaderRowSchema.schema.shape, [])
    expectExactTokens(value?.header, {
      background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
      color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
      border: defaultBorderTokens,
      paddingX: '{{primitives.space.md}}',
      paddingY: '{{primitives.space.md}}',
      font: defaultFontTokens,
      textAlign: 'left',
      height: '2.5rem',
      cell: expect.any(Object),
      headerCell: expect.any(Object),
      sortIcons: expect.any(Object),
      filterIcons: expect.any(Object),
      hover: expect.any(Object),
      active: expect.any(Object),
      selected: expect.any(Object),
      focus: expect.any(Object),
    })
  })

  describe('header row hover', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.header?.hover, {
        background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        border: hoverBorderTokens,
      })
    })
  })

  describe('header row active', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.header?.active, {
        background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
        border: activeBorderTokens,
      })
    })
  })

  describe('header row selected', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.header?.selected, {
        background: '{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
        border: selectedBorderTokens,
      })
    })
  })

  describe('header row focus', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.header?.focus, {
        background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
        border: focusBorderTokens,
      })
    })
  })

  describe('header row cell', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header?.cell, DataTableCellWithStatesSchema.schema.shape, [])
      expectExactTokens(value?.header?.cell, {
        background: '{{primitives.area.surface.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.surface.defaultState.defaultSeverity.contrast}}',
        border: defaultBorderTokens,
        paddingX: '{{primitives.space.md}}',
        paddingY: '{{primitives.space.md}}',
        font: defaultFontTokens,
        textAlign: 'left',
        verticalAlign: 'middle',
        truncate: false,
        hover: expect.any(Object),
        active: expect.any(Object),
        selected: expect.any(Object),
        focus: expect.any(Object),
      })
    })
  })

  describe('header row headerCell', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header?.headerCell, DataTableHeaderCellSchema.schema.shape, [])
      expectExactTokens(value?.header?.headerCell, {
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        hover: expect.any(Object),
        selected: expect.any(Object),
      })
    })

    describe('headerCell hover', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.headerCell?.hover, {
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
        })
      })
    })

    describe('headerCell selected', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.headerCell?.selected, {
          background: '{{primitives.defaultVariant.state.selected.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
        })
      })
    })
  })

  describe('header row sortIcons', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header?.sortIcons, DataTableSortIconStylesSchema.schema.shape, [])
      expectExactTokens(value?.header?.sortIcons, {
        icon: {
          size: '{{primitives.icon.sm}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          content: '',
          url: '',
        },
        ascendingIcon: 'onecx:sort-ascending',
        descendingIcon: 'onecx:sort-descending',
        defaultIcon: 'onecx:sort-default',
        hover: expect.any(Object),
        active: expect.any(Object),
        selected: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('sortIcons hover', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.sortIcons?.hover, {
          icon: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('sortIcons active', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.sortIcons?.active, {
          icon: {
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('sortIcons selected', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.sortIcons?.selected, {
          icon: {
            color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('sortIcons focus', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.sortIcons?.focus, {
          icon: {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          },
        })
      })
    })
  })

  describe('header row filterIcons', () => {
    it('should apply defaults', () => {
      const result = dataTable.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.header?.filterIcons, DataTableFilterIconStylesSchema.schema.shape, [])
      expectExactTokens(value?.header?.filterIcons, {
        icon: {
          size: '{{primitives.icon.sm}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          content: '',
          url: '',
        },
        onIcon: 'onecx:filter-on',
        offIcon: 'onecx:filter-off',
        hover: expect.any(Object),
        active: expect.any(Object),
        selected: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('filterIcons hover', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.filterIcons?.hover, {
          icon: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('filterIcons active', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.filterIcons?.active, {
          icon: {
            color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('filterIcons selected', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.filterIcons?.selected, {
          icon: {
            color: '{{primitives.defaultVariant.state.selected.defaultSeverity.contrast}}',
          },
        })
      })
    })

    describe('filterIcons focus', () => {
      it('should apply defaults', () => {
        const result = dataTable.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.header?.filterIcons?.focus, {
          icon: {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          },
        })
      })
    })
  })
})
