import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { input, inputFilledVariant, inputFilledVariantState, inputFocusRingSchema, inputSize, inputState, inputVariant } from './input'

describe('input schema', () => {
  it('parses an empty object', () => {
    const result = input.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('input tokens', () => {
    it('should apply defaults', () => {
      const result = input.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, input.shape, [])
      expectExactTokens(value, {
        transition: {
          duration: '{{primitives.transition.duration}}',
        },
        defaultVariant: expect.any(Object),
        variants: expect.any(Object),
      })
    })

    describe('defaultVariant', () => {
      it('should apply defaults', () => {
        const result = input.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.defaultVariant, inputVariant.shape, [])
        expectExactTokens(value?.defaultVariant, {
          font: {
            weight: '{{primitives.font.weight}}',
            size: '{{primitives.font.size}}',
          },
          padding: {
            x: '{{primitives.space.md}}',
            y: '{{primitives.space.sm}}',
          },
          border: {
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.sm}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.shadow.sm}}',
          },
          focusRing: {
            width: '{{primitives.focusRing.width}}',
            style: '{{primitives.focusRing.style}}',
            color: '{{primitives.focusRing.color}}',
            offset: '{{primitives.focusRing.offset}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.focusRing.shadow}}',
          },
          defaultState: expect.any(Object),
          hover: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          invalid: expect.any(Object),
          sizes: expect.any(Object),
        })
      })

      describe('defaultState', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.defaultVariant?.defaultState, inputState.shape, [])
          expectExactTokens(value?.defaultVariant?.defaultState, {
            background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
              shadow: '{{primitives.shadow.sm}}',
            },
            placeholder: {
              color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.defaultVariant?.hover, inputState.shape, [])
          expectExactTokens(value?.defaultVariant?.hover, {
            background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
              shadow: '{{primitives.shadow.sm}}',
            },
            placeholder: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.defaultVariant?.focus, inputState.shape, [])
          expectExactTokens(value?.defaultVariant?.focus, {
            background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
              shadow: '{{primitives.shadow.sm}}',
            },
            placeholder: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.defaultVariant?.disabled, inputState.shape, [])
          expectExactTokens(value?.defaultVariant?.disabled, {
            background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
              shadow: '{{primitives.shadow.sm}}',
            },
            placeholder: {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('invalid state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.defaultVariant?.invalid, inputState.shape, [])
          expectExactTokens(value?.defaultVariant?.invalid, {
            background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.sm}}',
              offset: '{{primitives.border.offset.sm}}',
              radius: '{{primitives.border.radius.md}}',
              shadow: '{{primitives.shadow.sm}}',
            },
            placeholder: {
              color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('focusRing', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.defaultVariant?.focusRing, inputFocusRingSchema.shape, [])
          expectExactTokens(value?.defaultVariant?.focusRing, {
            width: '{{primitives.focusRing.width}}',
            style: '{{primitives.focusRing.style}}',
            color: '{{primitives.focusRing.color}}',
            offset: '{{primitives.focusRing.offset}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.focusRing.shadow}}',
          })
        })
      })

      describe('sizes', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactTokens(value?.defaultVariant?.sizes, {
            sm: {
              fontSize: '{{primitives.font.size}}',
              padding: {
                x: '{{primitives.space.sm}}',
                y: '{{primitives.space.xs}}',
              },
            },
            lg: {
              fontSize: '{{primitives.font.size}}',
              padding: {
                x: '{{primitives.space.lg}}',
                y: '{{primitives.space.md}}',
              },
            },
          })

          expectExactUndefinedTokens(value?.defaultVariant?.sizes?.sm, inputSize.shape, [])
          expectExactUndefinedTokens(value?.defaultVariant?.sizes?.lg, inputSize.shape, [])
        })
      })
    })

    describe('filled variant', () => {
      it('should apply defaults', () => {
        const result = input.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.variants?.filled, inputFilledVariant.shape, [])
        expectExactTokens(value?.variants?.filled, {
          defaultState: {
            background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
            },
          },
          hover: {
            background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            },
          },
          focus: {
            background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            },
          },
          disabled: {
            background: '{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
            },
          },
          invalid: {
            background: '{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
            },
          },
        })
      })

      describe('defaultState', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.variants?.filled?.defaultState, inputFilledVariantState.shape, [])
        })
      })
    })
  })
})
