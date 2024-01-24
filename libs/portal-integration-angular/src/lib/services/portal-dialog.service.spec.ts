import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PortalDialogService } from './portal-dialog.service'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { Component, Input } from '@angular/core'
import { ButtonDialogHarness } from 'libs/portal-integration-angular/testing'
import { ButtonDialogComponent } from '../core/components/button-dialog/button-dialog.component'
import { CommonModule } from '@angular/common'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { DialogHostComponent } from '../core/components/button-dialog/dialog-host/dialog-host.component'
import { ButtonModule } from 'primeng/button'

@Component({
  template: `<h1>Base component</h1>`,
})
class BaseTestComponent {
  constructor(public portalDialogService: PortalDialogService) {}

  show() {}
}

describe('PortalDialogService', () => {
  let service: PortalDialogService
  let pDialogService: DialogService
  let rootLoader: HarnessLoader
  let fixture: ComponentFixture<BaseTestComponent>

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
    fixture = TestBed.createComponent(BaseTestComponent)
    service = TestBed.inject(PortalDialogService)
    pDialogService = TestBed.inject(DialogService)
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture)
  })

  it('should display dialog with translated title', async () => {
    jest.spyOn(pDialogService, 'open')
    jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
      service.openNew('TITLE_TRANSLATE', 'message', 'button1', 'button2')
    })

    fixture.componentInstance.show()
    fixture.detectChanges()

    // jest.setTimeout(1)

    expect(pDialogService.open).toHaveBeenCalledWith(
      ButtonDialogComponent,
      expect.objectContaining({
        header: translations['TITLE_TRANSLATE'],
      })
    )
    const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
    // const res = await dialogHarness.hasHarness(PButtonHarness)
    // expect(res).toBeTruthy()
  })

  it('should display dialog with translated title with parameters', async () => {
    jest.spyOn(pDialogService, 'open')
    jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
      service.openNew({ key: 'TITLE_TRANSLATE_PARAM', parameters: { val: 'myParam' } }, 'message', 'button1', 'button2')
    })

    fixture.componentInstance.show()
    fixture.detectChanges()

    expect(pDialogService.open).toHaveBeenCalledWith(
      ButtonDialogComponent,
      expect.objectContaining({
        header: 'translatedTitle myParam',
      })
    )
  })

  it('should display dialog with translated message', async () => {
    jest.spyOn(pDialogService, 'open')
    jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
      service.openNew('title', 'MESSAGE', 'button1', 'button2')
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
      service.openNew('title', { key: 'MESSAGE_PARAM', parameters: { val: 'myMsgParam' } }, 'button1', 'button2')
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
      service.openNew('title', 'message', 'BUTTON', 'BUTTON')
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
      service.openNew(
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
      service.openNew(
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
      service.openNew('title', { message: 'MESSAGE', icon: 'pi pi-times' }, 'button1', 'button2')
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
      service.openNew(
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

  @Component({
    template: `<h1 id="testHeader">{{ header }}</h1>`,
  })
  class TestComponentWithInputs {
    @Input() header: string = 'header'
  }

  it('should display dialog with custom component if provided', async () => {
    jest.spyOn(pDialogService, 'open')
    jest.spyOn(fixture.componentInstance, 'show').mockImplementation(() => {
      service.openNew('title', { type: TestComponentWithInputs }, 'button1', 'button2')
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
      service.openNew(
        'title',
        {
          type: TestComponentWithInputs,
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
      service.openNew('title', 'message', 'button1')
    })

    fixture.componentInstance.show()
    fixture.detectChanges()

    const dialogHarness = await rootLoader.getHarness(ButtonDialogHarness)
    const primaryButtonLabel = await dialogHarness.getPrimaryButtonlabel()
    expect(primaryButtonLabel).toBe('button1')
    const secondaryButtonLabel = await dialogHarness.getSecondaryButtonlabel()
    expect(secondaryButtonLabel).toBeUndefined()
  })
})
