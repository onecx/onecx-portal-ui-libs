import {
  Component,
  ElementRef,
  OnInit,
  effect,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
  output,
} from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { BehaviorSubject, Observable, map, withLatestFrom } from 'rxjs'
import {
  ButtonDialogButtonDetails,
  ButtonDialogConfig,
  ButtonDialogCustomButtonDetails,
  ButtonDialogData,
} from '../../../model/button-dialog'
import { DialogState, DialogStateButtonClicked, PortalDialogServiceData } from '../../../services/portal-dialog.service'

export const defaultPrimaryButtonDetails: ButtonDialogButtonDetails = {
  key: 'OCX_BUTTON_DIALOG.CONFIRM',
}

export const defaultSecondaryButtonDetails: ButtonDialogButtonDetails = {
  key: 'OCX_BUTTON_DIALOG.CANCEL',
}

export const defaultDialogData: ButtonDialogData = {
  config: {
    primaryButtonDetails: defaultPrimaryButtonDetails,
    secondaryButtonIncluded: true,
    secondaryButtonDetails: defaultSecondaryButtonDetails,
  },
  componentData: {},
}

@Component({
  standalone: false,
  selector: 'ocx-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent implements OnInit {
  dynamicDialogConfig = inject(DynamicDialogConfig)
  dynamicDialogRef = inject(DynamicDialogRef)

  config = input<ButtonDialogConfig | undefined>(undefined)

  dialogData = signal<ButtonDialogData>(defaultDialogData)
  primaryButtonDisabled$: Observable<boolean | undefined> | undefined
  secondaryButtonDisabled$: Observable<boolean | undefined> | undefined
  customButtonsDisabled$: BehaviorSubject<Record<string, boolean>> = new BehaviorSubject({})
  leftCustomButtons = signal<ButtonDialogCustomButtonDetails[]>([])
  rightCustomButtons = signal<ButtonDialogCustomButtonDetails[]>([])

  buttonClickedEmitter = output<DialogState<unknown>>()

  primaryButton = viewChild<ElementRef>('primaryButton')
  secondaryButton = viewChild<ElementRef>('secondaryButton')
  customButtons = viewChildren<ElementRef>('customButton')

  constructor() {
    // Auto focus button effect for dynamic dialog
    effect(() => {
      const config = this.dynamicDialogConfig.data?.config

      if (!config) return

      if (config.autoFocusButton === 'primary') {
        const primaryButton = this.primaryButton()
        primaryButton?.nativeElement.focus()
      } else if (config.autoFocusButton === 'secondary') {
        const secondaryButton = this.secondaryButton()
        secondaryButton?.nativeElement.focus()
      } else if (config.autoFocusButton === 'custom') {
        const button = this.customButtons().find((customButton) => {
          return customButton.nativeElement.id === config.autoFocusButtonCustomId
        })
        setTimeout(() => {
          button?.nativeElement.focus()
        })
      }
    })

    // config update effect for inline dialog
    effect(() => {
      // Run the effect only if config input is provided
      const config = this.config()
      if (!config) return

      const dialogData = this.dialogData()
      if (config) {
        if (!!config.primaryButtonDetails && !!config.primaryButtonDetails?.key) {
          dialogData.config.primaryButtonDetails = config.primaryButtonDetails
        }
        if (config.secondaryButtonIncluded) {
          dialogData.config.secondaryButtonIncluded = config.secondaryButtonIncluded
        }
        if (!!config.secondaryButtonDetails && !!config.secondaryButtonDetails?.key) {
          dialogData.config.secondaryButtonDetails = config.secondaryButtonDetails
        }
      }
      dialogData.config.customButtons = config.customButtons
      this.dialogData.set(dialogData)
      this.setupCustomButtons(dialogData)
    })
  }

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
    const dialogData = this.dialogData()
    if (dynamicConfigData.config) {
      const dialogConfig = dynamicConfigData.config
      if (!!dialogConfig.primaryButtonDetails && !!dialogConfig.primaryButtonDetails.key) {
        dialogData.config.primaryButtonDetails = dialogConfig.primaryButtonDetails
      }
      if (dialogConfig.secondaryButtonIncluded !== undefined) {
        dialogData.config.secondaryButtonIncluded = dialogConfig.secondaryButtonIncluded
      }
      if (!!dialogConfig.secondaryButtonDetails && !!dialogConfig.secondaryButtonDetails.key) {
        dialogData.config.secondaryButtonDetails = dialogConfig.secondaryButtonDetails
      }
    }

    this.dialogData.set(dialogData)

    const [leftButtons, rightButtons] = this.setupCustomButtons(dynamicConfigData)

    this.primaryButtonDisabled$ = portalDialogServiceData.primaryButtonEnabled$.pipe(map((isEnabled) => !isEnabled))
    this.secondaryButtonDisabled$ = portalDialogServiceData.secondaryButtonEnabled$.pipe(map((isEnabled) => !isEnabled))

    const initCustomButtons: Record<string, boolean> = {}
    rightButtons.concat(leftButtons).map((button) => {
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

    this.buttonClickedEmitter.subscribe((dialogState) => {
      portalDialogServiceData.buttonClicked$.next(dialogState)
    })
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
    const leftButtons = dialogData.config.customButtons?.filter((button) => button.alignment === 'left') ?? []
    const rightButtons = dialogData.config.customButtons?.filter((button) => button.alignment === 'right') ?? []
    this.leftCustomButtons.set(leftButtons)
    this.rightCustomButtons.set(rightButtons)

    return [leftButtons, rightButtons]
  }
}
