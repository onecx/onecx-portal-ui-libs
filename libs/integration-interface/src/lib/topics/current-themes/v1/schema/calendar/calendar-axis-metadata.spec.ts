import { introspectThemeAxisMetadata } from '../../utils/axis-metadata'
import { theme } from '../../current-themes.schema'

const CALENDAR = 'v2.usages.calendar'

type Axes = { variant?: string[]; state?: string[]; severity?: string[] }

/** Maps every calendar scope path to the variant/state/severity keys its leaves pass through. */
function collectScopes(): Map<string, Axes> {
  const scopes = new Map<string, Axes>()
  for (const [leafPath, metadata] of Object.entries(introspectThemeAxisMetadata(theme))) {
    if (!leafPath.startsWith(`${CALENDAR}.`)) continue
    for (const { scopePath, entries } of metadata.scopes) {
      const axes = scopes.get(scopePath) ?? {}
      for (const { kind, segments } of entries) {
        const keys = new Set(axes[kind]).add(segments.join('.'))
        axes[kind] = [...keys].sort()
      }
      scopes.set(scopePath, axes)
    }
  }
  return scopes
}

describe('calendar axis metadata', () => {
  const scopes = collectScopes()

  /** Asserts every occurrence of the scope (the panel subtree repeats per state) has exactly the expected keys. */
  function expectAxes(scopeName: string, expected: Axes) {
    const occurrences = [...scopes].filter(([path]) => path.endsWith(`.${scopeName}`)).map(([, axes]) => axes)
    const sorted = Object.fromEntries(Object.entries(expected).map(([kind, keys]) => [kind, [...keys].sort()]))

    expect(occurrences.length).toBeGreaterThan(0)
    occurrences.forEach((axes) => expect(axes).toEqual(sorted))
  }

  it('opens scopes only for the expected components', () => {
    const scopeNames = new Set([...scopes.keys()].map((path) => path.split('.').pop()))

    expect([...scopeNames].sort()).toEqual(
      [
        'calendar',
        'input',
        'icon',
        'calendarIconButton',
        'panel',
        'header',
        'selectMonth',
        'selectYear',
        'navButton',
        'datePanel',
        'dateCell',
        'monthCell',
        'yearCell',
        'timePicker',
        'timeInput',
        'timePickerButton',
        'footerButtonBar',
        'todayButton',
        'clearButton',
      ].sort()
    )
  })

  describe('root', () => {
    it('calendar (settings and transitionDuration opted out)', () => {
      expect(scopes.get(CALENDAR)).toEqual({ variant: ['defaultVariant'] })
    })
  })

  describe('input', () => {
    it('input (shadow opted out)', () => {
      expectAxes('input', {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
        severity: ['defaultSeverity'],
      })
    })

    it('input.icon (focusRing opted out)', () => {
      expectAxes('input.icon', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
      })
    })
  })

  describe('calendarIconButton', () => {
    it('calendarIconButton (width, height and focusRing opted out)', () => {
      expectAxes('calendarIconButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })

  describe('panel', () => {
    it.each(['panel', 'header', 'datePanel', 'timePicker', 'footerButtonBar'])('%s', (scopeName) => {
      expectAxes(scopeName, { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })
  })

  describe('header', () => {
    it.each(['selectMonth', 'selectYear'])('%s (static tokens opted out)', (scopeName) => {
      expectAxes(scopeName, { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('navButton (width, height and focusRing opted out)', () => {
      expectAxes('navButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })

  describe('datePanel', () => {
    it.each(['dayView.dateCell', 'monthView.monthCell', 'yearView.yearCell'])('%s', (scopeName) => {
      expectAxes(scopeName, {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'selected'],
      })
    })
  })

  describe('timePicker', () => {
    it('timeInput (static tokens opted out)', () => {
      expectAxes('timeInput', { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('timePickerButton (width, height and focusRing opted out)', () => {
      expectAxes('timePickerButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })

  describe('footerButtonBar', () => {
    it.each(['todayButton', 'clearButton'])('%s (static tokens opted out)', (scopeName) => {
      expectAxes(scopeName, {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })
})
