import { EventEmitter, Injectable, Type } from '@angular/core'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Observable, map } from 'rxjs'
import { ButtonDialogComponent } from '../core/components/button-dialog/button-dialog.component'
import { ButtonDialogButtonDetails, ButtonDialogData } from '../model/button-dialog'
import { DialogHostComponent } from '../core/components/button-dialog/dialog-host/dialog-host.component'
import { TranslateService } from '@ngx-translate/core'

// TODO:
// type TranslationKeyWithParameters = { key: string; Record<string, unknown> }
// type TranslationKey = string | TranslationKeyWithParameters
type TranslationKey = string
type DialogMessage = { message: TranslationKey; icon: string }
interface DialogResult<T> {
  dialogResult: T
}
// result in DialogState:
// if component passed to open function has member dialogResult (implementes DialogResult)
//  -> use this value
// else
//  -> use undefined

type Component<T> = {
  type: Type<any> | DialogResult<T>
  inputs?: Record<string, unknown>
}

export type DialogState<T> = {
  button: 'primary' | 'secondary'
  result: T | undefined
}

// interface DialogMainButtonDisabled {
//     @Output() mainButtonEnabled: EventEmitter<boolean> = new EventEmitter<boolean>()
// } // If component implements interface the button is disabled till true is emited, if interface is not implemented the button is enabled
interface DialogPrimaryButtonDisabled {
  mainButtonEnabled: EventEmitter<boolean>
}
// interface DialogSecondaryButtonDisabled { // If component implements interface the button is disabled till true is emited, if interface is not implemented the button is enabled
//     @Output()
//     secondaryButtonEnabled = new EventEmitter<boolean>()
// }
interface DialogSecondaryButtonDisabled {
  secondaryButtonEnabled: EventEmitter<boolean>
}
interface DialogButtonClicked {
  //if component implements this interface it gets informed when a button was clicked
  // TODO:
  // ocxDialogButtonClicked(state: DialogState): Observable<boolean> | Promise<boolean> | boolean | undefined; // if false leave dialog open
}

@Injectable({ providedIn: 'any' })
export class PortalDialogService {
  constructor(private dialogService: DialogService, private translateService: TranslateService) {}

  /**
   * @deprecated
   */
  open(componentType: Type<any>, config: DynamicDialogConfig): DynamicDialogRef {
    return this.dialogService.open(componentType, config)
  }

  openNew<T = unknown>(
    title: TranslationKey | null,
    componentOrMessage: Component<T> | TranslationKey | DialogMessage,
    primaryButtonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails,
    secondaryButtonTranslationKeyOrDetails?: TranslationKey | ButtonDialogButtonDetails, //when there is a secondaryButton a closeButton X is shown in the top of the dialog if showCloseButton is true
    showCloseButton: boolean = true
  ): Observable<DialogState<T>> {
    console.log(
      title,
      componentOrMessage,
      primaryButtonTranslationKeyOrDetails,
      secondaryButtonTranslationKeyOrDetails,
      showCloseButton
    )
    let dialogTitle: string = title ? title : ''
    this.translateService.get(dialogTitle).subscribe((translation: string) => {
      dialogTitle = translation
    })

    const componentToRender: Component<any> = this.getComponentToRender(componentOrMessage)
    const dynamicDialogDataConfig: ButtonDialogData = {
      component: componentToRender.type as Type<any>,
      config: {
        primaryButtonDetails: this.getButtonDetails(primaryButtonTranslationKeyOrDetails),
        secondaryButtonEnabled: secondaryButtonTranslationKeyOrDetails !== undefined,
        secondaryButtonDetails: this.getButtonDetails(secondaryButtonTranslationKeyOrDetails),
      },
      componentData: componentToRender.inputs,
    }
    return this.dialogService
      .open(ButtonDialogComponent, {
        header: dialogTitle,
        // width: '50vw',
        // contentStyle: {
        //   borderRadius: '0px 0px var(--border-radius) var(--border-radius)',
        // },
        data: dynamicDialogDataConfig,
      })
      .onClose.pipe(
        map((result) => {
          console.log('From pipe' + result)
          return result
        })
      )
  }

  private getButtonDetails(
    buttonTranslationKeyOrDetails: TranslationKey | ButtonDialogButtonDetails | undefined
  ): ButtonDialogButtonDetails | undefined {
    if (buttonTranslationKeyOrDetails === undefined) {
      return undefined
    }

    let buttonDetails

    if (this.isTranslationKey(buttonTranslationKeyOrDetails)) {
      buttonDetails = {
        key: buttonTranslationKeyOrDetails,
      }
    } else {
      buttonDetails = buttonTranslationKeyOrDetails
    }

    return buttonDetails
  }

  private getComponentToRender(componentOrMessage: Component<any> | TranslationKey | DialogMessage): Component<any> {
    if (this.isTranslationKey(componentOrMessage)) {
      return {
        type: DialogHostComponent,
        inputs: {
          message: componentOrMessage,
        },
      }
    } else if (this.isDialogMessage(componentOrMessage)) {
      return {
        type: DialogHostComponent,
        inputs: {
          message: componentOrMessage.message,
          icon: componentOrMessage.icon,
        },
      }
    }
    return componentOrMessage
  }

  private isTranslationKey(obj: any): obj is TranslationKey {
    return typeof obj === 'string' || obj instanceof String
  }

  private isDialogMessage(obj: any): obj is DialogMessage {
    return 'message' in obj && 'icon' in obj
  }
}

// dialogService.open('MY_COOL_INFO_KEY', 'MY_DIALOG_TITLE', 'GENERAL.OK','GENERAL.CANCEL')
// // -> shows dialog with translated message and the two buttons

// dialogService.open({message: 'MY_COOL_WARNING_KEY', icon: 'warning icon'}, 'MY_DIALOG_TITLE','GENERAL.OK')
// // -> shows dialog with the icon shown next to the translated message and the one button

// dialogService.open({ type: MyDialogContentComponent }, 'MY_DIALOG_TITLE','GENERAL.OK')
// // -> shows dialog with MyDialogContentComponent as content with the one button

// dialogService.open({ type: MyDialogContentComponent: inputs: { myCoolInputForComponent: 12345 } }, 'MY_DIALOG_TITLE', { key: 'GENERAL.OK', icon: 'icon class?'}, { key: 'GENERAL.CANCEL', parameters: {parameterForTranslation: 'asdf'} )
// // -> shows dialog with MyDialogContentComponent as content and sets the values specified in inputs as inputs of the component with the two buttons. One with an icon and a transated message. The other with a translated message where the parameters are used for the translation.
