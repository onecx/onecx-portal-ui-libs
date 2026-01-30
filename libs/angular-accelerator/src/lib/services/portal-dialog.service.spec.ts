import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Observable, of } from 'rxjs'

import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {
  provideAppStateServiceMock,
  provideShellCapabilityServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { DivHarness, InputHarness, provideTranslateTestingService } from '@onecx/angular-testing'
import { PrimeIcons } from 'primeng/api'
import { DialogContentHarness, DialogFooterHarness } from '../../../testing'
import { AngularAcceleratorModule } from '../angular-accelerator.module'
import { DialogContentComponent } from '../components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../components/dialog/dialog-footer/dialog-footer.component'
import { DialogMessageContentComponent } from '../components/dialog/dialog-message-content/dialog-message-content.component'
import {
  DialogButtonClicked,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'

import * as loggerUtils from '../utils/logger.utils'

// This component is in charge of dialog display
@Component({
  standalone: false,
  template: `<h1>BaseTestComponent</h1>`,
})
class BaseTestComponent {
  portalDialogService = inject(PortalDialogService)

  resultFromShow: DialogState<any> | null = null
  nameResult: string | undefined
  surnameResult: string | undefined

  show(title: any, message: any, button1: any, button2?: any, showXButton: any = true) {
    this.portalDialogService.openDialog(title, message, button1, button2, showXButton).subscribe({
      next: (result) => {
        this.resultFromShow = result
      },
    })
  }

  showWithType() {
    this.portalDialogService
      .openDialog(
        'Enter credentials',
        {
          type: CompleteDialogComponent,
        },
        'Validate',
        'Hint: Doe'
      )
      .subscribe((result) => {
        this.nameResult = result?.result?.name
        this.surnameResult = result?.result?.surname
        this.resultFromShow = result
      })
  }
}

// This component should be displayed for testing inputs
@Component({
  standalone: false,
  template: `<div class="testHeader">{{ header }}</div>`,
})
class TestWithInputsComponent {
  @Input() header = 'header'
}

// This component should be displayed for testing result manipulation
@Component({
  standalone: false,
  template: `<h1>DialogResultTestComponent</h1>`,
})
class DialogResultTestComponent implements DialogResult<string> {
  portalDialogService = inject(PortalDialogService)

  @Input() dialogResult = ''
}

// This component should be displayed for testing state validation on button click
// It will only allow dialog to be closed if dialogResult === expectedDialogResult
// Each time button is clicked, dialogResult is increased by 1
@Component({
  standalone: false,
  template: `<h1>DialogButtonClickedWithResultComponent</h1>`,
})
class DialogButtonClickedWithResultComponent implements DialogResult<number>, DialogButtonClicked {
  portalDialogService = inject(PortalDialogService)

  @Input() dialogResult = 13
  @Input() returnType: 'boolean' | 'observable' | 'promise' | 'undefined' = 'boolean'
  @Input() expectedDialogResult = 25

  ocxDialogButtonClicked(state: DialogState<number>): boolean | Observable<boolean> | Promise<boolean> | undefined {
    if (state.result !== this.expectedDialogResult) {
      this.dialogResult++
    }

    if (this.returnType === 'boolean') {
      if (state.result === this.expectedDialogResult) {
        return true
      } else {
        return false
      }
    } else if (this.returnType === 'observable') {
      if (state.result === this.expectedDialogResult) {
        return of(true)
      } else {
        return of(false)
      }
    } else if (this.returnType === 'promise') {
      if (state.result === this.expectedDialogResult) {
        return Promise.resolve(true)
      } else {
        return Promise.resolve(false)
      }
    }

    return undefined
  }
}

// This component should be displayed for testing primary button enablement
@Component({
  standalone: false,
  template: `<h1>DialogPrimaryButtonDisabledComponent</h1>`,
})
class DialogPrimaryButtonDisabledComponent implements DialogPrimaryButtonDisabled {
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

// This component should be displayed for testing secondary button enablement
@Component({
  standalone: false,
  template: `<h1>DialogSecondaryButtonDisabledComponent</h1>`,
})
class DialogSecondaryButtonDisabledComponent implements DialogSecondaryButtonDisabled {
  @Output()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

interface NameAndSurnameObject {
  name: string
  surname: string
}

// This component should be displayed for testing every part of the PortalDialogService feature
@Component({
  standalone: false,
  template: `<div>
    <h1>CompleteDialogComponent</h1>
    @if (!isNameValid) {
      <div class="nameError">Name is not correct</div>
    }
    <label for="name">Name:</label>
    <input id="name" type="text" (change)="onNameChange($event)" />
    <label for="surname">Surname:</label>
    <input id="surname" type="text" (change)="onSurnameChange($event)" />
    @if (message !== undefined) {
      <div class="message">{{ message }}</div>
    }
  </div>`,
})
export class CompleteDialogComponent
  implements
    DialogSecondaryButtonDisabled,
    DialogPrimaryButtonDisabled,
    DialogButtonClicked,
    DialogResult<NameAndSurnameObject>
{
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  @Output()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()

  dialogResult: NameAndSurnameObject = {
    name: '',
    surname: '',
  }

  isNameValid = false

  message: string | undefined = undefined

  onNameChange(event: any) {
    const newNameValue: string = event.target.value
    this.dialogResult.name = newNameValue
    if (newNameValue.length < 4 || newNameValue.length == 0) {
      this.isNameValid = false
      this.primaryButtonEnabled.emit(false)
    } else {
      this.isNameValid = true
      this.primaryButtonEnabled.emit(true)
    }
  }

  onSurnameChange(event: any) {
    const newSurnameValue: string = event.target.value
    this.dialogResult.surname = newSurnameValue
    if (newSurnameValue === 'Doe') {
      this.secondaryButtonEnabled.emit(true)
    } else {
      this.secondaryButtonEnabled.emit(false)
    }
  }

  ocxDialogButtonClicked(
    state: DialogState<NameAndSurnameObject>
  ): boolean | Observable<boolean> | Promise<boolean> | undefined {
    if (state.button === 'primary') {
      if (state.result?.name == 'John' && state.result.surname === 'Doe') {
        // use message service
        this.message = 'Welcome John'
        this.dialogResult.name = 'Submitted John'
        this.dialogResult.surname = 'Submitted Doe'
        return true
      }
      this.message = 'Wrong credentials'
      return false
    } else {
      this.message = 'Smart but name should be correct too'
      return false
    }
  }
}

describe('PortalDialogService', () => {
  let pDialogService: DialogService
  let rootLoader: HarnessLoader
  let fixture: ComponentFixture<BaseTestComponent>
  let loggerWarnSpy: jest.Mock
  let loggerErrorSpy: jest.Mock

  const translations = {
    TITLE_TRANSLATE: 'simpleTitle',
    TITLE_TRANSLATE_PARAM: 'translatedTitle {{val}}',
    MESSAGE: 'myMessage',
    MESSAGE_PARAM: 'myMessage {{val}}',
    BUTTON: 'myButton',
    BUTTON_PARAM: 'myButton {{val}}',
  }

  async function closeBasicDialog(button: 'primary' | 'secondary') {
    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    if (button === 'primary') {
      await footerHarness.clickPrimaryButton()
    } else {
      await footerHarness.clickSecondaryButton()
    }
  }

  const removeChildSpy = jest.fn()
  Object.defineProperty(global.document.body, 'removeChild', { value: removeChildSpy })

  beforeEach(async () => {
    loggerWarnSpy = jest.fn()
    loggerErrorSpy = jest.fn()
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue({
      debug: jest.fn() as any,
      info: jest.fn() as any,
      warn: loggerWarnSpy as any,
      error: loggerErrorSpy as any,
    })

    await TestBed.configureTestingModule({
      declarations: [
        BaseTestComponent,
        DialogContentComponent,
        DialogFooterComponent,
        DialogMessageContentComponent,
        CompleteDialogComponent,
        DialogButtonClickedWithResultComponent,
        DialogPrimaryButtonDisabledComponent,
        DialogSecondaryButtonDisabledComponent,
        TestWithInputsComponent,
        DialogResultTestComponent,
      ],
      imports: [DynamicDialogModule, CommonModule, NoopAnimationsModule, AngularAcceleratorModule],
      providers: [
        PortalDialogService,
        DialogService,
        provideShellCapabilityServiceMock(),
        provideAppStateServiceMock(),
        provideTranslateTestingService({
          en: translations,
        }),
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(BaseTestComponent)
    pDialogService = TestBed.inject(DialogService)
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('should display dialog with translated title', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('TITLE_TRANSLATE', 'message', 'button1', 'button2')

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: translations['TITLE_TRANSLATE'],
      })
    )

    closeBasicDialog('primary')
  })

  it('should log error and return null if dialog could not be opened', async () => {
    jest.spyOn(pDialogService, 'open').mockReturnValue(null)

    fixture.componentInstance.show('TITLE_TRANSLATE', 'message', 'button1', 'button2')

    expect(loggerErrorSpy).toHaveBeenCalledWith('Dialog could not be opened, dialog creation failed.')
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeNull()

    closeBasicDialog('primary')
  })

  it('should warn if dialog component instance could not be found after creation', async () => {
    jest.spyOn(pDialogService, 'open')
    jest.spyOn(pDialogService, 'getInstance').mockReturnValue(undefined)

    fixture.componentInstance.show('TITLE_TRANSLATE', 'message', 'button1', 'button2')

    expect(loggerWarnSpy).toHaveBeenCalledWith(
      'Dialog component instance could not be found after creation. The displayed dialog may not function as expected.'
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with translated title with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      { key: 'TITLE_TRANSLATE_PARAM', parameters: { val: 'myParam' } },
      'message',
      'button1',
      'button2'
    )

    expect(pDialogService.open).toHaveBeenLastCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: 'translatedTitle myParam',
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with translated message', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'MESSAGE', 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    expect(await dialogMessageContentHarness?.getMessageContent()).toEqual(translations['MESSAGE'])

    closeBasicDialog('primary')
  })

  it('should display dialog with translated message with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual('myMessage myMsgParam')

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'BUTTON', 'BUTTON')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      'message',
      { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam1' } },
      { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam2' } }
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('myButton myButtonParam1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe('myButton myButtonParam2')

    closeBasicDialog('primary')
  })

  it('should display dialog with translated buttons with icons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      'message',
      { key: 'BUTTON', icon: PrimeIcons.TIMES },
      { key: 'BUTTON', icon: PrimeIcons.TRASH }
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    const primaryButtonIcon = await footerHarness.getPrimaryButtonIcon()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    expect(primaryButtonIcon).toBe(PrimeIcons.TIMES)

    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    const secondaryButtonIcon = await footerHarness.getSecondaryButtonIcon()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])
    expect(secondaryButtonIcon).toBe(PrimeIcons.TRASH)

    closeBasicDialog('primary')
  })

  it('should display dialog with message and icon if DialogMessage provided as string and icon', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', { message: 'MESSAGE', icon: PrimeIcons.TIMES }, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual(translations['MESSAGE'])
    const icon = await dialogMessageContentHarness?.getIconValue()
    expect(icon).toContain(PrimeIcons.TIMES)

    closeBasicDialog('primary')
  })

  it('should display dialog with message and icon if DialogMessage provided as TranslationKey and icon', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { message: { key: 'MESSAGE_PARAM', parameters: { val: 'dialogMessageParam' } }, icon: PrimeIcons.TIMES },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    const message = await dialogMessageContentHarness?.getMessageContent()
    expect(message).toEqual('myMessage dialogMessageParam')
    const icon = await dialogMessageContentHarness?.getIconValue()
    expect(icon).toContain(PrimeIcons.TIMES)

    closeBasicDialog('primary')
  })

  it('should display dialog with custom component if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', TestWithInputsComponent, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('header')

    closeBasicDialog('primary')
  })

  it('should display dialog with custom component and inputs if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: TestWithInputsComponent,
        inputs: {
          header: 'myCustomHeader',
        },
      },
      'button1',
      'button2'
    )

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('myCustomHeader')

    closeBasicDialog('primary')
  })

  it('should display dialog with single button if secondary not provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('button1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBeUndefined()

    closeBasicDialog('primary')
  })

  it('should display dialog without top close button when one button defined', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', undefined, true)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: false,
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog without top close button when both buttons defined but specified to remove the button', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2', false)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: false,
      })
    )

    closeBasicDialog('primary')
  })

  it('should display dialog with top close button when both buttons defined and enabled', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2', true)

    expect(pDialogService.open).toHaveBeenCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        closable: true,
      })
    )

    closeBasicDialog('primary')
  })

  it('should return dialogState with primary on primaryButton click', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBeUndefined()
  })

  it('should return dialogState with secondary on primaryButton click', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1', 'button2')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickSecondaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('secondary')
    expect(result?.result).toBeUndefined()
  })

  it('should return dialogState with primary and dialogResult on primaryButton click when component implements DialogResult<T>', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      { type: DialogResultTestComponent, inputs: { dialogResult: 'resultAssignedLater' } },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe('resultAssignedLater')
  })

  it('should not close dialog when ocxDialogButtonClicked returns false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'boolean',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeNull()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'boolean',
          dialogResult: 1,
          expectedDialogResult: 1,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(1)
  })

  it('should not close dialog when ocxDialogButtonClicked returns Observable of false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'observable',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeNull()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns Observable of true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'observable',
          dialogResult: 4,
          expectedDialogResult: 4,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(4)
  })

  it('should not close dialog when ocxDialogButtonClicked returns Promise of false', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'promise',
          dialogResult: 1,
          expectedDialogResult: 2,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeNull()

    // Close dialog
    await footerHarness.clickPrimaryButton()
    const finalResult = fixture.componentInstance.resultFromShow
    expect(finalResult).toBeDefined()
  })

  it('should close dialog when ocxDialogButtonClicked returns Promise of true', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'promise',
          dialogResult: 10,
          expectedDialogResult: 10,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result).toBeDefined()
    expect(result?.button).toBe('primary')
    expect(result?.result).toBe(10)
  })

  it('should close dialog when ocxDialogButtonClicked returns undefined', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogButtonClickedWithResultComponent,
        inputs: {
          returnType: 'undefined',
          dialogResult: 13,
          expectedDialogResult: 10,
        },
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    await footerHarness.clickPrimaryButton()
    const result = fixture.componentInstance.resultFromShow
    expect(result?.button).toBe('primary')
    // 14 because dialogResult is increased on each button click
    expect(result?.result).toBe(14)
  })

  it('should disable primary button when component implements DialogPrimaryButtonDisabled interface', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogPrimaryButtonDisabledComponent,
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()

    closeBasicDialog('secondary')
  })

  it('should disable secondary button when component implements DialogSecondaryButtonDisabled interface', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      'title',
      {
        type: DialogSecondaryButtonDisabledComponent,
      },
      'button1',
      'button2'
    )

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeTruthy()

    closeBasicDialog('primary')
  })

  it('should react to complex component behavior and return when it decides', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.showWithType()

    // init state
    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    let isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()
    let isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeTruthy()
    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    let nameErrorDiv = await contentHarness.getHarnessOrNull(DivHarness.with({ class: 'nameError' }))
    const nameErrorDivText = await nameErrorDiv?.getText()
    expect(nameErrorDivText).toBe('Name is not correct')

    // change surname input to Doe
    const surnameInput = await contentHarness.getHarness(InputHarness.with({ id: 'surname' }))
    await surnameInput.setValue('Doe')
    await (await surnameInput.getTestElement()).dispatchEvent('change')

    const surnameValue = await surnameInput.getValue()
    expect(surnameValue).toBe('Doe')

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeTruthy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click secondary button
    await footerHarness.clickSecondaryButton()

    const messageDiv = await contentHarness.getHarness(DivHarness.with({ class: 'message' }))
    let messageText = await messageDiv.getText()
    expect(messageText).toBe('Smart but name should be correct too')

    // change name input to Albert
    const nameInput = await contentHarness.getHarness(InputHarness.with({ id: 'name' }))
    await nameInput.setValue('Albert')
    await (await nameInput.getTestElement()).dispatchEvent('change')

    let nameValue = await nameInput.getValue()
    expect(nameValue).toBe('Albert')
    nameErrorDiv = await contentHarness.getHarnessOrNull(DivHarness.with({ class: 'nameError' }))
    expect(nameErrorDiv).toBeNull()

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeFalsy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click primary button
    await footerHarness.clickPrimaryButton()

    messageText = await messageDiv.getText()
    expect(messageText).toBe('Wrong credentials')

    //change name input to John
    await nameInput.setValue('John')
    await (await nameInput.getTestElement()).dispatchEvent('change')

    nameValue = await nameInput.getValue()
    expect(nameValue).toBe('John')

    isPrimaryButtonDisabled = await footerHarness.getPrimaryButtonDisabled()
    expect(isPrimaryButtonDisabled).toBeFalsy()
    isSecondaryButtonDisabled = await footerHarness.getSecondaryButtonDisabled()
    expect(isSecondaryButtonDisabled).toBeFalsy()

    // click primary button
    await footerHarness.clickPrimaryButton()

    // expect dialog to close with observable containing last state
    const result = fixture.componentInstance.resultFromShow
    expect(result?.button).toBe('primary')
    expect(result?.result).toEqual({
      name: 'Submitted John',
      surname: 'Submitted Doe',
    })
    expect(fixture.componentInstance.nameResult).toBe('Submitted John')
    expect(fixture.componentInstance.surnameResult).toBe('Submitted Doe')
  })

  describe('cleanup', () => {
    it('should close dialog and remove it from html on destroy', async () => {
      jest.spyOn(pDialogService, 'open')

      fixture.componentInstance.show(
        'title',
        { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
        'button1',
        'button2'
      )

      const dialogService = TestBed.inject(DialogService)
      expect(dialogService.dialogComponentRefMap.size).toBe(1)
      const dialogRef = dialogService.dialogComponentRefMap.keys().next().value as DynamicDialogRef
      expect(dialogRef).toBeDefined()
      const dialogRefSpy = jest.spyOn(dialogRef, 'close')

      const dialogElement = dialogService.getInstance(dialogRef)?.el.nativeElement

      fixture.detectChanges()

      fixture.componentInstance.portalDialogService.ngOnDestroy()
      expect(dialogRefSpy).toHaveBeenCalledTimes(1)
      expect(removeChildSpy).toHaveBeenCalledWith(dialogElement)
    })

    it('should warn of incorrect cleanup if component reference is not found during removal', async () => {
      jest.spyOn(pDialogService, 'open')

      fixture.componentInstance.show(
        'title',
        { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
        'button1',
        'button2'
      )

      fixture.detectChanges()
      jest.spyOn(pDialogService, 'getInstance').mockReturnValue(undefined)

      fixture.componentInstance.portalDialogService.ngOnDestroy()
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Dialog component instance could not be found during cleanup. The displayed dialog may not function as expected.'
      )
    })
  })
})
