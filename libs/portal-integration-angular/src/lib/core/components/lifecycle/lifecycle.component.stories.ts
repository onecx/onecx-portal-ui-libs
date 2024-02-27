import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { LifecycleComponent } from './lifecycle.component'

export default {
  title: 'LifecycleComponent',
  component: LifecycleComponent,
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(BrowserModule), importProvidersFrom(BrowserAnimationsModule)],
    }),
    moduleMetadata({
      declarations: [LifecycleComponent],
      imports: [StorybookTranslateModule],
    }),
  ],
} as Meta<LifecycleComponent>

const Template: StoryFn<LifecycleComponent> = (args: LifecycleComponent) => ({
  props: args,
})

export const WithoutHighlightedStep = {
  render: Template,
}