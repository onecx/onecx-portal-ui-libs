import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { selectbutton, selectbuttonSettings } from './selectbutton'

describe('selectbutton schema', () => {
  it('parses an empty object', () => {
    const result = selectbutton.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('selectbutton tokens', () => {
    it('should apply defaults and auto-populate button with prefault', () => {
      const result = selectbutton.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data

      // Settings should be undefined by default
      expectExactUndefinedTokens(value, selectbutton.shape, ['settings'])

      // Container properties should have defaults
      expect(value?.gap).toEqual('{{primitives.space.xs}}')
      expectExactTokens(value?.border, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.sm}}',
        radius: '{{primitives.border.radius.md}}',
      })

      // Button child element should be auto-populated with togglebutton defaults
      expect(value?.button).toBeDefined()
      expect(value?.button?.paddingX).toBeDefined()
      expect(value?.button?.paddingY).toBeDefined()
      expect(value?.button?.gap).toBeDefined()
      expect(value?.button?.font).toBeDefined()
      expect(value?.button?.border).toBeDefined()
      expect(value?.button?.background).toBeDefined()
      expect(value?.button?.color).toBeDefined()

      // Button should have all togglebutton states
      expect(value?.button?.hover).toBeDefined()
      expect(value?.button?.focus).toBeDefined()
      expect(value?.button?.disabled).toBeDefined()
      expect(value?.button?.invalid).toBeDefined()
      expect(value?.button?.checked).toBeDefined()
      expect(value?.button?.sm).toBeDefined()
      expect(value?.button?.lg).toBeDefined()
      expect(value?.button?.icon).toBeDefined()
      expect(value?.button?.content).toBeDefined()
    })

    describe('settings', () => {
      it('should apply default settings when provided empty object', () => {
        const result = selectbutton.safeParse({
          settings: {},
        })

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.settings, {
          orientation: 'horizontal',
          size: 'md',
        })
      })

      it('should allow orientation to be customized', () => {
        const result = selectbutton.safeParse({
          settings: {
            orientation: 'vertical',
          },
        })

        expect(result.success).toBe(true)
        expect(result.data?.settings?.orientation).toEqual('vertical')
      })

      it('should allow size to be customized', () => {
        const result = selectbutton.safeParse({
          settings: {
            size: 'lg',
          },
        })

        expect(result.success).toBe(true)
        expect(result.data?.settings?.size).toEqual('lg')
      })

      it('should validate orientation enum', () => {
        const result = selectbutton.safeParse({
          settings: {
            orientation: 'diagonal',
          },
        })

        expect(result.success).toBe(false)
      })

      it('should validate size enum', () => {
        const result = selectbutton.safeParse({
          settings: {
            size: 'xl',
          },
        })

        expect(result.success).toBe(false)
      })
    })

    describe('container properties', () => {
      it('should allow gap to be customized', () => {
        const result = selectbutton.safeParse({
          gap: '{{primitives.space.md}}',
        })

        expect(result.success).toBe(true)
        expect(result.data?.gap).toEqual('{{primitives.space.md}}')
      })

      it('should allow border to be customized', () => {
        const result = selectbutton.safeParse({
          border: {
            radius: '{{primitives.border.radius.lg}}',
          },
        })

        expect(result.success).toBe(true)
        expect(result.data?.border?.radius).toEqual('{{primitives.border.radius.lg}}')
      })

      it('should allow primitive references in gap', () => {
        const result = selectbutton.safeParse({
          gap: '0.5rem',
        })

        expect(result.success).toBe(true)
        expect(result.data?.gap).toEqual('0.5rem')
      })
    })

    describe('button child element', () => {
      it('should inherit all togglebutton properties', () => {
        const result = selectbutton.safeParse({})

        expect(result.success).toBe(true)

        const button = result.data?.button

        // Check togglebutton root properties
        expect(button?.paddingX).toEqual('{{primitives.space.sm}}')
        expect(button?.paddingY).toEqual('{{primitives.space.xs}}')
        expect(button?.gap).toEqual('{{primitives.space.xs}}')
        expect(button?.transitionDuration).toEqual('{{primitives.transition.duration}}')
        expect(button?.background).toEqual('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
        expect(button?.color).toEqual('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')

        // Check togglebutton states are populated
        expect(button?.hover?.background).toBeDefined()
        expect(button?.focus?.background).toBeDefined()
        expect(button?.disabled?.background).toBeDefined()
        expect(button?.invalid?.background).toBeDefined()

        // Check togglebutton checked variant
        expect(button?.checked?.background).toBeDefined()
        expect(button?.checked?.hover).toBeDefined()
        expect(button?.checked?.focus).toBeDefined()

        // Check size variants
        expect(button?.sm?.paddingX).toBeDefined()
        expect(button?.lg?.paddingX).toBeDefined()

        // Check child elements
        expect(button?.icon?.color).toBeDefined()
        expect(button?.content?.paddingX).toBeDefined()
      })

      it('should allow customizing button properties', () => {
        const result = selectbutton.safeParse({
          button: {
            paddingX: '{{primitives.space.lg}}',
            paddingY: '{{primitives.space.md}}',
            background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
          },
        })

        expect(result.success).toBe(true)

        const button = result.data?.button
        expect(button?.paddingX).toEqual('{{primitives.space.lg}}')
        expect(button?.paddingY).toEqual('{{primitives.space.md}}')
        expect(button?.background).toEqual('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}')
      })

      it('should allow customizing button hover state', () => {
        const result = selectbutton.safeParse({
          button: {
            hover: {
              background: '{{primitives.variant.secondary.state.hover.defaultSeverity.bg}}',
            },
          },
        })

        expect(result.success).toBe(true)

        const button = result.data?.button
        expect(button?.hover?.background).toEqual('{{primitives.variant.secondary.state.hover.defaultSeverity.bg}}')
      })

      it('should allow customizing button checked state', () => {
        const result = selectbutton.safeParse({
          button: {
            checked: {
              background: '{{primitives.variant.success.defaultState.defaultSeverity.bg}}',
            },
          },
        })

        expect(result.success).toBe(true)

        const button = result.data?.button
        expect(button?.checked?.background).toEqual('{{primitives.variant.success.defaultState.defaultSeverity.bg}}')
      })
    })

    describe('complete customization', () => {
      it('should allow full customization of all properties', () => {
        const result = selectbutton.safeParse({
          settings: {
            orientation: 'vertical',
            size: 'lg',
          },
          gap: '{{primitives.space.md}}',
          border: {
            radius: '{{primitives.border.radius.lg}}',
          },
          button: {
            paddingX: '{{primitives.space.xl}}',
            paddingY: '{{primitives.space.lg}}',
            background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
            hover: {
              background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
            },
            checked: {
              background: '{{primitives.variant.success.defaultState.defaultSeverity.bg}}',
            },
          },
        })

        expect(result.success).toBe(true)

        const value = result.data
        expect(value?.settings?.orientation).toEqual('vertical')
        expect(value?.settings?.size).toEqual('lg')
        expect(value?.gap).toEqual('{{primitives.space.md}}')
        expect(value?.border?.radius).toEqual('{{primitives.border.radius.lg}}')
        expect(value?.button?.paddingX).toEqual('{{primitives.space.xl}}')
        expect(value?.button?.paddingY).toEqual('{{primitives.space.lg}}')
        expect(value?.button?.background).toEqual('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}')
        expect(value?.button?.hover?.background).toEqual(
          '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}'
        )
        expect(value?.button?.checked?.background).toEqual(
          '{{primitives.variant.success.defaultState.defaultSeverity.bg}}'
        )
      })
    })
  })
})
