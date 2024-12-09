import { Component, EventEmitter, Input, OnInit, importProvidersFrom } from '@angular/core'
import { Meta, applicationConfig, argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { BrowserModule } from '@angular/platform-browser'
import { ButtonModule } from 'primeng/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DialogCustomButtonsDisabled, PortalDialogService } from './portal-dialog.service'
import { ButtonDialogComponent } from '../core/components/button-dialog/button-dialog.component'
import { StorybookTranslateModule } from '../core/storybook-translate.module'
import { DialogMessageContentComponent } from '../core/components/button-dialog/dialog-message-content/dialog-message-content.component'
import { PrimeIcons } from 'primeng/api'
import { TooltipModule } from 'primeng/tooltip'

@Component({
  selector: 'ocx-button-dialog-with-portal-dialog-service',
  template: `<button (click)="openDialog()">Open dialog</button>`,
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
      declarations: [ButtonDialogComponent, DialogMessageContentComponent],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule],
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

@Component({
  selector: 'ocx-my-component-to-display',
  template: `<p>Hello, its my component to display custom buttons</p>`,
})
class ComponentToDisplayCustomButtons implements DialogCustomButtonsDisabled, OnInit {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()

  ngOnInit(): void {
    this.customButtonEnabled.emit({ id: 'custom1', enabled: true })
  }
}

export const CustomButtons = {
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
      type: ComponentToDisplayCustomButtons,
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
    },
  },
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
      type: ComponentToDisplayCustomButtons,
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
