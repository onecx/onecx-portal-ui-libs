import { collectAxisScopes, expectAxes } from '../test-utils'

const CALENDAR = 'v2.usages.calendar'

describe('calendar axis metadata', () => {
  const scopes = collectAxisScopes(CALENDAR)

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
      expectAxes(scopes, CALENDAR, { variant: ['defaultVariant'] })
    })
  })

  describe('input', () => {
    it('input (shadow opted out)', () => {
      expectAxes(scopes, 'input', {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
        severity: ['defaultSeverity'],
      })
    })

    it('input.icon (focusRing opted out)', () => {
      expectAxes(scopes, 'input.icon', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
      })
    })
  })

  describe('calendarIconButton', () => {
    it('calendarIconButton (width, height and focusRing opted out)', () => {
      expectAxes(scopes, 'calendarIconButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })

  describe('panel', () => {
    it.each(['panel', 'header', 'datePanel', 'timePicker', 'footerButtonBar'])('%s', (scopeName) => {
      expectAxes(scopes, scopeName, { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })
  })

  describe('header', () => {
    it.each(['selectMonth', 'selectYear'])('%s (static tokens opted out)', (scopeName) => {
      expectAxes(scopes, scopeName, { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('navButton (width, height and focusRing opted out)', () => {
      expectAxes(scopes, 'navButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })

  describe('datePanel', () => {
    it.each(['dayView.dateCell', 'monthView.monthCell', 'yearView.yearCell'])('%s', (scopeName) => {
      expectAxes(scopes, scopeName, {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'selected'],
      })
    })
  })

  describe('timePicker', () => {
    it('timeInput (static tokens opted out)', () => {
      expectAxes(scopes, 'timeInput', { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('timePickerButton (width, height and focusRing opted out)', () => {
      expectAxes(scopes, 'timePickerButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })

  describe('footerButtonBar', () => {
    it.each(['todayButton', 'clearButton'])('%s (static tokens opted out)', (scopeName) => {
      expectAxes(scopes, scopeName, {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })
  })
})
