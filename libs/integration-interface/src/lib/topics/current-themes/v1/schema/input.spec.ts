import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  input,
  inputDisabledState,
  inputFilledDisabledState,
  inputFilledFocusState,
  inputFilledHoverState,
  inputFilledInvalidState,
  inputFilledVariant,
  inputFocusRingSchema,
  inputFocusState,
  inputHoverState,
  inputInvalidState,
  inputSize,
} from './input'

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
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        focusRing: {
          width: '{{primitives.border.width.md}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        placeholder: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        invalid: expect.any(Object),
        sizes: expect.any(Object),
        filled: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = input.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.hover, inputHoverState.shape, [])
        expectExactTokens(value?.hover, {
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
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
        expectExactUndefinedTokens(value?.focus, inputFocusState.shape, [])
        expectExactTokens(value?.focus, {
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
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
        expectExactUndefinedTokens(value?.disabled, inputDisabledState.shape, [])
        expectExactTokens(value?.disabled, {
          background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
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
        expectExactUndefinedTokens(value?.invalid, inputInvalidState.shape, [])
        expectExactTokens(value?.invalid, {
          background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
          color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
            style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
            shadow: '{{primitives.shadow.none}}',
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
        expectExactUndefinedTokens(value?.focusRing, inputFocusRingSchema.shape, [])
        expectExactTokens(value?.focusRing, {
          width: '{{primitives.border.width.md}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        })
      })
    })

    describe('sizes', () => {
      it('should apply defaults', () => {
        const result = input.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactTokens(value?.sizes, {
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

        expectExactUndefinedTokens(value?.sizes?.sm, inputSize.shape, [])
        expectExactUndefinedTokens(value?.sizes?.lg, inputSize.shape, [])
      })
    })

    describe('filled variant', () => {
      it('should apply defaults', () => {
        const result = input.safeParse({})

        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.filled, inputFilledVariant.shape, [])
        expectExactTokens(value?.filled, {
          background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
          placeholder: expect.any(Object),
          hover: expect.any(Object),
          focus: expect.any(Object),
          disabled: expect.any(Object),
          invalid: expect.any(Object),
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.hover, inputFilledHoverState.shape, [])
          expectExactTokens(value?.filled?.hover, {
            background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.focus, inputFilledFocusState.shape, [])
          expectExactTokens(value?.filled?.focus, {
            background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.disabled, inputFilledDisabledState.shape, [])
          expectExactTokens(value?.filled?.disabled, {
            background: '{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
            },
          })
        })
      })

      describe('invalid state', () => {
        it('should apply defaults', () => {
          const result = input.safeParse({})

          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.filled?.invalid, inputFilledInvalidState.shape, [])
          expectExactTokens(value?.filled?.invalid, {
            background: '{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}',
            color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
            placeholder: {
              color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
            },
          })
        })
      })
    })
  })
})
