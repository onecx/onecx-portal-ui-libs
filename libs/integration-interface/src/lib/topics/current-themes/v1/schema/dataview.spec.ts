import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { dataview } from './dataview'
import { DataviewSchema } from './dataview/dataview'
import { DataviewSettingsSchema } from './dataview/settings'
import { DataviewHeaderSchema } from './dataview/header'
import { DataviewContentSchema } from './dataview/content'
import { DataviewFooterSchema } from './dataview/footer'
import { DataviewPaginatorSchema } from './dataview/paginator'

const border = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
  width: '{{primitives.border.width.none}}',
  radius: '{{primitives.border.radius.none}}',
  offset: '{{primitives.border.offset.none}}',
}

const paginatorBorder = border

const paginatorFocusRing = {
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
  style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
  width: '{{primitives.focusRing.width.none}}',
  radius: '{{primitives.focusRing.radius.none}}',
  offset: '{{primitives.focusRing.offset.none}}',
  shadow: '{{primitives.focusRing.shadow.none}}',
}

const paginatorTokens = {
  border: expect.any(Object),
  focusRing: expect.any(Object),
  background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
  color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
  paddingX: '{{primitives.space.sm}}',
  paddingY: '{{primitives.space.sm}}',
  gap: '{{primitives.space.sm}}',
}

describe('dataview schema', () => {
  it('parses an empty object', () => {
    const result = dataview.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('dataview tokens', () => {
    it('should apply defaults', () => {
      const result = dataview.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, DataviewSchema.schema.shape, ['settings'])
      expectExactTokens(value, {
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        gap: '{{primitives.space.sm}}',
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        border: expect.any(Object),
        header: expect.any(Object),
        content: expect.any(Object),
        footer: expect.any(Object),
      })
    })

    describe('settings', () => {
      it('should apply default settings', () => {
        const result = dataview.safeParse({
          settings: {},
        })

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.settings, DataviewSettingsSchema.schema.shape, [
          'rows',
          'totalRecords',
        ])
        expectExactTokens(value?.settings, {
          paginator: false,
          pageLinks: 5,
          paginatorPosition: 'bottom',
          alwaysShowPaginator: true,
          paginatorDropdownScrollHeight: '200px',
          showCurrentPageReport: false,
          showJumpToPageDropdown: false,
          showFirstLastIcon: true,
          showPageLinks: true,
          lazy: false,
          lazyLoadOnInit: true,
          loading: false,
        })
      })
    })

    describe('border', () => {
      it('should apply defaults', () => {
        const result = dataview.safeParse({})

        expect(result.success).toBe(true)

        expectExactTokens(result.data?.border, border)
      })
    })

    describe('header', () => {
      it('should apply defaults', () => {
        const result = dataview.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.header, DataviewHeaderSchema.schema.shape, [])
        expectExactTokens(value?.header, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          border: expect.any(Object),
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.md}}',
          gap: '{{primitives.space.md}}',
          paginator: expect.any(Object),
        })
      })

      describe('border', () => {
        it('should apply defaults', () => {
          const result = dataview.safeParse({})

          expect(result.success).toBe(true)

          expectExactTokens(result.data?.header?.border, border)
        })
      })

      describe('paginator', () => {
        it('should apply defaults', () => {
          const result = dataview.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.header?.paginator, DataviewPaginatorSchema.schema.shape, [])
          expectExactTokens(value?.header?.paginator, paginatorTokens)
        })

        describe('border', () => {
          it('should apply defaults', () => {
            const result = dataview.safeParse({})

            expect(result.success).toBe(true)

            expectExactTokens(result.data?.header?.paginator?.border, paginatorBorder)
          })
        })

        describe('focusRing', () => {
          it('should apply defaults', () => {
            const result = dataview.safeParse({})

            expect(result.success).toBe(true)

            expectExactTokens(result.data?.header?.paginator?.focusRing, paginatorFocusRing)
          })
        })
      })
    })

    describe('content', () => {
      it('should apply defaults', () => {
        const result = dataview.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.content, DataviewContentSchema.schema.shape, [])
        expectExactTokens(value?.content, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          border: expect.any(Object),
          paddingX: '{{primitives.space.sm}}',
          paddingY: '{{primitives.space.sm}}',
          gap: '{{primitives.space.sm}}',
        })
      })

      describe('border', () => {
        it('should apply defaults', () => {
          const result = dataview.safeParse({})

          expect(result.success).toBe(true)

          expectExactTokens(result.data?.content?.border, border)
        })
      })
    })

    describe('footer', () => {
      it('should apply defaults', () => {
        const result = dataview.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.footer, DataviewFooterSchema.schema.shape, [])
        expectExactTokens(value?.footer, {
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
          border: expect.any(Object),
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.md}}',
          gap: '{{primitives.space.md}}',
          paginator: expect.any(Object),
        })
      })

      describe('border', () => {
        it('should apply defaults', () => {
          const result = dataview.safeParse({})

          expect(result.success).toBe(true)

          expectExactTokens(result.data?.footer?.border, border)
        })
      })

      describe('paginator', () => {
        it('should apply defaults', () => {
          const result = dataview.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.footer?.paginator, DataviewPaginatorSchema.schema.shape, [])
          expectExactTokens(value?.footer?.paginator, paginatorTokens)
        })

        describe('border', () => {
          it('should apply defaults', () => {
            const result = dataview.safeParse({})

            expect(result.success).toBe(true)

            expectExactTokens(result.data?.footer?.paginator?.border, paginatorBorder)
          })
        })

        describe('focusRing', () => {
          it('should apply defaults', () => {
            const result = dataview.safeParse({})

            expect(result.success).toBe(true)

            expectExactTokens(result.data?.footer?.paginator?.focusRing, paginatorFocusRing)
          })
        })
      })
    })
  })
})
