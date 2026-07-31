import { expectExactTokens, expectExactUndefinedTokens } from './test-utils'
import { calendar } from './calendar'
import { CalendarInputSchema } from './calendar/input'
import { CalendarInputIconSchema } from './calendar/inputicon'
import { CalendarPanelSchema } from './calendar/panel'
import { CalendarPanelHeaderSchema } from './calendar/panelheader'
import { CalendarDatePanelSchema } from './calendar/datepanel'
import { CalendarPanelButtonSchema } from './calendar/panelbutton'
import { CalendarNavigationSelectorSchema } from './calendar/navigationselector'
import { CalendarPickerCellSchema } from './calendar/pickercell'
import { CalendarTimeInputSchema } from './calendar/timeinput'
import { CalendarTodaySchema } from './calendar/today'
import { CalendarWeekDayLabelSchema } from './calendar/weekdaylabel'
import { CalendarViewSchema } from './calendar/view'
import { CalendarTimeSeperatorSchema } from './calendar/timeseperator'
import { CalendarMultiMonthDividerSchema } from './calendar/multimonthdivider'
import { CalendarFooterButtonBarSchema } from './calendar/footerbuttonbar'

describe('calendar schema', () => {
  it('parses an empty object', () => {
    const result = calendar.safeParse({})

    expect(result.success).toBe(true)
  })

  describe('calendar root tokens', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value, calendar.shape, ['settings', 'timePicker'])
      expectExactTokens(value, {
        transitionDuration: '{{primitives.transition.duration}}',
        input: expect.any(Object),
        panel: expect.any(Object),
        calendarIconButton: expect.any(Object),
        inputCalendarIcon: expect.any(Object),
        timePickerButton: expect.any(Object),
        timeInput: expect.any(Object),
        timeSeparator: expect.any(Object),
        multiMonthDivider: expect.any(Object),
        footerButtonBar: expect.any(Object),
      })
    })
  })

  describe('calendar input', () => {
    it('should apply defaults for default state', () => {
      const result = calendar.safeParse({})

      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.input, CalendarInputSchema.schema.shape, [])
      expectExactTokens(value?.input, {
        padding: '{{primitives.space.md}}',
        shadow: '{{primitives.shadow.md}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
        border: {
          color: '{{primitives.variant.primary.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.variant.primary.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          radius: '{{primitives.border.radius.md}}',
          offset: '{{primitives.border.offset.none}}',
        },
        placeholderColor: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
        focusRing: {
          color: '{{primitives.variant.primary.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.variant.primary.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          shadow: '{{primitives.shadow.none}}',
          radius: '{{primitives.radius.md}}',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
        disabled: expect.any(Object),
        invalid: expect.any(Object),
        sm: expect.any(Object),
        lg: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.input?.hover, CalendarInputSchema.hoverTokens.shape, [])
        expectExactTokens(value?.input?.hover, {
          padding: '{{primitives.space.md}}',
          shadow: '{{primitives.shadow.md}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          background: '{{primitives.variant.primary.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.variant.primary.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.variant.primary.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
          placeholderColor: '{{primitives.variant.primary.state.hover.defaultSeverity.contrast}}',
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.input?.focus, CalendarInputSchema.focusTokens.shape, [])
        expectExactTokens(value?.input?.focus, {
          padding: '{{primitives.space.md}}',
          shadow: '{{primitives.shadow.md}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          background: '{{primitives.variant.primary.state.focus.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.variant.primary.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.variant.primary.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
          placeholderColor: '{{primitives.variant.primary.state.focus.defaultSeverity.contrast}}',
        })
      })
    })

    describe('disabled state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.input?.disabled, CalendarInputSchema.disabledTokens.shape, [])
        expectExactTokens(value?.input?.disabled, {
          padding: '{{primitives.space.md}}',
          shadow: '{{primitives.shadow.md}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          background: '{{primitives.variant.primary.state.disabled.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.color}}',
            style: '{{primitives.variant.primary.state.disabled.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
          placeholderColor: '{{primitives.variant.primary.state.disabled.defaultSeverity.contrast}}',
        })
      })
    })

    describe('invalid state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.input?.invalid, CalendarInputSchema.invalidTokens.shape, [])
        expectExactTokens(value?.input?.invalid, {
          padding: '{{primitives.space.md}}',
          shadow: '{{primitives.shadow.md}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          background: '{{primitives.variant.primary.state.invalid.defaultSeverity.bg}}',
          color: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
          border: {
            color: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.color}}',
            style: '{{primitives.variant.primary.state.invalid.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.md}}',
            radius: '{{primitives.border.radius.md}}',
            offset: '{{primitives.border.offset.none}}',
          },
          placeholderColor: '{{primitives.variant.primary.state.invalid.defaultSeverity.contrast}}',
        })
      })
    })
  })

  describe('calendar input icon', () => {
    it('should apply defaults for default state', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.inputCalendarIcon, CalendarInputIconSchema.schema.shape, [])
      expectExactTokens(value?.inputCalendarIcon, {
        color: '{{primitives.defaultVariant.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}',
        padding: '{{primitives.space.md}}',
        width: '2.5rem',
        height: '2.5rem',
        focusRing: {
          color: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.defaultVariant.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          shadow: '{{primitives.shadow.none}}',
          radius: '{{primitives.radius.md}}',
        },
        hover: expect.any(Object),
        active: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.inputCalendarIcon?.hover, CalendarInputIconSchema.hoverTokens.shape, [])
        expectExactTokens(value?.inputCalendarIcon?.hover, {
          padding: '{{primitives.space.md}}',
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.defaultVariant.state.hover.defaultSeverity.contrast}}',
          background: '{{primitives.defaultVariant.state.hover.defaultSeverity.bg}}',
        })
      })
    })

    describe('active state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.inputCalendarIcon?.active, CalendarInputIconSchema.activeTokens.shape, [])
        expectExactTokens(value?.inputCalendarIcon?.active, {
          padding: '{{primitives.space.md}}',
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.defaultVariant.state.active.defaultSeverity.contrast}}',
          background: '{{primitives.defaultVariant.state.active.defaultSeverity.bg}}',
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.inputCalendarIcon?.focus, CalendarInputIconSchema.focusTokens.shape, [])
        expectExactTokens(value?.inputCalendarIcon?.focus, {
          padding: '{{primitives.space.md}}',
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.defaultVariant.state.focus.defaultSeverity.contrast}}',
          background: '{{primitives.defaultVariant.state.focus.defaultSeverity.bg}}',
        })
      })
    })
  })

  describe('calendar panel', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel, CalendarPanelSchema.schema.shape, [])
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
        headerGap: '{{primitives.space.sm}}',
        header: expect.any(Object),
        datePanel: expect.any(Object),
      })
    })

    describe('panel header', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.panel?.header, CalendarPanelHeaderSchema.schema.shape, [])
        expectExactTokens(value?.panel?.header, {
          background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
          padding: '{{primitives.space.md}}',
          margin: '{{primitives.space.md}}',
          gap: '{{primitives.space.sm}}',
          selectMonth: expect.any(Object),
          selectYear: expect.any(Object),
          navButton: expect.any(Object),
        })
      })
    })

    describe('date panel', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.panel?.datePanel, CalendarDatePanelSchema.schema.shape, [])
        expectExactTokens(value?.panel?.datePanel, {
          background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
          padding: '{{primitives.space.md}}',
          margin: '{{primitives.space.md}}',
          weekDayLabel: expect.any(Object),
          dayView: expect.any(Object),
          dateCell: expect.any(Object),
          monthView: expect.any(Object),
          monthCell: expect.any(Object),
          yearView: expect.any(Object),
          yearCell: expect.any(Object),
          today: expect.any(Object),
        })
      })
    })
  })

  describe('calendar panel button', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.calendarIconButton, CalendarPanelButtonSchema.schema.shape, [])
      expectExactTokens(value?.calendarIconButton, {
        width: '2.5rem',
        height: '2.5rem',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
        focusRing: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          shadow: '{{primitives.shadow.none}}',
          radius: '{{primitives.radius.md}}',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.calendarIconButton?.hover, CalendarPanelButtonSchema.hoverTokens.shape, [])
        expectExactTokens(value?.calendarIconButton?.hover, {
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
          border: {
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.calendarIconButton?.focus, CalendarPanelButtonSchema.focusTokens.shape, [])
        expectExactTokens(value?.calendarIconButton?.focus, {
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
          border: {
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })
  })

  describe('calendar navigation selector', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.header?.selectMonth, CalendarNavigationSelectorSchema.schema.shape, [])
      expectExactTokens(value?.panel?.header?.selectMonth, {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        padding: '{{primitives.space.sm}}',
        font: {
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
        focusRing: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          shadow: '{{primitives.shadow.none}}',
          radius: '{{primitives.radius.md}}',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(
          value?.panel?.header?.selectMonth?.hover,
          CalendarNavigationSelectorSchema.hoverTokens.shape,
          []
        )
        expectExactTokens(value?.panel?.header?.selectMonth?.hover, {
          background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
          padding: '{{primitives.space.sm}}',
          font: {
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          border: {
            color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(
          value?.panel?.header?.selectMonth?.focus,
          CalendarNavigationSelectorSchema.focusTokens.shape,
          []
        )
        expectExactTokens(value?.panel?.header?.selectMonth?.focus, {
          color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
          padding: '{{primitives.space.sm}}',
          font: {
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          border: {
            color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })
  })

  describe('calendar picker cell', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.datePanel?.dateCell, CalendarPickerCellSchema.schema.shape, [])
      expectExactTokens(value?.panel?.datePanel?.dateCell, {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        width: '2.5rem',
        height: '2.5rem',
        padding: '{{primitives.space.xs}}',
        font: {
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.sm}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
        hover: expect.any(Object),
        selected: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(
          value?.panel?.datePanel?.dateCell?.hover,
          CalendarPickerCellSchema.hoverTokens.shape,
          []
        )
        expectExactTokens(value?.panel?.datePanel?.dateCell?.hover, {
          background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
          color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
          width: '2.5rem',
          height: '2.5rem',
          padding: '{{primitives.space.xs}}',
          font: {
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          border: {
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('selected state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(
          value?.panel?.datePanel?.dateCell?.selected,
          CalendarPickerCellSchema.selectedTokens.shape,
          []
        )
        expectExactTokens(value?.panel?.datePanel?.dateCell?.selected, {
          color: '{{primitives.area.overlay.state.selected.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
          width: '2.5rem',
          height: '2.5rem',
          padding: '{{primitives.space.xs}}',
          font: {
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          border: {
            color: '{{primitives.area.overlay.state.selected.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.selected.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
          inRangeBackground: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
          rangeSelectedBackground: '{{primitives.area.overlay.state.selected.defaultSeverity.bg}}',
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(
          value?.panel?.datePanel?.dateCell?.focus,
          CalendarPickerCellSchema.focusTokens.shape,
          []
        )
        expectExactTokens(value?.panel?.datePanel?.dateCell?.focus, {
          color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
          width: '2.5rem',
          height: '2.5rem',
          padding: '{{primitives.space.xs}}',
          font: {
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          border: {
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.sm}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })
  })

  describe('calendar today', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.datePanel?.today, CalendarTodaySchema.schema.shape, [])
      expectExactTokens(value?.panel?.datePanel?.today, {
        background: '{{primitives.variant.primary.defaultState.defaultSeverity.bg}}',
        color: '{{primitives.variant.primary.defaultState.defaultSeverity.contrast}}',
      })
    })
  })

  describe('calendar week day label', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.datePanel?.weekDayLabel, CalendarWeekDayLabelSchema.schema.shape, [])
      expectExactTokens(value?.panel?.datePanel?.weekDayLabel, {
        padding: '{{primitives.space.xs}}',
        font: {
          weight: '{{primitives.font.weight.bold}}',
          size: '{{primitives.font.size}}',
        },
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
      })
    })
  })

  describe('calendar view', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.panel?.datePanel?.dayView, CalendarViewSchema.schema.shape, [])
      expectExactTokens(value?.panel?.datePanel?.dayView, {
        margin: '{{primitives.space.md}}',
      })
    })
  })

  describe('calendar time input', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.timeInput, CalendarTimeInputSchema.schema.shape, [])
      expectExactTokens(value?.timeInput, {
        width: '3rem',
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
        padding: '{{primitives.space.xs}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
        focusRing: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
          width: '{{primitives.border.width.md}}',
          offset: '{{primitives.border.offset.none}}',
          shadow: '{{primitives.shadow.none}}',
          radius: '{{primitives.radius.md}}',
        },
        hover: expect.any(Object),
        focus: expect.any(Object),
      })
    })

    describe('hover state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.timeInput?.hover, CalendarTimeInputSchema.hoverTokens.shape, [])
        expectExactTokens(value?.timeInput?.hover, {
          width: '3rem',
          padding: '{{primitives.space.xs}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
          border: {
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })

    describe('focus state', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.timeInput?.focus, CalendarTimeInputSchema.focusTokens.shape, [])
        expectExactTokens(value?.timeInput?.focus, {
          width: '3rem',
          padding: '{{primitives.space.xs}}',
          font: {
            family: '{{primitives.font.family}}',
            size: '{{primitives.font.size}}',
            weight: '{{primitives.font.weight}}',
          },
          color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
          border: {
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
        })
      })
    })
  })

  describe('calendar time separator', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.timeSeparator, CalendarTimeSeperatorSchema.schema.shape, [])
      expectExactTokens(value?.timeSeparator, {
        color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
        padding: '{{primitives.space.xs}}',
        font: {
          family: '{{primitives.font.family}}',
          size: '{{primitives.font.size}}',
          weight: '{{primitives.font.weight}}',
        },
      })
    })
  })

  describe('calendar multi-month divider', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.multiMonthDivider, CalendarMultiMonthDividerSchema.schema.shape, [])
      expectExactTokens(value?.multiMonthDivider, {
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.none}}',
          offset: '{{primitives.border.offset.none}}',
          radius: '{{primitives.border.radius.md}}',
        },
        gap: '{{primitives.space.md}}',
      })
    })
  })

  describe('calendar footer button bar', () => {
    it('should apply defaults', () => {
      const result = calendar.safeParse({})
      expect(result.success).toBe(true)

      const value = result.data
      expectExactUndefinedTokens(value?.footerButtonBar, CalendarFooterButtonBarSchema.schema.shape, [])
      expectExactTokens(value?.footerButtonBar, {
        padding: '{{primitives.space.md}}',
        border: {
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
          style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
          width: '{{primitives.border.width.md}}',
          radius: '{{primitives.border.radius.md}}',
          offset: '{{primitives.border.offset.none}}',
        },
        gap: '{{primitives.space.md}}',
        todayButton: expect.any(Object),
        clearButton: expect.any(Object),
      })
    })

    describe('todayButton', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.footerButtonBar?.todayButton, CalendarPanelButtonSchema.schema.shape, [])
        expectExactTokens(value?.footerButtonBar?.todayButton, {
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
          border: {
            color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
          focusRing: {
            color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            shadow: '{{primitives.shadow.none}}',
            radius: '{{primitives.radius.md}}',
          },
          hover: expect.any(Object),
          focus: expect.any(Object),
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = calendar.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(
            value?.footerButtonBar?.todayButton?.hover,
            CalendarPanelButtonSchema.hoverTokens.shape,
            []
          )
          expectExactTokens(value?.footerButtonBar?.todayButton?.hover, {
            width: '2.5rem',
            height: '2.5rem',
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
            background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
            border: {
              color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = calendar.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(
            value?.footerButtonBar?.todayButton?.focus,
            CalendarPanelButtonSchema.focusTokens.shape,
            []
          )
          expectExactTokens(value?.footerButtonBar?.todayButton?.focus, {
            width: '2.5rem',
            height: '2.5rem',
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
            background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
            border: {
              color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })
    })

    describe('clearButton', () => {
      it('should apply defaults', () => {
        const result = calendar.safeParse({})
        expect(result.success).toBe(true)

        const value = result.data
        expectExactUndefinedTokens(value?.footerButtonBar?.clearButton, CalendarPanelButtonSchema.schema.shape, [])
        expectExactTokens(value?.footerButtonBar?.clearButton, {
          width: '2.5rem',
          height: '2.5rem',
          color: '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}',
          background: '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}',
          border: {
            color: '{{primitives.area.overlay.defaultState.defaultSeverity.border.color}}',
            style: '{{primitives.area.overlay.defaultState.defaultSeverity.border.style}}',
            width: '{{primitives.border.width.none}}',
            offset: '{{primitives.border.offset.none}}',
            radius: '{{primitives.border.radius.md}}',
          },
          focusRing: {
            color: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.color}}',
            style: '{{primitives.area.overlay.defaultState.defaultSeverity.focusRing.style}}',
            width: '{{primitives.border.width.md}}',
            offset: '{{primitives.border.offset.none}}',
            shadow: '{{primitives.shadow.none}}',
            radius: '{{primitives.radius.md}}',
          },
          hover: expect.any(Object),
          focus: expect.any(Object),
        })
      })

      describe('hover state', () => {
        it('should apply defaults', () => {
          const result = calendar.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(
            value?.footerButtonBar?.clearButton?.hover,
            CalendarPanelButtonSchema.hoverTokens.shape,
            []
          )
          expectExactTokens(value?.footerButtonBar?.clearButton?.hover, {
            width: '2.5rem',
            height: '2.5rem',
            color: '{{primitives.area.overlay.state.hover.defaultSeverity.contrast}}',
            background: '{{primitives.area.overlay.state.hover.defaultSeverity.bg}}',
            border: {
              color: '{{primitives.area.overlay.state.hover.defaultSeverity.border.color}}',
              style: '{{primitives.area.overlay.state.hover.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })

      describe('focus state', () => {
        it('should apply defaults', () => {
          const result = calendar.safeParse({})
          expect(result.success).toBe(true)

          const value = result.data
          expectExactUndefinedTokens(
            value?.footerButtonBar?.clearButton?.focus,
            CalendarPanelButtonSchema.focusTokens.shape,
            []
          )
          expectExactTokens(value?.footerButtonBar?.clearButton?.focus, {
            width: '2.5rem',
            height: '2.5rem',
            color: '{{primitives.area.overlay.state.focus.defaultSeverity.contrast}}',
            background: '{{primitives.area.overlay.state.focus.defaultSeverity.bg}}',
            border: {
              color: '{{primitives.area.overlay.state.focus.defaultSeverity.border.color}}',
              style: '{{primitives.area.overlay.state.focus.defaultSeverity.border.style}}',
              width: '{{primitives.border.width.none}}',
              offset: '{{primitives.border.offset.none}}',
              radius: '{{primitives.border.radius.md}}',
            },
          })
        })
      })
    })
  })
})
