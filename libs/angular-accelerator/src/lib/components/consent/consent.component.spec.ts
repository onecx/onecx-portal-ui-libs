import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslationObject, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { OcxConsentHarness } from '../../../../testing/consent.harness'
import { ConsentComponent } from './consent.component'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'
import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of({
      OCX_CONSENT: {
        TITLE: 'Default title',
        MESSAGE: 'Default message: {{url}}',
        AGREE: 'Default agree',
        WITHDRAW: 'Default withdraw',
      },
      CUSTOM: {
        TITLE: 'Custom title',
        MESSAGE: 'Custom message: {{url}}',
        AGREE: 'Custom agree',
        WITHDRAW: 'Custom withdraw',
      },
    } as TranslationObject)
  }
}

@Component({
  standalone: false,
  template: `
    <ocx-consent
      [url]="url()"
      [purpose]="purpose()"
      [titleKey]="titleKey()"
      [messageKey]="messageKey()"
      [agreeKey]="agreeKey()"
      [withdrawKey]="withdrawKey()"
      [showWithdraw]="showWithdraw()"
      (consentChanged)="onConsentChanged($event)"
    >
      <p class="projected">Projected body</p>
      @if (showInfo()) {
        <a ocx-consent-info href="/privacy">Privacy</a>
      }
    </ocx-consent>
  `,
})
class HostComponent {
  url = signal('https://example.com')
  lastConsent = signal<unknown>(undefined)

  purpose = signal<string | undefined>(undefined)
  showWithdraw = signal<boolean>(false)
  showInfo = signal<boolean>(false)

  titleKey = signal<string | undefined>(undefined)
  messageKey = signal<string | undefined>(undefined)
  agreeKey = signal<string | undefined>(undefined)
  withdrawKey = signal<string | undefined>(undefined)

  onConsentChanged(event: unknown): void {
    this.lastConsent.set(event)
  }
}

