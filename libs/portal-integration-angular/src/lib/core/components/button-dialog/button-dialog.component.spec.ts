import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ButtonDialogComponent, DefaultButtonDialogHostComponent } from './button-dialog.component'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { MFE_INFO } from '../../../api/injection-tokens'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonDialogHostDirective } from '../../directives/button-dialog-host.directive'
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
      declarations: [ButtonDialogComponent, ButtonDialogHostDirective],
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

    it('should create default button-dialog without passing config', () => {
      expect(component.dialogData.component).toEqual(undefined)
      expect(component.dialogData.componentData).toEqual(undefined)
      expect(component.dialogData.config.mainButtonDetails).toEqual(component.defaultMainButtonDetails)
      expect(component.dialogData.config.sideButtonEnabled).toEqual(true)
      expect(component.dialogData.config.sideButtonDetails).toEqual(component.defaultSideButtonDetails)

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should create customized button-dialog with passing config', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonEnabled: true,
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
          closeDialog: false,
          valueToEmit: true,
        },
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create a new EventEmitter by default', async () => {
      jest.spyOn(component.resultEmitter, 'emit')

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await button.click()

      expect(component.resultEmitter.emit).toHaveBeenCalledTimes(1)
    })

    it('should create Confirm/Cancel button-dialog when sideButton is enabled', () => {
      component.config = {
        sideButtonEnabled: true,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is disabled', () => {
      component.config = {
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')).not.toBeTruthy()
    })

    it('should create CustmMain/Cancel button-dialog when mainButton is defined', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
          closeDialog: false,
          valueToEmit: false,
        },
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined', () => {
      component.config = {
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
          closeDialog: false,
          valueToEmit: true,
        },
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain/CustomSide button-dialog when both buttons are defined', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
          closeDialog: false,
          valueToEmit: true,
        },
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is disabled', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')).not.toBeTruthy()
    })

    it('should create CustomMain/Cancel button-dialog when sideButton is enabled', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonEnabled: true,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is defined but is disabled', () => {
      component.config = {
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
          closeDialog: false,
          valueToEmit: true,
        },
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')).not.toBeTruthy()
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined and enabled', () => {
      component.config = {
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
          closeDialog: false,
          valueToEmit: true,
        },
        sideButtonEnabled: true,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is defined but is disabled', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'pi pi-check',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'pi pi-times',
          closeDialog: false,
          valueToEmit: true,
        },
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).not.toBeTruthy()
    })

    it('should assign icons to buttons', () => {
      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'mainIcon',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'sideIcon',
          closeDialog: false,
          valueToEmit: true,
        },
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      expect(component.dialogData.config.mainButtonDetails!.icon).toBe('mainIcon')
      expect(component.dialogData.config.sideButtonDetails!.icon).toBe('sideIcon')
    })

    it('should emit approperiate values', async () => {
      jest.spyOn(component.resultEmitter, 'emit')

      component.config = {
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'mainLabel',
          closeDialog: false,
          valueToEmit: 'myCustomValueWithCustomType',
        },
      }

      component.loadComponent()
      fixture.detectChanges()

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await button.click()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith('myCustomValueWithCustomType')
    })
  })

  describe('with dynamicDialog data', () => {
    it('should use DynamicDialogConfig', async () => {
      const buttonDialogData: ButtonDialogDynamicDialogConfig = {
        component: DefaultButtonDialogHostComponent,
        config: {
          mainButtonDetails: {
            label: 'CustomMainFromDynamicDialogConfig',
            icon: 'pi pi-check',
            closeDialog: false,
            valueToEmit: false,
          },
          sideButtonEnabled: true,
          sideButtonDetails: {
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

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('h2')?.textContent).toBe('CustomTitleFromDynamicDialogConfig')
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe(
        'CustomMainFromDynamicDialogConfig'
      )
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe(
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

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('h2')?.textContent).toBe('Title')
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should emit appropriate values while passing emitter via dynamicDialogConfig', async () => {
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

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await button.click()

      expect(emitter.emit).toHaveBeenCalledWith(true)
      expect(defaultEmiter.emit).toHaveBeenCalledTimes(0)
    })

    it('should use closeDialog property to determine if button-dialog should be closed', async () => {
      const buttonDialogData: ButtonDialogDynamicDialogConfig = {
        component: DefaultButtonDialogHostComponent,
        config: {
          mainButtonDetails: {
            label: 'CustomMain',
            icon: 'mainLabel',
            closeDialog: true,
            valueToEmit: 'myCustomValueWithCustomType',
          },
          sideButtonEnabled: true,
          sideButtonDetails: {
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

      const mainButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await mainButton.click()

      expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(1)

      jest.resetAllMocks()

      const sideButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogSideButton' }))
      await sideButton.click()

      expect(component.dynamicDialogRef.close).toHaveBeenCalledTimes(0)
    })
  })

  describe('inline usage', () => {
    @Component({
      template: `<ocx-button-dialog>
        <div ocxButtonDialogHost id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestBaseHostComponent {}

    let fixtureWithHost
    let componentWithHost

    it('should use ng-content', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestBaseHostComponent)
      fixtureWithHost.detectChanges()

      const nativeElement: HTMLElement = fixtureWithHost.debugElement.nativeElement
      expect(nativeElement.querySelector('#host')?.textContent).toBe('HostComponentContent')
    })

    let config: ButtonDialogConfig = {
      mainButtonDetails: {
        label: 'inlineMain',
        icon: 'pi pi-plus',
        valueToEmit: 'inlineMainEmit',
      },
      sideButtonEnabled: true,
      sideButtonDetails: {
        label: 'inlineSide',
        icon: 'pi pi-times',
        valueToEmit: 'inlineSideEmit',
      },
    }

    @Component({
      template: ` <ocx-button-dialog [config]="this.buttonDialogConfig">
        <div ocxButtonDialogHost id="host">HostComponentContent</div>
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
        <div ocxButtonDialogHost id="host">HostComponentContent</div>
      </ocx-button-dialog>`,
    })
    class TestHostComponentWithResultSub {
      @Input() buttonDialogConfig: ButtonDialogConfig = config
      public handleResult(result: any): void {
        console.log(result)
      }
    }

    it('should use passed config', async () => {
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
