import type { Preview } from '@storybook/angular'
import { patchPrimeNgAutoFocus } from '../src/lib/utils/primeng-autofocus-patch.utils'

// Stories import PrimeNG modules directly (e.g. `primeng/table`), that applies the PrimeNG v21 AutoFocus patch does not run in the Storybook bundle.
patchPrimeNgAutoFocus()

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

