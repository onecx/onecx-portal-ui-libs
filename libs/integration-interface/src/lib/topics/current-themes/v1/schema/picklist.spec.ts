import { picklist } from './picklist'

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
      expect(value?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
      expect(value?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
      expect(value?.gap).toBe('{{primitives.space.md}}')
      expect(value?.settings).toBeUndefined()
      expect(value?.panel).toBeDefined()
      expect(value?.sourceControlButtons).toBeDefined()
      expect(value?.transferControlButtons).toBeDefined()
      expect(value?.targetControlButtons).toBeDefined()
    })
  })

  describe('picklist panel', () => {
    it('should apply defaults', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.panel).toBeDefined()
      expect(value?.panel?.header).toBeDefined()
      expect(value?.panel?.items).toBeDefined()
    })

    describe('picklist panel header', () => {
      it('should apply defaults', () => {
        const result = picklist.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expect(value?.panel?.header).toBeDefined()
        expect(value?.panel?.header?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
        expect(value?.panel?.header?.color).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
        expect(value?.panel?.header?.paddingX).toBe('{{primitives.space.md}}')
        expect(value?.panel?.header?.paddingY).toBe('{{primitives.space.sm}}')
        expect(value?.panel?.header?.border.color).toBe(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}'
        )
        expect(value?.panel?.header?.border.style).toBe(
          '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}'
        )
        expect(value?.panel?.header?.border.width).toBe('{{primitives.border.width.sm}}')
        expect(value?.panel?.header?.border.offset).toBe('{{primitives.border.offset.sm}}')
        expect(value?.panel?.header?.border.radius).toBe('{{primitives.border.radius.none}}')
        expect(value?.panel?.header?.font).toStrictEqual({
          weight: '{{primitives.font.weight}}',
        })
      })
    })

    describe('picklist panel items', () => {
      it('should apply defaults', () => {
        const result = picklist.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expect(value?.panel?.items).toBeDefined()
        expect(value?.panel?.items?.background).toBe('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
        expect(value?.panel?.items?.paddingX).toBe('{{primitives.space.sm}}')
        expect(value?.panel?.items?.paddingY).toBe('{{primitives.space.sm}}')
        expect(value?.panel?.items?.gap).toBe('{{primitives.space.none}}')
        expect(value?.panel?.items?.item).toBeDefined()
      })

      describe('picklist panel item', () => {
        it('should apply defaults for default state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expect(value?.panel?.items?.item).toBeDefined()
          expect(value?.panel?.items?.item?.background).toBe(
            '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
          )
          expect(value?.panel?.items?.item?.color).toBe(
            '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}'
          )
          expect(value?.panel?.items?.item?.paddingX).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.paddingY).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.border).toStrictEqual({
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.none}}',
          })
        })

        it('should apply defaults for hover state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expect(value?.panel?.items?.item?.hover).toBeDefined()
          expect(value?.panel?.items?.item?.hover?.background).toBe(
            '{{primitives.defaultVariant.hover.defaultSeverity.bg}}'
          )
          expect(value?.panel?.items?.item?.hover?.color).toBe(
            '{{primitives.defaultVariant.hover.defaultSeverity.contrast}}'
          )
          expect(value?.panel?.items?.item?.hover?.paddingX).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.hover?.paddingY).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.hover?.border).toStrictEqual({
            color: '{{primitives.defaultVariant.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.none}}',
          })
        })

        it('should apply defaults for selected state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expect(value?.panel?.items?.item?.selected).toBeDefined()
          expect(value?.panel?.items?.item?.selected?.background).toBe(
            '{{primitives.primary.selected.defaultSeverity.bg}}'
          )
          expect(value?.panel?.items?.item?.selected?.color).toBe(
            '{{primitives.primary.selected.defaultSeverity.contrast}}'
          )
          expect(value?.panel?.items?.item?.selected?.paddingX).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.selected?.paddingY).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.selected?.border).toStrictEqual({
            color: '{{primitives.primary.selected.defaultSeverity.border.color}}',
            style: '{{primitives.primary.selected.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.none}}',
          })
        })

        it('should apply defaults for focused state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expect(value?.panel?.items?.item?.focused).toBeDefined()
          expect(value?.panel?.items?.item?.focused?.background).toBe(
            '{{primitives.defaultVariant.focused.defaultSeverity.bg}}'
          )
          expect(value?.panel?.items?.item?.focused?.color).toBe(
            '{{primitives.defaultVariant.focused.defaultSeverity.contrast}}'
          )
          expect(value?.panel?.items?.item?.focused?.paddingX).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.focused?.paddingY).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.focused?.border).toStrictEqual({
            color: '{{primitives.defaultVariant.focused.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.focused.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.none}}',
          })
        })

        it('should apply defaults for disabled state', () => {
          const result = picklist.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expect(value?.panel?.items?.item?.disabled).toBeDefined()
          expect(value?.panel?.items?.item?.disabled?.background).toBe(
            '{{primitives.defaultVariant.disabled.defaultSeverity.bg}}'
          )
          expect(value?.panel?.items?.item?.disabled?.color).toBe(
            '{{primitives.defaultVariant.disabled.defaultSeverity.contrast}}'
          )
          expect(value?.panel?.items?.item?.disabled?.paddingX).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.disabled?.paddingY).toBe('{{primitives.space.sm}}')
          expect(value?.panel?.items?.item?.disabled?.border).toStrictEqual({
            color: '{{primitives.defaultVariant.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.none}}',
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
    expect(value?.sourceControlButtons).toBeDefined()
    expect(value?.transferControlButtons).toBeDefined()
    expect(value?.targetControlButtons).toBeDefined()
  })

  describe('picklist control button', () => {
    it('should apply defaults for source', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.sourceControlButtons).toBeDefined()
    })

    it('should apply defaults for transfer', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.transferControlButtons).toBeDefined()
    })

    it('should apply defaults for target', () => {
      const result = picklist.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expect(value?.targetControlButtons).toBeDefined()
    })
  })
})
