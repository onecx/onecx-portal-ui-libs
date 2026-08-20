import * as z from 'zod'
import { applyDefaultsRecursive } from '../defaults-helper'
import { expectDefaultsMatchShape } from '../test-utils'

import { calendar, calendarDefaults } from './calendar'
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
import { calendarTimeSeperatorShape, calendarTimeSeperatorDefaults } from './timeseperator'
import { calendarTimePickerShape, calendarTimePickerDefaults } from './timepicker'
import { calendarFooterButtonShape, calendarTodayButtonDefaults, calendarClearButtonDefaults } from './footerbutton'
import { calendarFooterButtonBarShape, calendarFooterButtonBarDefaults } from './footerbuttonbar'
import { calendarPanelShape, calendarPanelDefaults } from './panel'
import { calendarSettingsShape } from './settings'

/**
 * Single spec file for the whole `calendar` component (Step 8 of the
 * theme-schema-audit skill). One `describe` block per subcomponent, in the
 * same stable order used during the structural audit.
 *
 * Strategy — snapshot the values, hand-assert the invariants:
 *
 * - The **exact resolved key/value tree** is locked in with Jest snapshots
 *   (`toMatchSnapshot()` on `parse({})`), never by hand-transcribed literal
 *   trees: hand-written `expected*` literals would duplicate every value that
 *   already lives in the `*Defaults` exports and drift silently. The snapshot
 *   diff is the "exact key/value" diff, and for a structure-only restructure
 *   it shows only the key moves, value tokens unchanged.
 * - The **structural invariants** the audit confirmed are asserted
 *   explicitly (they are shape claims, where an assertion is sharper than a
 *   snapshot diff): the default token path
 *   (`defaultVariant.defaultState.defaultSeverity.<token>`), static tokens at
 *   the node root (siblings of `defaultVariant`), state-dependent children
 *   inside the state blocks, no grouping-wrapper keys, the `defaultVariant`-
 *   only variant-coverage policy, and shared-shape reference identity.
 * - **Shape/defaults parity** (`expectDefaultsMatchShape`) catches wiring
 *   bugs (typos, renames) independently of the resolved values.
 *
 * Shared shapes (panelButton ×3, pickerCell ×3, footerButton ×2) are
 * snapshotted exactly once in their own `describe` block; every consumer
 * only asserts it references the shared `*Shape`/`*Defaults` by reference.
 */

// ------------------------------------------------------------------
// Local assertion helpers (structural invariants)
// ------------------------------------------------------------------

/**
 * Asserts that `tokenPath` resolves to `expected` in `parsed` — i.e. the leaf
 * sits at exactly that nested path (the default token path), not one level
 * shallower or wrapped in another key.
 */
function expectLeafAtTokenPath(
  parsed: Record<string, unknown>,
  tokenPath: (string | number)[],
  expected: unknown
): void {
  let current: unknown = parsed
  for (const [i, segment] of tokenPath.entries()) {
    const obj = current as Record<string, unknown> | undefined
    if (!obj || typeof obj !== 'object' || !(segment in obj) || obj[segment] === undefined) {
      throw new Error(`token path not resolved at '${tokenPath.slice(0, i + 1).join('.')}': ${JSON.stringify({
        [String(segment)]: '(missing or undefined)',
      })}`)
    }
    current = obj[segment]
  }
  expect(current).toStrictEqual(expected)
}

/**
 * Asserts that no nested object in the shape tree is keyed with a
 * grouping-wrapper key (`variant`/`state`/`severity`): the default slots
 * (`defaultVariant`, `defaultState`, `defaultSeverity`) and their named
 * siblings must be flat keys, never wrapped in a category object.
 */
function expectNoGroupingWrapperKeys(schema: z.ZodTypeAny): void {
  if (schema instanceof z.ZodObject) {
    const wrapperKeys = ['variant', 'state', 'severity'].filter((key) => key in schema.shape)
    expect(wrapperKeys).toEqual([])
    for (const fieldSchema of Object.values(schema.shape)) {
      expectNoGroupingWrapperKeys(fieldSchema)
    }
  }
}

type AnyRecord = Record<string, any>

/** Walks the parsed output down `path` (for invariant assertions on the resolved tree). */
function at(o: AnyRecord, path: string[]): any {
  return path.reduce((acc: any, key) => acc?.[key], o)
}

/** Unwraps a ZodPrefault/ZodDefault wrapper and returns the inner object's shape. */
function objectShape(schema: z.ZodTypeAny): AnyRecord {
  const inner = (schema as { def?: { innerType?: z.ZodTypeAny } }).def?.innerType
  return ((inner ?? schema) as any).shape
}

/** Walks the shape tree down `path`, unwrapping prefaulted objects at each level. */
function shapeAt(schema: z.ZodTypeAny, path: string[]): z.ZodTypeAny {
  return path.reduce((current, key) => objectShape(current)[key], schema)
}

