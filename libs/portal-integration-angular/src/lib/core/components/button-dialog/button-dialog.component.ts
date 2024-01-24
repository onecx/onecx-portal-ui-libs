import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonDialogButtonDetails, ButtonDialogConfig, ButtonDialogData } from '../../../model/button-dialog'
import { DialogHostComponent } from './dialog-host/dialog-host.component'

@Component({
  selector: 'ocx-button-dialog',
  templateUrl: './button-dialog.component.html',
})
export class ButtonDialogComponent implements OnInit {
  defaultPrimaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'Confirm',
  }

  defaultSecondaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'Cancel',
  }

  defaultDialogData: ButtonDialogData = {
    component: DialogHostComponent,
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

  componentRef!: ComponentRef<any>

  constructor(public dynamicDialogConfig: DynamicDialogConfig, public dynamicDialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  primaryButtonAction() {
    if (this.componentRef === undefined) {
      this.resultEmitter.emit('primary')
      return
    }

    const component = this.componentRef.instance
    let result = undefined
    if ('dialogResult' in component) {
      result = component.dialogResult
    }
    this.dynamicDialogRef.close({
      button: 'primary',
      result: result,
    })
  }

  secondaryButtonAction() {
    if (this.componentRef === undefined) {
      this.resultEmitter.emit('secondary')
    }

    const component = this.componentRef.instance
    let result = undefined
    if ('dialogResult' in component) {
      result = component.dialogResult
    }
    this.dynamicDialogRef.close({
      button: 'secondary',
      result: result,
    })
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data !== undefined) {
      this.setUpDialogDataForDynamicConfig()
    } else {
      this.setUpDialogDataForInput()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    if (dynamicConfigData.config !== undefined) {
      const dialogConfig = dynamicConfigData.config
      if (dialogConfig.primaryButtonDetails !== undefined && dialogConfig.primaryButtonDetails.key !== undefined) {
        this.dialogData.config.primaryButtonDetails = dialogConfig.primaryButtonDetails
      }
      if (dialogConfig.secondaryButtonEnabled !== undefined) {
        this.dialogData.config.secondaryButtonEnabled = dialogConfig.secondaryButtonEnabled
      }
      if (dialogConfig.secondaryButtonDetails !== undefined && dialogConfig.secondaryButtonDetails.key !== undefined) {
        this.dialogData.config.secondaryButtonDetails = dialogConfig.secondaryButtonDetails
      }
    }
    if (dynamicConfigData.component !== undefined) {
      this.dialogData.component = dynamicConfigData.component
    }
    if (dynamicConfigData.componentData !== undefined) {
      this.dialogData.componentData = dynamicConfigData.componentData
    }

    const viewContainerRef = this.dialogHost
    viewContainerRef.clear()

    if (this.dialogData.component) {
      const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component)
      Object.keys(this.dialogData.componentData).forEach((k) => {
        componentRef.instance[k] = this.dialogData.componentData[k]
      })
      this.componentRef = componentRef
    }
  }

  setUpDialogDataForInput() {
    this.dialogData.component = undefined
    this.dialogData.componentData = undefined
    if (this.config !== undefined) {
      if (this.config.primaryButtonDetails !== undefined && this.config.primaryButtonDetails.key !== undefined) {
        this.dialogData.config.primaryButtonDetails = this.config.primaryButtonDetails
      }
      if (this.config.secondaryButtonEnabled !== undefined) {
        this.dialogData.config.secondaryButtonEnabled = this.config.secondaryButtonEnabled
      }
      if (this.config.secondaryButtonDetails !== undefined && this.config.secondaryButtonDetails.key !== undefined) {
        this.dialogData.config.secondaryButtonDetails = this.config.secondaryButtonDetails
      }
    }
  }
}
