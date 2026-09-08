import { applyDefaultsRecursive } from '../defaults-helper'
import {
  expectDefaultsMatchShape,
  at,
  expectLeafAtTokenPath,
  expectNoGroupingWrapperKeys,
  shapeAt,
  innerSchema,
} from '../test-utils'

import { calendar } from './calendar'
import { calendarInputShape, calendarInputDefaults } from './input'
import { calendarIconShape, calendarIconDefaults } from './inputicon'
import { calendarPanelButtonShape, calendarPanelButtonDefaults } from './panelbutton'
import { calendarNavigationSelectorShape, calendarNavigationSelectorDefaults } from './navigationselector'
import { calendarPanelHeaderShape, calendarPanelHeaderDefaults } from './panelheader'
import { calendarPickerCellShape, calendarPickerCellDefaults } from './pickercell'
import { calendarViewShape, calendarViewDefaults, CalendarViewCellFieldName } from './view'
import { calendarWeekDayLabelShape, calendarWeekDayLabelDefaults } from './weekdaylabel'
import { calendarTodayShape, calendarTodayDefaults } from './today'
import { calendarDatePanelShape, calendarDatePanelDefaults } from './datepanel'
import { calendarMultiMonthDividerShape, calendarMultiMonthDividerDefaults } from './multimonthdivider'
import { calendarTimeInputShape, calendarTimeInputDefaults } from './timeinput'
import { calendarTimeSeperatorShape, calendarTimeSeperatorDefaults } from './timeseperator'
import { calendarTimePickerShape, calendarTimePickerDefaults } from './timepicker'
import { calendarFooterButtonShape, calendarTodayButtonDefaults, calendarClearButtonDefaults } from './footerbutton'
import { calendarFooterButtonBarShape, calendarFooterButtonBarDefaults } from './footerbuttonbar'
import { calendarPanelShape, calendarPanelDefaults } from './panel'
import { calendarSettingsShape } from './settings'

