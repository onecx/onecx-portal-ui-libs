import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject, Observable, from, isObservable, map, of, startWith, withLatestFrom } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
  ButtonDialogButtonDetails,
  ButtonDialogConfig,
  ButtonDialogCustomButtonDetails,
  ButtonDialogData,
} from 'libs/portal-integration-angular/src/lib/model/button-dialog'
import { DialogMessageContentComponent } from '../../button-dialog/dialog-message-content/dialog-message-content.component'
import {
  DialogState,
  DialogStateButtonClicked,
  PortalDialogServiceData,
} from 'libs/portal-integration-angular/src/lib/services/portal-dialog.service'

@Component({
  selector: 'ocx-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent implements OnInit {
  defaultPrimaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'OCX_BUTTON_DIALOG.CONFIRM',
  }

  defaultSecondaryButtonDetails: ButtonDialogButtonDetails = {
    key: 'OCX_BUTTON_DIALOG.CANCEL',
  }

  defaultDialogData: ButtonDialogData = {
    config: {
      primaryButtonDetails: this.defaultPrimaryButtonDetails,
      secondaryButtonIncluded: true,
      secondaryButtonDetails: this.defaultSecondaryButtonDetails,
    },
    componentData: {},
  }

  dialogData: ButtonDialogData = this.defaultDialogData
  primaryButtonDisabled$: Observable<boolean | undefined> | undefined
  secondaryButtonDisabled$: Observable<boolean | undefined> | undefined
  customButtonsDisabled$: BehaviorSubject<Record<string, boolean>> = new BehaviorSubject({})
  leftCustomButtons: ButtonDialogCustomButtonDetails[] = []
  rightCustomButtons: ButtonDialogCustomButtonDetails[] = []

  buttonClickedEmitter: EventEmitter<DialogState<unknown>> | undefined

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public dynamicDialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadComponent()
  }

  primaryButtonAction() {
    return this.buttonAction('primary')
  }

  secondaryButtonAction() {
    return this.buttonAction('secondary')
  }

  customButtonAction(button: ButtonDialogCustomButtonDetails) {
    return this.buttonAction(`custom`, button.id)
  }

  resolveCustomButtonDisabled(customButtonsDisabled: Record<string, boolean>, buttonId: string) {
    return buttonId in customButtonsDisabled ? customButtonsDisabled[buttonId] : true
  }

  loadComponent() {
    if (this.dynamicDialogConfig.data) {
      this.setUpDialogDataForDynamicConfig()
    }
  }

  setUpDialogDataForDynamicConfig() {
    const dynamicConfigData: ButtonDialogData = this.dynamicDialogConfig.data
    const portalDialogServiceData: PortalDialogServiceData = this.dynamicDialogConfig.data.portalDialogServiceData
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

    this.setupCustomButtons(dynamicConfigData)

    this.primaryButtonDisabled$ = portalDialogServiceData.primaryButtonEnabled$.pipe(map((isEnabled) => !isEnabled))
    this.secondaryButtonDisabled$ = portalDialogServiceData.secondaryButtonEnabled$.pipe(map((isEnabled) => !isEnabled))

    const initCustomButtons: Record<string, boolean> = {}
    this.rightCustomButtons.concat(this.leftCustomButtons).map((button) => {
      initCustomButtons[button.id] = true
    })
    this.customButtonsDisabled$.next(initCustomButtons)
    portalDialogServiceData.customButtonEnabled$
      .pipe(
        withLatestFrom(this.customButtonsDisabled$),
        map(([buttonEnabled, customButtonsDisabled]) => {
          if (customButtonsDisabled[buttonEnabled.id] !== !buttonEnabled.enabled) {
            customButtonsDisabled[buttonEnabled.id] = !buttonEnabled.enabled
          }
          return customButtonsDisabled
        })
      )
      .subscribe(this.customButtonsDisabled$)

    this.buttonClickedEmitter = portalDialogServiceData.buttonClicked$
  }

  private buttonAction(resultButtonClickedName: DialogStateButtonClicked, buttonId?: string) {
    const state: DialogState<unknown> = {
      button: resultButtonClickedName,
      result: undefined,
      id: buttonId,
    }

    this.buttonClickedEmitter?.emit(state)
  }

  private setupCustomButtons(dialogData: ButtonDialogData) {
    this.leftCustomButtons = dialogData.config.customButtons?.filter((button) => button.alignment === 'left') ?? []
    this.rightCustomButtons = dialogData.config.customButtons?.filter((button) => button.alignment === 'right') ?? []
  }
}
