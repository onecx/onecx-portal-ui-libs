import { EventEmitter, Injectable, Type, isDevMode } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, mergeMap } from 'rxjs'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

import { ButtonDialogButtonDetails, ButtonDialogCustomButtonDetails, ButtonDialogData } from '../model/button-dialog'
import { DialogMessageContentComponent } from '../core/components/button-dialog/dialog-message-content/dialog-message-content.component'
import { PrimeIcon } from '@onecx/angular-accelerator'
import { DialogFooterComponent } from '../core/components/dialog/dialog-footer/dialog-footer.component'
import { DialogContentComponent } from '../core/components/dialog/dialog-content/dialog-content.component'

/**
 * Object containing key for translation with parameters object for translation
 *
 * @example
 * ## Assume such translation is in the translation file
 * ```typescript
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## TranslationKeyWithParameters declaration
 * ```
 * // will be translated into
 * // text with parameter value = hello
 * const myKey: TranslationKeyWithParameters = {
 *   key: 'MY_KEY',
 *   parameters: {
 *     value: 'hello',
 *   },
 * }
 * ```
 */
type TranslationKeyWithParameters = { key: string; parameters: Record<string, unknown> }
/**
 * String with key to translation or {@link TranslationKeyWithParameters} object. If provided string cannot be translated it will be displayed as is.
 */
type TranslationKey = string | TranslationKeyWithParameters
/**
 * Object containing message of type {@link TranslationKey} and icon to be displayed along the message.
 *
 * @example
 * DialogMessage with TranslationKey will display 'text with parameter value = hello' and question mark icon
 *
 * ## Assume such translation is in the translation file
 * ```
 * const translations = {
 *   MY_KEY = 'text with parameter value = {{value}}',
 * }
 * ```
 *
 * ## DialogMessage declaration
 * ```
 * const myDialogMessage: DialogMessage = {
 *   message: {
 *     key: 'MY_KEY',
 *     parameters: {
 *       value = 'hello',
 *     },
 *   },
 *   icon: PrimeIcons.QUESTION
 * }
 * ```
 */
type DialogMessage = { message: TranslationKey; icon: PrimeIcon }

/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use if you want {@link PortalDialogService.openDialog} to return state of displayed component's current dialogResult value alongside the clicked button.
 *
 * @example
 * Display component implementing DialogResult<string> and react on the returned value
 *
 * ## Component declaration
 * ```
 * ⁣@Component({template: `<div>
 * <input (change)="onInputChange($event)">
 * </div>`})
 * export class MyInputComponent implements DialogResult<string> {
 *   dialogResult: string = ''
 *
 *   onInputChange(event: any) {
 *     this.dialogResult = event.target.value
 *   }
 * }
 * ```
 *
 * ## PortalDialogService call
 * ```
 * portalDialogService.openDialog(title, { type: MyInputComponent }, primaryButton, ...).subscribe((result: DialogState<string>) => {
 * // result.value === MyInputComponent.dialogResult (during button click)
 * // behavior when dialog closes
 * })
 * ```
 *
 */
