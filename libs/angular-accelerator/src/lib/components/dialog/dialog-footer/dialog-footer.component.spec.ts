import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PrimeIcons } from 'primeng/api'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { DialogFooterHarness, provideTranslateTestingService, TestbedHarnessEnvironment } from '../../../../../testing'
import { AngularAcceleratorModule } from '../../../angular-accelerator.module'
import {
  defaultDialogData,
  defaultPrimaryButtonDetails,
  defaultSecondaryButtonDetails,
  DialogFooterComponent,
} from './dialog-footer.component'

describe('DialogFooterComponent', () => {
  let component: DialogFooterComponent
  let fixture: ComponentFixture<DialogFooterComponent>
  let dialogFooterHarness: DialogFooterHarness

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogFooterComponent],
      imports: [AngularAcceleratorModule],
      providers: [
        DynamicDialogConfig,
        DynamicDialogRef,
        provideTranslateTestingService({
          en: translations,
        }),
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(DialogFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    dialogFooterHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DialogFooterHarness)
  })

  it('should create dialog-footer component', () => {
    expect(component).toBeTruthy()
  })

  it('should create default dialog-footer without passing config', async () => {
    // expect correct default initialization
    expect(component.dialogData().component).toEqual(undefined)
    expect(component.dialogData().componentData).toEqual({})
    expect(component.dialogData().config.primaryButtonDetails).toEqual(defaultPrimaryButtonDetails)
    expect(component.dialogData().config.secondaryButtonIncluded).toEqual(true)
    expect(component.dialogData().config.secondaryButtonDetails).toEqual(defaultSecondaryButtonDetails)

    // expect default emitted value to be label
    jest.spyOn(component.buttonClickedEmitter, 'emit')
    await dialogFooterHarness.clickPrimaryButton()

    expect(component.buttonClickedEmitter.emit).toHaveBeenCalledWith({
      button: 'primary',
      result: undefined,
      id: undefined,
    })

    jest.resetAllMocks()

    await dialogFooterHarness.clickSecondaryButton()

    expect(component.buttonClickedEmitter.emit).toHaveBeenCalledWith({
      button: 'secondary',
      result: undefined,
      id: undefined,
    })

    // expect default label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
    // expect no icon
    expect(await dialogFooterHarness.getPrimaryButtonIcon()).toBe(null)
    expect(await dialogFooterHarness.getSecondaryButtonIcon()).toBe(null)
  })

  it('should create customized button-dialog with passing config', async () => {
    component.dialogData.set({
      config: {
        primaryButtonDetails: {
          key: 'CustomMain',
          icon: PrimeIcons.CHECK,
        },
        secondaryButtonIncluded: true,
        secondaryButtonDetails: {
          key: 'CustomSide',
          icon: PrimeIcons.TIMES,
        },
      },
      componentData: {},
    })

    // expect correct label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
    // expect correct icon
    expect(await dialogFooterHarness.getPrimaryButtonIcon()).toBe(PrimeIcons.CHECK)
    expect(await dialogFooterHarness.getSecondaryButtonIcon()).toBe(PrimeIcons.TIMES)
  })

  it('should translate button keys', async () => {
    component.dialogData.set({
      config: {
        primaryButtonDetails: {
          key: 'CUSTOM_PRI',
        },
        secondaryButtonIncluded: true,
        secondaryButtonDetails: {
          key: 'CUSTOM_SEC',
        },
      },
      componentData: {},
    })

    // expect correct label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe(translations['CUSTOM_PRI'])
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe(translations['CUSTOM_SEC'])
  })

  it('should translate button keys with parameters', async () => {
    component.dialogData.set({
      config: {
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
      },
      componentData: {},
    })

    // expect correct label
    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('primary-firstParam')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('secondary-secondParam')
  })

  it('should create Confirm/Cancel button-dialog when sideButton is enabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        secondaryButtonIncluded: true,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
  })

  it('should create Confirm only button-dialog when sideButton is disabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        secondaryButtonIncluded: false,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  it('should create CustmMain/Cancel button-dialog when mainButton is defined', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        primaryButtonDetails: {
          key: 'CustomMain',
        },
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
  })

  it('should create Confirm/CustomSide button-dialog when sideButton is defined', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
  })

  it('should create CustomMain/CustomSide button-dialog when both buttons are defined', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        primaryButtonDetails: {
          key: 'CustomMain',
        },
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
  })

  it('should create CustomMain only button-dialog when sideButton is disabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        primaryButtonDetails: {
          key: 'CustomMain',
        },
        secondaryButtonIncluded: false,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  it('should create CustomMain/Cancel button-dialog when sideButton is enabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        primaryButtonDetails: {
          key: 'CustomMain',
        },
        secondaryButtonIncluded: true,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('Cancel')
  })

  it('should create Confirm only button-dialog when sideButton is defined but is disabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
        secondaryButtonIncluded: false,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  it('should create Confirm/CustomSide button-dialog when sideButton is defined and enabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
        secondaryButtonIncluded: true,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('Confirm')
    expect(await dialogFooterHarness.getSecondaryButtonLabel()).toBe('CustomSide')
  })

  it('should create CustomMain only button-dialog when sideButton is defined but is disabled', async () => {
    component.dialogData.set({
      ...defaultDialogData,
      config: {
        ...defaultDialogData.config,
        primaryButtonDetails: {
          key: 'CustomMain',
        },
        secondaryButtonDetails: {
          key: 'CustomSide',
        },
        secondaryButtonIncluded: false,
      },
    })

    expect(await dialogFooterHarness.getPrimaryButtonLabel()).toBe('CustomMain')
    expect(await dialogFooterHarness.getSecondaryButton()).toBeNull()
  })

  describe('button severity', () => {
    it('should render primary button with configured severity', async () => {
      component.dialogData.set({
        config: {
          primaryButtonDetails: {
            key: 'CustomMain',
            severity: 'danger',
          },
          secondaryButtonIncluded: true,
          secondaryButtonDetails: {
            key: 'CustomSide',
            severity: 'secondary',
          },
          customButtons: [
            {
              id: 'custom1',
              key: 'CustomCustom1',
              alignment: 'right',
              severity: 'success',
            },
            {
              id: 'custom2',
              key: 'CustomCustom2',
              alignment: 'right',
              severity: 'contrast',
            },
          ],
        },
        componentData: {},
      })

      expect(await dialogFooterHarness.getPrimaryButtonSeverity()).toBe('danger')
      expect(await dialogFooterHarness.getSecondaryButtonSeverity()).toBe('secondary')
    })

    it('should render primary, secondary, and custom buttons without severity when omitted', async () => {
      component.dialogData.set({
        config: {
          primaryButtonDetails: {
            key: 'CustomMain',
          },
          secondaryButtonIncluded: true,
          secondaryButtonDetails: {
            key: 'CustomSide',
          },
          customButtons: [
            {
              id: 'custom1',
              key: 'CustomCustom1',
              alignment: 'right',
            },
            {
              id: 'custom2',
              key: 'CustomCustom2',
              alignment: 'right',
            },
          ],
        },
        componentData: {},
      })

      expect(await dialogFooterHarness.getPrimaryButtonSeverity()).toBeUndefined()
      expect(await dialogFooterHarness.getSecondaryButtonSeverity()).toBeUndefined()
    })

    it('should render all PrimeNG severity values correctly on primary button', async () => {
      // Test a representative set of severities to verify the feature works
      // PrimeNG may not remove old severity classes when changing, so we test individually
      const testSeverities: Array<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast'> = [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'help',
        'danger',
        'contrast',
      ]

      for (const severity of testSeverities) {
        // Create a fresh component instance for each severity to avoid PrimeNG class accumulation
        fixture.destroy()
        fixture = TestBed.createComponent(DialogFooterComponent)
        component = fixture.componentInstance
        dialogFooterHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DialogFooterHarness)

        component.dialogData.set({
          config: {
            primaryButtonDetails: {
              key: 'CustomMain',
              severity,
            },
            secondaryButtonIncluded: false,
          },
          componentData: {},
        })

        fixture.detectChanges()
        await fixture.whenStable()

        expect(await dialogFooterHarness.getPrimaryButtonSeverity()).toBe(severity)
      }
    })

    it('should render all PrimeNG severity values correctly on secondary button', async () => {
      const testSeverities: Array<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast'> = [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'help',
        'danger',
        'contrast',
      ]

      for (const severity of testSeverities) {
        fixture.destroy()
        fixture = TestBed.createComponent(DialogFooterComponent)
        component = fixture.componentInstance
        dialogFooterHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, DialogFooterHarness)

        component.dialogData.set({
          config: {
            primaryButtonDetails: {
              key: 'CustomMain',
            },
            secondaryButtonIncluded: true,
            secondaryButtonDetails: {
              key: 'CustomSide',
              severity,
            },
          },
          componentData: {},
        })

        fixture.detectChanges()
        await fixture.whenStable()

        expect(await dialogFooterHarness.getSecondaryButtonSeverity()).toBe(severity)
      }
    })
  })
})
