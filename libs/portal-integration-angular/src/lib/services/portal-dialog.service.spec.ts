import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DialogResult, DialogState, PortalDialogService } from './portal-dialog.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component, Input } from '@angular/core'
import { ButtonDialogHarness } from '../../../testing/button-dialog.harness'
import { ButtonDialogComponent } from '../core/components/button-dialog/button-dialog.component'
import { CommonModule } from '@angular/common'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { DialogHostComponent } from '../core/components/button-dialog/dialog-host/dialog-host.component'
import { ButtonModule } from 'primeng/button'
import { Observable, of } from 'rxjs'

@Component({
  template: `<h1>Base component</h1>`,
})
class BaseTestComponent {
  constructor(public portalDialogService: PortalDialogService) {}

  show(): Observable<DialogState<any>> {
    return of({
      button: 'primary',
      result: undefined,
    })
  }
}

@Component({
  template: `<h1 id="testHeader">{{ header }}</h1>`,
})
class TestWithInputsComponent {
  @Input() header = 'header'
}

@Component({
  template: `<h1>Base component</h1>`,
})
class DialogResultTestComponent implements DialogResult<string> {
  dialogResult = ''

  constructor(public portalDialogService: PortalDialogService) {}

  show(): Observable<DialogState<any>> {
    return of({
      button: 'primary',
      result: undefined,
    })
  }

  changeDialogResult(value: string) {
    this.dialogResult = value
  }
}

