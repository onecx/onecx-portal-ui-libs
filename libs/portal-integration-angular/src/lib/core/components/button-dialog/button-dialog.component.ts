import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
  ButtonDialogConfig,
  ButtonDialogData,
  ButtonDialogDynamicDialogConfig,
  ButtonDialogDynamicDialogDetails,
} from '../../../model/button-dialog'

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
  defaultPrimaryButtonDetails: ButtonDialogDynamicDialogDetails = {
    label: 'Confirm',
    closeDialog: true,
  }

  defaultSecondaryButtonDetails: ButtonDialogDynamicDialogDetails = {
    label: 'Cancel',
    closeDialog: true,
  }

  defaultDialogData: ButtonDialogData = {
    component: DefaultButtonDialogHostComponent,
    config: {
      primaryButtonDetails: this.defaultPrimaryButtonDetails,
      secondaryButtonEnabled: true,
      secondaryButtonDetails: this.defaultSecondaryButtonDetails,
    },
    componentData: {},
  }

  @Input() config: ButtonDialogConfig = {}

  @Output() resultEmitter = new EventEmitter()

  @ViewChild('container', { static: true, read: ViewContainerRef })
  dialogHost!: ViewContainerRef

  dialogData: ButtonDialogData = this.defaultDialogData

  dialogEmitter: EventEmitter<any> = this.resultEmitter

  constructor(public dynamicDialogConfig: DynamicDialogConfig, public dynamicDialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  mainButtonAction() {
    const valueToEmit =
      this.dialogData.config.primaryButtonDetails!.valueToEmit !== undefined
        ? this.dialogData.config.primaryButtonDetails!.valueToEmit
        : this.dialogData.config.primaryButtonDetails?.label
    this.dialogEmitter.emit(valueToEmit)

    if ('closeDialog' in this.dialogData.config.primaryButtonDetails!) {
      if (this.dialogData.config.primaryButtonDetails.closeDialog) {
        this.dynamicDialogRef.close()
      }
    }
  }

  sideButtonAction() {
    const valueToEmit =
      this.dialogData.config.secondaryButtonDetails!.valueToEmit !== undefined
        ? this.dialogData.config.secondaryButtonDetails!.valueToEmit
        : this.dialogData.config.secondaryButtonDetails!.label
    this.dialogEmitter.emit(valueToEmit)

    if ('closeDialog' in this.dialogData.config.secondaryButtonDetails!) {
      if (this.dialogData.config.secondaryButtonDetails.closeDialog) {
        this.dynamicDialogRef.close()
      }
    }
  }

  loadComponent() {
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
      if (dialogConfig.primaryButtonDetails !== undefined && dialogConfig.primaryButtonDetails.label !== undefined) {
        this.dialogData.config.primaryButtonDetails = dialogConfig.primaryButtonDetails
      }
      if (dialogConfig.secondaryButtonEnabled !== undefined) {
        this.dialogData.config.secondaryButtonEnabled = dialogConfig.secondaryButtonEnabled
      }
      if (
        dialogConfig.secondaryButtonDetails !== undefined &&
        dialogConfig.secondaryButtonDetails.label !== undefined
      ) {
        this.dialogData.config.secondaryButtonDetails = dialogConfig.secondaryButtonDetails
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

    const viewContainerRef = this.dialogHost
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
      if (this.config.primaryButtonDetails !== undefined && this.config.primaryButtonDetails.label !== undefined) {
        this.dialogData.config.primaryButtonDetails = this.config.primaryButtonDetails
      }
      if (this.config.secondaryButtonEnabled !== undefined) {
        this.dialogData.config.secondaryButtonEnabled = this.config.secondaryButtonEnabled
      }
      if (this.config.secondaryButtonDetails !== undefined && this.config.secondaryButtonDetails.label !== undefined) {
        this.dialogData.config.secondaryButtonDetails = this.config.secondaryButtonDetails
      }
    }
  }
}
