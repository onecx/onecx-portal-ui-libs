import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const CALENDAR = 'v2.usages.calendar'

// Each component is checked for its axis metadata and for how the resolver uses it: a non-default
// key falls back to its default on the component's own level, a fully-default component falls back
// on the first ancestor with a non-default key, and there is no fallback when every level is default.
// Fallback paths are relative to CALENDAR.
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
    it('has only defaultVariant as a variant (settings and transitionDuration opted out)', () => {
      expectAxes(scopes, CALENDAR, { variant: ['defaultVariant'] })
    })

    it('has no fallback for a leaf carrying only the root metadata', () => {
      expectFallback(CALENDAR, { from: 'defaultVariant.input.shadow', to: undefined })
    })
  })

  describe('input', () => {
    it('has the input variants, states and severity (shadow opted out)', () => {
      expectAxes(scopes, 'input', {
        variant: ['defaultVariant', 'filled'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
        severity: ['defaultSeverity'],
      })
    })

    it('filled + hover falls back to filled + defaultState', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.input.filled.hover.defaultSeverity.background',
        to: 'defaultVariant.input.filled.defaultState.defaultSeverity.background',
      })
    })

    it('filled + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.input.filled.defaultState.defaultSeverity.background',
        to: 'defaultVariant.input.defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.input.defaultVariant.hover.defaultSeverity.background',
        to: 'defaultVariant.input.defaultVariant.defaultState.defaultSeverity.background',
      })
    })

    it('defaultVariant + defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.input.defaultVariant.defaultState.defaultSeverity.background',
        to: undefined,
      })
    })
  })

  describe('input.icon', () => {
    it('has its own variant and states (focusRing opted out)', () => {
      expectAxes(scopes, 'input.icon', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled', 'invalid'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.input.icon.defaultVariant.hover.color',
        to: 'defaultVariant.input.icon.defaultVariant.defaultState.color',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, { from: 'defaultVariant.input.icon.defaultVariant.defaultState.color', to: undefined })
    })
  })

  describe('calendarIconButton', () => {
    it('has the interactive states (width, height and focusRing opted out)', () => {
      expectAxes(scopes, 'calendarIconButton', {
        variant: ['defaultVariant'],
        state: ['defaultState', 'hover', 'focus', 'active', 'disabled'],
      })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.calendarIconButton.defaultVariant.hover.color',
        to: 'defaultVariant.calendarIconButton.defaultVariant.defaultState.color',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.calendarIconButton.defaultVariant.defaultState.color',
        to: undefined,
      })
    })
  })

  describe('panel', () => {
    it('has the panel states', () => {
      expectAxes(scopes, 'panel', { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.panel.defaultVariant.hover.background.color',
        to: 'defaultVariant.panel.defaultVariant.defaultState.background.color',
      })
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, {
        from: 'defaultVariant.panel.defaultVariant.defaultState.background.color',
        to: undefined,
      })
    })
  })

  describe.each([
    ['header', 'background.color'],
    ['datePanel', 'background.color'],
    ['timePicker', 'padding'],
    ['footerButtonBar', 'padding'],
  ])('panel > %s', (child, token) => {
    it('has the panel states', () => {
      expectAxes(scopes, child, { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.defaultState.${child}.defaultVariant.hover.${token}`,
        to: `defaultVariant.panel.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it('hover falls back to defaultState before the parent panel relaxes', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.hover.${child}.defaultVariant.hover.${token}`,
        to: `defaultVariant.panel.defaultVariant.hover.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it('defaultState falls back on the parent panel state', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.hover.${child}.defaultVariant.defaultState.${token}`,
        to: `defaultVariant.panel.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it('defaultState has no fallback when the parent panel is default', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
        to: undefined,
      })
    })
  })

  describe.each([
    ['header', 'selectMonth', ['defaultState', 'hover', 'focus'], 'padding'],
    ['header', 'selectYear', ['defaultState', 'hover', 'focus'], 'padding'],
    ['header', 'navButton', ['defaultState', 'hover', 'focus', 'active', 'disabled'], 'color'],
    ['datePanel', 'dayView.dateCell', ['defaultState', 'hover', 'focus', 'active', 'disabled', 'selected'], 'padding'],
    [
      'datePanel',
      'monthView.monthCell',
      ['defaultState', 'hover', 'focus', 'active', 'disabled', 'selected'],
      'padding',
    ],
    ['datePanel', 'yearView.yearCell', ['defaultState', 'hover', 'focus', 'active', 'disabled', 'selected'], 'padding'],
    ['timePicker', 'timeInput', ['defaultState', 'hover', 'focus'], 'color'],
    ['timePicker', 'timePickerButton', ['defaultState', 'hover', 'focus', 'active', 'disabled'], 'color'],
    ['footerButtonBar', 'todayButton', ['defaultState', 'hover', 'focus', 'active', 'disabled'], 'padding'],
    ['footerButtonBar', 'clearButton', ['defaultState', 'hover', 'focus', 'active', 'disabled'], 'padding'],
  ])('panel > %s > %s', (parent, child, states, token) => {
    it('has its states (static tokens opted out)', () => {
      expectAxes(scopes, child, { variant: ['defaultVariant'], state: states })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.defaultState.${parent}.defaultVariant.defaultState.${child}.defaultVariant.hover.${token}`,
        to: `defaultVariant.panel.defaultVariant.defaultState.${parent}.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it('hover falls back to defaultState before its parents relax', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.hover.${parent}.defaultVariant.hover.${child}.defaultVariant.hover.${token}`,
        to: `defaultVariant.panel.defaultVariant.hover.${parent}.defaultVariant.hover.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it(`defaultState falls back on the parent ${parent} state`, () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.hover.${parent}.defaultVariant.hover.${child}.defaultVariant.defaultState.${token}`,
        to: `defaultVariant.panel.defaultVariant.hover.${parent}.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it(`defaultState falls back on the panel state when ${parent} is default`, () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.hover.${parent}.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
        to: `defaultVariant.panel.defaultVariant.defaultState.${parent}.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
      })
    })

    it('defaultState has no fallback when all parents are default', () => {
      expectFallback(CALENDAR, {
        from: `defaultVariant.panel.defaultVariant.defaultState.${parent}.defaultVariant.defaultState.${child}.defaultVariant.defaultState.${token}`,
        to: undefined,
      })
    })
  })
})
