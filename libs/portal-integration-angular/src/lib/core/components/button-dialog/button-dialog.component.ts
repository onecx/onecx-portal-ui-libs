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
import { Observable, from, isObservable, of } from 'rxjs'
import { DialogState } from '../../../services/portal-dialog.service'

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
      secondaryButtonIncluded: true,
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
  primaryButtonEnabled = true
  secondaryButtonEnabled = true

  constructor(public dynamicDialogConfig: DynamicDialogConfig, public dynamicDialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  primaryButtonAction() {
    if (this.componentRef === undefined) {
      this.resultEmitter.emit('primary')
      return
    }

    const state: DialogState<any> = {
      button: 'primary',
      result: undefined,
    }

    this.resolveButtonClick(state)
  }

  secondaryButtonAction() {
    if (this.componentRef === undefined) {
      this.resultEmitter.emit('secondary')
      return
    }

    const state: DialogState<any> = {
      button: 'secondary',
      result: undefined,
    }

    this.resolveButtonClick(state)
  }

  private resolveButtonClick(state: DialogState<any>) {
    const component = this.componentRef.instance

    // check if component implements DialogResult<T>
    if ('dialogResult' in component) {
      state.result = component.dialogResult
    }
    // check if component implements DialogButtonClicked
    if (typeof component.ocxDialogButtonClicked === 'function') {
      this.toObservable(component.ocxDialogButtonClicked(state)).subscribe({
        next: (result: boolean) => {
          if (result === true) {
            this.dynamicDialogRef.close(state)
          }
        },
      })
    } else {
      return this.dynamicDialogRef.close(state)
    }
  }

  private toObservable(
    ocxDialogButtonClickedResult: boolean | Observable<boolean> | Promise<boolean> | undefined
  ): Observable<boolean> {
    if (ocxDialogButtonClickedResult === undefined) {
      return of(true)
    }
    if (isObservable(ocxDialogButtonClickedResult)) {
      return ocxDialogButtonClickedResult
    }
    return from(Promise.resolve(ocxDialogButtonClickedResult))
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
      if (dialogConfig.secondaryButtonIncluded !== undefined) {
        this.dialogData.config.secondaryButtonIncluded = dialogConfig.secondaryButtonIncluded
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
      //check for DialogPrimaryButtonDisabled and DialogSecondaryButtonDisabled interfaces
      if ('primaryButtonEnabled' in componentRef.instance) {
        this.primaryButtonEnabled = false
        componentRef.instance.primaryButtonEnabled.subscribe({
          next: (enabled: boolean) => {
            this.primaryButtonEnabled = enabled
          },
        })
      }
      if ('secondaryButtonEnabled' in componentRef.instance) {
        this.secondaryButtonEnabled = false
        componentRef.instance.secondaryButtonEnabled.subscribe({
          next: (enabled: boolean) => {
            this.secondaryButtonEnabled = enabled
          },
        })
      }
      //populate container
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
      if (this.config.secondaryButtonIncluded !== undefined) {
        this.dialogData.config.secondaryButtonIncluded = this.config.secondaryButtonIncluded
      }
      if (this.config.secondaryButtonDetails !== undefined && this.config.secondaryButtonDetails.key !== undefined) {
        this.dialogData.config.secondaryButtonDetails = this.config.secondaryButtonDetails
      }
    }
  }
}