describe('calendar schema', () => {
  const parsed = calendar.parse({})

  it('parses an empty object', () => {
    expect(calendar.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    // The calendar schema models only `defaultVariant` (no named color variants — see the
    // "The 5 canonical color variants are intentionally not modeled" comment in calendar.ts),
    // so the whole resolved tree is captured by snapshotting `defaultVariant`.
    expect(parsed['defaultVariant']).toMatchSnapshot()
  })

  it('resolves a baseline leaf through the default token path (defaultVariant.defaultState.defaultSeverity)', () => {
    // The calendar input's baseline background is the generic input's default-path background
    // (Option 1 — extends the generic input usage; the calendar adds only `icon`/`shadow`).
    expectLeafAtTokenPath(
      parsed,
      ['defaultVariant', 'input', 'defaultVariant', 'defaultState', 'defaultSeverity', 'background'],
      '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
    )
  })

  it('does not wrap the default slots in grouping-wrapper keys (variant/state/severity)', () => {
    expectNoGroupingWrapperKeys(calendar)
  })

  it('does not model the 5 named color variants (primary/secondary/tertiary/quaternary/quinary)', () => {
    for (const variant of ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary']) {
      expect(parsed[variant]).toBeUndefined()
    }
  })

  // ------------------------------------------------------------------
  // input
  // ------------------------------------------------------------------

  describe('input', () => {
    const schema = applyDefaultsRecursive(calendarInputShape, calendarInputDefaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarInputShape, calendarInputDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('resolves the default token path', () => {
      expectLeafAtTokenPath(
        resolved,
        ['defaultVariant', 'defaultState', 'defaultSeverity', 'background'],
        '{{primitives.defaultVariant.defaultState.defaultSeverity.bg}}'
      )
    })

    it('keeps the calendar-only tokens (icon, shadow) at the input root, siblings of defaultVariant/filled', () => {
      // Option 1: a shallow .extend() cannot re-nest the generic input's severity
      // blocks, so the calendar-only tokens sit at the input root.
      expect(resolved['icon']).toBeDefined()
      expect(resolved['shadow']).toBe('{{primitives.shadow.md}}')
      expect(resolved['defaultVariant']).toBeDefined()
      expect(resolved['filled']).toBeDefined()
    })

    it('inherits the generic input static tokens (sm, lg, focusRing) inside the baseline severity block', () => {
      // The generic input's sm/lg/focusRing are leaf tokens of the default severity
      // block (not at the input root) — reused via Option 1.
      const baseline = at(resolved, ['defaultVariant', 'defaultState', 'defaultSeverity'])
      expect(baseline['sm']).toBeDefined()
      expect(baseline['lg']).toBeDefined()
      expect(baseline['focusRing']).toBeDefined()
    })

    it('reuses the shared calendar icon shape/defaults by reference and inherits the generic input defaults', () => {
      // Option 1: calendarInputDefaults spreads the generic inputDefaults and adds
      // only the calendar-specific icon/shadow. The icon reuses the shared icon const.
      expect(calendarInputDefaults.icon).toBe(calendarIconDefaults)
      expect(innerSchema(shapeAt(calendarInputShape, ['icon']))).toBe(calendarIconShape)
    })
  })

  describe('input icon', () => {
    const schema = applyDefaultsRecursive(calendarIconShape, calendarIconDefaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarIconShape, calendarIconDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('keeps focusRing at the node root, siblings of defaultVariant', () => {
      expect(resolved['focusRing']).toBeDefined()
      expect(at(resolved, ['defaultVariant', 'defaultState', 'focusRing'])).toBeUndefined()
    })
  })

  // ------------------------------------------------------------------
  // Shared shapes: canonical snapshot + identity checks in consumers
  // ------------------------------------------------------------------

  describe('panel button (shared: calendarIconButton, navButton, timePickerButton)', () => {
    const schema = applyDefaultsRecursive(calendarPanelButtonShape, calendarPanelButtonDefaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarPanelButtonShape, calendarPanelButtonDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('keeps the static tokens (width, height, focusRing) at the node root, siblings of defaultVariant', () => {
      expect(resolved['width']).toBeDefined()
      expect(resolved['height']).toBeDefined()
      expect(resolved['focusRing']).toBeDefined()
      expect(at(resolved, ['defaultVariant', 'defaultState', 'focusRing'])).toBeUndefined()
    })
  })

  describe('picker cell (shared: dateCell, monthCell, yearCell)', () => {
    const schema = applyDefaultsRecursive(calendarPickerCellShape, calendarPickerCellDefaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarPickerCellShape, calendarPickerCellDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('resolves the default token path', () => {
      expectLeafAtTokenPath(
        resolved,
        ['defaultVariant', 'defaultState', 'background'],
        '{{primitives.area.overlay.defaultState.defaultSeverity.bg}}'
      )
    })
  })

  // ------------------------------------------------------------------
  // Consumers of shared shapes: reference identity, no re-snapshot
  // ------------------------------------------------------------------

  describe('panel header', () => {
    const schema = applyDefaultsRecursive(calendarPanelHeaderShape, calendarPanelHeaderDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarPanelHeaderShape, calendarPanelHeaderDefaults)
    })

    it('resolves the new yearMonthNav baseline leaf inside the state block (header.yearMonthNav)', () => {
      // The .p-datepicker-title month/year display is a static (flat) element placed
      // inside the header's state block — no own variant/state tree.
      expectLeafAtTokenPath(
        schema.parse({}),
        ['defaultVariant', 'defaultState', 'yearMonthNav', 'color'],
        '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'
      )
      // It is a child of the header's state block, not a root-level token.
      expect(at(schema.parse({}), ['yearMonthNav'])).toBeUndefined()
    })

    it('reuses the shared panel-button shape/defaults by reference (navButton)', () => {
      expect(calendarPanelHeaderDefaults.defaultVariant.defaultState.navButton).toBe(calendarPanelButtonDefaults)
      expect(innerSchema(shapeAt(calendarPanelHeaderShape, ['defaultVariant', 'defaultState', 'navButton']))).toBe(
        calendarPanelButtonShape
      )
    })
  })

  describe.each<CalendarViewCellFieldName>(['dateCell', 'monthCell', 'yearCell'])(
    'view with cell field "%s" (dayView, monthView, yearView)',
    (fieldName) => {
      const shape = calendarViewShape(fieldName)
      const defaults = calendarViewDefaults(fieldName)
      const schema = applyDefaultsRecursive(shape, defaults)

      it('parses an empty object', () => {
        expect(schema.safeParse({}).success).toBe(true)
      })

      it('shape and defaults stay in sync', () => {
        expectDefaultsMatchShape(shape, defaults)
      })

      it('resolves the expected default token tree', () => {
        expect(schema.parse({})).toMatchSnapshot()
      })

      it('wires the cell field to the shared picker-cell shape/defaults by reference', () => {
        // View is a flat container: the cell field sits at the root (no defaultVariant
        // level). The cell reuses the shared picker-cell const (wrapped in .prefault({})),
        // so the unwrapped inner shape is identical by reference.
        expect(defaults[fieldName]).toBe(calendarPickerCellDefaults)
        expect(innerSchema(shapeAt(shape, [fieldName]))).toBe(calendarPickerCellShape)
      })
    }
  )

  // ------------------------------------------------------------------
  // Static leaf nodes (flat, no default slots)
  // ------------------------------------------------------------------

  describe('week day label', () => {
    const schema = applyDefaultsRecursive(calendarWeekDayLabelShape, calendarWeekDayLabelDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarWeekDayLabelShape, calendarWeekDayLabelDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })
  })

  describe('today cell', () => {
    const schema = applyDefaultsRecursive(calendarTodayShape, calendarTodayDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarTodayShape, calendarTodayDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })
  })

  describe('multi month divider', () => {
    const schema = applyDefaultsRecursive(calendarMultiMonthDividerShape, calendarMultiMonthDividerDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarMultiMonthDividerShape, calendarMultiMonthDividerDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })
  })

  describe('time input', () => {
    const schema = applyDefaultsRecursive(calendarTimeInputShape, calendarTimeInputDefaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarTimeInputShape, calendarTimeInputDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('keeps the static tokens (width, padding, font, focusRing) at the node root, siblings of defaultVariant', () => {
      expect(resolved['width']).toBeDefined()
      expect(resolved['padding']).toBeDefined()
      expect(resolved['font']).toBeDefined()
      expect(resolved['focusRing']).toBeDefined()
      expect(at(resolved, ['defaultVariant', 'defaultState', 'focusRing'])).toBeUndefined()
    })

    it('resolves the default token path at defaultVariant.defaultState (no defaultSeverity wrapper)', () => {
      expectLeafAtTokenPath(
        resolved,
        ['defaultVariant', 'defaultState', 'color'],
        '{{primitives.area.overlay.defaultState.defaultSeverity.contrast}}'
      )
    })
  })

  describe('time separator', () => {
    const schema = applyDefaultsRecursive(calendarTimeSeperatorShape, calendarTimeSeperatorDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarTimeSeperatorShape, calendarTimeSeperatorDefaults)
    })

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })
  })

  // ------------------------------------------------------------------
  // Composite nodes
  // ------------------------------------------------------------------

  describe('date panel', () => {
    const schema = applyDefaultsRecursive(calendarDatePanelShape, calendarDatePanelDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarDatePanelShape, calendarDatePanelDefaults)
    })
  })

  describe('time picker', () => {
    const schema = applyDefaultsRecursive(calendarTimePickerShape, calendarTimePickerDefaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarTimePickerShape, calendarTimePickerDefaults)
    })

    it('keeps the state-dependent children (timeInput, timeSeparator, timePickerButton) inside the state block, not at the node root', () => {
      expect(resolved['timeInput']).toBeUndefined()
      expect(resolved['timeSeparator']).toBeUndefined()
      expect(resolved['timePickerButton']).toBeUndefined()
      const stateBlock = at(resolved, ['defaultVariant', 'defaultState'])
      expect(stateBlock.timeInput).toBeDefined()
      expect(stateBlock.timeSeparator).toBeDefined()
      expect(stateBlock.timePickerButton).toBeDefined()
    })

    it('reuses the shared panel-button shape/defaults by reference (timePickerButton)', () => {
      expect(calendarTimePickerDefaults.defaultVariant.defaultState.timePickerButton).toBe(calendarPanelButtonDefaults)
      expect(
        innerSchema(shapeAt(calendarTimePickerShape, ['defaultVariant', 'defaultState', 'timePickerButton']))
      ).toBe(calendarPanelButtonShape)
    })
  })

  describe.each([
    ['today button', calendarTodayButtonDefaults],
    ['clear button', calendarClearButtonDefaults],
  ])('footer %s (shared footer button shape, independent defaults)', (_label, defaults) => {
    const schema = applyDefaultsRecursive(calendarFooterButtonShape, defaults)
    const resolved = schema.parse({})

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarFooterButtonShape, defaults)
    })

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('keeps the static tokens (minWidth, focusRing) at the node root, siblings of defaultVariant', () => {
      expect(resolved['minWidth']).toBeDefined()
      expect(resolved['focusRing']).toBeDefined()
      expect(at(resolved, ['defaultVariant', 'defaultState', 'focusRing'])).toBeUndefined()
    })
  })

  describe('footer button bar', () => {
    const schema = applyDefaultsRecursive(calendarFooterButtonBarShape, calendarFooterButtonBarDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarFooterButtonBarShape, calendarFooterButtonBarDefaults)
    })

    it('reuses the shared footer-button shape (independent defaults for todayButton and clearButton)', () => {
      // The buttons sit inside the state block, each wrapping the shared const in .prefault({}).
      expect(
        innerSchema(shapeAt(calendarFooterButtonBarShape, ['defaultVariant', 'defaultState', 'todayButton']))
      ).toBe(calendarFooterButtonShape)
      expect(
        innerSchema(shapeAt(calendarFooterButtonBarShape, ['defaultVariant', 'defaultState', 'clearButton']))
      ).toBe(calendarFooterButtonShape)
      expect(calendarFooterButtonBarDefaults.defaultVariant.defaultState.todayButton).not.toBe(
        calendarFooterButtonBarDefaults.defaultVariant.defaultState.clearButton
      )
    })
  })

  describe('panel', () => {
    const schema = applyDefaultsRecursive(calendarPanelShape, calendarPanelDefaults)

    it('parses an empty object', () => {
      expect(schema.safeParse({}).success).toBe(true)
    })

    it('shape and defaults stay in sync', () => {
      expectDefaultsMatchShape(calendarPanelShape, calendarPanelDefaults)
    })
  })

  // ------------------------------------------------------------------
  // settings (pass-through, no token defaults)
  // ------------------------------------------------------------------

  describe('settings', () => {
    it('parses an empty object', () => {
      expect(calendarSettingsShape.safeParse({}).success).toBe(true)
    })

    it('resolves to an empty object when no settings are supplied (no defaults)', () => {
      expect(calendarSettingsShape.parse({})).toEqual({})
    })

    it('accepts custom settings values', () => {
      const custom = {
        unstyled: true,
        inputStyle: 'color: red',
        inputStyleClass: 'my-input',
        panelStyle: 'color: blue',
        panelStyleClass: 'my-panel',
        todayButtonStyleClass: 'my-today',
        clearButtonStyleClass: 'my-clear',
        showIcon: true,
        icon: 'pi pi-calendar',
        iconDisplay: 'button' as const,
        appendTo: 'body',
        size: 'small' as const,
        variant: 'filled' as const,
        fluid: true,
        invalid: false,
      }

      expect(calendarSettingsShape.parse(custom)).toEqual(custom)
    })
  })
})
