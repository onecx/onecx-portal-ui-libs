import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { ButtonModule } from 'primeng/button'
import { PrimeIcons } from 'primeng/api'
import { DialogInlineComponent } from './dialog-inline.component'
import { DialogContentComponent } from '../dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TooltipModule } from 'primeng/tooltip'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { OcxTooltipDirective } from '../../../directives/ocx-tooltip.directive'

export default {
  title: 'Components/DialogInlineComponent',
  component: DialogInlineComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        importProvidersFrom(StorybookThemeModule),
        DynamicDialogConfig,
        DynamicDialogRef,
      ],
    }),
    moduleMetadata({
      declarations: [DialogInlineComponent, DialogContentComponent, DialogFooterComponent, OcxTooltipDirective],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<DialogInlineComponent>

export const DialogInlineDefaultButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-dialog-inline>
              <p>My message to display</p>
          </ocx-dialog-inline>
      `,
  }),
  args: {},
}

export const DialogInlineWithButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-dialog-inline ${argsToTemplate(args)}>
            <p>My message to display</p>
        </ocx-dialog-inline>
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

export const DialogInlineWithCustomButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-dialog-inline ${argsToTemplate(args)}>
              <p>My message to display</p>
          </ocx-dialog-inline>
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
