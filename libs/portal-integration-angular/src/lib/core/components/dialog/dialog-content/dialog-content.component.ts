import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core'
import { Observable, Subscription, from, isObservable, of, startWith } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonDialogData } from '../../../../model/button-dialog'
import { DialogMessageContentComponent } from '../../button-dialog/dialog-message-content/dialog-message-content.component'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  PortalDialogServiceData,
} from '../../../../services/portal-dialog.service'

@Component({
  selector: 'ocx-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.scss'],
})
export class DialogContentComponent implements OnInit, OnDestroy {
  defaultDialogData: ButtonDialogData = {
    component: DialogMessageContentComponent,
    config: {},
    componentData: {},
  }

  @ViewChild('container', { static: true, read: ViewContainerRef })
  dialogHost!: ViewContainerRef

  dialogData: ButtonDialogData = this.defaultDialogData
  componentRef!: ComponentRef<any>

  primaryButtonEnabledSub?: Subscription
  secondaryButtonEnabledSub?: Subscription
  customButtonEnabledSub?: Subscription
  buttonClickedSub?: Subscription

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public dynamicDialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  ngOnDestroy(): void {
    this.primaryButtonEnabledSub?.unsubscribe()
    this.secondaryButtonEnabledSub?.unsubscribe()
    this.customButtonEnabledSub?.unsubscribe()
    this.buttonClickedSub?.unsubscribe()
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data) {
      this.setUpDialogDataForDynamicConfig()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    const portalDialogServiceData: PortalDialogServiceData = this.dynamicDialogConfig.data.portalDialogServiceData
    if (dynamicConfigData.component) {
      this.dialogData.component = dynamicConfigData.component
    }
    if (dynamicConfigData.componentData) {
      this.dialogData.componentData = dynamicConfigData.componentData
    }

    const viewContainerRef = this.dialogHost
    viewContainerRef.clear()

    this.buttonClickedSub = portalDialogServiceData.buttonClicked$.subscribe((state) => {
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
    })

    if (this.dialogData.component) {
      const componentRef = viewContainerRef.createComponent<any>(this.dialogData.component)

      if (this.isDialogPrimaryButtonDisabledImplemented(componentRef.instance)) {
        this.primaryButtonEnabledSub = componentRef.instance.primaryButtonEnabled
          .pipe(startWith(false))
          .subscribe((isEnabled) => {
            portalDialogServiceData.primaryButtonEnabled$.emit(isEnabled)
          })
      }
      if (this.isDialogSecondaryButtonDisabledImplemented(componentRef.instance)) {
        this.secondaryButtonEnabledSub = componentRef.instance.secondaryButtonEnabled
          .pipe(startWith(false))
          .subscribe((isEnabled) => {
            portalDialogServiceData.secondaryButtonEnabled$.emit(isEnabled)
          })
      }
      if (this.isDialogCustomButtonDisabledImplemented(componentRef.instance)) {
        this.customButtonEnabledSub = componentRef.instance.customButtonEnabled.subscribe((buttonEnabled) => {
          portalDialogServiceData.customButtonEnabled$.emit(buttonEnabled)
        })
      }

      //populate container
      Object.keys(this.dialogData.componentData).forEach((k) => {
        componentRef.setInput(k, this.dialogData.componentData[k])
      })
      this.componentRef = componentRef
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

  private isDialogCustomButtonDisabledImplemented(component: any): component is DialogCustomButtonsDisabled {
    return 'customButtonEnabled' in component
  }
}
