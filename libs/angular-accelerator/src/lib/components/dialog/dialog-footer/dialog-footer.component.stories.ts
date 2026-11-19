import { importProvidersFrom } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  Meta,
  applicationConfig,
  argsToTemplate,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular-vite'
import { OpenngIcons } from '@openng/optimus-ui/api'
import { ButtonModule } from '@openng/optimus-ui/button'
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog'
import { TooltipModule } from '@openng/optimus-ui/tooltip'
import { BehaviorSubject, Subject } from 'rxjs'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { OcxTooltipDirective } from '../../../directives/tooltip.directive'
import { DialogState, PortalDialogServiceData } from '../../../services/portal-dialog.service'
import { DialogFooterComponent } from './dialog-footer.component'

export default {
  title: 'Components/DialogFooterComponent',
  component: DialogFooterComponent,
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
      declarations: [DialogFooterComponent],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule, OcxTooltipDirective],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<DialogFooterComponent>

export const DialogFooterDefaultButtons = {
  decorators: [
    applicationConfig({
      providers: [DynamicDialogConfig],
    }),
  ],
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `<ocx-dialog-footer ${argsToTemplate(args)}></ocx-dialog-footer>`,
  }),
  args: {
    config: {
      primaryButtonDetails: {
        key: 'OCX_BUTTON_DIALOG.CONFIRM',
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'OCX_BUTTON_DIALOG.CANCEL',
      },
    },
  },
}

export const DialogFooterWithIconsAndCustomButtons = {
  decorators: [
    applicationConfig({
      providers: [DynamicDialogConfig],
    }),
  ],
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `<ocx-dialog-footer ${argsToTemplate(args)}></ocx-dialog-footer>`,
  }),
  args: {
    config: {
      primaryButtonDetails: {
        key: 'Save',
        icon: OpenngIcons.CHECK,
      },
      secondaryButtonIncluded: true,
      secondaryButtonDetails: {
        key: 'Cancel',
        icon: OpenngIcons.TIMES,
      },
      customButtons: [
        {
          id: 'custom-1',
          alignment: 'left',
          key: 'Reset',
          icon: OpenngIcons.REFRESH,
        },
        {
          id: 'custom-2',
          alignment: 'right',
          key: 'Save as draft',
        },
      ],
    },
  },
}

export const DialogFooterWithDisabledButtons = {
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              config: {
                primaryButtonDetails: {
                  key: 'Save',
                  icon: OpenngIcons.CHECK,
                },
                secondaryButtonIncluded: true,
                secondaryButtonDetails: {
                  key: 'Cancel',
                  icon: OpenngIcons.TIMES,
                },
                customButtons: [
                  {
                    id: 'custom-1',
                    alignment: 'left',
                    key: 'Reset',
                  },
                  {
                    id: 'custom-2',
                    alignment: 'right',
                    key: 'Save as draft',
                  },
                ],
              },
              componentData: {},
              portalDialogServiceData: {
                primaryButtonEnabled$: new BehaviorSubject<boolean>(false),
                secondaryButtonEnabled$: new BehaviorSubject<boolean>(true),
                // Custom buttons start disabled, enable one so both states are rendered.
                customButtonEnabled$: new BehaviorSubject<{ id: string; enabled: boolean }>({
                  id: 'custom-2',
                  enabled: true,
                }),
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
    template: `<ocx-dialog-footer></ocx-dialog-footer>`,
  }),
  args: {},
}
