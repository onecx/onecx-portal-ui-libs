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
import { EventEmitter } from '@angular/core'
import { ButtonDialogContent } from '../../../model/button-dialog-content'

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

    it('should create default button-dialog without passing dialogContent', () => {
      expect(component.dialogData.component).toEqual(DefaultButtonDialogHostComponent)
      expect(component.dialogData.data).toEqual({})
      expect(component.dialogData.mainButtonDetails).toEqual(component.defaultMainButtonDetails)
      expect(component.dialogData.sideButtonEnabled).toEqual(true)
      expect(component.dialogData.sideButtonDetails).toEqual(component.defaultSideButtonDetails)

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('h2')?.textContent).toBe('Title')
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should create customized button-dialog with passing dialogContent', () => {
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
        data: {
          title: 'CustomTitle',
        },
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('h2')?.textContent).toBe('CustomTitle')
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('CustomMain')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('CustomSide')
    })

    it('should create a new EventEmitter by default', async () => {
      jest.spyOn(component.dialogResult, 'emit')

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await button.click()

      expect(component.dialogResult.emit).toHaveBeenCalledTimes(1)
    })

    it('should create Confirm/Cancel button-dialog when sideButton is enabled', () => {
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
        sideButtonEnabled: true,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')?.textContent).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is disabled', () => {
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      const nativeElement: HTMLElement = fixture.debugElement.nativeElement
      expect(nativeElement.querySelector('#buttonDialogMainButton > button')?.textContent).toBe('Confirm')
      expect(nativeElement.querySelector('#buttonDialogSideButton > button')).not.toBeTruthy()
    })

    it('should create CustmMain/Cancel button-dialog when mainButton is defined', () => {
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
        mainButtonDetails: {
          label: 'CustomMain',
          icon: 'mainLabel',
          closeDialog: false,
          valueToEmit: false,
        },
        sideButtonDetails: {
          label: 'CustomSide',
          icon: 'sideLabel',
          closeDialog: false,
          valueToEmit: true,
        },
        sideButtonEnabled: false,
      }

      component.loadComponent()
      fixture.detectChanges()

      expect(component.dialogData.mainButtonDetails.icon).toBe('mainLabel')
      expect(component.dialogData.sideButtonDetails.icon).toBe('sideLabel')
    })

    it('should emit appropriate values', async () => {
      const emitter: EventEmitter<any> = new EventEmitter()
      jest.spyOn(emitter, 'emit')
      const defaultEmiter = component.dialogResult
      jest.spyOn(defaultEmiter, 'emit')

      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
        resultEmitter: emitter,
      }

      component.loadComponent()
      fixture.detectChanges()

      const button = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await button.click()

      expect(emitter.emit).toHaveBeenCalledWith(true)
      expect(defaultEmiter.emit).toHaveBeenCalledTimes(0)
    })

    it('should emit approperiate values', async () => {
      jest.spyOn(component.dialogResult, 'emit')

      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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

      expect(component.dialogResult.emit).toHaveBeenCalledWith('myCustomValueWithCustomType')
    })

    it('should use closeDialog property to determine if button-dialog should be closed', async () => {
      jest.spyOn(component.ref, 'close')

      component.dialogContent = {
        component: DefaultButtonDialogHostComponent,
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
      }

      component.loadComponent()
      fixture.detectChanges()

      const mainButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogMainButton' }))
      await mainButton.click()

      expect(component.ref.close).toHaveBeenCalledTimes(1)

      jest.resetAllMocks()

      const sideButton = await loader.getHarness(PButtonHarness.with({ id: 'buttonDialogSideButton' }))
      await sideButton.click()

      expect(component.ref.close).toHaveBeenCalledTimes(0)
    })
  })

  describe('with dynamicDialog data', () => {
    it('should use DynamicDialogConfig', async () => {
      const buttonDialogContent: ButtonDialogContent = {
        component: DefaultButtonDialogHostComponent,
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
        data: {
          title: 'CustomTitleFromDynamicDialogConfig',
        },
      }
      const dialogConfig: DynamicDialogConfig = {
        data: buttonDialogContent,
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
  })
})
