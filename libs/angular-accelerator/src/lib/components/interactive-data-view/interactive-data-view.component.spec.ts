import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HarnessLoader, parallel, TestElement } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import {
  PDropdownHarness,
  PButtonHarness,
  PPicklistHarness,
  ButtonHarness,
  PMultiSelectListItemHarness,
  TableHeaderColumnHarness,
  TableRowHarness,
  ListItemHarness,
} from '@onecx/angular-testing'
import { UserService } from '@onecx/angular-integration-interface'
import { provideAppStateServiceMock, provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataViewComponent, RowListGridData } from '../data-view/data-view.component'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { ColumnType } from '../../model/column-type.model'
import {
  DataViewHarness,
  ColumnGroupSelectionHarness,
  CustomGroupColumnSelectorHarness,
  DataLayoutSelectionHarness,
  DataTableHarness,
  DataListGridHarness,
  DefaultGridItemHarness,
  DefaultListItemHarness,
  InteractiveDataViewHarness,
  SlotHarness,
  FilterViewHarness,
} from '../../../../testing'
import { DateUtils } from '../../utils/dateutils'
import { provideRouter } from '@angular/router'
import { SlotService } from '@onecx/angular-remote-components'
import { SlotServiceMock } from '@onecx/angular-remote-components/mocks'
import { IfPermissionDirective } from '../../directives/if-permission.directive'
import { FilterType } from '../../model/filter.model'
import { FilterViewComponent } from '../filter-view/filter-view.component'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { PrimeIcons } from 'primeng/api'
import { limit } from '../../utils/filter.utils'
import { DatePipe } from '@angular/common'

