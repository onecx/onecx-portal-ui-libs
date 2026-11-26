import type { Preview } from '@storybook/angular-vite'
import { patchOptimusAutoFocus } from '../src/lib/utils/optimus-autofocus-patch.utils'

// Stories import Optimus modules directly (e.g. `optimus/table`), that applies the Optimus  AutoFocus patch does not run in the Storybook bundle.
patchOptimusAutoFocus()

// Resolves once the DOM had no mutations for `quietMs` (or after `timeoutMs`).
// Translations are loaded asynchronously, so labels and aria attributes are filled in after the first render.
function waitForDomToSettle(quietMs = 150, timeoutMs = 3000): Promise<void> {
  return new Promise((resolve) => {
    let quietTimer: ReturnType<typeof setTimeout>
    const done = () => {
      observer.disconnect()
      clearTimeout(quietTimer)
      clearTimeout(timeoutTimer)
      resolve()
    }
    const observer = new MutationObserver(() => {
      clearTimeout(quietTimer)
      quietTimer = setTimeout(done, quietMs)
    })
    const timeoutTimer = setTimeout(done, timeoutMs)
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true })
    quietTimer = setTimeout(done, quietMs)
  })
}

const preview: Preview = {
  // afterEach hooks run in reverse order, so this runs before the a11y addon checks the story.
  // Only wait when that check runs (not on docs pages, not for stories with `a11y.test: 'off'`).
  afterEach: async ({ viewMode, parameters, globals }) => {
    const a11y = parameters['a11y']
    if (viewMode !== 'story' || a11y?.disable || a11y?.test === 'off' || globals['a11y']?.manual) return
    await waitForDomToSettle()
  },
  parameters: {
    // Fail `npm run test:a11y` on axe violations. Per story: `a11y: { test: 'todo' }` only reports, `'off'` skips.
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Components', '*'],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
