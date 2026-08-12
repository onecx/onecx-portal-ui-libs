import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import {
  dropdown,
  input as inputSchema,
  inputHoverState as inputHoverStateSchema,
  inputFocusState as inputFocusStateSchema,
  inputDisabledState as inputDisabledStateSchema,
  inputInvalidState as inputInvalidStateSchema,
  clearIcon as clearIconSchema,
  clearIconSize as clearIconSizeSchema,
  clearIconSizeVariants as clearIconSizeVariantsSchema,
  clearIconHoverState as clearIconHoverStateSchema,
  clearIconFocusState as clearIconFocusStateSchema,
  clearIconDisabledState as clearIconDisabledStateSchema,
  clearIconInvalidState as clearIconInvalidStateSchema,
  panel as panelSchema,
  filter as filterSchema,
  filterHoverState as filterHoverStateSchema,
  filterFocusState as filterFocusStateSchema,
  itemList as itemListSchema,
  itemListHeader as itemListHeaderSchema,
  option as optionSchema,
  optionHoverState as optionHoverStateSchema,
  optionFocusState as optionFocusStateSchema,
  optionDisabledState as optionDisabledStateSchema,
  optionInvalidState as optionInvalidStateSchema,
  checkmark as checkmarkSchema,
  size as sizeSchema,
  dropdownSize as dropdownSizeSchema,
} from './dropdown'