/** Unwraps a ZodPrefault/ZodDefault wrapper to the underlying schema (for identity checks). */
function innerSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  const inner = (schema as { def?: { innerType?: z.ZodTypeAny } }).def?.innerType
  return inner ?? schema
}

describe('calendar schema', () => {
  const parsed = calendar.parse({})

  it('parses an empty object', () => {
    expect(calendar.safeParse({}).success).toBe(true)
  })

  it('resolves the expected default token tree', () => {
    expect(parsed).toMatchSnapshot()
  })

  it('resolves a baseline leaf through the default token path (defaultVariant.defaultState.defaultSeverity)', () => {
    expectLeafAtTokenPath(
      parsed,
      ['defaultVariant', 'input', 'defaultVariant', 'defaultState', 'defaultSeverity', 'padding'],
      '{{primitives.space.md}}'
    )
  })

  it('does not wrap the default slots in grouping-wrapper keys (variant/state/severity)', () => {
    expectNoGroupingWrapperKeys(calendar)
  })

  it('carries baked defaults on defaultVariant only — named variants carry no baked token values', () => {
    for (const variant of ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'] as const) {
      expect(parsed[variant]).not.toStrictEqual(calendarDefaults.defaultVariant)
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

    it('keeps the static tokens (sm, lg, focusRing) at the node root, siblings of defaultVariant', () => {
      expect(resolved['sm']).toBeDefined()
      expect(resolved['lg']).toBeDefined()
      expect(resolved['focusRing']).toBeDefined()
      expect(at(resolved, ['defaultVariant', 'defaultState', 'defaultSeverity', 'focusRing'])).toBeUndefined()
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
      expect(at(resolved, ['defaultVariant', 'defaultState', 'defaultSeverity', 'focusRing'])).toBeUndefined()
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
      expect(at(resolved, ['defaultVariant', 'defaultState', 'defaultSeverity', 'focusRing'])).toBeUndefined()
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
        ['defaultVariant', 'defaultState', 'defaultSeverity', 'background'],
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

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })

    it('reuses the shared panel-button shape/defaults by reference (navButton)', () => {
      expect(calendarPanelHeaderDefaults.defaultVariant.defaultState.defaultSeverity.navButton).toBe(
        calendarPanelButtonDefaults
      )
      expect(
        innerSchema(
          shapeAt(calendarPanelHeaderShape, ['defaultVariant', 'defaultState', 'defaultSeverity', 'navButton'])
        )
      ).toBe(calendarPanelButtonShape)
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

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
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

    it('resolves the expected default token tree', () => {
      expect(resolved).toMatchSnapshot()
    })

    it('keeps the state-dependent children (timeSeparator, timePickerButton) inside the state block, not at the node root', () => {
      expect(resolved['timeSeparator']).toBeUndefined()
      expect(resolved['timePickerButton']).toBeUndefined()
      const stateBlock = at(resolved, ['defaultVariant', 'defaultState', 'defaultSeverity'])
      expect(stateBlock.timeSeparator).toBeDefined()
      expect(stateBlock.timePickerButton).toBeDefined()
    })

    it('reuses the shared panel-button shape/defaults by reference (timePickerButton)', () => {
      expect(calendarTimePickerDefaults.defaultVariant.defaultState.defaultSeverity.timePickerButton).toBe(
        calendarPanelButtonDefaults
      )
      expect(
        innerSchema(
          shapeAt(calendarTimePickerShape, ['defaultVariant', 'defaultState', 'defaultSeverity', 'timePickerButton'])
        )
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
      expect(at(resolved, ['defaultVariant', 'defaultState', 'defaultSeverity', 'focusRing'])).toBeUndefined()
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

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
    })

    it('reuses the shared footer-button shape (independent defaults for todayButton and clearButton)', () => {
      // The buttons sit inside the state block, each wrapping the shared const in .prefault({}).
      expect(
        innerSchema(
          shapeAt(calendarFooterButtonBarShape, ['defaultVariant', 'defaultState', 'defaultSeverity', 'todayButton'])
        )
      ).toBe(calendarFooterButtonShape)
      expect(
        innerSchema(
          shapeAt(calendarFooterButtonBarShape, ['defaultVariant', 'defaultState', 'defaultSeverity', 'clearButton'])
        )
      ).toBe(calendarFooterButtonShape)
      expect(calendarFooterButtonBarDefaults.defaultVariant.defaultState.defaultSeverity.todayButton).not.toBe(
        calendarFooterButtonBarDefaults.defaultVariant.defaultState.defaultSeverity.clearButton
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

    it('resolves the expected default token tree', () => {
      expect(schema.parse({})).toMatchSnapshot()
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
