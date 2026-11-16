import { LiveAnnouncer } from '@angular/cdk/a11y'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ChangeDetectionStrategy, Component, DestroyRef, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import {
  provideAppStateServiceMock,
  provideConfigurationServiceMock,
  provideUserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { SlotService } from '@onecx/angular-remote-components'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { of } from 'rxjs'
import { AngularAcceleratorOptimusModule } from '../angular-accelerator-optimus.module'
import { AngularAcceleratorModule } from '../angular-accelerator.module'
import { Row } from '../components/data-table/data-table.component'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'
import { ColumnType } from '../model/column-type.model'
import { DataTableColumn } from '../model/data-table-column.model'
import { Filter, FilterType } from '../model/filter.model'
import { DataViewStateService } from './data-view-state.service'
import { ResultsAnnouncementService } from './results-announcement.service'

const ALL_ROWS: Row[] = [
  { id: '1', name: 'alpha' },
  { id: '2', name: 'beta' },
  { id: '3', name: 'alpha' },
  { id: '4', name: 'gamma' },
]

const COLUMNS: DataTableColumn[] = [
  { id: 'name', nameKey: 'NAME', columnType: ColumnType.STRING, sortable: true, filterable: true },
]

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ocx-search-header
      header="Search"
      [loading]="loading()"
      [searchResultsCount]="count()"
      (searched)="search()"
    ></ocx-search-header>
    <ocx-interactive-data-view layout="table" [data]="rows()" [columns]="columns"></ocx-interactive-data-view>
  `,
})
class SearchPageComponent {
  readonly loading = signal(false)
  readonly count = signal<number | null>(0)
  readonly rows = signal<Row[]>([])
  readonly columns = COLUMNS

  search() {
    this.loading.set(true)
  }

  finishSearch(rows: Row[]) {
    this.rows.set(rows)
    this.count.set(rows.length)
    this.loading.set(false)
  }
}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ocx-search-header header="Search" [searchResultsCount]="null"></ocx-search-header>
    <ocx-interactive-data-view layout="table" [data]="rows()" [columns]="columns"></ocx-interactive-data-view>
    <ocx-interactive-data-view layout="list" [data]="rows()" [columns]="columns"></ocx-interactive-data-view>
  `,
})
class TwoDataViewsPageComponent {
  readonly rows = signal<Row[]>(ALL_ROWS)
  readonly columns = COLUMNS
}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ocx-interactive-data-view
      layout="table"
      [data]="rows()"
      [columns]="columns"
      [announceResults]="announceResults()"
    ></ocx-interactive-data-view>
  `,
})
class DataViewPageComponent {
  readonly rows = signal<Row[]>(ALL_ROWS)
  readonly announceResults = signal<boolean | undefined>(undefined)
  readonly columns = COLUMNS
}

const TEST_IMPORTS = [
  AngularAcceleratorModule,
  AngularAcceleratorOptimusModule,
  RouterTestingModule,
  NoopAnimationsModule,
]

function testProviders() {
  return [
    AppStateService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    provideAppStateServiceMock(),
    provideUserServiceMock(),
    provideConfigurationServiceMock(),
    provideTranslateTestingService({ en: require('../../../assets/i18n/en.json') }),
    { provide: HAS_PERMISSION_CHECKER, useExisting: UserService },
    { provide: SlotService, useValue: { isSomeComponentDefinedForSlot: () => of(false) } },
  ]
}

describe('ResultsAnnouncementService', () => {
  let service: ResultsAnnouncementService

  beforeEach(() => {
    service = TestBed.inject(ResultsAnnouncementService)
  })

  it('clears a pending search results announcement request', () => {
    service.requestSearchResultsAnnouncement()

    service.clearSearchResultsAnnouncementRequest()

    expect(service.consumeSearchResultsAnnouncementRequest()).toBe(false)
  })

  it('drops a pending request when the requesting search header is destroyed', () => {
    let destroy = () => undefined as void
    const destroyRef = { onDestroy: (callback: () => void) => (destroy = callback) } as unknown as DestroyRef
    service.registerSearchHeader(destroyRef)
    service.requestSearchResultsAnnouncement()

    destroy()

    expect(service.searchHeaderPresent()).toBe(false)
    expect(service.consumeSearchResultsAnnouncementRequest()).toBe(false)
  })
})

describe('Results announcement with two data views and one search header', () => {
  it('announces a search only once, by the first data view that receives new data', async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoDataViewsPageComponent],
      imports: TEST_IMPORTS,
      providers: testProviders(),
    }).compileComponents()
    const announceSpy = jest.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue()
    const fixture = TestBed.createComponent(TwoDataViewsPageComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    const searchHeader = fixture.debugElement.children[0].componentInstance as SearchHeaderComponent
    searchHeader.onSearchClicked()
    fixture.componentInstance.rows.set(ALL_ROWS.slice(0, 3))
    fixture.detectChanges()
    await fixture.whenStable()

    expect(announceSpy).toHaveBeenCalledTimes(1)
  })
})

describe('Results announcement of an interactive data view', () => {
  let fixture: ComponentFixture<DataViewPageComponent>
  let announceSpy: jest.SpyInstance

  async function render() {
    fixture.detectChanges()
    await fixture.whenStable()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataViewPageComponent],
      imports: TEST_IMPORTS,
      providers: testProviders(),
    }).compileComponents()
    announceSpy = jest.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue()
    fixture = TestBed.createComponent(DataViewPageComponent)
    await render()
  })

  it('announces new data without a search header', async () => {
    fixture.componentInstance.rows.set(ALL_ROWS.slice(0, 1))
    await render()

    expect(announceSpy).toHaveBeenCalledTimes(1)
    expect(announceSpy).toHaveBeenCalledWith('1 Results Found')
  })

  it('forwards announceResults to the data table', async () => {
    fixture.componentInstance.announceResults.set(false)
    await render()
    fixture.componentInstance.rows.set(ALL_ROWS.slice(0, 1))
    await render()

    expect(announceSpy).not.toHaveBeenCalled()
  })
})

describe('Results announcement on a search page', () => {
  let fixture: ComponentFixture<SearchPageComponent>
  let page: SearchPageComponent
  let announceSpy: jest.SpyInstance

  async function render() {
    fixture.detectChanges()
    await fixture.whenStable()
  }

  function searchHeader(): SearchHeaderComponent {
    return fixture.debugElement.children[0].componentInstance as SearchHeaderComponent
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchPageComponent],
      imports: [AngularAcceleratorModule, AngularAcceleratorOptimusModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideAppStateServiceMock(),
        provideUserServiceMock(),
        provideConfigurationServiceMock(),
        provideTranslateTestingService({ en: require('../../../assets/i18n/en.json') }),
        { provide: HAS_PERMISSION_CHECKER, useExisting: UserService },
        { provide: SlotService, useValue: { isSomeComponentDefinedForSlot: () => of(false) } },
      ],
    }).compileComponents()

    announceSpy = jest.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue()
    fixture = TestBed.createComponent(SearchPageComponent)
    page = fixture.componentInstance
    await render()
    page.finishSearch(ALL_ROWS)
    await render()
  })

  function dataViewState(): DataViewStateService {
    return fixture.debugElement.children[1].injector.get(DataViewStateService)
  }

  it('announces nothing at page load', () => {
    expect(announceSpy).not.toHaveBeenCalled()
  })

  it('announces exactly one message with the count after a search', async () => {
    searchHeader().onSearchClicked()
    await render()
    page.finishSearch(ALL_ROWS.slice(0, 2))
    await render()

    expect(announceSpy).toHaveBeenCalledTimes(1)
    expect(announceSpy).toHaveBeenCalledWith('2 results found', 'polite')
  })

  it('announces the filtered count once after a client-side filter', async () => {
    const filters: Filter[] = [{ columnId: 'name', value: 'alpha', filterType: FilterType.EQUALS }]
    dataViewState().filters.set(filters)
    await render()

    expect(announceSpy).toHaveBeenCalledTimes(1)
    expect(announceSpy).toHaveBeenCalledWith('2 Results Found')
  })

  it('announces once after a sort', async () => {
    dataViewState().sortColumn.set('name')
    await render()

    expect(announceSpy).toHaveBeenCalledTimes(1)
    expect(announceSpy).toHaveBeenCalledWith('4 Results Found')
  })

  it('lets the data component announce a search when the search header has no count', async () => {
    page.count.set(null)
    await render()

    searchHeader().onSearchClicked()
    await render()
    page.rows.set(ALL_ROWS.slice(0, 3))
    page.loading.set(false)
    await render()

    expect(announceSpy).toHaveBeenCalledTimes(1)
    expect(announceSpy).toHaveBeenCalledWith('3 Results Found')
  })

  it('registers the search header only while it is on the page', () => {
    const service = TestBed.inject(ResultsAnnouncementService)
    expect(service.searchHeaderPresent()).toBe(true)

    fixture.destroy()

    expect(service.searchHeaderPresent()).toBe(false)
  })
})