describe('dropdown schema', () => {
  it('parses an empty object', () => {
    const result = dropdown.safeParse({})
    expect(result.success).toBe(true)
  })

  describe('dropdown root tokens', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, dropdown.shape, ['settings'])
      expectExactTokens(value, {
        input: expect.any(Object),
        panel: expect.any(Object),
      })
    })
  })

  // =======================================================================
  // Input (defaultVariant area — the visible input field)
  // =======================================================================
  describe('dropdown input', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.input, inputSchema.shape, [])
      expectExactTokens(value?.input, {
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        paddingX: '{{primitives.space.sm}}',
        paddingY: '{{primitives.space.sm}}',
        border: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        focusRing: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        transition: '{{primitives.transition.duration}}',
        size: expect.any(Object),
        clearIcon: expect.any(Object),
        hover: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        invalid: expect.any(Object),
      })
    })

    // =======================================================================
    // Size variants (sm, md, lg)
    // =======================================================================
    describe('dropdown input size', () => {
      it('should apply defaults', () => {
        const result = dropdown.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.input?.size, sizeSchema.shape, [])
        expectExactTokens(value?.input?.size, {
          sm: expect.any(Object),
          md: expect.any(Object),
          lg: expect.any(Object),
        })
      })

      describe('sm size', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.size?.sm, dropdownSizeSchema.shape, [])
          expectExactTokens(value?.input?.size?.sm, {
            font: {
              size: '{{primitives.font.size}}',
            },
            paddingX: '{{primitives.space.xs}}',
            paddingY: '{{primitives.space.xs}}',
          })
        })
      })

      describe('md size', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.size?.md, dropdownSizeSchema.shape, [])
          expectExactTokens(value?.input?.size?.md, {
            font: {
              size: '{{primitives.font.size}}',
            },
            paddingX: '{{primitives.space.sm}}',
            paddingY: '{{primitives.space.sm}}',
          })
        })
      })

      describe('lg size', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.size?.lg, dropdownSizeSchema.shape, [])
          expectExactTokens(value?.input?.size?.lg, {
            font: {
              size: '{{primitives.font.size}}',
            },
            paddingX: '{{primitives.space.md}}',
            paddingY: '{{primitives.space.md}}',
          })
        })
      })
    })

    describe('input states', () => {
      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.hover, inputHoverStateSchema.shape, [])
          expectExactTokens(value?.input?.hover, {
            background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.focus, inputFocusStateSchema.shape, [])
          expectExactTokens(value?.input?.focus, {
            background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.disabled, inputDisabledStateSchema.shape, [])
          expectExactTokens(value?.input?.disabled, {
            background: '{{primitives.defaultVariant.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.disabled.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('invalid state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.invalid, inputInvalidStateSchema.shape, [])
          expectExactTokens(value?.input?.invalid, {
            background: '{{primitives.defaultVariant.state.invalid.defaultSeverity.bg}}',
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.color}}',
              style: '{{primitives.defaultVariant.state.invalid.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })
    })
  })

  // =======================================================================
  // Clear icon (inside input — defaultVariant area)
  // =======================================================================
  describe('dropdown clear icon', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.input?.clearIcon, clearIconSchema.shape, [])
      expectExactTokens(value?.input?.clearIcon, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        size: expect.any(Object),
        hover: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        invalid: expect.any(Object),
      })
    })

    describe('clear icon size', () => {
      it('should apply defaults', () => {
        const result = dropdown.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.input?.clearIcon?.size, clearIconSizeVariantsSchema.shape, [])
        expectExactTokens(value?.input?.clearIcon?.size, {
          sm: expect.any(Object),
          md: expect.any(Object),
          lg: expect.any(Object),
        })
      })

      describe('sm size', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.size?.sm, clearIconSizeSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.size?.sm, {
            size: '16px',
          })
        })
      })

      describe('md size', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.size?.md, clearIconSizeSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.size?.md, {
            size: '20px',
          })
        })
      })

      describe('lg size', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.size?.lg, clearIconSizeSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.size?.lg, {
            size: '24px',
          })
        })
      })
    })

    describe('clear icon states', () => {
      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.hover, clearIconHoverStateSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.hover, {
            color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.focus, clearIconFocusStateSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.focus, {
            color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.disabled, clearIconDisabledStateSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.disabled, {
            color: '{{primitives.defaultVariant.state.disabled.defaultSeverity.contrast}}',
          })
        })
      })

      describe('invalid state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.input?.clearIcon?.invalid, clearIconInvalidStateSchema.shape, [])
          expectExactTokens(value?.input?.clearIcon?.invalid, {
            color: '{{primitives.defaultVariant.state.invalid.defaultSeverity.contrast}}',
          })
        })
      })
    })
  })

  // =======================================================================
  // Panel (overlay area — dropdown popup)
  // =======================================================================
  describe('dropdown panel', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel, panelSchema.shape, [])
      expectExactTokens(value?.panel, {
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.sm}}',
          shadow: '{{primitives.shadow.sm}}',
        },
        padding: '{{primitives.space.md}}',
        filter: expect.any(Object),
        itemList: expect.any(Object),
      })
    })
  })

  // =======================================================================
  // Filter (inside panel — overlay area)
  // =======================================================================
  describe('dropdown filter', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.filter, filterSchema.shape, [])
      expectExactTokens(value?.panel?.filter, {
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.sm}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
        focusRing: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.radius.md}}',
          shadow: '{{primitives.shadow.none}}',
        },
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('filter states', () => {
      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel?.filter?.hover, filterHoverStateSchema.shape, [])
          expectExactTokens(value?.panel?.filter?.hover, {
            background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel?.filter?.focus, filterFocusStateSchema.shape, [])
          expectExactTokens(value?.panel?.filter?.focus, {
            background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
            border: {
              color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.md}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })
    })
  })

  // =======================================================================
  // Item list (inside panel — overlay area)
  // =======================================================================
  describe('dropdown item list', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.itemList, itemListSchema.shape, [])
      expectExactTokens(value?.panel?.itemList, {
        padding: '{{primitives.space.sm}}',
        gap: '{{primitives.space.none}}',
        header: expect.any(Object),
        option: expect.any(Object),
      })
    })
  })

  // =======================================================================
  // Item list header (inside itemList — overlay area, group separator)
  // =======================================================================
  describe('dropdown item list header', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.itemList?.header, itemListHeaderSchema.shape, [])
      expectExactTokens(value?.panel?.itemList?.header, {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.sm}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '600',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        cursor: 'default',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.none}}',
        },
      })
    })
  })

  // =======================================================================
  // Option (inside itemList — overlay area)
  // =======================================================================
  describe('dropdown option', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.itemList?.option, optionSchema.shape, [])
      expectExactTokens(value?.panel?.itemList?.option, {
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.sm}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
          lineHeight: '{{primitives.font.lineHeight}}',
          letterSpacing: '{{primitives.font.letterSpacing}}',
          style: '{{primitives.font.style}}',
        },
        checkmark: expect.any(Object),
        hover: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        invalid: expect.any(Object),
      })
    })

    describe('option states', () => {
      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel?.itemList?.option?.hover, optionHoverStateSchema.shape, [])
          expectExactTokens(value?.panel?.itemList?.option?.hover, {
            background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel?.itemList?.option?.focus, optionFocusStateSchema.shape, [])
          expectExactTokens(value?.panel?.itemList?.option?.focus, {
            background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
          })
        })
      })

      describe('disabled state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel?.itemList?.option?.disabled, optionDisabledStateSchema.shape, [])
          expectExactTokens(value?.panel?.itemList?.option?.disabled, {
            background: '{{primitives.area.overlay.state.disabled.defaultSeverity.bg}}',
            color: '{{primitives.area.overlay.state.disabled.defaultSeverity.contrast}}',
          })
        })
      })

      describe('invalid state', () => {
        it('should apply defaults', () => {
          const result = dropdown.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(value?.panel?.itemList?.option?.invalid, optionInvalidStateSchema.shape, [])
          expectExactTokens(value?.panel?.itemList?.option?.invalid, {
            background: '{{primitives.area.overlay.state.invalid.defaultSeverity.bg}}',
            color: '{{primitives.area.overlay.state.invalid.defaultSeverity.contrast}}',
          })
        })
      })
    })
  })

  // =======================================================================
  // Checkmark (inside option — overlay area)
  // =======================================================================
  describe('dropdown checkmark', () => {
    it('should apply defaults', () => {
      const result = dropdown.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.itemList?.option?.checkmark, checkmarkSchema.shape, ['size'])
      expectExactTokens(value?.panel?.itemList?.option?.checkmark, {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      })
    })
  })
})
