import { Component, Input } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ButtonModule } from 'primeng/button'

import { ButtonDialogComponent } from './button-dialog.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { ButtonDialogHarness, DivHarness } from '../../../../../testing'
import { ButtonDialogConfig } from '../../../model/button-dialog'
import { PrimeIcons } from 'primeng/api'

@Component({
  template: `<ocx-button-dialog>
    <div class="host">HostComponentContent</div>
  </ocx-button-dialog>`,
})
class TestBaseHostComponent {}

const config: ButtonDialogConfig = {
  primaryButtonDetails: {
    key: 'inlineMain',
    icon: PrimeIcons.PLUS,
  },
  secondaryButtonIncluded: true,
  secondaryButtonDetails: {
    key: 'inlineSide',
    icon: PrimeIcons.TIMES,
  },
}

@Component({
  template: ` <ocx-button-dialog [config]="this.buttonDialogConfig">
    <div class="host">HostComponentContent</div>
  </ocx-button-dialog>`,
})
class TestHostWithConfigComponent {
  @Input() buttonDialogConfig: ButtonDialogConfig = config
}

@Component({
  template: ` <ocx-button-dialog (resultEmitter)="handleResult($event)">
    <div class="host">HostComponentContent</div>
  </ocx-button-dialog>`,
})
class TestHostWithResultSubComponent {
  @Input() buttonDialogConfig: ButtonDialogConfig = config
  public handleResult(result: any): void {
    console.log(result)
  }
}

