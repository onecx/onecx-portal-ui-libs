import { NgComponentOutlet } from '@angular/common'
import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, StoryFn, applicationConfig, componentWrapperDecorator, moduleMetadata } from '@storybook/angular-vite'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { DialogMessageContentComponent } from './dialog-message-content.component'

export default {
  title: 'Components/DialogMessageContentComponent',
  component: DialogMessageContentComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [DialogMessageContentComponent],
      imports: [StorybookTranslateModule, NgComponentOutlet],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<DialogMessageContentComponent>

// The component has no selector, so Storybook would render it without passing the inputs.
const Template: StoryFn<DialogMessageContentComponent> = (args) => ({
  props: {
    component: DialogMessageContentComponent,
    inputs: { message: args.message, messageParameters: args.messageParameters ?? {}, icon: args.icon ?? '' },
  },
  template: `<ng-container *ngComponentOutlet="component; inputs: inputs"></ng-container>`,
})

export const DialogMessageContentDefault = {
  render: Template,
  args: {
    message: 'Your changes have been saved.',
  },
}

export const DialogMessageContentWithIcon = {
  render: Template,
  args: {
    message: 'Do you want to delete this item?',
    icon: OpenngIcons.EXCLAMATION_TRIANGLE,
  },
}

export const DialogMessageContentWithLongText = {
  render: Template,
  args: {
    message:
      'This is a long message that contains a very long unbroken word to show that it wraps instead of overflowing: Donaudampfschifffahrtsgesellschaftskapitaenswitwenrentenversicherungsanstalt',
    icon: OpenngIcons.INFO_CIRCLE,
  },
}
