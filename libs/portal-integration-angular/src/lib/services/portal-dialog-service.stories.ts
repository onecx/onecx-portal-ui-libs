import { Component, EventEmitter, Input, OnInit, importProvidersFrom } from '@angular/core'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { BrowserModule } from '@angular/platform-browser'
import { ButtonModule } from 'primeng/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { StorybookTranslateModule } from '../core/storybook-translate.module'
import { DialogMessageContentComponent } from '../core/components/button-dialog/dialog-message-content/dialog-message-content.component'
import { PrimeIcons } from 'primeng/api'
import { TooltipModule } from 'primeng/tooltip'
import { DialogFooterComponent } from '../core/components/dialog/dialog-footer/dialog-footer.component'
import { DialogContentComponent } from '../core/components/dialog/dialog-content/dialog-content.component'
import { Observable } from 'rxjs'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'ocx-button-dialog-with-portal-dialog-service',
  template: `<p-button label="Open dialog" (click)="openDialog()" />`,
})
class ButtonDialogWithPortalDialogServiceComponent {
  constructor(private portalDialogService: PortalDialogService) {}

  @Input() title = 'Title'
  @Input() messageOrComponent = 'Message'
  @Input() primaryKey = 'Primary'
  @Input() secondaryKey = 'Secondary'
  @Input() extras = {}

  openDialog() {
    this.portalDialogService
      .openDialog(this.title, this.messageOrComponent, this.primaryKey, this.secondaryKey, this.extras)
      .subscribe(() => {
        console.log('dialog closed')
      })
  }
}

@Component({
  selector: 'ocx-my-component-to-display',
  template: `<p>Component to display with disabled buttons</p>
    <div class="flex gap-2">
      <p-button label="Toggle custom button" (click)="clickCustom()" />
      <p-button label="Toggle secondary button" (click)="click2()" />
      <p-button label="Toggle primary button" (click)="click1()" />
    </div>`,
})
class WithDisabledButtonsComponent
  implements DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled, DialogCustomButtonsDisabled
{
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()

  primaryState = false
  secondaryState = false
  customState = false

  click1() {
    this.primaryState = !this.primaryState
    this.primaryButtonEnabled.emit(this.primaryState)
  }
  click2() {
    this.secondaryState = !this.secondaryState
    this.secondaryButtonEnabled.emit(this.secondaryState)
  }
  clickCustom() {
    this.customState = !this.customState
    this.customButtonEnabled.emit({
      id: 'custom1',
      enabled: this.customState,
    })
  }
}

export default {
  title: 'PortalDialogService',
  component: ButtonDialogWithPortalDialogServiceComponent,
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        DynamicDialogConfig,
        DynamicDialogRef,
        PortalDialogService,
        DialogService,
        importProvidersFrom(StorybookTranslateModule),
      ],
    }),
    moduleMetadata({
      declarations: [
        DialogMessageContentComponent,
        DialogFooterComponent,
        DialogContentComponent,
        WithDisabledButtonsComponent,
      ],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule, FormsModule],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<ButtonDialogWithPortalDialogServiceComponent>

export const Basic = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <ocx-button-dialog-with-portal-dialog-service>
      </ocx-button-dialog-with-portal-dialog-service>
        `,
  }),
  args: {},
}

export const CustomData = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </ocx-button-dialog-with-portal-dialog-service>
          `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: 'Primary Button',
    secondaryKey: 'Secondary Button',
    extras: {},
  },
}

export const CustomDataWithExtendedButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
          <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
          </ocx-button-dialog-with-portal-dialog-service>
            `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {},
  },
}

@Component({
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display</p>`,
})
class ComponentToDisplayComponent {}

export const ComponentDisplayed = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplayComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {},
  },
}

export const ComponentDisplayedWithDisabledButtons = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: WithDisabledButtonsComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {
      customButtons: [
        {
          id: 'custom1',
          alignment: 'right',
          key: 'MY_CUSTOM_BUTTON',
        },
      ],
    },
  },
}

@Component({
  selector: 'ocx-my-component-to-display',
  template: `<p>Component to display with validation</p>
    <p>It is impossible to close the dialog by clicking secondary button</p>
    <p>Type result to be able to close the dialog via primary button click</p>
    <input type="text" (change)="onInputChange($event)" />`,
})
class WithValidationComponent implements DialogResult<string>, DialogButtonClicked {
  dialogResult = ''

  onInputChange(event: any) {
    const value: string = event.target.value
    this.dialogResult = value
  }

  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Observable<boolean> | Promise<boolean> | undefined {
    if (state.button === 'primary' && this.dialogResult === 'result') return true

    return false
  }
}

export const ComponentDisplayedWithValidation = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: WithValidationComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
  },
}

export const CustomAutofocus = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
        <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </ocx-button-dialog-with-portal-dialog-service>
          `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: 'Custom message',
    primaryKey: 'Primary Button',
    secondaryKey: 'Secondary Button',
    extras: {
      autoFocusButton: 'secondary',
    },
  },
}

@Component({
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display custom buttons</p>`,
})
class ComponentToDisplayCustomButtonsComponent implements DialogCustomButtonsDisabled, OnInit {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()
  ngOnInit(): void {
    this.customButtonEnabled.emit({ id: 'custom1', enabled: true })
  }
}

export const CustomButtonsWithAutofocus = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <ocx-button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </ocx-button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplayCustomButtonsComponent,
    },
    primaryKey: {
      key: 'PRIMARY_KEY',
      icon: PrimeIcons.BOOKMARK,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'right',
    },
    secondaryKey: {
      key: 'SECONDARY_KEY',
      icon: PrimeIcons.SEARCH,
      tooltipKey: 'TOOLTIP_KEY',
      tooltipPosition: 'left',
    },
    extras: {
      customButtons: [
        {
          id: 'custom1',
          alignment: 'right',
          key: 'CUSTOM_KEY',
          icon: 'pi pi-times',
        },
      ],
      autoFocusButton: 'custom',
      autoFocusButtonCustomId: 'custom1',
    },
  },
}
