import { Component, EventEmitter, Input, OnInit, importProvidersFrom, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { PrimeIcons } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TooltipModule } from 'primeng/tooltip'
import { Observable } from 'rxjs'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import { StorybookTranslateModule } from '../storybook-translate.module'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { StorybookThemeModule } from '../storybook-theme.module'
import { OcxTooltipDirective } from '../directives/ocx-tooltip.directive'

@Component({
  standalone: false,
  selector: 'ocx-button-dialog-with-portal-dialog-service',
  template: `<p-button label="Open dialog" (click)="openDialog()" />`,
})
class ButtonDialogWithPortalDialogServiceComponent {
  private portalDialogService = inject(PortalDialogService)

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
  standalone: false,
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
  title: 'Components/PortalDialogService',
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
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [
        DialogMessageContentComponent,
        DialogFooterComponent,
        DialogContentComponent,
        WithDisabledButtonsComponent,
        OcxTooltipDirective
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
  standalone: false,
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
  standalone: false,
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
  standalone: false,
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
