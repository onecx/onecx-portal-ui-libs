import type { Preview } from '@storybook/angular'
import { InitializeOptions, initialize, mswDecorator } from 'msw-storybook-addon'
import { patchPrimeNgAutoFocus } from '../src/lib/patch/primng-auto-focus-patch'

// Stories import PrimeNG modules directly (e.g. `primeng/table`) and never load
// AngularAcceleratorModule, so the module-file side effect that applies the
// PrimeNG v20 AutoFocus patch does not run in the Storybook bundle. Apply it
// here, at preview evaluation, so stories render with the patch active.
// (No-op in production apps, which import AngularAcceleratorModule.)
patchPrimeNgAutoFocus()


/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: 'bypass',
} as InitializeOptions)

const preview: Preview = {
  decorators: [mswDecorator],
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
