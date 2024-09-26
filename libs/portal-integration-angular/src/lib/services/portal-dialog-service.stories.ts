import { Component, Input, importProvidersFrom } from '@angular/core'
import {
  Meta,
  StoryFn,
  applicationConfig,
  argsToTemplate,
  componentWrapperDecorator,
  moduleMetadata,
} from '@storybook/angular'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { BrowserModule } from '@angular/platform-browser'
import { ButtonModule } from 'primeng/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PortalDialogService } from './portal-dialog.service'
import { ButtonDialogComponent } from '../core/components/button-dialog/button-dialog.component'
import { StorybookTranslateModule } from '../core/storybook-translate.module'
import { DialogMessageContentComponent } from '../core/components/button-dialog/dialog-message-content/dialog-message-content.component'
import { PrimeIcons } from 'primeng/api'
import { TooltipModule } from 'primeng/tooltip'

@Component({
  selector: 'button-dialog-with-portal-dialog-service',
  template: `<button (click)="openDialog()">Open dialog</button>`,
})
class ButtonDialogWithPortalDialogService {
  constructor(private portalDialogService: PortalDialogService) {}

  @Input() title = 'Title'
  @Input() messageOrComponent = 'Message'
  @Input() primaryKey = 'Primary'
  @Input() secondaryKey = 'Secondary'
  @Input() extras = {}

  openDialog() {
    this.portalDialogService
      .openDialog(this.title, this.messageOrComponent, this.primaryKey, this.secondaryKey, this.extras)
      .subscribe(() => {})
  }
}

export default {
  title: 'PortalDialogService',
  component: ButtonDialogWithPortalDialogService,
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
} as Meta<ButtonDialogWithPortalDialogService>

const Template: StoryFn = (args) => ({
  props: args,
})

export const Basic = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
      <button-dialog-with-portal-dialog-service>
      </button-dialog-with-portal-dialog-service>
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
        <button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
        </button-dialog-with-portal-dialog-service>
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
          <button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
          </button-dialog-with-portal-dialog-service>
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
  selector: 'my-component-to-display',
  template: `<p>Hello, its my component to display</p>`,
})
class ComponentToDisplay {}

export const ComponentDisplayed = {
  render: (args: any) => ({
    props: {
      ...args,
    },
    template: `
            <button-dialog-with-portal-dialog-service ${argsToTemplate(args)}>
            </button-dialog-with-portal-dialog-service>
              `,
  }),
  args: {
    title: 'Custom title',
    messageOrComponent: {
      type: ComponentToDisplay,
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
