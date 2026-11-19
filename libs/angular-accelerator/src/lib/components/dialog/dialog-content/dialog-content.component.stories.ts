import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, componentWrapperDecorator, moduleMetadata } from '@storybook/angular-vite'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog'
import { Subject } from 'rxjs'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { DialogState, PortalDialogServiceData } from '../../../services/portal-dialog.service'
import { DialogMessageContentComponent } from '../dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from './dialog-content.component'

export default {
  title: 'Components/DialogContentComponent',
  component: DialogContentComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
        DynamicDialogRef,
      ],
    }),
    moduleMetadata({
      declarations: [DialogContentComponent, DialogMessageContentComponent],
      imports: [StorybookTranslateModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<DialogContentComponent>

export const DialogContentWithProjectedContent = {
  decorators: [
    applicationConfig({
      providers: [DynamicDialogConfig],
    }),
  ],
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-dialog-content>
              <p>My message to display</p>
          </ocx-dialog-content>
      `,
  }),
  args: {},
}

export const DialogContentWithMessageAndIcon = {
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              component: DialogMessageContentComponent,
              config: {},
              componentData: {
                message: 'Do you want to save your changes?',
                icon: OpenngIcons.QUESTION_CIRCLE,
              },
              portalDialogServiceData: {
                primaryButtonEnabled$: new Subject<boolean>(),
                secondaryButtonEnabled$: new Subject<boolean>(),
                customButtonEnabled$: new Subject<{ id: string; enabled: boolean }>(),
                buttonClicked$: new Subject<DialogState<unknown>>(),
              } satisfies PortalDialogServiceData,
            },
          },
        },
      ],
    }),
  ],
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `<ocx-dialog-content></ocx-dialog-content>`,
  }),
  args: {},
}

export const DialogContentScrollable = {
  decorators: [
    applicationConfig({
      providers: [DynamicDialogConfig],
    }),
  ],
  render: (args: any) => ({
    props: {
      ...args,
      paragraphs: Array.from({ length: 30 }, (_, i) => i + 1),
    },
    template: `
          <ocx-dialog-content>
              @for (paragraph of paragraphs; track paragraph) {
                <p>Paragraph {{ paragraph }} of a long dialog content that needs to be scrolled.</p>
              }
          </ocx-dialog-content>
      `,
  }),
  args: {},
}