export interface DialogResult<T> {
  dialogResult: T
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of the primary button (disabled or enabled). Whenever your component wants to disable/enable primary button it should emit boolean equal to whether primary button should be enabled.
 *
 * If you implement this interface then primary button will be disabled until the emitter emits true
 */
export interface DialogPrimaryButtonDisabled {
  primaryButtonEnabled: EventEmitter<boolean>
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of the secondary button (disabled or enabled). Whenever your component wants to disable/enable secondary button it should emit boolean equal to whether secondary button should be enabled.
 *
 * If you implement this interface then secondary button will be disabled until the emitter emits true
 */
export interface DialogSecondaryButtonDisabled {
  secondaryButtonEnabled: EventEmitter<boolean>
}

/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to control the state of custom buttons (disabled or enabled). Whenever your component wants to disable/enable any custom button it should emit an object indicating which button should be disabled/enabled. This object should contain id property (string) related to previously defined button and enabled property (boolean) equal to whether custom button should be enabled.
 *
 * If you implement this interface then all custom buttons will be disabled until the emitter emits true
 */
export interface DialogCustomButtonsDisabled {
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }>
}
/**
 * Implement via component class to be displayed by {@link PortalDialogService.openDialog}
 *
 * Use to add behavior on button clicks. {@link DialogButtonClicked.ocxDialogButtonClicked} method will be called everytime any button is clicked and should return boolean value (or Observable<boolean> or Promise<boolean>) equal to whether dialog should be closed or not.
 *
 * {@link DialogButtonClicked.ocxDialogButtonClicked} will recieve object containing component's state captured on button click. It will have button property with value 'primary' or 'secondary' which determines which button was clicked.
 *
 * It will also have result property which by default will be undefined, however if you want to add any properties to the state please combine this interface with {@link DialogResult}. That way result will be equal to component's dialogResult property captured on button click.
 *
 * @example
 * Display component implementing DialogResult<string> and DialogButtonClicked which should not close dialog on clear click but should close when send clicked and api call was sucessful
 *
 * ## Component declaration
 * ```
 * ⁣@Component({template: `<div>
 * <input (change)="onInputChange($event)">
 * </div>`})
 * export class MyInputComponent implements DialogResult<string>, DialogButtonClicked {
 *   dialogResult: string = ''
 *
 *   onInputChange(event: any) {
 *     this.dialogResult = event.target.value
 *   }
 *
 *   ocxDialogButtonClicked(state: DialogState<string>) {
 *     // here you can do any operations you desire
 *     // such as form validation
 *     // api calls and so on
 *     if (state.button === 'primary') {
 *       // send form data to server
 *       this.apiService.postInput(state.result, ...).pipe(
 *         // map response to boolean meaning if call was successfull
 *       )
 *       return true // if dialog should be closed return true
 *     } else {
 *       // clear input
 *       return false // don't want to close the dialog, only to clear it
 *     }
 *   }
 * }
 * ```
 *
 * ## PortalDialogService call
 * ```
 * portalDialogService.openDialog(title, { type: MyInputComponent }, "Send", "Clear").subscribe((result: DialogState<string>) => {
 * // behavior to be fired when dialog closes
 * })
 * ```
 */
export interface DialogButtonClicked<T = unknown> {
  ocxDialogButtonClicked(state: DialogState<T>): Observable<boolean> | Promise<boolean> | boolean | undefined | void
}

/**
 * Object containing component type to be displayed and inputs to populate the component.
 *
 * @example
 *
 * ```
 * ⁣@Component({template: `<h1>{{content}}</h1>`})
 * export class MyComponent {
 *   ⁣@Input() content: string = ''
 * }
 * const myComponent = {
 *   type: MyComponent,
 *   inputs: {
 *     content: 'My header content',
 *   },
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
type Component<T extends unknown> = unknown extends T
  ? {
      type: Type<any>
      inputs?: Record<string, unknown>
    }
  : {
      type: Type<DialogResult<T>>
      inputs?: Record<string, unknown>
    }

export type DialogButton = 'primary' | 'secondary' | 'custom'
export type DialogStateButtonClicked = 'primary' | 'secondary' | 'custom'

/**
 * Object containing information about clicked button ('primary' or 'secondary') and displayed component state captured on button click (only if component implements {@link DialogResult} interface)
 */
export type DialogState<T> = {
  button: DialogStateButtonClicked
  result: T | undefined
  id?: string
}

export type PortalDialogConfig = {
  showXButton?: boolean
  customButtons?: ButtonDialogCustomButtonDetails[]
  autoFocusButton?: DialogButton
  autoFocusButtonCustomId?: string
  ariaLabelledBy?: string
  width?: string
  height?: string
  closeOnEscape?: boolean
  focusOnShow?: boolean
  focusTrap?: boolean
  baseZIndex?: number
  autoZIndex?: boolean
  dismissableMask?: boolean
  showHeader?: boolean
  modal?: boolean
  resizable?: boolean
  draggable?: boolean
  keepInViewport?: boolean
  minX?: number
  minY?: number
  maximizable?: boolean
  maximizeIcon?: string
  minimizeIcon?: string
  position?: string
  closeAriaLabel?: string
}

export interface PortalDialogServiceData {
  primaryButtonEnabled$: EventEmitter<boolean>
  secondaryButtonEnabled$: EventEmitter<boolean>
  customButtonEnabled$: EventEmitter<{ id: string; enabled: boolean }>
  buttonClicked$: EventEmitter<DialogState<unknown>>
}

@Injectable({ providedIn: 'any' })
export class PortalDialogService {
  constructor(
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {}

  /**
   * @deprecated
   */
  open(componentType: Type<any>, config: DynamicDialogConfig): DynamicDialogRef {
    if (isDevMode()) {
      console.warn('You are using a deprecated method to display a dialog. Please move to the new one')
    }
    return this.dialogService.open(componentType, config)
  }

  /**
   * Opens dialog with a component or message to display and one or two buttons. This method allows you to customize the dialog using parameters and by implementic specific interfaces via component to be displayed. The dialog is only shown if if you subscribe to this function.
   *
   * Displaying component inisde the dialog can be achieved by providing the component class with optional inputs. By default the component will be shown without any interaction with the dialog, however you can implement the following interfaces by your component class to allow for some interactions:
   * - {@link DialogResult} - dialog state will contain dialogResult property
   *
   * - {@link DialogButtonClicked} - on button click ocxDialogButtonClicked function will be called with dialog state as a parameter. You should return true if you want dialog to be close or false if not and add any operations on your component.
   *
   * - {@link DialogPrimaryButtonDisabled} - dialog will use the EventEmitter to determine if the primary button should be disabled
   *
   * - {@link DialogSecondaryButtonDisabled} - dialog will use the EventEmitter to determine if the secondary button should be disabled
   *
   * - {@link DialogCustomButtonsDisabled} - dialog will use the EventEmitter to determine if the custom buttons should be disabled
   *
   * @param title Translation key for dialog title
   * @param componentOrMessage Either a component or a translation key of a message with optional parameters and icon to be displayed next to the message
   * @param primaryButtonTranslationKeyOrDetails Translation key with optional parameters and icon to be displayed next to the text of the button
   * @param secondaryButtonTranslationKeyOrDetails Translation key with optional parameters and icon to be displayed next to the text of the button
   * @param extras Configuration object allowing for customization of the dialog behavior and visual aspects
   * @returns Observable containing dialog state on close
   *
   *
   * @example
   * Display dialog with message and two buttons using translation keys
   *
   * ```
   * // assume 'TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON' and 'REFRESH_BUTTON' are translation keys
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message with icon and single button
   *
   * ```
   * // Welcome message with question mark icon
   * const dialogMessage = {
   *   key: 'WELCOME_MESSAGE',
   *   icon: PrimeIcons.QUESTION
   * }
   * this.portalDialogService.openDialog('TITLE_KEY', dialogMessage, 'OK_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message with two customized buttons
   *
   * ```
   * // Ok button with check icon
   * const primaryButton = {
   *   key: 'OK_BUTTON',
   *   icon: PrimeIcons.CHECK
   *   tooltipKey: 'OK_TOOLTIP',
   *   tooltipPosition: 'bottom'
   * }
   *
   * // Refresh button with refresh icon
   * const secondaryButton = {
   *   key: 'REFRESH_BUTTON',
   *   icon: PrimeIcons.REFRESH
   *   tooltipKey: 'REFRESH_TOOLTIP',
   *   tooltipPosition: 'right'
   * }
   *
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', primaryButton, secondaryButton).subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog message without X button in top right corner
   *
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON', false).subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * React on dialog closing
   *
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', 'WELCOME_MESSAGE', 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog with component
   *
   * ## Component declaration
   * ```
   * ⁣@Component({template: `<div>
   * <h1>{{header | translate}}</h1>
   * <input (change)="onInputChange($event)">
   * </div>`})
   * export class MyInputComponent implements DialogResult<string>,  DialogButtonClicked, DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled {
   *   ⁣@Input() header: string = ''
   *   // change value to manipulate component state visible by dialog
   *   dialogResult: string = ''
   *   // emit true/false to disable primary button
   *   ⁣@Output() primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
   *   // emit true/false to disable secondary button
   *   ⁣@Output() secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
   *
   *   // implement operations to be done on button clicks and return if the dialog should be closed
   *   ocxDialogButtonClicked(state: DialogState<string>) {
   *     return true
   *   }
   *
   *   onInputChange(event: any) {
   *     this.dialogResult = event.target.value
   *   }
   * }
   * ```
   *
   * ## PortalDialogService call
   * ```
   * const myComponent = {
   *   type: MyInputComponent,
   *   inputs: {
   *     header: 'DIALOG_HEADER'
   *   }
   * }
   * this.portalDialogService.openDialog('TITLE_KEY', myComponent, 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   *
   * @example
   * Display dialog with component without passing inputs
   *
   * ## PortalDialogService call
   * ```
   * this.portalDialogService.openDialog('TITLE_KEY', MyInputComponent, 'OK_BUTTON', 'REFRESH_BUTTON').subscribe((stateOnClose) => {
   *   // operations when dialog has been closed
   * })
   * ```
   */
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    extras?: PortalDialogConfig
  ): Observable<DialogState<T>>
  /**
   * @deprecated Use `extras` instead of `showXButton`
   */
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    showXButton?: boolean
  ): Observable<DialogState<T>>
  openDialog<T>(
    title: TranslationKey | null,
    componentOrMessage: Type<any> | Type<DialogResult<T>> | Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails,
    extrasOrShowXButton: PortalDialogConfig | boolean = {}
  ): Observable<DialogState<T>> {
    const dialogOptions: PortalDialogConfig =
      typeof extrasOrShowXButton === 'object'
        ? extrasOrShowXButton
        : {
            showXButton: extrasOrShowXButton,
          }
    const translateParams = this.prepareTitleForTranslation(title)

    const componentToRender: Component<any> = this.getComponentToRender(componentOrMessage)
    const dynamicDialogDataConfig: ButtonDialogData = {
      component: componentToRender.type as Type<any>,
      config: {
        primaryButtonDetails: this.buttonDetailsOrTranslationKey(primaryButtonTranslationKeyOrDetails),
        secondaryButtonIncluded: secondaryButtonTranslationKeyOrDetails !== undefined,
        secondaryButtonDetails: this.buttonDetailsOrTranslationKey(secondaryButtonTranslationKeyOrDetails),
        customButtons: dialogOptions.customButtons?.map(
          (button) => this.buttonDetailsOrTranslationKey(button) as ButtonDialogCustomButtonDetails
        ),
        autoFocusButton: dialogOptions.autoFocusButton,
        autoFocusButtonCustomId: dialogOptions.autoFocusButtonCustomId,
      },
      componentData: componentToRender.inputs,
    }

    return this.translateService.get(translateParams.key, translateParams.parameters).pipe(
      mergeMap((dialogTitle) => {
        return this.dialogService.open(DialogContentComponent, {
          header: dialogTitle,
          data: {
            ...dynamicDialogDataConfig,
            portalDialogServiceData: {
              primaryButtonEnabled$: new EventEmitter(),
              secondaryButtonEnabled$: new EventEmitter(),
              customButtonEnabled$: new EventEmitter(),
              buttonClicked$: new EventEmitter(),
            } satisfies PortalDialogServiceData,
          },
          closable: dialogOptions.showXButton && secondaryButtonTranslationKeyOrDetails !== undefined,
          ...dialogOptions,
          focusOnShow: false,
          templates: {
            footer: DialogFooterComponent,
          },
        }).onClose
      })
    )
  }

