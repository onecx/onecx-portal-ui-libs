import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { LoadingIndicatorComponent } from './loading-indicator.component'
import { StorybookThemeModule } from '../../storybook-theme.module'

export default {
  title: 'Components/LoadingIndicatorComponent',
  component: LoadingIndicatorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [LoadingIndicatorComponent],
      imports: [StorybookTranslateModule],
    }),
  ],
} as Meta<LoadingIndicatorComponent>

const Template: StoryFn<LoadingIndicatorComponent> = (args: LoadingIndicatorComponent) => ({
  props: args,
})

export const Basic = {
  render: Template,
  args: {},
}
