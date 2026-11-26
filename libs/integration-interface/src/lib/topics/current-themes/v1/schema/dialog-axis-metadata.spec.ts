import { collectAxisScopes, expectAxes, expectFallback } from './test-utils'

const DIALOG = 'v2.usages.dialog'

// The dialog's root is structural (settings/root/header/content/footer) and carries no axis of its
// own, so it opens no scope. The usage's only axis is its buttons — the close button and the
// primary/secondary footer action buttons — each a state slot (defaultState/hover) that re-roots as
// a child component. Each button's `hover` falls back to its own `defaultState`, and the
// fully-default path (and the static root/content/title tokens, plus the settings block) carry no
// fallback. Fallback paths are relative to DIALOG.
describe('dialog axis metadata', () => {
  const scopes = collectAxisScopes(DIALOG)

  it('opens scopes only for the expected buttons (the structural root opens none)', () => {
    const names = new Set([...scopes.keys()].map((path) => path.split('.').pop()))
    expect([...names].sort()).toEqual(['closeButton', 'primaryActionButton', 'secondaryActionButton'])
  })

  describe('root', () => {
    it('a static root token has no fallback (no enclosing scope)', () => {
      expectFallback(DIALOG, { from: 'root.bg', to: undefined })
    })

    it('a content padding token has no fallback', () => {
      expectFallback(DIALOG, { from: 'content.padding', to: undefined })
    })

    it('a header title token (unmarked, no scope) has no fallback', () => {
      expectFallback(DIALOG, { from: 'header.title.fontSize', to: undefined })
    })

    it('the settings block (axis: setting) has no fallback', () => {
      expectFallback(DIALOG, { from: 'settings.modal', to: undefined })
    })
  })

  describe.each([
    ['closeButton', 'header.closeButton'],
    ['primaryActionButton', 'footer.primaryActionButton'],
    ['secondaryActionButton', 'footer.secondaryActionButton'],
  ])('button %s', (name, path) => {
    it('has its states (per-state content unmarked)', () => {
      expectAxes(scopes, name, { state: ['defaultState', 'hover'] })
    })

    it('hover falls back to defaultState', () => {
      expectFallback(DIALOG, {
        from: `${path}.hover.color`,
        to: `${path}.defaultState.color`,
      })
    })

    it('defaultState has no fallback (root opens no scope)', () => {
      expectFallback(DIALOG, { from: `${path}.defaultState.color`, to: undefined })
    })
  })
})
