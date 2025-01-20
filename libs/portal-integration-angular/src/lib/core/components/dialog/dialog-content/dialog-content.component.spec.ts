import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing'
import { DialogContentComponent } from './dialog-content.component'
import { DialogContentHarness, DivHarness, TestbedHarnessEnvironment } from '@onecx/portal-integration-angular/testing'
import { MockAuthModule } from '../../../../mock-auth/mock-auth.module'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Component, EventEmitter } from '@angular/core'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
} from '../../../../services/portal-dialog.service'
import { Observable } from 'rxjs'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DialogMessageContentComponent } from '../../button-dialog/dialog-message-content/dialog-message-content.component'

@Component({
  template: `<ocx-dialog-content>
    <div class="host">HostComponentContent</div>
  </ocx-dialog-content>`,
})
class TestBaseHostComponent {}

@Component({
  template: ` <div class="test">Test Component</div>`,
})
class TestWithDialogResultComponent implements DialogResult<string> {
  dialogResult = ''
}

@Component({
  template: ` <div class="test">Test Component</div>`,
})
class TestWithButtonClickedComponent implements DialogButtonClicked {
  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Promise<boolean> | Observable<boolean> | undefined {
    if (this.returnUndefined) return undefined
    if (state.button === this.expectedButton) {
      return true
    }
    return false
  }

  returnUndefined = false
  expectedButton = 'primary'
}

@Component({
  template: ` <div class="test">Test Component</div>`,
})
class TestWithDialogResultAndButtonClickedComponent implements DialogResult<string>, DialogButtonClicked {
  ocxDialogButtonClicked(
    state: DialogState<unknown>
  ): boolean | void | Promise<boolean> | Observable<boolean> | undefined {
    if (state.button === this.expectedButton && state.result === this.expectedResult) {
      return true
    }
    return false
  }

  dialogResult = ''

  returnUndefined = false
  expectedButton = 'primary'
  expectedResult = ''
}

@Component({
  template: ` <div class="test">Test Component</div>`,
})
class TestWithButtonDisableComponent
  implements DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled, DialogCustomButtonsDisabled
{
  primaryState = false
  secondaryState = false
  customState = false
  customButtonEnabled: EventEmitter<{ id: string; enabled: boolean }> = new EventEmitter()
  secondaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()
  primaryButtonEnabled: EventEmitter<boolean> = new EventEmitter()

  togglePrimaryButtonEnable() {
    this.primaryState = !this.primaryState
    this.primaryButtonEnabled.emit(this.primaryState)
  }

  toggleSecondaryButtonEnable() {
    this.secondaryState = !this.secondaryState
    this.secondaryButtonEnabled.emit(this.secondaryState)
  }

  toggleCustomButtonEnable() {
    this.customState = !this.customState
    this.customButtonEnabled.emit({
      id: 'id',
      enabled: this.customState,
    })
  }
}

describe('DialogContentComponent', () => {
  let component: DialogContentComponent
  let fixture: ComponentFixture<DialogContentComponent>

  let fixtureWithHost
  let harnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogContentComponent, DialogMessageContentComponent],
      imports: [MockAuthModule, TranslateTestingModule.withTranslations({})],
      providers: [DynamicDialogConfig, DynamicDialogRef],
    }).compileComponents()

    jest.resetAllMocks()
  })

  it('should ue ng-content', async () => {
    fixtureWithHost = TestBed.createComponent(TestBaseHostComponent)
    fixtureWithHost.detectChanges()
    harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
    const contentHarness = await harnessLoader.getHarness(DialogContentHarness)

    const contentDiv = await contentHarness.getHarness(DivHarness.with({ class: 'host' }))
    expect(contentDiv).toBeDefined()
    expect(await contentDiv.getText()).toBe('HostComponentContent')
  })

  it('should close dialog with result of button click', () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    const clickedState: DialogState<unknown> = {
      button: 'primary',
      result: undefined,
      id: undefined,
    }
    buttonClickedEmitter.emit(clickedState)

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith(clickedState)
  })
  it('should close dialog with overwritten state result with component result if DialogResult is implemented', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithDialogResultComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.dialogResult = 'componentResult'
    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'componentResult',
      id: undefined,
    })
  })
  it('should close dialog with state result if DialogButtonClicked resulted in undefined', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.returnUndefined = true
    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })
  })
  it('should close dialog with overwritten state result if DialogButtonClicked resulted in undefined', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.returnUndefined = true

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })
  })
  it('should close dialog with state result if DialogButtonClicked resulted in true', fakeAsync(() => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.expectedButton = 'primary'

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    flush()

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })
  }))
  it('should close dialog with overwritten state result if DialogButtonClicked resulted in true', fakeAsync(() => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithDialogResultAndButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.expectedButton = 'primary'
    component.componentRef.instance.expectedResult = 'my-result'
    component.componentRef.instance.dialogResult = 'my-result'

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    flush()

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith({
      button: 'primary',
      result: 'my-result',
      id: undefined,
    })
  }))
  it('should not close dialog if DialogButtonClicked resulted in false', async () => {
    const buttonClickedEmitter = new EventEmitter<DialogState<unknown>>()
    const dialogConfig = TestBed.inject(DynamicDialogConfig)
    dialogConfig.data = {
      component: TestWithDialogResultAndButtonClickedComponent,
      portalDialogServiceData: {
        buttonClicked$: buttonClickedEmitter,
      },
    }
    const dynamicDialogRef = TestBed.inject(DynamicDialogRef)
    const dynamicDialogRefSpy = jest.spyOn(dynamicDialogRef, 'close')

    fixture = TestBed.createComponent(DialogContentComponent)
    fixture.detectChanges()
    component = fixture.componentInstance

    component.componentRef.instance.expectedButton = 'primary'
    component.componentRef.instance.expectedResult = 'my-result'
    component.componentRef.instance.dialogResult = 'my-other-result'

    buttonClickedEmitter.emit({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledTimes(0)
  })

  describe('buttons enablement', () => {
    it('should emit when primary button enablement changes', () => {
      const primaryButtonEnabledEmitter = new EventEmitter<boolean>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          primaryButtonEnabled$: primaryButtonEnabledEmitter,
          buttonClicked$: new EventEmitter(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(primaryButtonEnabledEmitter, 'emit')
      component.componentRef.instance.togglePrimaryButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith(true)
    })
    it('should emit when secondary button enablement changes', () => {
      const secondaryButtonEnabledEmitter = new EventEmitter<boolean>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          secondaryButtonEnabled$: secondaryButtonEnabledEmitter,
          buttonClicked$: new EventEmitter(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(secondaryButtonEnabledEmitter, 'emit')
      component.componentRef.instance.toggleSecondaryButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith(true)
    })
    it('should emit when custom button enablement changes', () => {
      const customButtonEnabledEmitter = new EventEmitter<{ id: string; enabled: boolean }>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          customButtonEnabled$: customButtonEnabledEmitter,
          buttonClicked$: new EventEmitter(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(customButtonEnabledEmitter, 'emit')
      component.componentRef.instance.toggleCustomButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith({
        id: 'id',
        enabled: true,
      })
    })
  })
})
