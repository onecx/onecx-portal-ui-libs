import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ButtonDialogComponent, DefaultButtonDialogHostComponent } from './button-dialog.component'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { MFE_INFO } from '../../../api/injection-tokens'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { PButtonHarness } from '../../../../../testing'
import { Component, EventEmitter, Input, ViewChild } from '@angular/core'
import { ButtonDialogDynamicDialogConfig, ButtonDialogConfig } from '../../../model/button-dialog'
import { By } from '@angular/platform-browser'

describe('ButtonDialogComponent', () => {
  let component: ButtonDialogComponent
  let fixture: ComponentFixture<ButtonDialogComponent>
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonDialogComponent],
      imports: [
        ButtonModule,
        MockAuthModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../../assets/i18n/en.json'),
          de: require('./../../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        {
          provide: MFE_INFO,
          useValue: {
            baseHref: '/base/path',
            mountPath: '/base/path',
            remoteBaseUrl: 'http://localhost:4200',
            shellName: 'shell',
          },
        },
        DynamicDialogConfig,
        DynamicDialogRef,
      ],
    })
  })

  describe('basic usage', () => {
    beforeEach(async () => {
      await TestBed.compileComponents()
      fixture = TestBed.createComponent(ButtonDialogComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      loader = TestbedHarnessEnvironment.loader(fixture)
    })

    it('should create button-dialog component', () => {
      expect(component).toBeTruthy()
    })

    it('should create default button-dialog without passing config', async () => {
      // expect correct default initialization
      expect(component.dialogData.component).toEqual(undefined)
      expect(component.dialogData.componentData).toEqual(undefined)
      expect(component.dialogData.config.primaryButtonDetails).toEqual(component.defaultPrimaryButtonDetails)
      expect(component.dialogData.config.secondaryButtonEnabled).toEqual(true)
      expect(component.dialogData.config.secondaryButtonDetails).toEqual(component.defaultSecondaryButtonDetails)

      // expect default emitted value to be label
      jest.spyOn(component.resultEmitter, 'emit')
      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await button.click()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith(
        component.defaultDialogData.config.primaryButtonDetails?.label
      )

      // expect default label
      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
      // expect no icon
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton')?.getAttribute('ng-reflect-icon')).toBe('')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton')?.getAttribute('ng-reflect-icon')).toBe('')
    })

    it('should create customized button-dialog with passing config', () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
        },
        secondaryButtonEnabled: true,
        secondaryButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
        },
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      // expect correct label
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('CustomSide')
      // expect correct icon
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton')?.getAttribute('ng-reflect-icon')).toBe(
        'pi pi-check'
      )
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton')?.getAttribute('ng-reflect-icon')).toBe(
        'pi pi-times'
      )
    })

    it('should create a new EventEmitter by default', async () => {
      jest.spyOn(component.resultEmitter, 'emit')

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await button.click()

      // expect default emitter to be called
      expect(component.resultEmitter.emit).toHaveBeenCalledTimes(1)
    })

    it('should create Confirm/Cancel button-dialog when sideButton is enabled', () => {
      component.dialogData.config.secondaryButtonEnabled = true

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is disabled', () => {
      component.dialogData.config.secondaryButtonEnabled = false

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')).not.toBeTruthy()
    })

    it('should create CustmMain/Cancel button-dialog when mainButton is defined', () => {
      component.dialogData.config.primaryButtonDetails = {
        label: 'CustomMain',
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined', () => {
      component.dialogData.config.secondaryButtonDetails = {
        label: 'CustomSide',
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain/CustomSide button-dialog when both buttons are defined', () => {
      component.dialogData.config.primaryButtonDetails = {
        label: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonDetails = {
        label: 'CustomSide',
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is disabled', () => {
      component.dialogData.config.primaryButtonDetails = {
        label: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonEnabled = false

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')).not.toBeTruthy()
    })

    it('should create CustomMain/Cancel button-dialog when sideButton is enabled', () => {
      component.dialogData.config.primaryButtonDetails = {
        label: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonEnabled = true

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is defined but is disabled', () => {
      component.dialogData.config.secondaryButtonDetails = {
        label: 'CustomSide',
      }
      component.dialogData.config.secondaryButtonEnabled = false

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')).not.toBeTruthy()
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined and enabled', () => {
      component.dialogData.config.secondaryButtonDetails = {
        label: 'CustomSide',
      }
      component.dialogData.config.secondaryButtonEnabled = true

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is defined but is disabled', () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          label: 'CustomMain',
        },
        secondaryButtonDetails: {
          label: 'CustomSide',
        },
        secondaryButtonEnabled: false,
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).not.toBeTruthy()
    })

    it('should emit approperiate values', async () => {
      jest.spyOn(component.resultEmitter, 'emit')

      component.dialogData.config = {
        primaryButtonDetails: {
          label: 'CustomMain',
          valueToEmit: 'myCustomValueWithCustomType',
        },
      }

      fixture.detectChanges()

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await button.click()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith('myCustomValueWithCustomType')
    })
  })

  describe('with dynamicDialog data', () => {
    it('should use DynamicDialogConfig', async () => {
      const buttonDialogData: ButtonDialogDynamicDialogConfig = {
        component: DefaultButtonDialogHostComponent,
        config: {
          primaryButtonDetails: {
            label: 'CustomMainFromDynamicDialogConfig',
            icon: 'pi pi-check',
            closeDialog: false,
            valueToEmit: false,
          },
          secondaryButtonEnabled: true,
          secondaryButtonDetails: {
            label: 'CustomSideFromDynamicDialogConfig',
            icon: 'pi pi-times',
            closeDialog: false,
            valueToEmit: true,
          },
        },
        componentData: {
          title: 'CustomTitleFromDynamicDialogConfig',
        },
      }
      const dialogConfig: DynamicDialogConfig = {
        data: buttonDialogData,
      }
      TestBed.overrideProvider(DynamicDialogConfig, { useValue: dialogConfig })

      await TestBed.compileComponents()
      fixture = TestBed.createComponent(ButtonDialogComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      component.loadComponent()
      fixture.detectChanges()

      // expect correct data from dynamic dialog config
      expect(component.dialogData.component).toBe(DefaultButtonDialogHostComponent)
      expect(component.dialogData.config.primaryButtonDetails).toBe(buttonDialogData.config?.primaryButtonDetails)
      expect(component.dialogData.config.secondaryButtonEnabled).toBe(buttonDialogData.config?.secondaryButtonEnabled)
      expect(component.dialogData.config.secondaryButtonDetails).toBe(buttonDialogData.config?.secondaryButtonDetails)
      expect(component.dialogData.componentData).toBe(buttonDialogData.componentData)

      // expect changes in ui with config
      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('h2')?.textContent).toBe('CustomTitleFromDynamicDialogConfig')
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe(
        'CustomMainFromDynamicDialogConfig'
      )
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe(
        'CustomSideFromDynamicDialogConfig'
      )
    })

    it('should use use default data if dynamicDialogConfig not passed', async () => {
      const buttonDialogData: ButtonDialogDynamicDialogConfig = {}
      const dialogConfig: DynamicDialogConfig = {
        data: buttonDialogData,
      }
      TestBed.overrideProvider(DynamicDialogConfig, { useValue: dialogConfig })

      await TestBed.compileComponents()
      fixture = TestBed.createComponent(ButtonDialogComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      component.loadComponent()
      fixture.detectChanges()
      loader = TestbedHarnessEnvironment.loader(fixture)

      jest.spyOn(component.dynamicDialogRef, 'close')

      // exepect default data if config not passed
      expect(component.dialogData).toBe(component.defaultDialogData)

      // expect to close dialog by default
      const mainButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await mainButton.click()

      expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(1)

      jest.resetAllMocks()

      const sideButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogSecondaryButton' }))
      await sideButton.click()

      expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(1)

      // expect default label
      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('h2')?.textContent).toBe('Title')
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
      // expect no icon
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton')?.getAttribute('ng-reflect-icon')).toBe('')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton')?.getAttribute('ng-reflect-icon')).toBe('')
    })

    it('should use correct emitter while passing emitter via dynamicDialogConfig', async () => {
      const emitter: EventEmitter<any> = new EventEmitter()
      jest.spyOn(emitter, 'emit')

      const defaultEmiter = component.resultEmitter
      jest.spyOn(defaultEmiter, 'emit')

      const buttonDialogData: ButtonDialogDynamicDialogConfig = {
        emitter: emitter,
      }
      const dialogConfig: DynamicDialogConfig = {
        data: buttonDialogData,
      }
      TestBed.overrideProvider(DynamicDialogConfig, { useValue: dialogConfig })

      await TestBed.compileComponents()
      fixture = TestBed.createComponent(ButtonDialogComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      component.loadComponent()
      fixture.detectChanges()
      loader = TestbedHarnessEnvironment.loader(fixture)

      //expect default emitted value to be label
      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await button.click()

      expect(emitter.emit).toHaveBeenCalledWith(component.defaultDialogData.config.primaryButtonDetails?.label)
      expect(defaultEmiter.emit).toHaveBeenCalledTimes(0)
    })

    it('should use closeDialog property to determine if button-dialog should be closed', async () => {
      const buttonDialogData: ButtonDialogDynamicDialogConfig = {
        component: DefaultButtonDialogHostComponent,
        config: {
          primaryButtonDetails: {
            label: 'CustomMain',
            icon: 'mainLabel',
            closeDialog: true,
            valueToEmit: 'myCustomValueWithCustomType',
          },
          secondaryButtonEnabled: true,
          secondaryButtonDetails: {
            label: 'CustomSide',
            icon: 'sideLabel',
            closeDialog: false,
            valueToEmit: 1,
          },
        },
      }
      const dialogConfig: DynamicDialogConfig = {
        data: buttonDialogData,
      }
      TestBed.overrideProvider(DynamicDialogConfig, { useValue: dialogConfig })
      await TestBed.compileComponents()
      fixture = TestBed.createComponent(ButtonDialogComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      component.loadComponent()
      fixture.detectChanges()
      loader = TestbedHarnessEnvironment.loader(fixture)

      jest.spyOn(component.dynamicDialogRef, 'close')

      const mainButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await mainButton.click()

      expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(1)

      jest.resetAllMocks()

      const sideButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogSecondaryButton' }))
      await sideButton.click()

      expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(0)
    })
  })

  describe('inline usage', () => {
    @Component({
      template: `<ocx-button-dialog>
        <div id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestBaseHostComponent {}

    let fixtureWithHost

    it('should use ng-content', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestBaseHostComponent)
      fixtureWithHost.detectChanges()

      const nativeElement: HTMLElement = fixtureWithHost.debugElement.nativeElement
      expect(nativeElement.querySelector('#host')?.textContent).toBe('HostComponentContent')
    })

    let config: ButtonDialogConfig = {
      primaryButtonDetails: {
        label: 'inlineMain',
        icon: 'pi pi-plus',
        valueToEmit: 'inlineMainEmit',
      },
      secondaryButtonEnabled: true,
      secondaryButtonDetails: {
        label: 'inlineSide',
        icon: 'pi pi-times',
        valueToEmit: 'inlineSideEmit',
      },
    }

    @Component({
      template: ` <ocx-button-dialog [config]="this.buttonDialogConfig">
        <div id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestHostComponentWithConfig {
      @Input() buttonDialogConfig: ButtonDialogConfig = config
    }

    it('should use passed config', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestHostComponentWithConfig)
      fixtureWithHost.detectChanges()

      const buttonDialog = fixtureWithHost.debugElement.query(By.css('ocx-button-dialog'))
      expect(buttonDialog).toBeTruthy()
      expect(buttonDialog.properties['config']).toBe(config)
    })

    @Component({
      template: ` <ocx-button-dialog (resultEmitter)="handleResult($event)">
        <div id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestHostComponentWithResultSub {
      @Input() buttonDialogConfig: ButtonDialogConfig = config
      public handleResult(result: any): void {
        console.log(result)
      }
    }

    it('should use default emitter inline', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestHostComponentWithResultSub)
      fixtureWithHost.detectChanges()

      jest.spyOn(console, 'log')

      const buttonDialog = fixtureWithHost.debugElement.query(By.css('ocx-button-dialog'))
      expect(buttonDialog).toBeTruthy()
      buttonDialog.triggerEventHandler('resultEmitter', true)
      expect(console.log).toHaveBeenCalledWith(true)
    })
  })
})