describe('PortalDialogService', () => {
  let service: PortalDialogService
  let pDialogService: DialogService
  let rootLoader: HarnessLoader

  const translations = {
    TITLE_TRANSLATE: 'basicTitle',
    TITLE_TRANSLATE_PARAM: 'translatedTitle {{val}}',
    MESSAGE: 'myMessage',
    MESSAGE_PARAM: 'myMessage {{val}}',
    BUTTON: 'myButton',
    BUTTON_PARAM: 'myButton {{val}}',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseTestComponent, ButtonDialogComponent, DialogHostComponent],
      imports: [
        TranslateTestingModule.withTranslations('en', translations),
        DynamicDialogModule,
        CommonModule,
        NoopAnimationsModule,
        ButtonModule,
      ],
      providers: [PortalDialogService, DialogService],
    }).compileComponents()
  })

  describe('with BaseTestComponent', () => {
    let fixture: ComponentFixture<BaseTestComponent>

    beforeEach(async () => {
      fixture = TestBed.createComponent(BaseTestComponent)
      service = TestBed.inject(PortalDialogService)
      pDialogService = TestBed.inject(DialogService)
      rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
      jest.clearAllMocks()
    })

    it('should display dialog with translated title', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('TITLE_TRANSLATE', 'message', 'button1', 'button2')
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      expect(pDialogService.open).toHaveBeenCalledWith(
        ButtonDialogComponent,
        expect.objectContaining({
          header: translations['TITLE_TRANSLATE'],
        })
      )
    })

    it('should display dialog with translated title with parameters', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew(
          { key: 'TITLE_TRANSLATE_PARAM', parameters: { val: 'myParam' } },
          'message',
          'button1',
          'button2'
        )
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      expect(pDialogService.open).lastCalledWith(
        ButtonDialogComponent,
        expect.objectContaining({
          header: 'translatedTitle myParam',
        })
      )
    })

    it('should display dialog with translated message', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'MESSAGE', 'button1', 'button2')
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const message = await dialogHarness.getTextFor('#dialogMessage')
      expect(message).toEqual(translations['MESSAGE'])
    })

    it('should display dialog with translated message with parameters', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew(
          'title',
          { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } },
          'button1',
          'button2'
        )
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const message = await dialogHarness.getTextFor('#dialogMessage')
      expect(message).toEqual('myMessage myMsgParam')
    })

    it('should display dialog with translated buttons', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'BUTTON', 'BUTTON')
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const primaryButtonLabel = await dialogHarness.getPrimaryButtonlabel()
      expect(primaryButtonLabel).toBe(translations['BUTTON'])
      const secondaryButtonLabel = await dialogHarness.getSecondaryButtonlabel()
      expect(secondaryButtonLabel).toBe(translations['BUTTON'])
    })

    it('should display dialog with translated buttons with parameters', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew(
          'title',
          'message',
          { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam1' } },
          { key: 'BUTTON_PARAM', parameters: { val: 'myButtonParam2' } }
        )
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const primaryButtonLabel = await dialogHarness.getPrimaryButtonlabel()
      expect(primaryButtonLabel).toBe('myButton myButtonParam1')
      const secondaryButtonLabel = await dialogHarness.getSecondaryButtonlabel()
      expect(secondaryButtonLabel).toBe('myButton myButtonParam2')
    })

    it('should display dialog with translated buttons with icons', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew(
          'title',
          'message',
          { key: 'BUTTON', icon: 'pi pi-times' },
          { key: 'BUTTON', icon: 'pi pi-trash' }
        )
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const primaryButtonLabel = await dialogHarness.getPrimaryButtonlabel()
      const primaryButtonIcon = await dialogHarness.getPrimaryButtonIcon()
      expect(primaryButtonLabel).toBe(translations['BUTTON'])
      expect(primaryButtonIcon).toBe('pi pi-times')

      const secondaryButtonLabel = await dialogHarness.getSecondaryButtonlabel()
      const secondaryButtonIcon = await dialogHarness.getSecondaryButtonIcon()
      expect(secondaryButtonLabel).toBe(translations['BUTTON'])
      expect(secondaryButtonIcon).toBe('pi pi-trash')
    })

    it('should display dialog with message and icon if DialogMessage provided as string and icon', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', { message: 'MESSAGE', icon: 'pi pi-times' }, 'button1', 'button2')
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const message = await dialogHarness.getTextFor('#dialogMessage')
      expect(message).toEqual(translations['MESSAGE'])
      const icon = await dialogHarness.getAttributeFor('i', 'class')
      expect(icon).toContain('pi pi-times')
    })

    it('should display dialog with message and icon if DialogMessage provided as TranslationKey and icon', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew(
          'title',
          { message: { key: 'MESSAGE_PARAM', parameters: { val: 'dialogMessageParam' } }, icon: 'pi pi-times' },
          'button1',
          'button2'
        )
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const message = await dialogHarness.getTextFor('#dialogMessage')
      expect(message).toEqual('myMessage dialogMessageParam')
      const icon = await dialogHarness.getAttributeFor('i', 'class')
      expect(icon).toContain('pi pi-times')
    })

    it('should display dialog with custom component if provided', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', { type: TestWithInputsComponent }, 'button1', 'button2')
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const headerValue = await dialogHarness.getTextFor('#testHeader')
      expect(headerValue).toEqual('header')
    })

    it('should display dialog with custom component and inputs if provided', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew(
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
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const headerValue = await dialogHarness.getTextFor('#testHeader')
      expect(headerValue).toEqual('myCustomHeader')
    })

    it('should display dialog with single button if secondary not provided', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'button1')
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      const primaryButtonLabel = await dialogHarness.getPrimaryButtonlabel()
      expect(primaryButtonLabel).toBe('button1')
      const secondaryButtonLabel = await dialogHarness.getSecondaryButtonlabel()
      expect(secondaryButtonLabel).toBeUndefined()
    })

    it('should display dialog without top close button when one button defined', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'button1', undefined, true)
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      expect(pDialogService.open).toHaveBeenCalledWith(
        ButtonDialogComponent,
        expect.objectContaining({
          closable: false,
        })
      )
    })

    it('should display dialog without top close button when both buttons defined but specified to remove the button', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'button1', 'button2', false)
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      expect(pDialogService.open).toHaveBeenCalledWith(
        ButtonDialogComponent,
        expect.objectContaining({
          closable: false,
        })
      )
    })

    it('should display dialog with top close button when both buttons defined and enabled', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'button1', 'button2', true)
      })

      fixture.componentInstance.show()
      fixture.detectChanges()

      expect(pDialogService.open).toHaveBeenCalledWith(
        ButtonDialogComponent,
        expect.objectContaining({
          closable: true,
        })
      )
    })

    it('should return dialogState with primary on primaryButton click', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'button1', 'button2')
      })

      fixture.componentInstance.show().subscribe({
        next: (result: DialogState<any>) => {
          expect(result.button).toEqual('primary')
          expect(result.result).toBeUndefined()
        },
        error: () => {
          fail('it should not result in error')
        },
      })
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      await dialogHarness.clickPrimaryButton()
    })

    it('should return dialogState with secondary on primaryButton click', async () => {
      jest.spyOn(pDialogService, 'open')
      jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
        return service.openNew('title', 'message', 'button1', 'button2')
      })

      fixture.componentInstance.show().subscribe({
        next: (result: DialogState<any>) => {
          expect(result.button).toEqual('secondary')
          expect(result.result).toBeUndefined()
        },
        error: () => {
          fail('it should not result in error')
        },
      })
      fixture.detectChanges()

      const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
      await dialogHarness.clickSecondaryButton()
    })
  })

  it('should return dialogState with primary and dialogResult on primaryButton click when component implements DialogResult<T>', async () => {
    const fixture: ComponentFixture<DialogResultTestComponent> = TestBed.createComponent(DialogResultTestComponent)
    service = TestBed.inject(PortalDialogService)
    pDialogService = TestBed.inject(DialogService)
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
    jest.clearAllMocks()

    jest.spyOn(pDialogService, 'open')
    jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
      return service.openNew('title', 'message', 'button1', 'button2')
    })

    fixture.componentInstance.show().subscribe({
      next: (result: DialogState<any>) => {
        expect(result.button).toEqual('primary')
        expect(result.result).toEqual('newValue')
      },
      error: () => {
        fail('it should not result in error')
      },
    })
    fixture.detectChanges()

    fixture.componentInstance.changeDialogResult('newValue')

    const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
    await dialogHarness.clickPrimaryButton()
  })
})
