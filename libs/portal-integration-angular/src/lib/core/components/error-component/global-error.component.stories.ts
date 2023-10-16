import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular'
import { importProvidersFrom } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ButtonModule } from 'primeng/button'
import { GlobalErrorComponent } from './global-error.component'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'

export default {
  title: 'GlobalErrorComponent',
  component: GlobalErrorComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule),
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(RouterModule.forRoot([], { useHash: true })),
      ],
    }),
    moduleMetadata({
      imports: [ButtonModule],
      providers: [],
    }),
  ],
} as Meta<GlobalErrorComponent>

const Template: StoryFn<GlobalErrorComponent> = (args: GlobalErrorComponent) => ({
  props: args,
})

export const Primary = {
  render: Template,

  args: {
    errCode: 'TestError',
  },
}
