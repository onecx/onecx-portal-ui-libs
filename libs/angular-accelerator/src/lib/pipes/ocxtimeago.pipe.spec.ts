import { Component, ChangeDetectionStrategy } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateLoader, TranslateModule, TranslateService, TranslationObject } from '@ngx-translate/core'
import { of } from 'rxjs'
import type { Observable } from 'rxjs'
import { OcxTimeAgoPipe } from './ocxtimeago.pipe'

class FakeTimeAgoTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of({
      OCX_TIMEAGO: {
        A_FEW_SECONDS_AGO: 'a few seconds ago',
        A_MINUTE_AGO: 'a minute ago',
        MINUTES_AGO: '{{minutes}} minutes ago',
        AN_HOUR_AGO: 'an hour ago',
        HOURS_AGO: '{{hours}} hours ago',
        A_DAY_AGO: 'a day ago',
        DAYS_AGO: '{{days}} days ago',
        A_MONTH_AGO: 'a month ago',
        MONTHS_AGO: '{{months}} months ago',
        A_YEAR_AGO: 'a year ago',
        YEARS_AGO: '{{years}} years ago',
      },
    } as TranslationObject)
  }
}

// `date` is typed `any` to mirror the production call sites, which pass the (any-typed)
// field value straight through the pipe, and to allow an invalid Date.
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<span class="timeago">{{ date | timeago }}</span>`,
})
class HostForTimeAgoPipeComponent {
  date: any = new Date('invalid')
}

async function createFixture(): Promise<ComponentFixture<HostForTimeAgoPipeComponent>> {
  await TestBed.configureTestingModule({
    declarations: [HostForTimeAgoPipeComponent, OcxTimeAgoPipe],
    imports: [
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: FakeTimeAgoTranslateLoader },
        fallbackLang: 'en',
      }),
    ],
  }).compileComponents()

  TestBed.inject(TranslateService).use('en')
  return TestBed.createComponent(HostForTimeAgoPipeComponent)
}

function renderTimeAgo(fixture: ComponentFixture<HostForTimeAgoPipeComponent>, date: Date | null): string {
  fixture.componentInstance.date = date
  fixture.detectChanges()
  return (fixture.nativeElement as HTMLElement).querySelector('.timeago')?.textContent?.trim() ?? ''
}

describe('OcxTimeAgoPipe', () => {
  let fixture: ComponentFixture<HostForTimeAgoPipeComponent>

  beforeEach(async () => {
    fixture = await createFixture()
  })

  it('given an invalid date when rendered then the text is empty and has no translation key', () => {
    const text = renderTimeAgo(fixture, new Date('invalid'))

    expect(text).toBe('')
    expect(text).not.toContain('OCX_TIMEAGO')
  })

  it('given a date a few seconds in the past when rendered then a few seconds ago is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 10 * 1000))).toBe('a few seconds ago')
  })

  it('given a date a minute in the past when rendered then a minute ago is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 60 * 1000))).toBe('a minute ago')
  })

  it('given a date thirty minutes in the past when rendered then the minutes ago text is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 30 * 60 * 1000))).toBe('30 minutes ago')
  })

  it('given a date an hour in the past when rendered then an hour ago is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 60 * 60 * 1000))).toBe('an hour ago')
  })

  it('given a date five hours in the past when rendered then the hours ago text is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 5 * 60 * 60 * 1000))).toBe('5 hours ago')
  })

  it('given a date thirty hours in the past when rendered then a day ago is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 30 * 60 * 60 * 1000))).toBe('a day ago')
  })

  it('given a date ten days in the past when rendered then the days ago text is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 10 * 24 * 60 * 60 * 1000))).toBe('10 days ago')
  })

  it('given a date thirty days in the past when rendered then a month ago is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))).toBe('a month ago')
  })

  it('given a date one hundred days in the past when rendered then the months ago text is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 100 * 24 * 60 * 60 * 1000))).toBe('3 months ago')
  })

  it('given a date four hundred days in the past when rendered then a year ago is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 400 * 24 * 60 * 60 * 1000))).toBe('a year ago')
  })

  it('given a date seven hundred days in the past when rendered then the years ago text is shown', () => {
    expect(renderTimeAgo(fixture, new Date(Date.now() - 700 * 24 * 60 * 60 * 1000))).toBe('2 years ago')
  })
})
