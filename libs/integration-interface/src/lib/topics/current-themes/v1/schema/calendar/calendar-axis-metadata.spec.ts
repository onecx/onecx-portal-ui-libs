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
      expectFallback(CALENDAR, 'defaultVariant.input.shadow', undefined)
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
      expectFallback(
        CALENDAR,
        'defaultVariant.input.filled.hover.defaultSeverity.background',
        'defaultVariant.input.filled.defaultState.defaultSeverity.background'
      )
    })

    it('filled + defaultState falls back to defaultVariant + defaultState', () => {
      expectFallback(
        CALENDAR,
        'defaultVariant.input.filled.defaultState.defaultSeverity.background',
        'defaultVariant.input.defaultVariant.defaultState.defaultSeverity.background'
      )
    })

    it('defaultVariant + hover falls back to defaultVariant + defaultState', () => {
      expectFallback(
        CALENDAR,
        'defaultVariant.input.defaultVariant.hover.defaultSeverity.background',
        'defaultVariant.input.defaultVariant.defaultState.defaultSeverity.background'
      )
    })

    it('defaultVariant + defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, 'defaultVariant.input.defaultVariant.defaultState.defaultSeverity.background', undefined)
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
      expectFallback(
        CALENDAR,
        'defaultVariant.input.icon.defaultVariant.hover.color',
        'defaultVariant.input.icon.defaultVariant.defaultState.color'
      )
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, 'defaultVariant.input.icon.defaultVariant.defaultState.color', undefined)
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
      expectFallback(
        CALENDAR,
        'defaultVariant.calendarIconButton.defaultVariant.hover.color',
        'defaultVariant.calendarIconButton.defaultVariant.defaultState.color'
      )
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, 'defaultVariant.calendarIconButton.defaultVariant.defaultState.color', undefined)
    })
  })

  describe('panel', () => {
    it('has the panel states', () => {
      expectAxes(scopes, 'panel', { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(
        CALENDAR,
        'defaultVariant.panel.defaultVariant.hover.background.color',
        'defaultVariant.panel.defaultVariant.defaultState.background.color'
      )
    })

    it('defaultState has no fallback (root has only defaults)', () => {
      expectFallback(CALENDAR, 'defaultVariant.panel.defaultVariant.defaultState.background.color', undefined)
    })
  })

  describe.each([
    ['header', 'background.color'],
    ['datePanel', 'background.color'],
    ['timePicker', 'padding'],
    ['footerButtonBar', 'padding'],
  ])('panel > %s', (child, token) => {
    const leaf = (panelState: string, childState: string) =>
      `defaultVariant.panel.defaultVariant.${panelState}.${child}.defaultVariant.${childState}.${token}`

    it('has the panel states', () => {
      expectAxes(scopes, child, { variant: ['defaultVariant'], state: ['defaultState', 'hover', 'focus'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(CALENDAR, leaf('defaultState', 'hover'), leaf('defaultState', 'defaultState'))
    })

    it('hover falls back to defaultState before the parent panel relaxes', () => {
      expectFallback(CALENDAR, leaf('hover', 'hover'), leaf('hover', 'defaultState'))
    })

    it('defaultState falls back on the parent panel state', () => {
      expectFallback(CALENDAR, leaf('hover', 'defaultState'), leaf('defaultState', 'defaultState'))
    })

    it('defaultState has no fallback when the parent panel is default', () => {
      expectFallback(CALENDAR, leaf('defaultState', 'defaultState'), undefined)
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
    const leaf = (panelState: string, parentState: string, childState: string) =>
      `defaultVariant.panel.defaultVariant.${panelState}.${parent}.defaultVariant.${parentState}.${child}.defaultVariant.${childState}.${token}`

    it('has its states (static tokens opted out)', () => {
      expectAxes(scopes, child, { variant: ['defaultVariant'], state: states })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(
        CALENDAR,
        leaf('defaultState', 'defaultState', 'hover'),
        leaf('defaultState', 'defaultState', 'defaultState')
      )
    })

    it('hover falls back to defaultState before its parents relax', () => {
      expectFallback(CALENDAR, leaf('hover', 'hover', 'hover'), leaf('hover', 'hover', 'defaultState'))
    })

    it(`defaultState falls back on the parent ${parent} state`, () => {
      expectFallback(CALENDAR, leaf('hover', 'hover', 'defaultState'), leaf('hover', 'defaultState', 'defaultState'))
    })

    it(`defaultState falls back on the panel state when ${parent} is default`, () => {
      expectFallback(
        CALENDAR,
        leaf('hover', 'defaultState', 'defaultState'),
        leaf('defaultState', 'defaultState', 'defaultState')
      )
    })

    it('defaultState has no fallback when all parents are default', () => {
      expectFallback(CALENDAR, leaf('defaultState', 'defaultState', 'defaultState'), undefined)
    })
  })
})
