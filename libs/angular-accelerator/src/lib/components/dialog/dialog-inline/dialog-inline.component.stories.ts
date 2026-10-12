import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { ButtonModule } from '@openng/optimus-ui/button'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { DialogInlineComponent } from './dialog-inline.component'
import { DialogContentComponent } from '../dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component'
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { OcxTooltipDirective } from '../../../directives/tooltip.directive'

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
      declarations: [DialogInlineComponent, DialogContentComponent, DialogFooterComponent],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule, OcxTooltipDirective],
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
        icon: OpenngIcons.BOOK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Times',
        icon: OpenngIcons.TIMES,
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
        icon: OpenngIcons.BOOK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Times',
        icon: OpenngIcons.TIMES,
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
