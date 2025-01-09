import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core'
import { BehaviorSubject, Observable, map, withLatestFrom } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
  ButtonDialogButtonDetails,
  ButtonDialogConfig,
  ButtonDialogCustomButtonDetails,
  ButtonDialogData,
} from '../../../../model/button-dialog'
import {
  DialogState,
  DialogStateButtonClicked,
  PortalDialogServiceData,
} from '../../../../services/portal-dialog.service'

@Component({
  selector: 'ocx-dialog-footer',
  templateUrl: './dialog-footer.component.html',
  styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent implements OnInit, AfterViewInit {
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

  @Input() config: ButtonDialogConfig = {}

  dialogData: ButtonDialogData = this.defaultDialogData
  primaryButtonDisabled$: Observable<boolean | undefined> | undefined
  secondaryButtonDisabled$: Observable<boolean | undefined> | undefined
  customButtonsDisabled$: BehaviorSubject<Record<string, boolean>> = new BehaviorSubject({})
  leftCustomButtons: ButtonDialogCustomButtonDetails[] = []
  rightCustomButtons: ButtonDialogCustomButtonDetails[] = []

  @Output() buttonClickedEmitter: EventEmitter<DialogState<unknown>> = new EventEmitter()

  @ViewChild('primaryButton', { static: true, read: ViewContainerRef })
  primaryButton!: ViewContainerRef
  _secondaryButton!: ViewContainerRef
  @ViewChild('secondaryButton', { static: false, read: ViewContainerRef })
  set secondaryButton(content: ViewContainerRef) {
    if (content) {
      this._secondaryButton = content
    }
  }
  get secondaryButton(): ViewContainerRef {
    return this._secondaryButton
  }
  @ViewChildren('customButton') customButtons!: QueryList<ElementRef>

  constructor(
    public dynamicDialogConfig: DynamicDialogConfig,
    public dynamicDialogRef: DynamicDialogRef
  ) {}

  ngAfterViewInit(): void {
    if (!(this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.config)) return

    const config = this.dynamicDialogConfig.data.config
    if (config.autoFocusButton === 'primary') {
      this.primaryButton.element.nativeElement.focus()
    } else if (config.autoFocusButton === 'secondary') {
      this.secondaryButton.element.nativeElement.focus()
    } else if (config.autoFocusButton === 'custom') {
      const button = this.customButtons.find((customButton) => {
        return customButton.nativeElement.id === config.autoFocusButtonCustomId
      })
      setTimeout(() => {
        button?.nativeElement.focus()
      })
    }
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
    } else {
      this.setUpDialogDataForInput()
    }
  }

  setUpDialogDataForInput() {
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
    this.dialogData.config.customButtons = this.config.customButtons
    this.setupCustomButtons(this.dialogData)
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
