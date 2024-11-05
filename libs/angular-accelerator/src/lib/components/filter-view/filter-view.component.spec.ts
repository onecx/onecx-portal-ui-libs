import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { FilterViewComponent } from './filter-view.component'
import { FilterViewHarness, TestbedHarnessEnvironment } from '../../../../testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ColumnType } from '../../model/column-type.model'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { FilterType } from '../../model/filter.model'
import { PrimeIcons } from 'primeng/api'
import { DatePipe } from '@angular/common'
import { limit } from '../../utils/filter.utils'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'

describe('FilterViewComponent', () => {
  let fixture: ComponentFixture<FilterViewComponent>
  let component: FilterViewComponent
  let translateService: TranslateService
  let filterView: FilterViewHarness

  const deafultDate = new Date(2024, 1, 1, 0, 0, 0, 0)

  const mockFilters = [
    {
      columnId: 'name',
      value: 'name-filter',
      filterType: FilterType.EQUAL,
    },
    {
      columnId: 'date',
      value: deafultDate,
      filterType: FilterType.EQUAL,
    },
    {
      columnId: 'status',
      value: 'MY_STATUS_KEY',
      filterType: FilterType.EQUAL,
    },
    {
      columnId: 'testNumber',
      value: true,
      filterType: FilterType.TRUTHY,
    },
  ]

  const mockColumns = [
    {
      columnType: ColumnType.STRING,
      id: 'name',
      nameKey: 'COLUMN_HEADER_NAME.NAME',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'date',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.TRANSLATION_KEY,
      id: 'status',
      nameKey: 'COLUMN_HEADER_NAME.STATUS',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      filterType: FilterType.TRUTHY,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterViewComponent],
      imports: [
        NoopAnimationsModule,
        AngularAcceleratorPrimeNgModule,
        AngularAcceleratorModule,
        TranslateTestingModule.withTranslations({
          en: {
            ...require('./../../../../assets/i18n/en.json'),
            'COLUMN_HEADER_NAME.NAME': 'Name',
            'COLUMN_HEADER_NAME.START_DATE': 'Start date',
            'COLUMN_HEADER_NAME.STATUS': 'Status',
            'COLUMN_HEADER_NAME.TEST_NUMBER': 'Test number',
            MY_STATUS_KEY: 'My status',
          },
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [],
    }).compileComponents()

    fixture = TestBed.createComponent(FilterViewComponent)
    component = fixture.componentInstance
    component.filters = mockFilters
    component.columns = mockColumns
    translateService = TestBed.inject(TranslateService)
    translateService.setDefaultLang('en')
    translateService.use('en')
    fixture.detectChanges()
    filterView = await TestbedHarnessEnvironment.harnessForFixture(fixture, FilterViewHarness)
  })

  it('should create filter view component', () => {
    expect(component).toBeTruthy()
  })

  it('should show button by default', async () => {
    const filtersButton = await filterView.getFiltersButton()
    expect(filtersButton).toBeTruthy()
    expect(await filtersButton?.getLabel()).toBe('Filters')
    expect(await filtersButton?.getBadgeValue()).toBe('4')
  })

  describe('chip section', () => {
    it('should show chips when specified and breakpoint is not mobile', async () => {
      const date = new Date(2024, 1, 1, 0, 0, 0, 0)
      const datePipe = new DatePipe('en')
      component.filters = [
        {
          columnId: 'name',
          value: 'name-filter',
          filterType: FilterType.EQUAL,
        },
        {
          columnId: 'date',
          value: new Date(2024, 1, 1, 0, 0, 0, 0),
          filterType: FilterType.EQUAL,
        },
        {
          columnId: 'testNumber',
          value: true,
          filterType: FilterType.TRUTHY,
        },
      ]
      component.showChips = true
      fixture.detectChanges()
      let filtersButton = await filterView.getFiltersButton()
      expect(filtersButton).toBeFalsy()

      let chipResetFiltersButton = await filterView.getChipsResetFiltersButton()
      expect(chipResetFiltersButton).toBeTruthy()
      expect(await chipResetFiltersButton?.getIcon()).toBe(PrimeIcons.ERASER)

      let chips = await filterView.getChips()
      expect(chips).toBeTruthy()
      expect(chips.length).toBe(3)

      expect(await chips[0].getContent()).toBe('Test number: Yes')
      expect(await chips[1].getContent()).toBe('Start date: '.concat(datePipe.transform(date, 'medium') ?? ''))
      expect(await chips[2].getContent()).toBe('Name: name-filter')

      const orgMatchMedia = window.matchMedia
      window.matchMedia = jest.fn(() => {
        return {
          matches: true,
        }
      }) as any
      window.dispatchEvent(new Event('resize'))

      fixture.detectChanges()
      filtersButton = await filterView.getFiltersButton()
      expect(filtersButton).toBeTruthy()

      chipResetFiltersButton = await filterView.getChipsResetFiltersButton()
      expect(chipResetFiltersButton).toBeFalsy()

      chips = await filterView.getChips()
      expect(chips.length).toBe(0)

      window.matchMedia = orgMatchMedia
    })
    it('should show no filters message when no filters selected', async () => {
      component.filters = []
      component.showChips = true
      fixture.detectChanges()

      const chipResetFiltersButton = await filterView.getChipsResetFiltersButton()
      expect(chipResetFiltersButton).toBeTruthy()

      const chips = await filterView.getChips()
      expect(chips.length).toBe(0)

      const noFilters = await filterView.getNoFiltersMessage()
      expect(noFilters).toBeTruthy()
      expect(await noFilters?.getText()).toBe('No filters selected')
    })
    it('should reset filters on reset filters button click', async () => {
      const filteredEmitterSpy = jest.spyOn(component.filtered, 'emit')
      const componentStateEmitterSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.showChips = true
      fixture.detectChanges()

      const chips = await filterView.getChips()
      expect(chips.length).toBe(mockFilters.length)

      const chipResetFiltersButton = await filterView.getChipsResetFiltersButton()
      await chipResetFiltersButton?.click()
      expect(component.filters).toEqual([])
      expect(filteredEmitterSpy).toHaveBeenCalledWith([])
      expect(componentStateEmitterSpy).toHaveBeenCalledWith({
        filters: [],
      })
      const chipsAfterReset = await filterView.getChips()
      expect(chipsAfterReset.length).toBe(0)
    })
    it('should use provided chip selection strategy', async () => {
      component.showChips = true
      component.selectDisplayedChips = (data) => limit(data, 1, { reverse: false })
      fixture.detectChanges()

      const chips = await filterView.getChips()
      expect(chips.length).toBe(2)

      expect(await chips[0].getContent()).toBe('Name: name-filter')
    })
    it('should remove filter on chip removal', async () => {
      const filteredEmitterSpy = jest.spyOn(component.filtered, 'emit')
      const componentStateEmitterSpy = jest.spyOn(component.componentStateChanged, 'emit')
      component.filters = [
        {
          columnId: 'name',
          value: 'name-filter',
          filterType: FilterType.EQUAL,
        },
        {
          columnId: 'date',
          value: new Date(2024, 1, 1, 0, 0, 0, 0),
          filterType: FilterType.EQUAL,
        },
      ]
      component.showChips = true
      fixture.detectChanges()

      const chips = await filterView.getChips()
      expect(chips.length).toBe(2)
      await chips[0].clickRemove()

      const chipsAfterRemove = await filterView.getChips()
      expect(chipsAfterRemove.length).toBe(1)
      expect(await chipsAfterRemove[0].getContent()).toBe('Name: name-filter')
      const expectedFilters = [
        {
          columnId: 'name',
          value: 'name-filter',
          filterType: FilterType.EQUAL,
        },
      ]
      expect(component.filters).toEqual(expectedFilters)
      expect(filteredEmitterSpy).toHaveBeenCalledWith(expectedFilters)
      expect(componentStateEmitterSpy).toHaveBeenCalledWith({
        filters: expectedFilters,
      })
    })
    it('should show panel on show more chips click', async () => {
      component.showChips = true
      fixture.detectChanges()

      let dataTable = await filterView.getDataTable()
      expect(dataTable).toBeFalsy()

      const chips = await filterView.getChips()
      expect(chips.length).toBe(4)
      expect(await chips[3].getContent()).toBe('+1')
      await chips[3].click()
      fixture.detectChanges()

      dataTable = await filterView.getDataTable()
      expect(dataTable).toBeTruthy()
    })
  })

  describe('without chips', () => {
    it('should show panel on button click', async () => {
      let dataTable = await filterView.getDataTable()
      expect(dataTable).toBeFalsy()

      const filtersButton = await filterView.getFiltersButton()
      await filtersButton?.click()
      fixture.detectChanges()

      dataTable = await filterView.getDataTable()
      expect(dataTable).toBeTruthy()
    })
  })

  describe('overlay', () => {
    it('should show data table with column filters', async () => {
      const datePipe = new DatePipe('en')
      let dataTable = await filterView.getDataTable()
      expect(dataTable).toBeFalsy()

      const filtersButton = await filterView.getFiltersButton()
      await filtersButton?.click()
      fixture.detectChanges()

      dataTable = await filterView.getDataTable()
      expect(dataTable).toBeTruthy()
      const headers = await dataTable?.getHeaderColumns()
      expect(headers).toBeTruthy()
      expect(headers?.length).toBe(3)
      expect(await headers![0].getText()).toBe('Column name')
      expect(await headers![1].getText()).toBe('Filter value')
      expect(await headers![2].getText()).toBe('Actions')

      const rows = await dataTable?.getRows()
      expect(rows?.length).toBe(4)
      expect(await rows![0].getData()).toEqual(['Name', 'name-filter', ''])
      expect(await rows![1].getData()).toEqual(['Start date', datePipe.transform(deafultDate, 'medium'), ''])
      expect(await rows![2].getData()).toEqual(['Status', 'My status', ''])
      expect(await rows![3].getData()).toEqual(['Test number', 'Yes', ''])
    })

    it('should show reset all filters button above the table', async () => {
      const filtersButton = await filterView.getFiltersButton()
      await filtersButton?.click()
      fixture.detectChanges()

      const resetButton = await filterView.getOverlayResetFiltersButton()
      expect(resetButton).toBeTruthy()
      const dataTable = await filterView.getDataTable()
      expect((await dataTable?.getRows())?.length).toBe(4)

      await resetButton?.click()
      const rows = await dataTable?.getRows()
      expect(rows?.length).toBe(1)
      expect(await rows![0].getData()).toEqual(['No filters selected'])
    })

    it('should show remove filter in action column', async () => {
      const filteredEmitterSpy = jest.spyOn(component.filtered, 'emit')
      const componentStateEmitterSpy = jest.spyOn(component.componentStateChanged, 'emit')

      const filtersButton = await filterView.getFiltersButton()
      await filtersButton?.click()
      fixture.detectChanges()

      const dataTable = await filterView.getDataTable()
      let rows = await dataTable?.getRows()
      expect(rows?.length).toBe(4)
      const buttons = await rows![0].getAllActionButtons()
      expect(buttons.length).toBe(1)
      await buttons[0].click()

      rows = await dataTable?.getRows()
      expect(rows?.length).toBe(3)
      expect(component.filters.length).toBe(3)
      const expectedFilters = mockFilters.filter((f) => f.columnId !== 'name')
      expect(filteredEmitterSpy).toHaveBeenCalledWith(expectedFilters)
      expect(componentStateEmitterSpy).toHaveBeenCalledWith({
        filters: expectedFilters,
      })
    })
  })
})
