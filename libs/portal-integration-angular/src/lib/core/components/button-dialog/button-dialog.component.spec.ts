import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ButtonDialogComponent } from './button-dialog.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { MFE_INFO } from '../../../api/injection-tokens'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'
import { HarnessLoader } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { PButtonHarness } from '../../../../../testing'
import { Component, Input } from '@angular/core'
import { ButtonDialogConfig } from '../../../model/button-dialog'
import { By } from '@angular/platform-browser'
import { TranslateTestingModule } from 'ngx-translate-testing'

describe('ButtonDialogComponent', () => {
  let component: ButtonDialogComponent
  let fixture: ComponentFixture<ButtonDialogComponent>
  let loader: HarnessLoader

  const translations: any = { CUSTOM_PRI: 'primaryTranslation', CUSTOM_SEC: 'secondaryTranslation' }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonDialogComponent],
      imports: [
        ButtonModule,
        MockAuthModule,
        TranslateTestingModule.withTranslations({
          en: translations,
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
      jest.spyOn(component.dynamicDialogRef, 'close')
      const primaryButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
      await primaryButton.click()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith('primary')
      expect(component.dynamicDialogRef.close).toHaveBeenCalledWith({
        button: 'primary',
        result: undefined,
      })

      jest.resetAllMocks()

      const secondaryButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogSecondaryButton' }))
      await secondaryButton.click()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith('secondary')
      expect(component.dynamicDialogRef.close).toHaveBeenCalledWith({
        button: 'secondary',
        result: undefined,
      })

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
          key: 'CustomMain',
          icon: 'pi pi-check',
        },
        secondaryButtonEnabled: true,
        secondaryButtonDetails: {
          key: 'CustomSide',
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

    // TODO: Test translated keys with parameters
    it('should translate button keys', () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          key: 'CUSTOM_PRI',
        },
        secondaryButtonEnabled: true,
        secondaryButtonDetails: {
          key: 'CUSTOM_SEC',
        },
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      // expect correct label
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe(
        translations['CUSTOM_PRI']
      )
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe(
        translations['CUSTOM_SEC']
      )
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
        key: 'CustomMain',
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined', () => {
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain/CustomSide button-dialog when both buttons are defined', () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is disabled', () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonEnabled = false

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')).not.toBeTruthy()
    })

    it('should create CustomMain/Cancel button-dialog when sideButton is enabled', () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonEnabled = true

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is defined but is disabled', () => {
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }
      component.dialogData.config.secondaryButtonEnabled = false

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')).not.toBeTruthy()
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined and enabled', () => {
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
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
          key: 'CustomMain',
        },
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
        secondaryButtonEnabled: false,
      }

      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).not.toBeTruthy()
    })
  })

  describe('with dynamicDialog data', () => {
    // TODO - fix
    // it('should use DynamicDialogConfig', async () => {
    //   const buttonDialogData: ButtonDialogData = {
    //     component: DialogHostComponent,
    //     config: {
    //       primaryButtonDetails: {
    //         key: 'CustomMainFromDynamicDialogConfig',
    //         icon: 'pi pi-check',
    //       },
    //       secondaryButtonEnabled: true,
    //       secondaryButtonDetails: {
    //         key: 'CustomSideFromDynamicDialogConfig',
    //         icon: 'pi pi-times',
    //       },
    //     },
    //     componentData: {
    //       title: 'CustomTitleFromDynamicDialogConfig',
    //     },
    //   }
    //   const dialogConfig: DynamicDialogConfig = {
    //     data: buttonDialogData,
    //   }
    //   TestBed.overrideProvider(DynamicDialogConfig, { useValue: dialogConfig })
    //   await TestBed.compileComponents()
    //   fixture = TestBed.createComponent(ButtonDialogComponent)
    //   component = fixture.componentInstance
    //   fixture.detectChanges()
    //   component.loadComponent()
    //   fixture.detectChanges()
    //   // expect correct data from dynamic dialog config
    //   expect(component.dialogData.component).toBe(DialogHostComponent)
    //   expect(component.dialogData.config.primaryButtonDetails).toBe(buttonDialogData.config?.primaryButtonDetails)
    //   expect(component.dialogData.config.secondaryButtonEnabled).toBe(buttonDialogData.config?.secondaryButtonEnabled)
    //   expect(component.dialogData.config.secondaryButtonDetails).toBe(buttonDialogData.config?.secondaryButtonDetails)
    //   expect(component.dialogData.componentData).toBe(buttonDialogData.componentData)
    //   // expect changes in ui with config
    //   const nativeElement: HTMLElement = fixture.debugElement.nativeElement
    //   expect(nativeElement.querySelector('h2')?.textContent).toBe('CustomTitleFromDynamicDialogConfig')
    //   expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe(
    //     'CustomMainFromDynamicDialogConfig'
    //   )
    //   expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe(
    //     'CustomSideFromDynamicDialogConfig'
    //   )
    // })
    // TODO - fix
    // it('should use use default data if dynamicDialogConfig not passed', async () => {
    //   const buttonDialogData: ButtonDialogConfig = {}
    //   const dialogConfig: DynamicDialogConfig = {
    //     data: buttonDialogData,
    //   }
    //   TestBed.overrideProvider(DynamicDialogConfig, { useValue: dialogConfig })
    //   await TestBed.compileComponents()
    //   fixture = TestBed.createComponent(ButtonDialogComponent)
    //   component = fixture.componentInstance
    //   fixture.detectChanges()
    //   component.loadComponent()
    //   fixture.detectChanges()
    //   loader = TestbedHarnessEnvironment.loader(fixture)
    //   jest.spyOn(component.dynamicDialogRef, 'close')
    //   // exepect default data if config not passed
    //   expect(component.dialogData).toBe(component.defaultDialogData)
    //   // expect to close dialog by default
    //   const mainButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogPrimaryButton' }))
    //   await mainButton.click()
    //   expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(1)
    //   jest.resetAllMocks()
    //   const sideButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogSecondaryButton' }))
    //   await sideButton.click()
    //   expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(1)
    //   // expect default label
    //   const nativeElement: HTMLElement = fixture.debugElement.nativeElement
    //   expect(nativeElement.querySelector('h2')?.textContent).toBe('Title')
    //   expect(nativeElement.querySelector('#buttonDialogPrimaryButton > button')?.textContent).toBe('Confirm')
    //   expect(nativeElement.querySelector('#buttonDialogSecondaryButton > button')?.textContent).toBe('Cancel')
    //   // expect no icon
    //   expect(nativeElement.querySelector('#buttonDialogPrimaryButton')?.getAttribute('ng-reflect-icon')).toBe('')
    //   expect(nativeElement.querySelector('#buttonDialogSecondaryButton')?.getAttribute('ng-reflect-icon')).toBe('')
    // })
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

    const config: ButtonDialogConfig = {
      primaryButtonDetails: {
        key: 'inlineMain',
        icon: 'pi pi-plus',
      },
      secondaryButtonEnabled: true,
      secondaryButtonDetails: {
        key: 'inlineSide',
        icon: 'pi pi-times',
      },
    }

    @Component({
      template: ` <ocx-button-dialog [config]="this.buttonDialogConfig">
        <div id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestHostWithConfigComponent {
      @Input() buttonDialogConfig: ButtonDialogConfig = config
    }

    it('should use passed config', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestHostWithConfigComponent)
      fixtureWithHost.detectChanges()

      const buttonDialog = fixtureWithHost.debugElement.query(By.css('ocx-button-dialog'))
      expect(buttonDialog).toBeTruthy()
      expect(buttonDialog.properties['config']).toBe(config)
    })

    // TODO: Fix to use button clicks
    @Component({
      template: ` <ocx-button-dialog (resultEmitter)="handleResult($event)">
        <div id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestHostWithResultSubComponent {
      @Input() buttonDialogConfig: ButtonDialogConfig = config
      public handleResult(result: any): void {
        console.log(result)
      }
    }

    it('should use default emitter inline', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestHostWithResultSubComponent)
      fixtureWithHost.detectChanges()

      jest.spyOn(console, 'log')

      const buttonDialog = fixtureWithHost.debugElement.query(By.css('ocx-button-dialog'))
      expect(buttonDialog).toBeTruthy()
      buttonDialog.triggerEventHandler('resultEmitter', true)
      expect(console.log).toHaveBeenCalledWith(true)
    })
  })
})
