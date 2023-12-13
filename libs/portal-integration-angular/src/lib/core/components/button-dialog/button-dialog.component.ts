import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
  ButtonDialogConfig,
  ButtonDialogData,
  ButtonDialogDynamicDialogConfig,
  ButtonDialogDynamicDialogDetails,
} from '../../../model/button-dialog'
import { ButtonDialogHostDirective } from '../../directives/button-dialog-host.directive'

@Component({
  template: `
    <div>
      <h2>{{ title }}</h2>
    </div>
  `,
})
export class DefaultButtonDialogHostComponent {
  @Input() title = 'Title'
}

@Component({
  selector: 'ocx-button-dialog',
  templateUrl: './button-dialog.component.html',
})
export class ButtonDialogComponent implements OnInit {
  defaultMainButtonDetails: ButtonDialogDynamicDialogDetails = {
    label: 'Confirm',
    icon: 'pi pi-check',
    closeDialog: true,
    valueToEmit: true,
  }

  defaultSideButtonDetails: ButtonDialogDynamicDialogDetails = {
    label: 'Cancel',
    icon: 'pi pi-times',
    closeDialog: true,
    valueToEmit: false,
  }

  defaultDialogData: ButtonDialogData = {
    component: DefaultButtonDialogHostComponent,
    config: {
      mainButtonDetails: this.defaultMainButtonDetails,
      sideButtonEnabled: true,
      sideButtonDetails: this.defaultSideButtonDetails,
    },
    componentData: {},
  }

  @Input() config: ButtonDialogConfig = {}

  @Output() resultEmitter = new EventEmitter()

  @ViewChild(ButtonDialogHostDirective, { static: true })
  dialogHost!: ButtonDialogHostDirective

  dialogData: ButtonDialogData = this.defaultDialogData

  dialogEmitter: EventEmitter<any> = this.resultEmitter

  constructor(public dynamicDialogConfig: DynamicDialogConfig, public dynamicDialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  mainButtonAction() {
    this.dialogEmitter.emit(this.dialogData.config.mainButtonDetails!.valueToEmit)
    if (
      'closeDialog' in this.dialogData.config.mainButtonDetails! &&
      this.dialogData.config.mainButtonDetails.closeDialog
    ) {
      this.dynamicDialogRef.close()
    }
  }

  sideButtonAction() {
    this.dialogEmitter.emit(this.dialogData.config.sideButtonDetails!.valueToEmit)
    if (
      'closeDialog' in this.dialogData.config.sideButtonDetails! &&
      this.dialogData.config.sideButtonDetails.closeDialog
    ) {
      this.dynamicDialogRef.close()
    }
  }

  loadComponent() {
    const viewContainerRef = this.dialogHost.viewContainerRef
    viewContainerRef.clear()

    if (this.dynamicDialogConfig.data !== undefined) {
      this.setUpDialogDataForDynamicConfig()
    } else {
      this.setUpDialogDataForInput()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogDynamicDialogConfig = this.dynamicDialogConfig.data
    if (dynamicConfigData.config !== undefined) {
      const dialogConfig = dynamicConfigData.config
      if (dialogConfig.mainButtonDetails !== undefined) {
        this.dialogData.config.mainButtonDetails = dialogConfig.mainButtonDetails
      }
      if (dialogConfig.sideButtonEnabled !== undefined) {
        this.dialogData.config.sideButtonEnabled = dialogConfig.sideButtonEnabled
      }
      if (dialogConfig.sideButtonDetails !== undefined) {
        this.dialogData.config.sideButtonDetails = dialogConfig.sideButtonDetails
      }
    }
    if (dynamicConfigData.component !== undefined) {
      this.dialogData.component = dynamicConfigData.component
    }
    if (dynamicConfigData.emitter !== undefined) {
      this.dialogEmitter = dynamicConfigData.emitter
    }
    if (dynamicConfigData.componentData !== undefined) {
      this.dialogData.componentData = dynamicConfigData.componentData
    }

    const viewContainerRef = this.dialogHost.viewContainerRef
    viewContainerRef.clear()

    const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component!)
    Object.keys(this.dialogData.componentData).forEach((k) => {
      componentRef.instance[k] = this.dialogData.componentData[k]
    })
  }

  setUpDialogDataForInput() {
    this.dialogData.component = undefined
    this.dialogData.componentData = undefined
    if (this.config !== undefined) {
      if (this.config.mainButtonDetails !== undefined) {
        this.dialogData.config.mainButtonDetails = this.config.mainButtonDetails
      }
      if (this.config.sideButtonEnabled !== undefined) {
        this.dialogData.config.sideButtonEnabled = this.config.sideButtonEnabled
      }
      if (this.config.sideButtonDetails !== undefined) {
        this.dialogData.config.sideButtonDetails = this.config.sideButtonDetails
      }
    }
  }
}
