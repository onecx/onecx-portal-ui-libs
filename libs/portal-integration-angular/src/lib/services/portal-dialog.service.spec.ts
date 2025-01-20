import { CommonModule } from '@angular/common'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'
import { Observable, of } from 'rxjs'

import { DialogMessageContentComponent } from '../core/components/button-dialog/dialog-message-content/dialog-message-content.component'
import {
  DialogButtonClicked,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
  PortalDialogService,
} from './portal-dialog.service'
import { DivHarness, InputHarness } from '@onecx/angular-testing'
import { DialogContentHarness, DialogFooterHarness } from '../../../testing/index'
import { PrimeIcons } from 'primeng/api'
import { DialogContentComponent } from '../core/components/dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../core/components/dialog/dialog-footer/dialog-footer.component'

@Component({
  template: `<h1>BaseTestComponent</h1>`,
})
class BaseTestComponent {
  resultFromShow: DialogState<any> | undefined = undefined
  nameResult: string | undefined
  surnameResult: string | undefined
  constructor(public portalDialogService: PortalDialogService) {}

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
        this.nameResult = result.result?.name
        this.surnameResult = result.result?.surname
        this.resultFromShow = result
      })
  }
}

@Component({
  template: `<div class="testHeader">{{ header }}</div>`,
})
class TestWithInputsComponent {
  @Input() header = 'header'
}

@Component({
  template: `<h1>DialogResultTestComponent</h1>`,
})
class DialogResultTestComponent implements DialogResult<string> {
  @Input() dialogResult = ''

  constructor(public portalDialogService: PortalDialogService) {}
}

@Component({
  template: `<h1>DialogButtonClickedWithResultComponent</h1>`,
})
class DialogButtonClickedWithResultComponent implements DialogResult<number>, DialogButtonClicked {
  @Input() dialogResult = 13
  @Input() returnType: 'boolean' | 'observable' | 'promise' | 'undefined' = 'boolean'
  @Input() expectedDialogResult = 25

  constructor(public portalDialogService: PortalDialogService) {}

  ocxDialogButtonClicked(state: DialogState<number>): boolean | Observable<boolean> | Promise<boolean> | undefined {
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

@Component({
  template: `<h1>DialogPrimaryButtonDisabledComponent</h1>`,
})
class DialogPrimaryButtonDisabledComponent implements DialogPrimaryButtonDisabled {
  @Output()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
}

@Component({
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

@Component({
  template: `<div>
    <h1>CompleteDialogComponent</h1>
    <div class="nameError" *ngIf="!isNameValid">Name is not correct</div>
    <label for="name">Name:</label>
    <input id="name" type="text" (change)="onNameChange($event)" />
    <label for="surname">Surname:</label>
    <input id="surname" type="text" (change)="onSurnameChange($event)" />
    <div class="message" *ngIf="message !== undefined">{{ message }}</div>
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

  const translations = {
    TITLE_TRANSLATE: 'simpleTitle',
    TITLE_TRANSLATE_PARAM: 'translatedTitle {{val}}',
    MESSAGE: 'myMessage',
    MESSAGE_PARAM: 'myMessage {{val}}',
    BUTTON: 'myButton',
    BUTTON_PARAM: 'myButton {{val}}',
  }

  beforeEach(async () => {
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
      imports: [
        TranslateTestingModule.withTranslations('en', translations),
        DynamicDialogModule,
        CommonModule,
        NoopAnimationsModule,
        ButtonModule,
      ],
      providers: [PortalDialogService, DialogService],
    }).compileComponents()
    fixture = TestBed.createComponent(BaseTestComponent)
    pDialogService = TestBed.inject(DialogService)
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
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
  })

  it('should display dialog with translated title with parameters', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show(
      { key: 'TITLE_TRANSLATE_PARAM', parameters: { val: 'myParam' } },
      'message',
      'button1',
      'button2'
    )

    expect(pDialogService.open).lastCalledWith(
      DialogContentComponent,
      expect.objectContaining({
        header: 'translatedTitle myParam',
      })
    )
  })

  it('should display dialog with translated message', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'MESSAGE', 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const dialogMessageContentHarness = await contentHarness.getDialogMessageContent()
    expect(await dialogMessageContentHarness?.getMessageContent()).toEqual(translations['MESSAGE'])
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
  })

  it('should display dialog with translated buttons', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'BUTTON', 'BUTTON')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe(translations['BUTTON'])
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBe(translations['BUTTON'])
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
  })

  it('should display dialog with custom component if provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', TestWithInputsComponent, 'button1', 'button2')

    const contentHarness = await rootLoader.getHarness(DialogContentHarness)
    const headerDiv = await contentHarness.getHarness(DivHarness.with({ class: 'testHeader' }))
    const headerValue = await headerDiv.getText()
    expect(headerValue).toEqual('header')
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
  })

  it('should display dialog with single button if secondary not provided', async () => {
    jest.spyOn(pDialogService, 'open')

    fixture.componentInstance.show('title', 'message', 'button1')

    const footerHarness = await rootLoader.getHarness(DialogFooterHarness)
    const primaryButtonLabel = await footerHarness.getPrimaryButtonLabel()
    expect(primaryButtonLabel).toBe('button1')
    const secondaryButtonLabel = await footerHarness.getSecondaryButtonLabel()
    expect(secondaryButtonLabel).toBeUndefined()
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
    expect(result).toBeUndefined()
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
    expect(result).toBeUndefined()
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
    expect(result).toBeUndefined()
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
    expect(result?.result).toBe(13)
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
})
