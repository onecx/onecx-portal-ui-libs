import { collectAxisScopes, expectAxes, expectFallback } from '../test-utils'

const MULTISELECT = 'v2.usages.multiselect'

// The multiselect root is a variant axis (`defaultVariant`/`filled`); `settings` opts out with
// `axis: 'setting'`. Every nested stateful component (label container, chip, chip remove icon,
// filter input, list item and the shared checkbox) is a child boundary (`axis: 'state',
// child: true`) that re-roots the fallback, so a sibling child component (e.g. `chip` next to the
// label container's states, `checkbox` next to the list item's states) is never classified as a
// state of its parent.
describe('multiselect axis metadata', () => {
  const scopes = collectAxisScopes(MULTISELECT)

  it('opens scopes only for the root and its stateful child components', () => {
    const names = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...names].sort()).toEqual([
      'checkbox',
      'chip',
      'chipRemoveIcon',
      'input',
      'item',
      'labelContainer',
      'multiselect',
    ])
  })

  it('root exposes only the variants (settings opts out)', () => {
    expectAxes(scopes, 'multiselect', { variant: ['defaultVariant', 'filled'] })
  })

  it('label container exposes only its states', () => {
    expectAxes(scopes, 'labelContainer', { state: ['defaultState', 'hover', 'focus', 'invalid', 'disabled'] })
  })

  it('chip exposes only its states', () => {
    expectAxes(scopes, 'chip', { state: ['defaultState', 'hover', 'focus'] })
  })

  it('chip remove icon exposes the icon-only button states and severities', () => {
    expectAxes(scopes, 'chipRemoveIcon', {
      state: ['defaultState', 'hover', 'active', 'focus', 'disabled'],
      severity: ['defaultSeverity', 'success', 'info', 'help', 'warning', 'danger', 'contrast'],
    })
  })

  it('filter input exposes only its states', () => {
    expectAxes(scopes, 'input', { state: ['defaultState', 'hover', 'focus', 'active'] })
  })

  it('list item and checkbox expose only their states', () => {
    expectAxes(scopes, 'item', { state: ['defaultState', 'hover', 'focus', 'selected'] })
    expectAxes(scopes, 'checkbox', { state: ['defaultState', 'hover', 'focus', 'selected'] })
  })

  describe('fallback', () => {
    it('settings have no fallback', () => {
      expectFallback(MULTISELECT, { from: 'settings.variant', to: undefined })
    })

    it('a label container state falls back to its defaultState within the same variant', () => {
      expectFallback(MULTISELECT, {
        from: 'filled.labelContainer.hover.background',
        to: 'filled.labelContainer.defaultState.background',
      })
    })

    it('filled falls back to defaultVariant once the state is at default', () => {
      expectFallback(MULTISELECT, {
        from: 'filled.labelContainer.defaultState.background',
        to: 'defaultVariant.labelContainer.defaultState.background',
      })
    })

    it('a fully default label container token has no fallback', () => {
      expectFallback(MULTISELECT, { from: 'defaultVariant.labelContainer.defaultState.background', to: undefined })
    })

    it('a chip state falls back to the chip defaultState, not to a label container state', () => {
      expectFallback(MULTISELECT, {
        from: 'defaultVariant.labelContainer.chip.hover.color',
        to: 'defaultVariant.labelContainer.chip.defaultState.color',
      })
    })

    it('a chip remove icon state falls back to its defaultState before its severity', () => {
      expectFallback(MULTISELECT, {
        from: 'defaultVariant.labelContainer.chip.chipRemoveIcon.hover.danger.background.color',
        to: 'defaultVariant.labelContainer.chip.chipRemoveIcon.defaultState.danger.background.color',
      })
    })

    it('a list item checkbox state falls back to the checkbox defaultState', () => {
      expectFallback(MULTISELECT, {
        from: 'defaultVariant.overlay.listItems.item.checkbox.hover.background.color',
        to: 'defaultVariant.overlay.listItems.item.checkbox.defaultState.background.color',
      })
    })

    it('a filter input state falls back to the input defaultState', () => {
      expectFallback(MULTISELECT, {
        from: 'defaultVariant.overlay.filter.input.active.color',
        to: 'defaultVariant.overlay.filter.input.defaultState.color',
      })
    })
  })
})
