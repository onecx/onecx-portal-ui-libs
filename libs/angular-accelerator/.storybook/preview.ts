import type { Preview } from '@storybook/angular'
import { patchOptimusAutoFocus } from '../src/lib/utils/optimus-autofocus-patch.utils'

// Stories import Optimus modules directly (e.g. `optimus/table`), that applies the Optimus  AutoFocus patch does not run in the Storybook bundle.
patchOptimusAutoFocus()


const preview: Preview = {
  parameters: {
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