  private prepareTitleForTranslation(title: TranslationKey | null): TranslationKeyWithParameters {
    if (!title) return { key: '', parameters: {} }
    if (this.isString(title)) return { key: title, parameters: {} }
    return title
  }

  private buttonDetailsOrTranslationKey(
    buttonTranslationKeyOrDetails:
      | TranslationKey
      | ButtonDialogButtonDetails
      | ButtonDialogCustomButtonDetails
      | undefined
  ): ButtonDialogButtonDetails | ButtonDialogCustomButtonDetails | undefined {
    if (buttonTranslationKeyOrDetails === undefined) {
      return undefined
    }

    let buttonDetails

    if (this.isString(buttonTranslationKeyOrDetails)) {
      buttonDetails = {
        key: buttonTranslationKeyOrDetails,
      }
    } else {
      buttonDetails = buttonTranslationKeyOrDetails
    }

    return buttonDetails
  }

  private getComponentToRender(
    componentOrMessage: Type<any> | Type<DialogResult<any>> | Component<any> | TranslationKey | DialogMessage
  ): Component<any> {
    if (this.isTranslationKey(componentOrMessage)) {
      return {
        type: DialogMessageContentComponent,
        inputs: {
          message: this.isString(componentOrMessage) ? componentOrMessage : componentOrMessage.key,
          messageParameters: this.isString(componentOrMessage) ? {} : componentOrMessage.parameters,
        },
      }
    } else if (this.isDialogMessage(componentOrMessage)) {
      return {
        type: DialogMessageContentComponent,
        inputs: {
          message: this.isString(componentOrMessage.message)
            ? componentOrMessage.message
            : componentOrMessage.message.key,
          icon: componentOrMessage.icon,
          messageParameters: this.isString(componentOrMessage.message) ? {} : componentOrMessage.message.parameters,
        },
      }
    } else if (this.isType(componentOrMessage)) {
      return {
        type: componentOrMessage,
      }
    }
    return componentOrMessage
  }

  private isTranslationKey(obj: any): obj is TranslationKey {
    return this.isString(obj) || ('key' in obj && 'parameters' in obj)
  }

  private isString(obj: any): obj is string {
    return typeof obj === 'string' || obj instanceof String
  }

  private isDialogMessage(obj: any): obj is DialogMessage {
    return 'message' in obj && 'icon' in obj
  }

  private isType(obj: any): obj is Type<any> {
    return obj instanceof Type
  }
}

export function providePortalDialogService() {
  return [DialogService, PortalDialogService]
}
