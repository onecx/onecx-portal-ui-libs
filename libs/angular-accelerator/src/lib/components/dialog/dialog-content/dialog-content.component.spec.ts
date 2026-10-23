import { Component, ChangeDetectionStrategy } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing'
import { DivHarness, TestbedHarnessEnvironment } from '@onecx/angular-testing'
import { DynamicDialogConfig, DynamicDialogRef } from '@openng/optimus-ui/dynamicdialog'
import { Observable, Subject } from 'rxjs'
import { DialogContentHarness, provideTranslateTestingService } from '../../../../../testing'
import { AngularAcceleratorModule } from '../../../angular-accelerator.module'
import {
  DialogButtonClicked,
  DialogCustomButtonsDisabled,
  DialogPrimaryButtonDisabled,
  DialogResult,
  DialogSecondaryButtonDisabled,
  DialogState,
} from '../../../services/portal-dialog.service'
import { DialogMessageContentComponent } from '../dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from './dialog-content.component'

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ocx-dialog-content>
    <div class="host">HostComponentContent</div>
  </ocx-dialog-content>`,
})
class TestBaseHostComponent {}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ` <div class="test">Test Component</div>`,
})
class TestWithDialogResultComponent implements DialogResult<string> {
  dialogResult = ''
}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ` <div class="test">Test Component</div>`,
})
class TestWithButtonDisableComponent
  implements DialogPrimaryButtonDisabled, DialogSecondaryButtonDisabled, DialogCustomButtonsDisabled
{
  primaryState = false
  secondaryState = false
  customState = false
  customButtonEnabled: Subject<{ id: string; enabled: boolean }> = new Subject()
  secondaryButtonEnabled: Subject<boolean> = new Subject()
  primaryButtonEnabled: Subject<boolean> = new Subject()

  togglePrimaryButtonEnable() {
    this.primaryState = !this.primaryState
    this.primaryButtonEnabled.next(this.primaryState)
  }

  toggleSecondaryButtonEnable() {
    this.secondaryState = !this.secondaryState
    this.secondaryButtonEnabled.next(this.secondaryState)
  }

  toggleCustomButtonEnable() {
    this.customState = !this.customState
    this.customButtonEnabled.next({
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
      imports: [AngularAcceleratorModule],
      providers: [DynamicDialogConfig, DynamicDialogRef, provideTranslateTestingService({})],
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
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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
    buttonClickedEmitter.next(clickedState)

    expect(dynamicDialogRefSpy).toHaveBeenCalledWith(clickedState)
  })
  it('should close dialog with overwritten state result with component result if DialogResult is implemented', async () => {
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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
    buttonClickedEmitter.next({
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
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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
    buttonClickedEmitter.next({
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
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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

    buttonClickedEmitter.next({
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
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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

    buttonClickedEmitter.next({
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
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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

    buttonClickedEmitter.next({
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
    const buttonClickedEmitter = new Subject<DialogState<unknown>>()
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

    buttonClickedEmitter.next({
      button: 'primary',
      result: 'buttonClickResult',
      id: undefined,
    })

    expect(dynamicDialogRefSpy).toHaveBeenCalledTimes(0)
  })

  describe('buttons enablement', () => {
    it('should emit when primary button enablement changes', () => {
      const primaryButtonEnabledEmitter = new Subject<boolean>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          primaryButtonEnabled$: primaryButtonEnabledEmitter,
          buttonClicked$: new Subject(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(primaryButtonEnabledEmitter, 'next')
      component.componentRef.instance.togglePrimaryButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith(true)
    })
    it('should emit when secondary button enablement changes', () => {
      const secondaryButtonEnabledEmitter = new Subject<boolean>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          secondaryButtonEnabled$: secondaryButtonEnabledEmitter,
          buttonClicked$: new Subject(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(secondaryButtonEnabledEmitter, 'next')
      component.componentRef.instance.toggleSecondaryButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith(true)
    })
    it('should emit when custom button enablement changes', () => {
      const customButtonEnabledEmitter = new Subject<{ id: string; enabled: boolean }>()
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: TestWithButtonDisableComponent,
        portalDialogServiceData: {
          customButtonEnabled$: customButtonEnabledEmitter,
          buttonClicked$: new Subject(),
        },
      }

      fixture = TestBed.createComponent(DialogContentComponent)
      fixture.detectChanges()
      component = fixture.componentInstance

      const emitterSpy = jest.spyOn(customButtonEnabledEmitter, 'next')
      component.componentRef.instance.toggleCustomButtonEnable()

      expect(emitterSpy).toHaveBeenCalledWith({
        id: 'id',
        enabled: true,
      })
    })
  })
  describe('scroll region', () => {
    let resizeCallback: (() => void) | undefined
    const observe = jest.fn()
    const disconnect = jest.fn()

    function setOverflow(region: HTMLElement, overflow: { vertical?: boolean; horizontal?: boolean }) {
      Object.defineProperty(region, 'clientHeight', { configurable: true, value: 100 })
      Object.defineProperty(region, 'scrollHeight', { configurable: true, value: overflow.vertical ? 300 : 100 })
      Object.defineProperty(region, 'clientWidth', { configurable: true, value: 200 })
      Object.defineProperty(region, 'scrollWidth', { configurable: true, value: overflow.horizontal ? 400 : 200 })
    }

    function createWithLongMessage() {
      const dialogConfig = TestBed.inject(DynamicDialogConfig)
      dialogConfig.data = {
        component: DialogMessageContentComponent,
        componentData: { message: 'Lorem ipsum dolor sit amet '.repeat(12) },
        portalDialogServiceData: { buttonClicked$: new Subject() },
      }
      fixture = TestBed.createComponent(DialogContentComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      return fixture.nativeElement.querySelector('.buttonDialogScrollableContent') as HTMLElement
    }

    const globalWithResizeObserver = globalThis as unknown as { ResizeObserver?: typeof ResizeObserver }
    const originalResizeObserver = globalWithResizeObserver.ResizeObserver

    beforeEach(() => {
      resizeCallback = undefined
      observe.mockClear()
      disconnect.mockClear()
      globalWithResizeObserver.ResizeObserver = jest.fn((callback: () => void) => {
        resizeCallback = callback
        return { observe, disconnect, unobserve: jest.fn() }
      }) as unknown as typeof ResizeObserver
    })

    afterEach(() => {
      globalWithResizeObserver.ResizeObserver = originalResizeObserver
    })

    it('should not be focusable or a named region while the content fits', () => {
      const region = createWithLongMessage()

      expect(component.scrollable()).toBe(false)
      expect(region.getAttribute('tabindex')).toBeNull()
      expect(region.getAttribute('role')).toBeNull()
      expect(region.getAttribute('aria-label')).toBeNull()
      expect(observe).toHaveBeenCalledTimes(2)
    })

    it('should become a keyboard focusable, named region when the content overflows vertically', () => {
      const region = createWithLongMessage()

      setOverflow(region, { vertical: true })
      resizeCallback?.()
      fixture.detectChanges()

      expect(component.scrollable()).toBe(true)
      expect(region.getAttribute('tabindex')).toBe('0')
      expect(region.getAttribute('role')).toBe('region')
      expect(region.getAttribute('aria-label')).toBeTruthy()
      expect(region.textContent).toContain('Lorem ipsum')
    })

    it('should become focusable when the content overflows horizontally and stop when it fits again', () => {
      const region = createWithLongMessage()

      setOverflow(region, { horizontal: true })
      resizeCallback?.()
      fixture.detectChanges()
      expect(region.getAttribute('tabindex')).toBe('0')

      setOverflow(region, {})
      resizeCallback?.()
      fixture.detectChanges()
      expect(region.getAttribute('tabindex')).toBeNull()
    })

    it('should disconnect the resize observer on destroy', () => {
      createWithLongMessage()

      fixture.destroy()

      expect(disconnect).toHaveBeenCalled()
    })

    it('should evaluate the overflow once when ResizeObserver is not available', () => {
      delete globalWithResizeObserver.ResizeObserver
      const region = createWithLongMessage()

      expect(resizeCallback).toBeUndefined()
      expect(region.getAttribute('tabindex')).toBeNull()
    })
  })
})