describe('InteractiveDataViewComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  let component: InteractiveDataViewComponent
  let fixture: ComponentFixture<InteractiveDataViewComponent>
  let loader: HarnessLoader
  let interactiveDataViewHarness: InteractiveDataViewHarness

  let viewItemEvent: RowListGridData | undefined
  let editItemEvent: RowListGridData | undefined
  let deleteItemEvent: RowListGridData | undefined

  let dateUtils: DateUtils
  let slotService: SlotServiceMock

  const mockData = [
    {
      version: 0,
      creationDate: '2023-09-12T09:34:11.997048Z',
      creationUser: 'creation user',
      modificationDate: '2023-09-12T09:34:11.997048Z',
      modificationUser: '',
      id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
      name: 'some name',
      description: '',
      status: 'some status',
      responsible: 'someone responsible',
      endDate: '2023-09-14T09:34:09Z',
      startDate: '2023-09-13T09:34:05Z',
      imagePath: '/path/to/image',
      testNumber: '1',
      testTruthy: 'value',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:33:58.544494Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:33:58.544494Z',
      modificationUser: '',
      id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
      name: 'example',
      description: 'example description',
      status: 'status example',
      responsible: '',
      endDate: '2023-09-13T09:33:55Z',
      startDate: '2023-09-12T09:33:53Z',
      imagePath: '',
      testNumber: '3.141',
      testTruthy: 'value2',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 1',
      description: '',
      status: 'status name 1',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '123456789',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 2',
      description: '',
      status: 'status name 2',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '12345.6789',
      testTruthy: 'value3',
    },
    {
      version: 0,
      creationDate: '2023-09-12T09:34:27.184086Z',
      creationUser: '',
      modificationDate: '2023-09-12T09:34:27.184086Z',
      modificationUser: '',
      id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
      name: 'name 3',
      description: '',
      status: 'status name 3',
      responsible: '',
      endDate: '2023-09-15T09:34:24Z',
      startDate: '2023-09-14T09:34:22Z',
      imagePath: '',
      testNumber: '7.1',
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
      columnType: ColumnType.STRING,
      id: 'description',
      nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'startDate',
      nameKey: 'COLUMN_HEADER_NAME.START_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.DATE,
      id: 'endDate',
      nameKey: 'COLUMN_HEADER_NAME.END_DATE',
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
      columnType: ColumnType.STRING,
      id: 'responsible',
      nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.RELATIVE_DATE,
      id: 'modificationDate',
      nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'creationUser',
      nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.NUMBER,
      id: 'testNumber',
      nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
      filterable: true,
      sortable: true,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
    {
      columnType: ColumnType.STRING,
      id: 'testTruthy',
      nameKey: 'COLUMN_HEADER_NAME.TEST_TRUTHY',
      filterable: true,
      sortable: true,
      filterType: FilterType.TRUTHY,
      predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InteractiveDataViewComponent,
        DataLayoutSelectionComponent,
        DataViewComponent,
        ColumnGroupSelectionComponent,
        CustomGroupColumnSelectorComponent,
        IfPermissionDirective,
        FilterViewComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ButtonModule,
        DialogModule,
        PickListModule,
        AngularAcceleratorModule,
        NoopAnimationsModule,
        AngularAcceleratorPrimeNgModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        provideUserServiceMock(),
        {
          provide: SlotService,
          useClass: SlotServiceMock,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        provideAppStateServiceMock(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(InteractiveDataViewComponent)
    component = fixture.componentInstance
    const userService = TestBed.inject(UserService)
    userService.permissions$.next([
      'TEST_MGMT#TEST_View',
      'TEST_MGMT#TEST_EDIT',
      'TEST_MGMT#TEST_DELETE',
      'PRODUCT#USE_SEARCHCONFIG',
    ])
    component.viewPermission = 'TEST_MGMT#TEST_View'
    component.editPermission = 'TEST_MGMT#TEST_EDIT'
    component.deletePermission = 'TEST_MGMT#TEST_DELETE'
    component.defaultGroupKey = 'PREDEFINED_GROUP.DEFAULT'
    component.searchConfigPermission = 'PRODUCT#USE_SEARCHCONFIG'
    component.viewItem.subscribe((event) => (viewItemEvent = event))
    component.editItem.subscribe((event) => (editItemEvent = event))
    component.deleteItem.subscribe((event) => (deleteItemEvent = event))
    component.titleLineId = 'name'
    component.subtitleLineIds = ['startDate']
    component.data = mockData
    component.columns = mockColumns

    fixture.detectChanges()

    loader = TestbedHarnessEnvironment.loader(fixture)
    interactiveDataViewHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, InteractiveDataViewHarness)

    dateUtils = TestBed.inject(DateUtils)
    slotService = TestBed.inject(SlotService) as any as SlotServiceMock

    viewItemEvent = undefined
    editItemEvent = undefined
    deleteItemEvent = undefined

    console.log('Global IntersectionObserver', global.IntersectionObserver)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load data view harness', async () => {
    const dataView = await loader.getHarness(DataViewHarness)
    expect(dataView).toBeTruthy()
  })

  it('should load DataLayoutSelection', async () => {
    const dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
    expect(dataLayoutSelection).toBeTruthy()
  })

  it('should load column-group-selection slot', async () => {
    slotService.assignComponentToSlot('column-group-selection', component.columnGroupSlotName)
    const userService = TestBed.inject(UserService)
    jest.spyOn(userService, 'hasPermission').mockReturnValue(true)
    fixture.detectChanges()

    const slot = await loader.getHarness(SlotHarness)
    expect(slot).toBeTruthy()
  })

  it('should load ColumnGroupSelectionDropdown', async () => {
    const columnGroupSelectionDropdown = await loader.getHarness(ColumnGroupSelectionHarness)
    expect(columnGroupSelectionDropdown).toBeTruthy()

    slotService.assignComponentToSlot('column-group-selection', component.columnGroupSlotName)
    const userService = TestBed.inject(UserService)
    jest.spyOn(userService, 'hasPermission').mockReturnValue(false)

    const columnGroupSelectionDropdownNoPermission = await loader.getHarness(ColumnGroupSelectionHarness)
    expect(columnGroupSelectionDropdownNoPermission).toBeTruthy()
  })

  it('should load CustomGroupColumnSelector', async () => {
    const customGroupColumnSelectorButton = await loader.getHarness(CustomGroupColumnSelectorHarness)
    expect(customGroupColumnSelectorButton).toBeTruthy()
  })

  it('should load FilterView', async () => {
    component.disableFilterView = false
    fixture.detectChanges()

    const filterView = await loader.getHarness(FilterViewHarness)
    expect(filterView).toBeTruthy()
  })

  it('should load DataListGridSortingDropdown', async () => {
    const dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
    const gridLayoutSelectionButton = await dataLayoutSelection.getGridLayoutSelectionButton()
    await gridLayoutSelectionButton?.click()

    const dataListGridSortingDropdown = await loader.getHarness(
      PDropdownHarness.with({ id: 'dataListGridSortingDropdown' })
    )
    expect(dataListGridSortingDropdown).toBeTruthy()
  })

  it('should load DataListGridSortingButton', async () => {
    const dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
    const gridLayoutSelectionButton = await dataLayoutSelection.getGridLayoutSelectionButton()
    await gridLayoutSelectionButton?.click()

    const dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    expect(dataListGridSortingButton).toBeTruthy()
  })

  describe('Table view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]
    let allFilterOptions: PMultiSelectListItemHarness[] | undefined

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView?.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []

      allFilterOptions = undefined
    })

    const expectedInitialHeaders = [
      'COLUMN_HEADER_NAME.NAME',
      'COLUMN_HEADER_NAME.DESCRIPTION',
      'COLUMN_HEADER_NAME.STATUS',
      'COLUMN_HEADER_NAME.RESPONSIBLE',
      'Actions',
    ]
    const expectedInitialRowsData = [
      ['some name', '', 'some status', 'someone responsible'],
      ['example', 'example description', 'status example', ''],
      ['name 1', '', 'status name 1', ''],
      ['name 2', '', 'status name 2', ''],
      ['name 3', '', 'status name 3', ''],
    ]

    it('should load table', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('table')
    })

    it('should get table data', async () => {
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))
      expect(headers).toEqual(expectedInitialHeaders)
      expect(rows).toEqual(expectedInitialRowsData)
    })

    it('should sort data by first table column in ascending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['example', 'example description', 'status example', ''],
        ['name 1', '', 'status name 1', ''],
        ['name 2', '', 'status name 2', ''],
        ['name 3', '', 'status name 3', ''],
        ['some name', '', 'some status', 'someone responsible'],
      ]
      const sortButton = await tableHeaders[0].getSortButton()
      await sortButton.click()
      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by third table column in ascending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['some name', '', 'some status', 'someone responsible'],
        ['example', 'example description', 'status example', ''],
        ['name 1', '', 'status name 1', ''],
        ['name 2', '', 'status name 2', ''],
        ['name 3', '', 'status name 3', ''],
      ]
      const sortButton = await tableHeaders[2].getSortButton()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by first table column in descending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['some name', '', 'some status', 'someone responsible'],
        ['name 3', '', 'status name 3', ''],
        ['name 2', '', 'status name 2', ''],
        ['name 1', '', 'status name 1', ''],
        ['example', 'example description', 'status example', ''],
      ]
      const sortButton = await tableHeaders[0].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by third table column in descending order', async () => {
      const expectedRowsDataAfterSorting = [
        ['name 3', '', 'status name 3', ''],
        ['name 2', '', 'status name 2', ''],
        ['name 1', '', 'status name 1', ''],
        ['example', 'example description', 'status example', ''],
        ['some name', '', 'some status', 'someone responsible'],
      ]
      const sortButton = await tableHeaders[2].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterSorting)
    })

    it('should sort data by first table column back to default order', async () => {
      const sortButton = await tableHeaders[0].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedInitialRowsData)
    })

    it('should sort data by third table column back to default order', async () => {
      const sortButton = await tableHeaders[2].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedInitialRowsData)
    })

    it('should filter data by first table column with second filter option', async () => {
      const expectedRowsDataAfterFilter = [['example', 'example description', 'status example', '']]

      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterFilter)
    })

    it('should filter data by first table column with second and third filter option', async () => {
      const expectedSelectedOptions = ['example', 'name 1']
      const expectedRowsDataAfterFilter = [
        ['example', 'example description', 'status example', ''],
        ['name 1', '', 'status name 1', ''],
      ]

      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[2].click()

      expect(await filterMultiSelect.getSelectedOptions()).toEqual(expectedSelectedOptions)

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterFilter)
    })

    it('should filter data by first table column with third filter option after selecting second and third option then unselecting second option', async () => {
      const expectedSelectedOption = ['name 1']
      const expectedRowsDataAfterFilter = [['name 1', '', 'status name 1', '']]

      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[2].click()

      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[1].click()

      expect(await filterMultiSelect.getSelectedOptions()).toEqual(expectedSelectedOption)

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsDataAfterFilter)
    })

    it('should get event viewItem with first data row when view action row button of first row is clicked', async () => {
      const viewButton = await tableRows[0].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get event viewItem with third data row when view action row button of third row is clicked', async () => {
      const viewButton = await tableRows[2].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get event editItem with first data row when edit action row button of first row is clicked', async () => {
      const editButton = await tableRows[0].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get event editItem with third data row when edit action row button of third row is clicked', async () => {
      const editButton = await tableRows[2].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get event deleteItem with first data row when delete action row button of first row is clicked', async () => {
      const deleteButton = await tableRows[0].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get event deleteItem with first data row when delete action row button of third row is clicked', async () => {
      const deleteButton = await tableRows[2].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[2])
    })

    it('should select option in column group selection dropdown', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.START_DATE',
        'COLUMN_HEADER_NAME.END_DATE',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'COLUMN_HEADER_NAME.TEST_NUMBER',
        'COLUMN_HEADER_NAME.TEST_TRUTHY',
        'Actions',
      ]
      const expectedRowsData = [
        [
          'some name',
          '',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
          'value2',
        ],
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
          '',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
          'value3',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
          '',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should select option in column group selection dropdown and sort ascending', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedRowsData = [
        [
          'some name',
          '',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
          'value2',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
          '',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
          'value3',
        ],
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
          '',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })

    it('should select option in column group selection dropdown and sort descending', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedRowsData = [
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
          '',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
          'value3',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
          '',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
          'value2',
        ],
        [
          'some name',
          '',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })

    it('should select option in column group selection dropdown and sort default', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const expectedRowsData = [
        [
          'some name',
          '',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
          'value',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
          'value2',
        ],
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
          '',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
          'value3',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
          '',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })

    it('should render an unpinnend action column on the right side of the table by default', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      expect(component.frozenActionColumn).toBe(false)
      expect(component.actionColumnPosition).toBe('right')
      expect(await dataTable?.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable?.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable?.getActionColumnHeader('right')
      const rightActionColumn = await dataTable?.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(rightActionColumnHeader)).toBe(false)
      expect(await dataTable?.columnIsFrozen(rightActionColumn)).toBe(false)
    })

    it('should render an pinned action column on the specified side of the table', async () => {
      component.viewItem.subscribe((event) => console.log(event))

      component.frozenActionColumn = true
      component.actionColumnPosition = 'left'

      expect(await dataTable?.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable?.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable?.getActionColumnHeader('left')
      const leftActionColumn = await dataTable?.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(leftActionColumnHeader)).toBe(true)
      expect(await dataTable?.columnIsFrozen(leftActionColumn)).toBe(true)
    })
  })

  describe('Table row selection ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataTable: DataTableHarness | null

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      dataView = await interactiveDataViewHarness.getDataView()
      dataTable = await dataView?.getDataTable()
    })

    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('table')
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('table')
      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(false)

      component.selectionChanged.subscribe()

      expect(await dataTable?.rowSelectionIsEnabled()).toEqual(true)
      component.selectionChanged.unsubscribe()
    })
  })

  describe('Table view custom group column selector ', () => {
    let dataView: DataViewHarness
    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]

    let customGroupColumnSelector: CustomGroupColumnSelectorHarness
    let picklist: PPicklistHarness
    let activeColumnsList: ListItemHarness[]
    let inActiveColumnsList: ListItemHarness[]
    let sourceControlsButtons: ButtonHarness[]
    let transferControlsButtons: ButtonHarness[]
    let dialogSaveButton: PButtonHarness
    let frozenActionColumnSelectButtons: TestElement[]
    let actionColumnPositionSelectButtons: TestElement[]

    beforeEach(async () => {
      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView?.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []

      customGroupColumnSelector = await loader.getHarness(CustomGroupColumnSelectorHarness)
      await customGroupColumnSelector.openCustomGroupColumnSelectorDialog()

      picklist = await customGroupColumnSelector.getPicklist()
      activeColumnsList = await picklist.getSourceListItems()
      inActiveColumnsList = await picklist.getTargetListItems()
      sourceControlsButtons = await picklist.getSourceControlsButtons()
      transferControlsButtons = await picklist.getTransferControlsButtons()
      dialogSaveButton = await customGroupColumnSelector.getSaveButton()
      frozenActionColumnSelectButtons = await customGroupColumnSelector.getFrozenActionColumnSelectButton()
      actionColumnPositionSelectButtons = await customGroupColumnSelector.getActionColumnPositionSelectButtons()
    })

    it('should move item up in picklist active columns list', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'Actions',
      ]
      const expectedRowsData = [
        ['', 'some name', 'some status', 'someone responsible'],
        ['example description', 'example', 'status example', ''],
        ['', 'name 1', 'status name 1', ''],
        ['', 'name 2', 'status name 2', ''],
        ['', 'name 3', 'status name 3', ''],
      ]
      await activeColumnsList[1].selectItem()
      await sourceControlsButtons[0].click()
      await dialogSaveButton.click()
      expect(spy).toHaveBeenCalled()
      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))
      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should move item down in picklist active columns list', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'Actions',
      ]
      const expectedRowsData = [
        ['some name', 'some status', '', 'someone responsible'],
        ['example', 'status example', 'example description', ''],
        ['name 1', 'status name 1', '', ''],
        ['name 2', 'status name 2', '', ''],
        ['name 3', 'status name 3', '', ''],
      ]

      await activeColumnsList[1].selectItem()
      await sourceControlsButtons[2].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should move item in picklist from active to inactive', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'Actions',
      ]
      const expectedRowsData = [
        ['', 'some status', 'someone responsible'],
        ['example description', 'status example', ''],
        ['', 'status name 1', ''],
        ['', 'status name 2', ''],
        ['', 'status name 3', ''],
      ]

      await activeColumnsList[0].selectItem()
      await transferControlsButtons[0].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should move item in picklist from inactive to active', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      const expectedHeaders = [
        'COLUMN_HEADER_NAME.NAME',
        'COLUMN_HEADER_NAME.DESCRIPTION',
        'COLUMN_HEADER_NAME.STATUS',
        'COLUMN_HEADER_NAME.RESPONSIBLE',
        'COLUMN_HEADER_NAME.START_DATE',
        'Actions',
      ]
      const expectedRowsData = [
        ['some name', '', 'some status', 'someone responsible', dateUtils.localizedDate('2023-09-13T09:34:05Z')],
        ['example', 'example description', 'status example', '', dateUtils.localizedDate('2023-09-12T09:33:53Z')],
        ['name 1', '', 'status name 1', '', dateUtils.localizedDate('2023-09-14T09:34:22Z')],
        ['name 2', '', 'status name 2', '', dateUtils.localizedDate('2023-09-14T09:34:22Z')],
        ['name 3', '', 'status name 3', '', dateUtils.localizedDate('2023-09-14T09:34:22Z')],
      ]

      await inActiveColumnsList[0].selectItem()
      await transferControlsButtons[2].click()
      await dialogSaveButton.click()
      expect(spy).toHaveBeenCalled()

      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })

    it('should allow users to configure the action column position', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      expect(component.actionColumnPosition).toBe('right')
      expect(component.frozenActionColumn).toBe(false)
      await actionColumnPositionSelectButtons[0].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      expect(component.actionColumnPosition).toBe('left')

      expect(await dataTable?.getActionColumnHeader('right')).toBe(null)
      expect(await dataTable?.getActionColumn('right')).toBe(null)

      const leftActionColumnHeader = await dataTable?.getActionColumnHeader('left')
      const leftActionColumn = await dataTable?.getActionColumn('left')
      expect(leftActionColumnHeader).toBeTruthy()
      expect(leftActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(leftActionColumnHeader)).toBe(false)
      expect(await dataTable?.columnIsFrozen(leftActionColumn)).toBe(false)
    })

    it('should allow users to freeze action column', async () => {
      const spy = jest.spyOn(CustomGroupColumnSelectorComponent.prototype, 'onSaveClick')
      expect(component.actionColumnPosition).toBe('right')
      expect(component.frozenActionColumn).toBe(false)
      await frozenActionColumnSelectButtons[0].click()
      await dialogSaveButton.click()

      expect(spy).toHaveBeenCalled()

      expect(component.frozenActionColumn).toBe(true)

      expect(await dataTable?.getActionColumnHeader('left')).toBe(null)
      expect(await dataTable?.getActionColumn('left')).toBe(null)

      const rightActionColumnHeader = await dataTable?.getActionColumnHeader('right')
      const rightActionColumn = await dataTable?.getActionColumn('right')
      expect(rightActionColumnHeader).toBeTruthy()
      expect(rightActionColumn).toBeTruthy()
      expect(await dataTable?.columnIsFrozen(rightActionColumnHeader)).toBe(true)
      expect(await dataTable?.columnIsFrozen(rightActionColumn)).toBe(true)
    })
  })

  describe('Filter view ', () => {
    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]

    let filterViewHarness: FilterViewHarness

    beforeEach(async () => {
      component.disableFilterView = false
      fixture.detectChanges()
      // select FULL group
      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[2].selectItem()

      const dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView?.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []

      expect(await tableHeaders[2].getText()).toBe('COLUMN_HEADER_NAME.START_DATE')
      const startDateFilterMultiSelect = await tableHeaders[2].getFilterMultiSelect()
      const startDateAllFilterOptions = await startDateFilterMultiSelect.getAllOptions()
      await startDateAllFilterOptions[0].click()
      await startDateFilterMultiSelect.close()

      expect(await tableHeaders[0].getText()).toBe('COLUMN_HEADER_NAME.NAME')
      const nameFilterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      const nameAllFilterOptions = await nameFilterMultiSelect.getAllOptions()
      await nameAllFilterOptions[0].click()
      await nameFilterMultiSelect.close()

      expect(await tableHeaders[4].getText()).toBe('COLUMN_HEADER_NAME.STATUS')
      const statusFilterMultiSelect = await tableHeaders[4].getFilterMultiSelect()
      const statusAllFilterOptions = await statusFilterMultiSelect.getAllOptions()
      await statusAllFilterOptions[0].click()
      await statusFilterMultiSelect.close()

      expect(await tableHeaders[9].getText()).toBe('COLUMN_HEADER_NAME.TEST_TRUTHY')
      const testTruthyFilterMultiSelect = await tableHeaders[9].getFilterMultiSelect()
      const testTruthyAllFilterOptions = await testTruthyFilterMultiSelect.getAllOptions()
      await testTruthyAllFilterOptions[0].click()
      await testTruthyFilterMultiSelect.close()

      filterViewHarness = await loader.getHarness(FilterViewHarness)
    })

    it('should show button by default', async () => {
      const filtersButton = await filterViewHarness.getFiltersButton()
      expect(filtersButton).toBeTruthy()
      expect(await filtersButton?.getLabel()).toBe('Filters')
      expect(await filtersButton?.getBadgeValue()).toBe('4')
    })

    describe('chip section', () => {
      it('should show chips when specified and breakpoint is not mobile', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()
        let filtersButton = await filterViewHarness.getFiltersButton()
        expect(filtersButton).toBeFalsy()

        let chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        expect(chipResetFiltersButton).toBeTruthy()
        expect(await chipResetFiltersButton?.getIcon()).toBe(PrimeIcons.ERASER)

        let chips = await filterViewHarness.getChips()
        expect(chips).toBeTruthy()
        expect(chips.length).toBe(4)

        expect(await chips[0].getContent()).toBe('COLUMN_HEADER_NAME.TEST_TRUTHY: Yes')
        expect(await chips[1].getContent()).toBe('COLUMN_HEADER_NAME.STATUS: some status')
        expect(await chips[2].getContent()).toBe('COLUMN_HEADER_NAME.NAME: some name')
        expect(await chips[3].getContent()).toBe('+1')

        const orgMatchMedia = window.matchMedia
        window.matchMedia = jest.fn(() => {
          return {
            matches: true,
          }
        }) as any
        window.dispatchEvent(new Event('resize'))

        fixture.detectChanges()
        filtersButton = await filterViewHarness.getFiltersButton()
        expect(filtersButton).toBeTruthy()

        chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        expect(chipResetFiltersButton).toBeFalsy()

        chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(0)

        window.matchMedia = orgMatchMedia
      })

      it('should show no filters message when no filters selected', async () => {
        component.filters = []
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        const chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        expect(chipResetFiltersButton).toBeTruthy()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(0)

        const noFilters = await filterViewHarness.getNoFiltersMessage()
        expect(noFilters).toBeTruthy()
        expect(await noFilters?.getText()).toBe('No filters selected')
      })

      it('should reset filters on reset filters button click', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(4)

        const chipResetFiltersButton = await filterViewHarness.getChipsResetFiltersButton()
        await chipResetFiltersButton?.click()
        expect(component.filters).toEqual([])
        const chipsAfterReset = await filterViewHarness.getChips()
        expect(chipsAfterReset.length).toBe(0)
      })

      it('should use provided chip selection strategy', async () => {
        const datePipe = new DatePipe('en')
        component.filterViewDisplayMode = 'chips'
        component.selectDisplayedChips = (data) => limit(data, 1, { reverse: false })
        fixture.detectChanges()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(2)

        expect(await chips[0].getContent()).toBe(
          'COLUMN_HEADER_NAME.START_DATE: ' + datePipe.transform('2023-09-13T09:34:05Z', 'medium')
        )
      })

      it('should remove filter on chip removal', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(4)
        expect(component.filters.length).toBe(4)
        await chips[0].clickRemove()

        const chipsAfterRemove = await filterViewHarness.getChips()
        expect(chipsAfterRemove.length).toBe(3)
        expect(component.filters.length).toBe(3)
        expect(await chipsAfterRemove[0].getContent()).toBe('COLUMN_HEADER_NAME.STATUS: some status')
      })

      it('should show panel on show more chips click', async () => {
        component.filterViewDisplayMode = 'chips'
        fixture.detectChanges()

        let dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeFalsy()

        const chips = await filterViewHarness.getChips()
        expect(chips.length).toBe(4)
        expect(await chips[3].getContent()).toBe('+1')
        await chips[3].click()
        fixture.detectChanges()

        dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeTruthy()
      })
    })

    describe('without chips', () => {
      it('should show panel on button click', async () => {
        let dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeFalsy()

        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeTruthy()
      })
    })

    describe('overlay', () => {
      it('should show data table with column filters', async () => {
        const datePipe = new DatePipe('en')
        let dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeFalsy()

        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        dataTable = await filterViewHarness.getDataTable()
        expect(dataTable).toBeTruthy()
        const headers = await dataTable?.getHeaderColumns()
        expect(headers).toBeTruthy()
        expect(headers?.length).toBe(3)
        expect(await headers![0].getText()).toBe('Column name')
        expect(await headers![1].getText()).toBe('Filter value')
        expect(await headers![2].getText()).toBe('Actions')

        const rows = await dataTable?.getRows()
        expect(rows?.length).toBe(4)
        expect(await rows![0].getData()).toEqual(['COLUMN_HEADER_NAME.NAME', 'some name', ''])
        expect(await rows![1].getData()).toEqual([
          'COLUMN_HEADER_NAME.START_DATE',
          datePipe.transform('2023-09-13T09:34:05Z', 'medium'),
          '',
        ])
        expect(await rows![2].getData()).toEqual(['COLUMN_HEADER_NAME.STATUS', 'some status', ''])
        expect(await rows![3].getData()).toEqual(['COLUMN_HEADER_NAME.TEST_TRUTHY', 'Yes', ''])
      })

      it('should show reset all filters button above the table', async () => {
        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        const resetButton = await filterViewHarness.getOverlayResetFiltersButton()
        expect(resetButton).toBeTruthy()
        const dataTable = await filterViewHarness.getDataTable()
        expect((await dataTable?.getRows())?.length).toBe(4)

        await resetButton?.click()
        const rows = await dataTable?.getRows()
        expect(rows?.length).toBe(1)
        expect(await rows![0].getData()).toEqual(['No filters selected'])
      })

      it('should show remove filter in action column', async () => {
        const filtersButton = await filterViewHarness.getFiltersButton()
        await filtersButton?.click()
        fixture.detectChanges()

        const dataTable = await filterViewHarness.getDataTable()
        let rows = await dataTable?.getRows()
        expect(rows?.length).toBe(4)
        const buttons = await rows![0].getAllActionButtons()
        expect(buttons.length).toBe(1)
        await buttons[0].click()

        rows = await dataTable?.getRows()
        expect(rows?.length).toBe(3)
        expect(component.filters.length).toBe(3)
      })
    })
  })

  describe('Grid view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataGrid: DataListGridHarness | null
    let gridItems: DefaultGridItemHarness[]

    let sortingDropdown: PDropdownHarness
    let sortingDropdownItems: ListItemHarness[]
    let dataListGridSortingButton: PButtonHarness

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)

      const gridLayoutSelectionButton = await dataLayoutSelection.getGridLayoutSelectionButton()
      await gridLayoutSelectionButton?.click()

      dataView = await loader.getHarness(DataViewHarness)
      dataGrid = await dataView?.getDataListGrid()
      sortingDropdown = await loader.getHarness(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
      sortingDropdownItems = await sortingDropdown.getDropdownItems()
      dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    })
    const expectedInitialGridItemsData = [
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'example', '2023-09-12T09:33:53Z'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 1', '2023-09-14T09:34:22Z'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 2', '2023-09-14T09:34:22Z'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z'],
    ]

    it('should load grid', async () => {
      expect(dataGrid).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('grid')
    })

    it('should get grid data', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedInitialGridItemsData)
    })

    it('should be sorted by first sorting dropdown item in ascending order', async () => {
      const expectedGridItemsDataAfterSorting = [
        ['./onecx-portal-lib/assets/images/placeholder.png', 'example', '2023-09-12T09:33:53Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 1', '2023-09-14T09:34:22Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 2', '2023-09-14T09:34:22Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z'],
        ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()

      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedGridItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item in descending order', async () => {
      const expectedGridItemsDataAfterSorting = [
        ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 2', '2023-09-14T09:34:22Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 1', '2023-09-14T09:34:22Z'],
        ['./onecx-portal-lib/assets/images/placeholder.png', 'example', '2023-09-12T09:33:53Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedGridItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item back to default order', async () => {
      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedInitialGridItemsData)
    })

    it('should get view actions menu button of first grid item and get event viewItem with first data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[0].selectItem()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get view actions menu button of third grid item and get event viewItem with third data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[0].selectItem()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get edit actions menu button first grid item and get event editItem with first data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[1].selectItem()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get edit actions menu button third grid item and get event editItem with third data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[1].selectItem()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get delete actions menu button first grid item and get event deleteItem with first data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[2].selectItem()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get delete actions menu button third grid item and get event deleteItem with third data grid item when clicked', async () => {
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[2].selectItem()

      expect(deleteItemEvent).toEqual(component.data[2])
    })
  })

  describe('List view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataList: DataListGridHarness | null
    let listItems: DefaultListItemHarness[]

    let sortingDropdown: PDropdownHarness
    let sortingDropdownItems: ListItemHarness[]
    let dataListGridSortingButton: PButtonHarness

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      const listLayoutSelectionButton = await dataLayoutSelection.getListLayoutSelectionButton()
      await listLayoutSelectionButton?.click()

      fixture.detectChanges()
      await fixture.whenStable()

      dataView = await loader.getHarness(DataViewHarness)
      dataList = await dataView?.getDataListGrid()
      sortingDropdown = await loader.getHarness(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
      sortingDropdownItems = await sortingDropdown.getDropdownItems()
      dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    })
    const expectedInitialListItemsData = [
      ['some name', '2023-09-13T09:34:05Z'],
      ['example', '2023-09-12T09:33:53Z'],
      ['name 1', '2023-09-14T09:34:22Z'],
      ['name 2', '2023-09-14T09:34:22Z'],
      ['name 3', '2023-09-14T09:34:22Z'],
    ]

    it('should load list', async () => {
      expect(dataList).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('list')
    })

    it('should get list data', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedInitialListItemsData)
    })

    it('should be sorted by first sorting dropdown item in ascending order', async () => {
      const expectedListItemsDataAfterSorting = [
        ['example', '2023-09-12T09:33:53Z'],
        ['name 1', '2023-09-14T09:34:22Z'],
        ['name 2', '2023-09-14T09:34:22Z'],
        ['name 3', '2023-09-14T09:34:22Z'],
        ['some name', '2023-09-13T09:34:05Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedListItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item in descending order', async () => {
      const expectedListItemsDataAfterSorting = [
        ['some name', '2023-09-13T09:34:05Z'],
        ['name 3', '2023-09-14T09:34:22Z'],
        ['name 2', '2023-09-14T09:34:22Z'],
        ['name 1', '2023-09-14T09:34:22Z'],
        ['example', '2023-09-12T09:33:53Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedListItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item back to default order', async () => {
      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedInitialListItemsData)
    })

    it('should get list item view button of first list item and get event viewItem with first data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const viewButton = await listItems[0].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event viewItem with third data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const viewButton = await listItems[2].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get list item view button of first list item and get event editItem with first data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const editButton = await listItems[0].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event editItem with third data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const editButton = await listItems[2].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get list item view button of first list item and get event deleteItem with first data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const deleteButton = await listItems[0].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event deleteItem with third data list item when clicked', async () => {
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const deleteButton = await listItems[2].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[2])
    })
  })

  describe('Data ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness

    let dataTable: DataTableHarness | null
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]
    let allFilterOptions: PMultiSelectListItemHarness[] | undefined

    let dataList: DataListGridHarness | null
    let listItems: DefaultListItemHarness[]
    let listLayoutSelectionButton: TestElement | null

    let dataGrid: DataListGridHarness | null
    let gridItems: DefaultGridItemHarness[]
    let gridLayoutSelectionButton: TestElement | null

    beforeEach(async () => {
      component.subtitleLineIds = ['startDate', 'testNumber']

      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      listLayoutSelectionButton = await dataLayoutSelection.getListLayoutSelectionButton()
      gridLayoutSelectionButton = await dataLayoutSelection.getGridLayoutSelectionButton()

      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView.getDataTable()
      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      tableRows = (await dataTable?.getRows()) ?? []

      allFilterOptions = undefined
    })
    const expectedSortedListItemsDataAscending = [
      ['some name', '2023-09-13T09:34:05Z', '1'],
      ['example', '2023-09-12T09:33:53Z', '3.141'],
      ['name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['name 1', '2023-09-14T09:34:22Z', '123456789'],
    ]
    const expectedSortedListItemsDataDescending = [
      ['name 1', '2023-09-14T09:34:22Z', '123456789'],
      ['name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['example', '2023-09-12T09:33:53Z', '3.141'],
      ['some name', '2023-09-13T09:34:05Z', '1'],
    ]
    const expectedSortedGridItemsDataAscending = [
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z', '1'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'example', '2023-09-12T09:33:53Z', '3.141'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
    ]
    const expectedSortedGridItemsDataDescending = [
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['./onecx-portal-lib/assets/images/placeholder.png', 'example', '2023-09-12T09:33:53Z', '3.141'],
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z', '1'],
    ]

    it('should remain sorted after switching data view from table view to grid view and to list view', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders?.[6].getSortButton()
      await sortButton?.click()

      await gridLayoutSelectionButton?.click()

      dataGrid = await dataView.getDataListGrid()
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedSortedGridItemsDataAscending)

      await listLayoutSelectionButton?.click()

      dataList = await dataView.getDataListGrid()
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataAscending)
    })

    it('should remain sorted after switching data view from table view to list view then sort again and switch to grid view', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ inputId: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = (await dataTable?.getHeaderColumns()) ?? []
      const sortButton = await tableHeaders?.[6].getSortButton()
      await sortButton?.click()

      await listLayoutSelectionButton?.click()

      dataList = await dataView.getDataListGrid()
      listItems = (await dataList?.getDefaultListItems()) ?? []
      let listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataAscending)

      const sortingDropdown = await loader.getHarness(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
      const dataListGridSortingButton = await loader.getHarness(
        PButtonHarness.with({ id: 'dataListGridSortingButton' })
      )

      expect(await (await sortingDropdown.host()).text()).toEqual('COLUMN_HEADER_NAME.TEST_NUMBER')
      await dataListGridSortingButton.click()

      listItems = (await dataList?.getDefaultListItems()) ?? []
      listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataDescending)

      await gridLayoutSelectionButton?.click()

      dataGrid = await dataView.getDataListGrid()
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedSortedGridItemsDataDescending)
    })

    it('should remain filtered with third filter option after switching view data view from table view to grid view and to list view', async () => {
      const expectedFilteredRowsData = [['name 1', '', 'status name 1', '']]
      const expectedFilteredListItemsData = [['name 1', '2023-09-14T09:34:22Z', '123456789']]
      const expectedFilteredGridItemsData = [
        ['./onecx-portal-lib/assets/images/placeholder.png', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
      ]
      const filterMultiSelect = await tableHeaders?.[0].getFilterMultiSelect()

      allFilterOptions = await filterMultiSelect?.getAllOptions()
      await allFilterOptions?.[2].click()

      tableRows = (await dataTable?.getRows()) ?? []
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedFilteredRowsData)

      await gridLayoutSelectionButton?.click()

      dataGrid = await dataView.getDataListGrid()
      gridItems = (await dataGrid?.getDefaultGridItems()) ?? []
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedFilteredGridItemsData)

      await listLayoutSelectionButton?.click()

      dataList = await dataView.getDataListGrid()
      listItems = (await dataList?.getDefaultListItems()) ?? []
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedFilteredListItemsData)
    })
  })
  describe('Dynamically disable/hide based on field path in interactive data view', () => {
    const setUpMockData = async (viewType: 'grid' | 'list' | 'table') => {
      const userService = TestBed.inject(UserService)
      userService.permissions$.next(['VIEW', 'EDIT', 'DELETE'])
      component.viewItem.subscribe(() => console.log())
      component.editItem.subscribe(() => console.log())
      component.deleteItem.subscribe(() => console.log())
      component.viewPermission = 'VIEW'
      component.editPermission = 'EDIT'
      component.deletePermission = 'DELETE'
      component.layout = viewType
      component.columns = [
        {
          columnType: ColumnType.STRING,
          id: 'name',
          nameKey: 'COLUMN_HEADER_NAME.NAME',
        },
        {
          columnType: ColumnType.STRING,
          id: 'ready',
          nameKey: 'Ready',
        },
      ]
      component.data = [
        {
          id: 'Test',
          imagePath:
            'https://images.unsplash.com/photo-1682686581427-7c80ab60e3f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          name: 'Card 1',
          ready: false,
        },
      ]
      component.titleLineId = 'name'

      fixture.detectChanges()
      await fixture.whenStable()
    }

    describe('Disable list action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionEnabledField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 1)).toBe(true)
      })
    })

    describe('Disable grid action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('grid')
        component.viewActionEnabledField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 1)).toBe(true)
      })
    })

    describe('Disable table action buttons based on field path', () => {
      it('should not disable any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should disable a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionEnabledField = 'ready'
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(1)).toBe(true)
      })
    })

    describe('Hide list action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('list')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 3)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('list')
        component.viewActionVisibleField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        expect(await dataView?.hasAmountOfActionButtons('list', 2)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('list', 0)).toBe(true)
      })
    })

    describe('Hide grid action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('grid')
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 3)).toBe(true)
        expect(await dataView?.hasAmountOfActionButtons('grid-hidden', 0)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('grid')
        component.viewActionVisibleField = 'ready'
        const dataView = await (await interactiveDataViewHarness.getDataView()).getDataListGrid()
        await (await dataView?.getMenuButton())?.click()
        expect(await dataView?.hasAmountOfActionButtons('grid', 2)).toBe(true)
        expect(await dataView?.hasAmountOfActionButtons('grid-hidden', 1)).toBe(true)
        expect(await dataView?.hasAmountOfDisabledActionButtons('grid', 0)).toBe(true)
      })
    })

    describe('Hide table action buttons based on field path', () => {
      it('should not hide any buttons initially', async () => {
        await setUpMockData('table')
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(3)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })

      it('should hide a button based on a given field path', async () => {
        await setUpMockData('table')
        component.viewActionVisibleField = 'ready'
        const dataTable = await (await interactiveDataViewHarness.getDataView()).getDataTable()
        expect(await dataTable?.hasAmountOfActionButtons(2)).toBe(true)
        expect(await dataTable?.hasAmountOfDisabledActionButtons(0)).toBe(true)
      })
    })
  })

  it('should react on group selection change event emit', () => {
    const columnsChangeSpy = jest.spyOn(component.displayedColumnsChange, 'emit')
    const columnKeysChangeSpy = jest.spyOn(component.displayedColumnKeysChange, 'emit')

    component.groupSelectionChangedSlotEmitter.emit({
      activeColumns: [
        {
          id: 'first-col',
        } as any,
        {
          id: 'second-col',
        } as any,
      ],
      groupKey: 'my-search-config',
    })

    expect(component.displayedColumnKeys).toStrictEqual(['first-col', 'second-col'])
    expect(component.selectedGroupKey).toBe('my-search-config')
    expect(columnsChangeSpy).toHaveBeenCalled()
    expect(columnKeysChangeSpy).toHaveBeenCalledWith(['first-col', 'second-col'])
  })
})
