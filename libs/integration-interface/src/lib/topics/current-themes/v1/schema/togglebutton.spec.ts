import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  togglebutton,
  togglebuttonSettings,
  hoverTogglebuttonTokens,
  focusTogglebuttonTokens,
  disabledTogglebuttonTokens,
  invalidTogglebuttonTokens,
  checkedTogglebuttonTokens,
  smTogglebuttonTokens,
  lgTogglebuttonTokens,
  iconTogglebuttonTokens,
  contentTogglebuttonTokens,
} from './togglebutton'

describe('togglebutton schema', () => {
  it('parses an empty object', () => {
    const result = togglebutton.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('togglebutton tokens', () => {
    it('should apply defaults and auto-populate states with prefault', () => {
      const result = togglebutton.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      // With prefault, states should be auto-populated
      expect(value?.hover).toBeDefined()
      expect(value?.focus).toBeDefined()
      expect(value?.disabled).toBeDefined()
      expect(value?.invalid).toBeDefined()
      expect(value?.checked).toBeDefined()
      expect(value?.sm).toBeDefined()
      expect(value?.lg).toBeDefined()
      expect(value?.icon).toBeDefined()
      expect(value?.content).toBeDefined()

      expectExactUndefinedTokens(value, togglebutton.shape, ['settings'])

      // Check root level tokens (excluding states)
      expect(value?.paddingX).toEqual('{{primitives.space.sm}}')
      expect(value?.paddingY).toEqual('{{primitives.space.xs}}')
      expect(value?.gap).toEqual('{{primitives.space.xs}}')
      expectExactTokens(value?.font, {
        family: '{{primitives.font.family}}',
        size: '{{primitives.font.size}}',
        weight: '{{primitives.font.weight}}',
        lineHeight: '{{primitives.font.lineHeight}}',
        letterSpacing: '{{primitives.font.letterSpacing}}',
        style: '{{primitives.font.style}}',
      })
      expectExactTokens(value?.border, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
        width: '{{primitives.border.width.sm}}',
        offset: '{{primitives.border.offset.sm}}',
        radius: '{{primitives.border.radius.md}}',
      })
      expect(value?.transitionDuration).toEqual('{{primitives.transition.duration}}')
      expect(value?.background).toEqual('{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}')
      expect(value?.color).toEqual('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')
      expectExactTokens(value?.focusRing, {
        width: '{{primitives.focusRing.width.md}}',
        style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
        offset: '{{primitives.focusRing.offset.md}}',
        radius: '{{primitives.focusRing.radius.md}}',
        shadow: '{{primitives.focusRing.shadow.none}}',
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.hover, {
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.focus, {
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('disabled state', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.disabled, {
          background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('invalid state', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.invalid, {
          background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('checked variant', () => {
      it('should apply defaults with nested states auto-populated', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.checked, checkedTogglebuttonTokens.shape, [])

        // Check root tokens
        expect(value?.checked?.background).toEqual('{{primitives.variant.primary.defaultState.defaultSeverity.bg}}')
        expect(value?.checked?.color).toEqual('{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}')
        expectExactTokens(value?.checked?.border, {
          color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.sm}}',
          radius: '{{primitives.border.radius.md}}',
        })

        // Nested states should also be auto-populated
        expect(value?.checked?.hover).toBeDefined()
        expect(value?.checked?.focus).toBeDefined()
        expect(value?.checked?.disabled).toBeDefined()
        expect(value?.checked?.invalid).toBeDefined()
      })

      describe('checked hover state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.checked?.hover, {
            background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('checked focus state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.checked?.focus, {
            background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('checked disabled state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.checked?.disabled, {
            background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('checked invalid state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.checked?.invalid, {
            background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })
    })

    describe('size variant sm', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.sm, {
          font: {
            size: '{{primitives.font.size.sm}}',
          },
          paddingX: '{{primitives.space.xs}}',
          paddingY: '{{primitives.space.xxs}}',
        })
      })
    })

    describe('size variant lg', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.lg, {
          font: {
            size: '{{primitives.font.size.lg}}',
          },
          paddingX: '{{primitives.space.md}}',
          paddingY: '{{primitives.space.sm}}',
        })
      })
    })

    describe('icon child-element', () => {
      it('should apply defaults with nested states auto-populated', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.icon, iconTogglebuttonTokens.shape, [])
        expect(value?.icon?.color).toEqual('{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}')

        // Nested states should be auto-populated
        expect(value?.icon?.hover).toBeDefined()
        expect(value?.icon?.focus).toBeDefined()
        expect(value?.icon?.disabled).toBeDefined()
        expect(value?.icon?.checked).toBeDefined()
      })

      describe('icon hover state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.icon?.hover, {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          })
        })
      })

      describe('icon focus state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.icon?.focus, {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          })
        })
      })

      describe('icon disabled state', () => {
        it('should apply defaults', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.icon?.disabled, {
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          })
        })
      })

      describe('icon checked variant', () => {
        it('should apply defaults with nested states auto-populated', () => {
          const result = togglebutton.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expect(value?.icon?.checked?.color).toEqual(
            '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}'
          )

          // Nested checked states should be auto-populated
          expect(value?.icon?.checked?.hover).toBeDefined()
          expect(value?.icon?.checked?.focus).toBeDefined()
          expect(value?.icon?.checked?.disabled).toBeDefined()
        })

        describe('icon checked hover state', () => {
          it('should apply defaults', () => {
            const result = togglebutton.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.icon?.checked?.hover, {
              color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            })
          })
        })

        describe('icon checked focus state', () => {
          it('should apply defaults', () => {
            const result = togglebutton.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.icon?.checked?.focus, {
              color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            })
          })
        })

        describe('icon checked disabled state', () => {
          it('should apply defaults', () => {
            const result = togglebutton.safeParse({})

            expect(result.success).toBe(true)

            const value = result.data
            expectExactTokens(value?.icon?.checked?.disabled, {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            })
          })
        })
      })
    })

    describe('content child-element', () => {
      it('should apply defaults', () => {
        const result = togglebutton.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.content, contentTogglebuttonTokens.shape, [])
        expectExactTokens(value?.content, {
          paddingX: '0',
          paddingY: '0',
          background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
          border: {
            radius: '{{primitives.border.radius.md}}',
          },
          shadow: '{{primitives.shadow.none}}',
        })
      })
    })
  })
})
