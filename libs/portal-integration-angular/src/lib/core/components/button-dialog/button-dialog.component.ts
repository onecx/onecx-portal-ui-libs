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
import { Observable, from, isObservable, map, of, startWith } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

import { ButtonDialogButtonDetails, ButtonDialogConfig, ButtonDialogData } from '../../../model/button-dialog'
import { DialogMessageContentComponent } from './dialog-message-content/dialog-message-content.component'
import {
  DialogButtonClicked,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
} from '../../../services/portal-dialog.service'

@Component({
  selector: 'ocx-button-dialog',
  templateUrl: './button-dialog.component.html',
  styleUrls: ['./button-dialog.component.scss'],
})
export class ButtonDialogComponent implements OnInit {
  defaultPrimaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'OCX_BUTTON_DIALOG.CONFIRM',
  }

  defaultSecondaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'OCX_BUTTON_DIALOG.CANCEL',
  }

  defaultDialogData: ButtonDialogData = {
    component: DialogMessageContentComponent,
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
  primaryButtonDisabled$: Observable<boolean | undefined> | undefined
  secondaryButtonDisabled$: Observable<boolean | undefined> | undefined

  constructor(public dynamicDialogConfig: DynamicDialogConfig, public dynamicDialogRef: DynamicDialogRef) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  primaryButtonAction() {
    if (!this.componentRef) {
      this.resultEmitter.emit('primary')
      return
    }

    const state: DialogState<unknown> = {
      button: 'primary',
      result: undefined,
    }

    this.resolveButtonClick(state)
  }

  secondaryButtonAction() {
    if (!this.componentRef) {
      this.resultEmitter.emit('secondary')
      return
    }

    const state: DialogState<unknown> = {
      button: 'secondary',
      result: undefined,
    }

    this.resolveButtonClick(state)
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data) {
      this.setUpDialogDataForDynamicConfig()
    } else {
      this.setUpDialogDataForInput()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    if (dynamicConfigData.config) {
      const dialogConfig = dynamicConfigData.config
      if (!!dialogConfig.primaryButtonDetails && !!dialogConfig.primaryButtonDetails.key) {
        this.dialogData.config.primaryButtonDetails = dialogConfig.primaryButtonDetails
      }
      if (dialogConfig.secondaryButtonIncluded !== undefined) {
        this.dialogData.config.secondaryButtonIncluded = dialogConfig.secondaryButtonIncluded
      }
      if (!!dialogConfig.secondaryButtonDetails && !!dialogConfig.secondaryButtonDetails.key) {
        this.dialogData.config.secondaryButtonDetails = dialogConfig.secondaryButtonDetails
      }
    }
    if (dynamicConfigData.component) {
      this.dialogData.component = dynamicConfigData.component
    }
    if (dynamicConfigData.componentData) {
      this.dialogData.componentData = dynamicConfigData.componentData
    }

    const viewContainerRef = this.dialogHost
    viewContainerRef.clear()

    if (this.dialogData.component) {
      const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component)

      if (this.isDialogPrimaryButtonDisabledImplemented(componentRef.instance)) {
        this.primaryButtonDisabled$ = componentRef.instance.primaryButtonEnabled.pipe(
          startWith(false),
          map((isEnabled: boolean) => !isEnabled)
        )
      }
      if (this.isDialogSecondaryButtonDisabledImplemented(componentRef.instance)) {
        this.secondaryButtonDisabled$ = componentRef.instance.secondaryButtonEnabled.pipe(
          startWith(false),
          map((isEnabled: boolean) => !isEnabled)
        )
      }

      //populate container
      Object.keys(this.dialogData.componentData).forEach((k) => {
        componentRef.setInput(k, this.dialogData.componentData[k])
      })
      this.componentRef = componentRef
    }
  }

  setUpDialogDataForInput() {
    this.dialogData.component = undefined
    this.dialogData.componentData = undefined
    if (this.config) {
      if (!!this.config.primaryButtonDetails && !!this.config.primaryButtonDetails.key) {
        this.dialogData.config.primaryButtonDetails = this.config.primaryButtonDetails
      }
      if (this.config.secondaryButtonIncluded) {
        this.dialogData.config.secondaryButtonIncluded = this.config.secondaryButtonIncluded
      }
      if (!!this.config.secondaryButtonDetails && !!this.config.secondaryButtonDetails.key) {
        this.dialogData.config.secondaryButtonDetails = this.config.secondaryButtonDetails
      }
    }
  }

  private resolveButtonClick(state: DialogState<unknown>) {
    const component = this.componentRef.instance

    const hasDialogResult = this.isDialogResultImplemented(component)
    if (hasDialogResult) {
      state.result = component.dialogResult
    }
    const closeResult = state
    // check if component implements DialogButtonClicked
    if (this.isDialogButtonClickedImplemented(component)) {
      const buttonResult = component.ocxDialogButtonClicked(state)
      // If undefined or void is returned, close dialog and return result
      if (buttonResult === undefined) {
        if (hasDialogResult) {
          closeResult.result = component.dialogResult
        }
        return this.dynamicDialogRef.close(closeResult)
      }
      this.toObservable(buttonResult).subscribe((result: boolean) => {
        if (result === true) {
          if (hasDialogResult) {
            closeResult.result = component.dialogResult
          }
          this.dynamicDialogRef.close(closeResult)
        }
      })
    } else {
      return this.dynamicDialogRef.close(closeResult)
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

  private isDialogResultImplemented(component: any): component is DialogResult<unknown> {
    return 'dialogResult' in component
  }

  private isDialogButtonClickedImplemented(component: any): component is DialogButtonClicked {
    return typeof component.ocxDialogButtonClicked === 'function'
  }

  private isDialogPrimaryButtonDisabledImplemented(component: any): component is DialogPrimaryButtonDisabled {
    return 'primaryButtonEnabled' in component
  }

  private isDialogSecondaryButtonDisabledImplemented(component: any): component is DialogSecondaryButtonDisabled {
    return 'secondaryButtonEnabled' in component
  }
}
