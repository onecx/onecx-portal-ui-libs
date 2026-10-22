import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { ButtonModule } from '@openng/optimus-ui/button'
import { GlobalErrorComponent } from './global-error.component'
import de from '../../../../assets/i18n/de.json'
import en from '../../../../assets/i18n/en.json'

describe('GlobalErrorComponent', () => {
  let fixture: ComponentFixture<GlobalErrorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalErrorComponent],
      imports: [ButtonModule, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigateByUrl: jest.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      ],
    }).compileComponents()

    const translate = TestBed.inject(TranslateService)
    translate.setTranslation('de', de)
    translate.setTranslation('en', en)
  })

  function render(lang: string) {
    TestBed.inject(TranslateService).use(lang)
    fixture = TestBed.createComponent(GlobalErrorComponent)
    fixture.detectChanges()
    return fixture.nativeElement as HTMLElement
  }

  it('should render a translated h1 and button in German without hard-coded English', () => {
    const el = render('de')
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Fehler')
    expect(el.querySelector('button')?.textContent?.trim()).toBe('Erneut versuchen')
    expect(el.querySelector('h1')?.textContent).not.toMatch(/error/i)
    expect(el.textContent).not.toContain('Try Again')
    expect(el.querySelectorAll('h1').length).toBe(1)
  })

  it('should render English texts', () => {
    const el = render('en')
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Error')
    expect(el.querySelector('button')?.textContent?.trim()).toBe('Try again')
  })
})
