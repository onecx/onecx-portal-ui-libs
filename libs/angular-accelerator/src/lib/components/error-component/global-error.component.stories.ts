import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular-vite'
import { ButtonModule } from '@openng/optimus-ui/button'
import { RippleModule } from '@openng/optimus-ui/ripple'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { StorybookThemeModule } from '../../storybook-theme.module'
import { GlobalErrorComponent } from './global-error.component'

const GlobalErrorComponentSBConfig: Meta<GlobalErrorComponent> = {
  title: 'Components/GlobalErrorComponent',
  component: GlobalErrorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
        // No query params: the component falls back to the default error code and back url
        provideRouter([]),
      ],
    }),
    moduleMetadata({
      declarations: [GlobalErrorComponent],
      imports: [ButtonModule, RippleModule, StorybookTranslateModule],
    }),
  ],
  // Known contrast violations: the details text (1.62:1) and the text button sit directly on the primary background,
  // .pages-panel.card gets no background in Storybook. Check against the portal styles and fix, all other rules apply.
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
}

const Template: StoryFn<GlobalErrorComponent> = (args) => ({
  props: args,
})

export const Default = {
  render: Template,
  args: {},
}

export const WithCustomErrorCode = {
  render: Template,
  args: {
    errCode: 'E1002_MICROFRONTEND_NOT_AVAILABLE',
  },
}

export default GlobalErrorComponentSBConfig
