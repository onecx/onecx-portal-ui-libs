import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { dialog, dialogRoot, dialogSettings } from './dialog'

describe('dialog schema', () => {
  it('parses an empty object', () => {
    const result = dialog.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('dialog tokens', () => {
    it('should apply defaults', () => {
      const result = dialog.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, dialog.shape, ['settings'])
      expectExactTokens(value, {
        root: expect.any(Object),
        header: expect.any(Object),
        title: expect.any(Object),
        content: expect.any(Object),
        footer: expect.any(Object),
      })
    })

    describe('root', () => {
      it('should apply defaults', () => {
        const result = dialog.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.root, dialogRoot.shape, [])
        expectExactTokens(value?.root, {
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
        })
      })
    })

    describe('header', () => {
      it('should apply defaults', () => {
        const result = dialog.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.header, dialog.shape.header._def.innerType.shape, [])
        expectExactTokens(value?.header, {
          padding: '{{primitives.space.md}}',
          gap: '{{primitives.space.sm}}',
          alignItems: 'center',
          justifyContent: 'space-between',
        })
      })
    })

    describe('title', () => {
      it('should apply defaults', () => {
        const result = dialog.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.title, dialog.shape.title._def.innerType.shape, [])
        expectExactTokens(value?.title, {
          fontSize: '{{primitives.font.size}}',
          fontWeight: '{{primitives.font.weight}}',
        })
      })
    })

    describe('content', () => {
      it('should apply defaults', () => {
        const result = dialog.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.content, dialog.shape.content._def.innerType.shape, [])
        expectExactTokens(value?.content, {
          padding: '{{primitives.space.md}}',
        })
      })
    })

    describe('footer', () => {
      it('should apply defaults', () => {
        const result = dialog.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.footer, dialog.shape.footer._def.innerType.shape, [])
        expectExactTokens(value?.footer, {
          padding: '{{primitives.space.md}}',
          gap: '{{primitives.space.sm}}',
          justifyContent: 'flex-end',
        })
      })
    })
  })

  describe('dialog settings', () => {
    it('should apply defaults when settings are provided', () => {
      const result = dialog.safeParse({ settings: {} })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.settings, dialogSettings.shape, [
        'closable',
        'closeOnEscape',
        'autoZIndex',
        'baseZIndex',
        'blockScroll',
        'minX',
        'minY',
        'focusOnShow',
        'focusTrap',
        'closeIcon',
        'closeAriaLabel',
        'minimizeIcon',
        'maximizeIcon',
        'draggable',
        'dismissableMask',
        'modal',
        'maximizable',
        'resizable',
      ])
    })

    it('should allow custom settings values', () => {
      const result = dialog.safeParse({
        settings: {
          closable: true,
          modal: true,
          baseZIndex: 999,
          minX: '400px',
        },
      })

      expect(result.success).toBe(true)

      const value = result.data
      expectExactTokens(value?.settings, {
        closable: true,
        modal: true,
        baseZIndex: 999,
        minX: '400px',
      })
    })
  })
})