describe('OcxConsentComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let harness: OcxConsentHarness

  beforeEach(async () => {
    localStorage.clear()

    await TestBed.configureTestingModule({
      declarations: [HostComponent, ConsentComponent],
      imports: [
        ButtonModule,
        RippleModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
          fallbackLang: 'en',
        }),
      ],
    }).compileComponents()

    const translate = TestBed.inject(TranslateService)
    translate.setDefaultLang('en')
    translate.use('en')

    fixture = TestBed.createComponent(HostComponent)
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxConsentHarness)
  })

  it('should show message when consent is missing', async () => {
    fixture.detectChanges()

    expect(await harness.isContentVisible('.projected')).toBe(false)
    expect(await harness.isConsentMessageVisible()).toBe(true)
  })

  it('should show projected content when consent exists for normalized URL', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://EXAMPLE.com/']))

    fixture = TestBed.createComponent(HostComponent)
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxConsentHarness)

    fixture.detectChanges()

    expect(await harness.isContentVisible('.projected')).toBe(true)
    expect(await harness.isConsentMessageVisible()).toBe(false)
  })

  it('should write consent to localStorage and emit on agreement', async () => {
    fixture.detectChanges()

    await harness.clickAgree()

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as unknown
    expect(Array.isArray(stored)).toBe(true)
    expect(stored).toContain('https://example.com')

    expect(fixture.componentInstance.lastConsent()).toEqual({ url: 'https://example.com', hasConsent: true })
  })

  it('should not duplicate consent entries for equivalent URLs', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://example.com/']))

    fixture = TestBed.createComponent(HostComponent)
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxConsentHarness)

    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(false)
    expect(await harness.isContentVisible('.projected')).toBe(true)

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as string[]
    expect(stored).toEqual(['https://example.com/'])
  })

  it('should handle invalid stored consent json gracefully', async () => {
    localStorage.setItem('onecx-consent', 'not-json')

    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
    expect(await harness.isContentVisible('.projected')).toBe(false)
  })

  it('should treat missing localStorage key as no consent', async () => {
    localStorage.removeItem('onecx-consent')

    fixture.detectChanges()

    ;(fixture.debugElement.children[0].componentInstance as ConsentComponent)['readConsents']()

    expect(await harness.isConsentMessageVisible()).toBe(true)
    expect(await harness.isContentVisible('.projected')).toBe(false)
  })

  it('should not write consent when url is empty after trimming', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify([]))

    fixture.componentInstance.url.set('   ')
    fixture.detectChanges()

    await harness.clickAgree()

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as string[]
    expect(stored).toEqual([])
    expect(fixture.componentInstance.lastConsent()).toBeUndefined()
  })

  it('should treat non-string consent entries as missing consent', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify([123]))

    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
    expect(await harness.isContentVisible('.projected')).toBe(false)
  })

  it('should normalize non-url strings by trimming and removing trailing slash', async () => {
    fixture.componentInstance.url.set('not a url/')
    fixture.detectChanges()

    await harness.clickAgree()

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as string[]
    expect(stored).toEqual(['not a url'])
    expect(fixture.componentInstance.lastConsent()).toEqual({ url: 'not a url', hasConsent: true })
  })

  it('should normalize url strings by stripping trailing slash', async () => {
    fixture.componentInstance.url.set('https://example.com/')
    fixture.detectChanges()

    await harness.clickAgree()

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as string[]
    expect(stored).toEqual(['https://example.com'])
    expect(fixture.componentInstance.lastConsent()).toEqual({ url: 'https://example.com', hasConsent: true })
  })

  it('should allow overriding translation keys via inputs', async () => {
    fixture.componentInstance.titleKey.set('CUSTOM.TITLE')
    fixture.componentInstance.messageKey.set('CUSTOM.MESSAGE')
    fixture.componentInstance.agreeKey.set('CUSTOM.AGREE')
    fixture.componentInstance.withdrawKey.set('CUSTOM.WITHDRAW')
    fixture.componentInstance.showWithdraw.set(true)

    fixture.detectChanges()

    const element: HTMLElement = fixture.nativeElement as HTMLElement
    expect(element.textContent).toContain('Custom title')
    expect(element.textContent).toContain('Custom message: https://example.com')
    expect(element.textContent).toContain('Custom agree')
  })

  it('should remove consent and emit when withdrawing is used', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://example.com']))

    fixture = TestBed.createComponent(HostComponent)
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxConsentHarness)

    fixture.componentInstance.showWithdraw.set(true)
    fixture.detectChanges()

    await harness.clickWithdraw()

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as string[]
    expect(stored).toEqual([])
    expect(fixture.componentInstance.lastConsent()).toEqual({ url: 'https://example.com', hasConsent: false, purpose: undefined })
  })

  it('should scope consent to purpose when purpose is provided', async () => {
    fixture.componentInstance.purpose.set('maps')
    fixture.detectChanges()

    await harness.clickAgree()

    const stored = JSON.parse(localStorage.getItem('onecx-consent') ?? '[]') as string[]
    expect(stored).toEqual(['https://example.com::maps'])
    expect(fixture.componentInstance.lastConsent()).toEqual({ url: 'https://example.com', hasConsent: true, purpose: 'maps' })
  })

  it('should keep unrelated consent entries when withdrawing without purpose', async () => {
    localStorage.setItem(
      'onecx-consent',
      JSON.stringify(['https://example.com/legal', 'https://example.com/other'])
    )

    fixture = TestBed.createComponent(HostComponent)
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, OcxConsentHarness)

    fixture.componentInstance.url.set('https://example.com/legal')
    fixture.componentInstance.purpose.set(undefined)
    fixture.componentInstance.showWithdraw.set(true)
    fixture.detectChanges()

    await harness.clickWithdraw()

    expect(JSON.parse(localStorage.getItem('onecx-consent') ?? '[]')).toEqual(['https://example.com/other'])
  })

  it('should keep stored consent for same url when purpose differs', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://example.com/legal::maps']))

    fixture.componentInstance.url.set('https://example.com/legal/')
    fixture.componentInstance.purpose.set('analytics')
    fixture.componentInstance.showWithdraw.set(true)
    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
    expect(await harness.isWithdrawVisible()).toBe(false)
    expect(JSON.parse(localStorage.getItem('onecx-consent') ?? '[]')).toEqual(['https://example.com/legal::maps'])
    expect(fixture.componentInstance.lastConsent()).toBeUndefined()
  })

  it('should not withdraw consent when normalized url is empty', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://example.com/legal']))

    fixture.componentInstance.url.set('   ')
    fixture.componentInstance.purpose.set(undefined)
    fixture.componentInstance.showWithdraw.set(true)
    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
    expect(await harness.isWithdrawVisible()).toBe(false)
    expect(JSON.parse(localStorage.getItem('onecx-consent') ?? '[]')).toEqual(['https://example.com/legal'])
  })

  it('should show info slot when projected', async () => {
    fixture.componentInstance.showInfo.set(true)
    fixture.detectChanges()

    expect(await harness.isInfoVisible()).toBe(true)
  })

  it('should treat consent as missing when purpose is required but stored entry has no purpose', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://example.com']))

    fixture.componentInstance.url.set('https://example.com')
    fixture.componentInstance.purpose.set('maps')
    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
  })

  it('should ignore stored entry when url normalization does not match (case, hash, query)', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://EXAMPLE.com/path?x=1#frag']))

    fixture.componentInstance.url.set('https://example.com/other')
    fixture.componentInstance.purpose.set(undefined)
    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
  })

  it('should not treat stored purpose with multiple separators as match when purpose differs', async () => {
    localStorage.setItem('onecx-consent', JSON.stringify(['https://example.com/legal::maps::osm']))

    fixture.componentInstance.url.set('https://example.com/legal')
    fixture.componentInstance.purpose.set('maps')
    fixture.detectChanges()

    expect(await harness.isConsentMessageVisible()).toBe(true)
  })
})
