import { TestBed } from '@angular/core/testing'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { BreadcrumbService } from './breadcrumb.service'
import { provideTranslateTestingService } from '../../../testing'

function snapshot(data: any, url: string[], child?: any) {
  return {
    data,
    url: url.map((path) => ({ path })),
    routeConfig: { path: url.join('/') },
    paramMap: { get: () => null },
    firstChild: child ?? null,
  } as any
}

describe('BreadcrumbService', () => {
  let events: Subject<any>
  let currentRoot: any
  let service: BreadcrumbService
  let translate: TranslateService

  function setup(root: any) {
    currentRoot = root
    events = new Subject<any>()
    TestBed.configureTestingModule({
      providers: [
        provideTranslateTestingService({
          en: { PRODUCT: 'Product', PAGE: 'Page' },
          de: { PRODUCT: 'Produkt', PAGE: 'Seite' },
        }),
        { provide: ActivatedRoute, useValue: { snapshot: root } },
        {
          provide: Router,
          useValue: {
            events,
            routerState: {
              get snapshot() {
                return { root: currentRoot }
              },
            },
          },
        },
      ],
    })
    translate = TestBed.inject(TranslateService)
    translate.use('en')
    service = TestBed.inject(BreadcrumbService)
  }

  it('translates labels, skips crumbs without a name and never emits NA', () => {
    const page = snapshot({ breadcrumb: 'PAGE' }, ['page'])
    const unnamed = snapshot({}, ['unnamed'], page)
    setup(snapshot({ mfeInfo: { productName: 'PRODUCT', baseHref: '/prod' } }, ['prod'], unnamed))

    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['Product', 'Page'])
  })

  it('updates labels on language change', () => {
    setup(
      snapshot(
        { mfeInfo: { productName: 'PRODUCT', baseHref: '/prod' } },
        ['prod'],
        snapshot({ breadcrumb: 'PAGE' }, ['page'])
      )
    )

    translate.use('de')

    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['Produkt', 'Seite'])
  })

  it('regenerates on navigation', () => {
    setup(snapshot({ breadcrumb: 'PAGE' }, ['page']))
    currentRoot = snapshot({ breadcrumb: 'PRODUCT' }, ['other'])
    events.next(new NavigationEnd(1, '/other', '/other'))

    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['Product'])
  })

  it('uses breadcrumbFn and translates its result', () => {
    setup(snapshot({ breadcrumb: 'x', breadcrumbFn: () => 'PAGE' }, ['page']))

    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['Page'])
  })

  it('keeps the label when no translation exists', () => {
    setup(snapshot({ breadcrumb: 'Plain label' }, ['page']))

    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['Plain label'])
  })

  it('re-translates when translations are merged after creation', () => {
    setup(snapshot({ breadcrumb: 'LATE' }, ['page']))
    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['LATE'])

    translate.setTranslation('en', { LATE: 'Loaded late' }, true)

    expect(service.generatedItemsSource.value.map((i) => i.label)).toEqual(['Loaded late'])
  })
})
