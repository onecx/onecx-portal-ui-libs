import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InteractiveDataViewComponent } from './interactive-data-view.component'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { DataLayoutSelectionComponent } from '../data-layout-selection/data-layout-selection.component'
import { DataViewComponent, RowListGridData } from '../data-view/data-view.component'
import { ColumnGroupSelectionComponent } from '../column-group-selection/column-group-selection.component'
import { CustomGroupColumnSelectorComponent } from '../custom-group-column-selector/custom-group-column-selector.component'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { PickListModule } from 'primeng/picklist'
import { TranslateModule } from '@ngx-translate/core'
import { HarnessLoader, parallel, TestElement } from '@angular/cdk/testing'
import { PortalCoreModule } from '../../portal-core.module'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ColumnType } from '../../../model/column-type.model'
import { MFE_INFO } from '../../../api/injection-tokens'
import {
  DataViewHarness,
  ColumnGroupSelectionHarness,
  CustomGroupColumnSelectorHarness,
  DataLayoutSelectionHarness,
  PDropdownHarness,
  PButtonHarness,
  DataTableHarness,
  DataListGridHarness,
  TableHeaderColumnHarness,
  TableRowHarness,
  ListItemHarness,
  DefaultGridItemHarness,
  DefaultListItemHarness,
  PPicklistHarness,
  ButtonHarness,
  PMultiSelectListItemHarness,
} from '../../../../../testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { DateUtils } from '../../utils/dateutils'

