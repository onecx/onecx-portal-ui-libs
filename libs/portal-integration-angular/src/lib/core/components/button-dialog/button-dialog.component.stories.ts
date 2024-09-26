import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../storybook-translate.module'
import { ButtonDialogComponent } from './button-dialog.component'
import { ButtonModule } from 'primeng/button'
import { PrimeIcons } from 'primeng/api'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

export default {
  title: 'ButtonDialogComponent',
  component: ButtonDialogComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        DynamicDialogConfig,
        DynamicDialogRef,
      ],
    }),
    moduleMetadata({
      declarations: [ButtonDialogComponent],
      imports: [StorybookTranslateModule, ButtonModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<ButtonDialogComponent>

export const ButtonDialogWithInlineContentDefaultButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-button-dialog>
              <p>My message to display</p>
          </ocx-button-dialog>
      `,
  }),
  args: {},
}

export const ButtonDialogWithInlineContent = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog ${argsToTemplate(args)}>
            <p>My message to display</p>
        </ocx-button-dialog>
    `,
  }),
  args: {
    config: {
      primaryButtonDetails: {
        key: 'KEY',
        icon: PrimeIcons.BOOK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Times',
        icon: PrimeIcons.TIMES,
      },
    },
  },
}

export const ButtonDialogWithCustomButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-button-dialog ${argsToTemplate(args)}>
              <p>My message to display</p>
          </ocx-button-dialog>
      `,
  }),
  args: {
    config: {
      primaryButtonDetails: {
        key: 'KEY',
        icon: PrimeIcons.BOOK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Times',
        icon: PrimeIcons.TIMES,
      },
      customButtons: [
        {
          id: 'custom-1',
          alignment: 'left',
          key: 'custom 1',
        },
        {
          id: 'custom-2',
          alignment: 'right',
          key: 'custom 2',
        },
      ],
    },
  },
}