describe('ButtonDialogComponent', () => {
  let component: ButtonDialogComponent
  let fixture: ComponentFixture<ButtonDialogComponent>
  let buttonDialogHarness: ButtonDialogHarness

  const translations: any = {
    CUSTOM_PRI: 'primaryTranslation',
    CUSTOM_SEC: 'secondaryTranslation',
    CUSTOM_PRI_PARAM: 'primary-{{val}}',
    CUSTOM_SEC_PARAM: 'secondary-{{val}}',
    OCX_BUTTON_DIALOG: {
      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
    },
  }

  describe('basic usage', () => {
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
        providers: [DynamicDialogConfig, DynamicDialogRef],
      }).compileComponents()
      fixture = TestBed.createComponent(ButtonDialogComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      buttonDialogHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ButtonDialogHarness)
    })

    it('should create button-dialog component', () => {
      expect(component).toBeTruthy()
    })

    it('should create default button-dialog without passing config', async () => {
      // expect correct default initialization
      expect(component.dialogData.component).toEqual(undefined)
      expect(component.dialogData.componentData).toEqual(undefined)
      expect(component.dialogData.config.primaryButtonDetails).toEqual(component.defaultPrimaryButtonDetails)
      expect(component.dialogData.config.secondaryButtonIncluded).toEqual(true)
      expect(component.dialogData.config.secondaryButtonDetails).toEqual(component.defaultSecondaryButtonDetails)

      // expect default emitted value to be label
      jest.spyOn(component.resultEmitter, 'emit')
      await buttonDialogHarness.clickPrimaryButton()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith('primary')

      jest.resetAllMocks()

      await buttonDialogHarness.clickSecondaryButton()

      expect(component.resultEmitter.emit).toHaveBeenCalledWith('secondary')

      // expect default label
      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('Confirm')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('Cancel')
      // expect no icon
      expect(await buttonDialogHarness.getPrimaryButtonIcon()).toBe('')
      expect(await buttonDialogHarness.getSecondaryButtonIcon()).toBe('')
    })

    it('should create customized button-dialog with passing config', async () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          key: 'CustomMain',
          icon: 'pi pi-check',
        },
        secondaryButtonIncluded: true,
        secondaryButtonDetails: {
          key: 'CustomSide',
          icon: 'pi pi-times',
        },
      }

      // expect correct label
      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('CustomMain')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('CustomSide')
      // expect correct icon
      expect(await buttonDialogHarness.getPrimaryButtonIcon()).toBe('pi pi-check')
      expect(await buttonDialogHarness.getSecondaryButtonIcon()).toBe('pi pi-times')
    })

    it('should translate button keys', async () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          key: 'CUSTOM_PRI',
        },
        secondaryButtonIncluded: true,
        secondaryButtonDetails: {
          key: 'CUSTOM_SEC',
        },
      }

      // expect correct label
      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe(translations['CUSTOM_PRI'])
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe(translations['CUSTOM_SEC'])
    })

    it('should translate button keys with parameters', async () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          key: 'CUSTOM_PRI_PARAM',
          parameters: {
            val: 'firstParam',
          },
        },
        secondaryButtonIncluded: true,
        secondaryButtonDetails: {
          key: 'CUSTOM_SEC_PARAM',
          parameters: {
            val: 'secondParam',
          },
        },
      }

      // expect correct label
      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('primary-firstParam')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('secondary-secondParam')
    })

    it('should create Confirm/Cancel button-dialog when sideButton is enabled', async () => {
      component.dialogData.config.secondaryButtonIncluded = true

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('Confirm')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is disabled', async () => {
      component.dialogData.config.secondaryButtonIncluded = false

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('Confirm')
      expect(await buttonDialogHarness.getSecondaryButton()).toBeNull()
    })

    it('should create CustmMain/Cancel button-dialog when mainButton is defined', async () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('CustomMain')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('Cancel')
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined', async () => {
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('Confirm')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('CustomSide')
    })

    it('should create CustomMain/CustomSide button-dialog when both buttons are defined', async () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('CustomMain')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is disabled', async () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonIncluded = false

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('CustomMain')
      expect(await buttonDialogHarness.getSecondaryButton()).toBeNull()
    })

    it('should create CustomMain/Cancel button-dialog when sideButton is enabled', async () => {
      component.dialogData.config.primaryButtonDetails = {
        key: 'CustomMain',
      }
      component.dialogData.config.secondaryButtonIncluded = true

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('CustomMain')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('Cancel')
    })

    it('should create Confirm only button-dialog when sideButton is defined but is disabled', async () => {
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }
      component.dialogData.config.secondaryButtonIncluded = false

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('Confirm')
      expect(await buttonDialogHarness.getSecondaryButton()).toBeNull()
    })

    it('should create Confirm/CustomSide button-dialog when sideButton is defined and enabled', async () => {
      component.dialogData.config.secondaryButtonDetails = {
        key: 'CustomSide',
      }
      component.dialogData.config.secondaryButtonIncluded = true

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('Confirm')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('CustomSide')
    })

    it('should create CustomMain only button-dialog when sideButton is defined but is disabled', async () => {
      component.dialogData.config = {
        primaryButtonDetails: {
          key: 'CustomMain',
        },
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
        secondaryButtonIncluded: false,
      }

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('CustomMain')
      expect(await buttonDialogHarness.getSecondaryButton()).toBeNull()
    })
  })

  describe('inline usage', () => {
    let fixtureWithHost
    let harnessLoader

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          ButtonDialogComponent,
          TestHostWithConfigComponent,
          TestBaseHostComponent,
          TestHostWithResultSubComponent,
        ],
        imports: [
          ButtonModule,
          MockAuthModule,
          TranslateTestingModule.withTranslations({
            en: translations,
          }),
        ],
        providers: [DynamicDialogConfig, DynamicDialogRef],
      }).compileComponents()
    })

    it('should use ng-content', async () => {
      fixtureWithHost = TestBed.createComponent(TestBaseHostComponent)
      fixtureWithHost.detectChanges()
      harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
      buttonDialogHarness = await harnessLoader.getHarness(ButtonDialogHarness)

      const contentDiv = await buttonDialogHarness.getHarness(DivHarness.with({ class: 'host' }))
      expect(contentDiv).toBeDefined()
      expect(await contentDiv.getText()).toBe('HostComponentContent')
    })

    it('should use passed config', async () => {
      fixtureWithHost = TestBed.createComponent(TestHostWithConfigComponent)
      fixtureWithHost.detectChanges()
      harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
      buttonDialogHarness = await harnessLoader.getHarness(ButtonDialogHarness)

      expect(await buttonDialogHarness.getPrimaryButtonLabel()).toBe('inlineMain')
      expect(await buttonDialogHarness.getPrimaryButtonIcon()).toBe('pi pi-plus')
      expect(await buttonDialogHarness.getSecondaryButtonLabel()).toBe('inlineSide')
      expect(await buttonDialogHarness.getSecondaryButtonIcon()).toBe('pi pi-times')
    })

    it('should use default emitter inline', async () => {
      await TestBed.compileComponents()
      fixtureWithHost = TestBed.createComponent(TestHostWithResultSubComponent)
      fixtureWithHost.detectChanges()
      buttonDialogHarness = await TestbedHarnessEnvironment.harnessForFixture(fixtureWithHost, ButtonDialogHarness)

      jest.spyOn(console, 'log')

      await buttonDialogHarness.clickPrimaryButton()
      expect(console.log).toHaveBeenCalledWith('primary')

      jest.resetAllMocks()

      await buttonDialogHarness.clickSecondaryButton()
      expect(console.log).toHaveBeenCalledWith('secondary')
    })
  })
})
