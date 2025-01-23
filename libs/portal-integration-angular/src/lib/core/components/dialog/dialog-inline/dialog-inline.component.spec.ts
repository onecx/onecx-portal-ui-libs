import { Component, Input } from '@angular/core'
import { ButtonDialogConfig } from '../../../../model/button-dialog'
import { PrimeIcons } from 'primeng/api'
import { DialogInlineComponent } from './dialog-inline.component'
import { TestBed } from '@angular/core/testing'
import {
  DialogContentHarness,
  DialogFooterHarness,
  DivHarness,
  TestbedHarnessEnvironment,
} from '@onecx/portal-integration-angular/testing'
import { DialogFooterComponent } from '../dialog-footer/dialog-footer.component'
import { DialogContentComponent } from '../dialog-content/dialog-content.component'
import { ButtonModule } from 'primeng/button'
import { MockAuthModule } from '../../../../mock-auth/mock-auth.module'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
  template: `<ocx-dialog-inline>
    <div class="host">HostComponentContent</div>
  </ocx-dialog-inline>`,
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
  template: ` <ocx-dialog-inline [config]="this.buttonDialogConfig">
    <div class="host">HostComponentContent</div>
  </ocx-dialog-inline>`,
})
class TestHostWithConfigComponent {
  @Input() buttonDialogConfig: ButtonDialogConfig = config
}

@Component({
  template: ` <ocx-dialog-inline (resultEmitter)="handleResult($event)">
    <div class="host">HostComponentContent</div>
  </ocx-dialog-inline>`,
})
class TestHostWithResultSubComponent {
  @Input() buttonDialogConfig: ButtonDialogConfig = config
  public handleResult(result: any): void {
    console.log(result)
  }
}

describe('DialogInlineComponent', () => {
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

  let fixtureWithHost
  let harnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DialogInlineComponent,
        DialogFooterComponent,
        DialogContentComponent,
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
    const contentHarness = await harnessLoader.getHarness(DialogContentHarness)

    const contentDiv = await contentHarness.getHarness(DivHarness.with({ class: 'host' }))
    expect(contentDiv).toBeDefined()
    expect(await contentDiv.getText()).toBe('HostComponentContent')
  })

  it('should use passed config', async () => {
    fixtureWithHost = TestBed.createComponent(TestHostWithConfigComponent)
    fixtureWithHost.detectChanges()
    harnessLoader = await TestbedHarnessEnvironment.loader(fixtureWithHost)
    const footerHarness = await harnessLoader.getHarness(DialogFooterHarness)

    expect(await footerHarness.getPrimaryButtonLabel()).toBe('inlineMain')
    expect(await footerHarness.getPrimaryButtonIcon()).toBe(PrimeIcons.PLUS)
    expect(await footerHarness.getSecondaryButtonLabel()).toBe('inlineSide')
    expect(await footerHarness.getSecondaryButtonIcon()).toBe(PrimeIcons.TIMES)
  })

  it('should use default emitter inline', async () => {
    await TestBed.compileComponents()
    fixtureWithHost = TestBed.createComponent(TestHostWithResultSubComponent)
    fixtureWithHost.detectChanges()
    const footerHarness = await TestbedHarnessEnvironment.harnessForFixture(fixtureWithHost, DialogFooterHarness)

    jest.spyOn(console, 'log')

    await footerHarness.clickPrimaryButton()
    expect(console.log).toHaveBeenCalledWith('primary')

    jest.resetAllMocks()

    await footerHarness.clickSecondaryButton()
    expect(console.log).toHaveBeenCalledWith('secondary')
  })
})