describe('InteractiveDataViewComponent', () => {
  let component: InteractiveDataViewComponent
  let fixture: ComponentFixture<InteractiveDataViewComponent>
  let loader: HarnessLoader

  let viewItemEvent: RowListGridData | undefined
  let editItemEvent: RowListGridData | undefined
  let deleteItemEvent: RowListGridData | undefined

  let dateUtils: DateUtils

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
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InteractiveDataViewComponent,
        DataLayoutSelectionComponent,
        DataViewComponent,
        ColumnGroupSelectionComponent,
        CustomGroupColumnSelectorComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        ButtonModule,
        DialogModule,
        PickListModule,
        MockAuthModule,
        PortalCoreModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../../assets/i18n/en.json'),
          de: require('./../../../../../assets/i18n/de.json'),
        }),
      ],
      providers: [
        {
          provide: MFE_INFO,
          useValue: {
            baseHref: '/base/path',
            mountPath: '/base/path',
            remoteBaseUrl: 'http://localhost:4200',
            shellName: 'shell',
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(InteractiveDataViewComponent)
    component = fixture.componentInstance
    component.viewPermission = 'TEST_MGMT#TEST_View'
    component.editPermission = 'TEST_MGMT#TEST_EDIT'
    component.deletePermission = 'TEST_MGMT#TEST_DELETE'
    component.defaultGroupKey = 'PREDEFINED_GROUP.DEFAULT'
    component.viewItem.subscribe((event) => (viewItemEvent = event))
    component.editItem.subscribe((event) => (editItemEvent = event))
    component.deleteItem.subscribe((event) => (deleteItemEvent = event))
    component.subtitleLineIds = ['startDate']
    component.data = mockData
    component.columns = mockColumns

    fixture.detectChanges()

    loader = TestbedHarnessEnvironment.loader(fixture)

    dateUtils = TestBed.inject(DateUtils)

    viewItemEvent = undefined
    editItemEvent = undefined
    deleteItemEvent = undefined
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

  it('should load ColumnGroupSelectionDropdown', async () => {
    const columnGroupSelectionDropdown = await loader.getHarness(ColumnGroupSelectionHarness)
    expect(columnGroupSelectionDropdown).toBeTruthy()
  })

  it('should load CustomGroupColumnSelector', async () => {
    const customGroupColumnSelectorButton = await loader.getHarness(CustomGroupColumnSelectorHarness)
    expect(customGroupColumnSelectorButton).toBeTruthy()
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
    let dataTable: DataTableHarness
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]
    let allFilterOptions: PMultiSelectListItemHarness[] | undefined

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView.getDataTable()
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()

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

      tableRows = await dataTable.getRows()
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

      tableRows = await dataTable.getRows()
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

      tableRows = await dataTable.getRows()
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

      tableRows = await dataTable.getRows()
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

      tableRows = await dataTable.getRows()
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

      tableRows = await dataTable.getRows()
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

      tableRows = await dataTable.getRows()
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
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
        ],
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()
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
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
        ],
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = await dataTable.getHeaderColumns()
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()

      tableRows = await dataTable.getRows()
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
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
        ],
        [
          'some name',
          '',
          dateUtils.localizedDate('2023-09-13T09:34:05Z'),
          dateUtils.localizedDate('2023-09-14T09:34:09Z'),
          'some status',
          'someone responsible',
          '1',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = await dataTable.getHeaderColumns()
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()
      await sortButton.click()

      tableRows = await dataTable.getRows()
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
        ],
        [
          'example',
          'example description',
          dateUtils.localizedDate('2023-09-12T09:33:53Z'),
          dateUtils.localizedDate('2023-09-13T09:33:55Z'),
          'status example',
          '',
          '3.141',
        ],
        [
          'name 1',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 1',
          '',
          '123,456,789',
        ],
        [
          'name 2',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 2',
          '',
          '12,345.679',
        ],
        [
          'name 3',
          '',
          dateUtils.localizedDate('2023-09-14T09:34:22Z'),
          dateUtils.localizedDate('2023-09-15T09:34:24Z'),
          'status name 3',
          '',
          '7.1',
        ],
      ]

      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = await dataTable.getHeaderColumns()
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()
      await sortButton.click()
      await sortButton.click()

      tableRows = await dataTable.getRows()
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedRowsData)
    })
  })

  describe('Table view custom group column selector ', () => {
    let dataView: DataViewHarness
    let dataTable: DataTableHarness
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]

    let customGroupColumnSelector: CustomGroupColumnSelectorHarness
    let picklist: PPicklistHarness
    let activeColumnsList: ListItemHarness[]
    let inActiveColumnsList: ListItemHarness[]
    let sourceControlsButtons: ButtonHarness[]
    let transferControlsButtons: ButtonHarness[]
    let dialogSaveButton: PButtonHarness

    beforeEach(async () => {
      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView.getDataTable()
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()

      customGroupColumnSelector = await loader.getHarness(CustomGroupColumnSelectorHarness)
      await customGroupColumnSelector.openCustomGroupColumnSelectorDialog()

      picklist = await customGroupColumnSelector.getPicklist()
      activeColumnsList = await picklist.getSourceListItems()
      inActiveColumnsList = await picklist.getTargetListItems()
      sourceControlsButtons = await picklist.getSourceControlsButtons()
      transferControlsButtons = await picklist.getTransferControlsButtons()
      dialogSaveButton = await customGroupColumnSelector.getSaveButton()
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
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()
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
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()
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
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()
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
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()
      const headers = await parallel(() => tableHeaders.map((header) => header.getText()))
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(headers).toEqual(expectedHeaders)
      expect(rows).toEqual(expectedRowsData)
    })
  })

  describe('Grid view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataGrid: DataListGridHarness
    let gridItems: DefaultGridItemHarness[]

    let sortingDropdown: PDropdownHarness
    let sortingDropdownItems: ListItemHarness[]
    let dataListGridSortingButton: PButtonHarness

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)

      const gridLayoutSelectionButton = await dataLayoutSelection.getGridLayoutSelectionButton()
      await gridLayoutSelectionButton?.click()

      dataView = await loader.getHarness(DataViewHarness)
      dataGrid = await dataView.getDataListGrid()
      sortingDropdown = await loader.getHarness(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
      sortingDropdownItems = await sortingDropdown.getDropdownItems()
      dataListGridSortingButton = await loader.getHarness(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
    })
    const expectedInitialGridItemsData = [
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
      ['', 'example', '2023-09-12T09:33:53Z'],
      ['', 'name 1', '2023-09-14T09:34:22Z'],
      ['', 'name 2', '2023-09-14T09:34:22Z'],
      ['', 'name 3', '2023-09-14T09:34:22Z'],
    ]

    it('should load grid', async () => {
      expect(dataGrid).toBeTruthy()
      expect(await dataLayoutSelection.getCurrentLayout()).toEqual('grid')
    })

    it('should get grid data', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedInitialGridItemsData)
    })

    it('should be sorted by first sorting dropdown item in ascending order', async () => {
      const expectedGridItemsDataAfterSorting = [
        ['', 'example', '2023-09-12T09:33:53Z'],
        ['', 'name 1', '2023-09-14T09:34:22Z'],
        ['', 'name 2', '2023-09-14T09:34:22Z'],
        ['', 'name 3', '2023-09-14T09:34:22Z'],
        ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()

      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedGridItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item in descending order', async () => {
      const expectedGridItemsDataAfterSorting = [
        ['/path/to/image', 'some name', '2023-09-13T09:34:05Z'],
        ['', 'name 3', '2023-09-14T09:34:22Z'],
        ['', 'name 2', '2023-09-14T09:34:22Z'],
        ['', 'name 1', '2023-09-14T09:34:22Z'],
        ['', 'example', '2023-09-12T09:33:53Z'],
      ]

      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedGridItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item back to default order', async () => {
      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedInitialGridItemsData)
    })

    it('should get view actions menu button of first grid item and get event viewItem with first data grid item when clicked', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[0].selectItem()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get view actions menu button of third grid item and get event viewItem with third data grid item when clicked', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[0].selectItem()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get edit actions menu button first grid item and get event editItem with first data grid item when clicked', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[1].selectItem()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get edit actions menu button third grid item and get event editItem with third data grid item when clicked', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[1].selectItem()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get delete actions menu button first grid item and get event deleteItem with first data grid item when clicked', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemMoreActionsMenu = await gridItems[0].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[2].selectItem()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get delete actions menu button third grid item and get event deleteItem with third data grid item when clicked', async () => {
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemMoreActionsMenu = await gridItems[2].getMoreActionsButton()
      const moreActionsMenuItems = await gridItemMoreActionsMenu.getAllActionsMenuItems()
      await moreActionsMenuItems[2].selectItem()

      expect(deleteItemEvent).toEqual(component.data[2])
    })
  })

  describe('List view ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness
    let dataList: DataListGridHarness
    let listItems: DefaultListItemHarness[]

    let sortingDropdown: PDropdownHarness
    let sortingDropdownItems: ListItemHarness[]
    let dataListGridSortingButton: PButtonHarness

    beforeEach(async () => {
      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      const listLayoutSelectionButton = await dataLayoutSelection.getListLayoutSelectionButton()
      await listLayoutSelectionButton?.click()

      dataView = await loader.getHarness(DataViewHarness)
      dataList = await dataView.getDataListGrid()
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
      listItems = await dataList.getDefaultListItems()
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

      listItems = await dataList.getDefaultListItems()
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

      listItems = await dataList.getDefaultListItems()
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedListItemsDataAfterSorting)
    })

    it('should be sorted by first sorting dropdown item back to default order', async () => {
      await sortingDropdownItems[0].selectItem()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()
      await dataListGridSortingButton.click()

      listItems = await dataList.getDefaultListItems()
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedInitialListItemsData)
    })

    it('should get list item view button of first list item and get event viewItem with first data list item when clicked', async () => {
      listItems = await dataList.getDefaultListItems()
      const viewButton = await listItems[0].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event viewItem with third data list item when clicked', async () => {
      listItems = await dataList.getDefaultListItems()
      const viewButton = await listItems[2].getViewButton()
      await viewButton?.click()

      expect(viewItemEvent).toEqual(component.data[2])
    })

    it('should get list item view button of first list item and get event editItem with first data list item when clicked', async () => {
      listItems = await dataList.getDefaultListItems()
      const editButton = await listItems[0].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event editItem with third data list item when clicked', async () => {
      listItems = await dataList.getDefaultListItems()
      const editButton = await listItems[2].getEditButton()
      await editButton?.click()

      expect(editItemEvent).toEqual(component.data[2])
    })

    it('should get list item view button of first list item and get event deleteItem with first data list item when clicked', async () => {
      listItems = await dataList.getDefaultListItems()
      const deleteButton = await listItems[0].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[0])
    })

    it('should get list item view button of third list item and get event deleteItem with third data list item when clicked', async () => {
      listItems = await dataList.getDefaultListItems()
      const deleteButton = await listItems[2].getDeleteButton()
      await deleteButton?.click()

      expect(deleteItemEvent).toEqual(component.data[2])
    })
  })

  describe('Data ', () => {
    let dataLayoutSelection: DataLayoutSelectionHarness
    let dataView: DataViewHarness

    let dataTable: DataTableHarness
    let tableHeaders: TableHeaderColumnHarness[]
    let tableRows: TableRowHarness[]
    let allFilterOptions: PMultiSelectListItemHarness[] | undefined

    let dataList: DataListGridHarness
    let listItems: DefaultListItemHarness[]
    let listLayoutSelectionButton: TestElement | null

    let dataGrid: DataListGridHarness
    let gridItems: DefaultGridItemHarness[]
    let gridLayoutSelectionButton: TestElement | null

    beforeEach(async () => {
      component.subtitleLineIds = ['startDate', 'testNumber']

      dataLayoutSelection = await loader.getHarness(DataLayoutSelectionHarness)
      listLayoutSelectionButton = await dataLayoutSelection.getListLayoutSelectionButton()
      gridLayoutSelectionButton = await dataLayoutSelection.getGridLayoutSelectionButton()

      dataView = await loader.getHarness(DataViewHarness)
      dataTable = await dataView.getDataTable()
      tableHeaders = await dataTable.getHeaderColumns()
      tableRows = await dataTable.getRows()

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
      ['', 'example', '2023-09-12T09:33:53Z', '3.141'],
      ['', 'name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['', 'name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
    ]
    const expectedSortedGridItemsDataDescending = [
      ['', 'name 1', '2023-09-14T09:34:22Z', '123456789'],
      ['', 'name 2', '2023-09-14T09:34:22Z', '12345.6789'],
      ['', 'name 3', '2023-09-14T09:34:22Z', '7.1'],
      ['', 'example', '2023-09-12T09:33:53Z', '3.141'],
      ['/path/to/image', 'some name', '2023-09-13T09:34:05Z', '1'],
    ]

    it('should remain sorted after switching data view from table view to grid view and to list view', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = await dataTable.getHeaderColumns()
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()

      await gridLayoutSelectionButton?.click()

      dataGrid = await dataView.getDataListGrid()
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedSortedGridItemsDataAscending)

      await listLayoutSelectionButton?.click()

      dataList = await dataView.getDataListGrid()
      listItems = await dataList.getDefaultListItems()
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataAscending)
    })

    it('should remain sorted after switching data view from table view to list view then sort again and switch to grid view', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      const columnGroupSelectionDropdown = await loader.getHarness(
        PDropdownHarness.with({ id: 'columnGroupSelectionDropdown' })
      )
      const dropdownItems = await columnGroupSelectionDropdown.getDropdownItems()
      await dropdownItems[1].selectItem()

      tableHeaders = await dataTable.getHeaderColumns()
      const sortButton = await tableHeaders[6].getSortButton()
      await sortButton.click()

      await listLayoutSelectionButton?.click()

      dataList = await dataView.getDataListGrid()
      listItems = await dataList.getDefaultListItems()
      let listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataAscending)

      const sortingDropdown = await loader.getHarness(PDropdownHarness.with({ id: 'dataListGridSortingDropdown' }))
      const dataListGridSortingButton = await loader.getHarness(
        PButtonHarness.with({ id: 'dataListGridSortingButton' })
      )

      expect(await (await sortingDropdown.host()).text()).toEqual('COLUMN_HEADER_NAME.TEST_NUMBER')
      await dataListGridSortingButton.click()

      listItems = await dataList.getDefaultListItems()
      listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedSortedListItemsDataDescending)

      await gridLayoutSelectionButton?.click()

      dataGrid = await dataView.getDataListGrid()
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedSortedGridItemsDataDescending)
    })

    it('should remain filtered with third filter option after switching view data view from table view to grid view and to list view', async () => {
      const expectedFilteredRowsData = [['name 1', '', 'status name 1', '']]
      const expectedFilteredListItemsData = [['name 1', '2023-09-14T09:34:22Z', '123456789']]
      const expectedFilteredGridItemsData = [['', 'name 1', '2023-09-14T09:34:22Z', '123456789']]
      const filterMultiSelect = await tableHeaders[0].getFilterMultiSelect()
      allFilterOptions = await filterMultiSelect.getAllOptions()
      await allFilterOptions[2].click()

      tableRows = await dataTable.getRows()
      const rows = await parallel(() => tableRows.map((row) => row.getData()))

      expect(rows).toEqual(expectedFilteredRowsData)

      await gridLayoutSelectionButton?.click()

      dataGrid = await dataView.getDataListGrid()
      gridItems = await dataGrid.getDefaultGridItems()
      const gridItemsData = await parallel(() => gridItems.map((item) => item.getData()))

      expect(gridItemsData).toEqual(expectedFilteredGridItemsData)

      await listLayoutSelectionButton?.click()

      dataList = await dataView.getDataListGrid()
      listItems = await dataList.getDefaultListItems()
      const listItemsData = await parallel(() => listItems.map((item) => item.getData()))

      expect(listItemsData).toEqual(expectedFilteredListItemsData)
    })
  })
})
