import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { DataTableComponent, Row } from './data-table.component'
import { PrimeNgModule } from '../../primeng.module'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ColumnType } from '../../../model/column-type.model'
import { PortalCoreModule } from '../../portal-core.module'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { DataTableHarness, PTableCheckboxHarness } from '../../../../../testing'

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>
  let component: DataTableComponent
  let translateService: TranslateService
  let dataTable: DataTableHarness
  let unselectedCheckBoxes: PTableCheckboxHarness[]
  let selectedCheckBoxes: PTableCheckboxHarness[]

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
      ALL: 'All',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} von {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})',
      ALL: 'Alle',
    },
  }

  const TRANSLATIONS = {
    [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
    [GERMAN_LANGUAGE]: GERMAN_TRANSLATIONS,
  }

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
      declarations: [DataTableComponent],
      imports: [
        PrimeNgModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        PortalCoreModule,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataTableComponent)
    component = fixture.componentInstance
    component.rows = mockData
    component.columns = mockColumns
    component.paginator = true
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    fixture.detectChanges()
    dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
  })

  it('should create the data table component', () => {
    expect(component).toBeTruthy()
  })

  it('loads dataTableHarness', async () => {
    const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    expect(dataTable).toBeTruthy()
  })

  describe('should display the paginator currentPageReport -', () => {
    it('de', async () => {
      translateService.use('de')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5')
    })

    it('en', async () => {
      translateService.use('en')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5')
    })
  })

  describe('should display the paginator currentPageReport  with totalRecordsOnServer -', () => {
    it('de', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('de')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5 (10)')
    })

    it('en', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('en')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5 (10)')
    })
  })

  describe('should display the paginator rowsPerPageOptions -', () => {
    it('de', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      translateService.use('de')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
      const rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(3)
      expect(rowsPerPageOptionsText).toEqual('Alle')
    })

    it('en', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      translateService.use('en')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
      const rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(3)
      expect(rowsPerPageOptionsText).toEqual('All')
    })
  })

  describe('Table row selection', () => {
    it('should initially show a table without selection checkboxes', async () => {
      expect(dataTable).toBeTruthy()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(false)
    })

    it('should show a table with selection checkboxes if the parent binds to the event emitter', async () => {
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(false)
      component.selectionChanged.subscribe()
      expect(await dataTable.rowSelectionIsEnabled()).toEqual(true)
    })

    it('should pre-select rows given through selectedRows input', async () => {
      component.selectionChanged.subscribe()

      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
      component.selectedRows = mockData.slice(0, 2)

      unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
      selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
      expect(selectedCheckBoxes.length).toBe(2)
      expect(unselectedCheckBoxes.length).toBe(3)
    })
  })

  it('should emit all selected elements when checkbox is clicked', async () => {
    let selectionChangedEvent: Row[] | undefined

    component.selectionChanged.subscribe((event) => (selectionChangedEvent = event))
    unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
    selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
    expect(unselectedCheckBoxes.length).toBe(5)
    expect(selectedCheckBoxes.length).toBe(0)
    expect(selectionChangedEvent).toBeUndefined()

    const firstRowCheckBox = unselectedCheckBoxes[0]
    await firstRowCheckBox.checkBox()
    unselectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('unchecked')
    selectedCheckBoxes = await dataTable.getHarnessesForCheckboxes('checked')
    expect(unselectedCheckBoxes.length).toBe(4)
    expect(selectedCheckBoxes.length).toBe(1)
    expect(selectionChangedEvent).toEqual([mockData[0]])
  })

  it('should render an unpinnend action column on the right side of the table by default', async () => {
    component.viewTableRow.subscribe((event) => console.log(event))

    expect(component.frozenActionColumn).toBe(false)
    expect(component.actionColumnPosition).toBe('right')
    expect(await dataTable.getActionColumnHeader('left')).toBe(null)
    expect(await dataTable.getActionColumn('left')).toBe(null)

    const rightActionColumnHeader = await dataTable.getActionColumnHeader('right')
    const rightActionColumn = await dataTable.getActionColumn('right')
    expect(rightActionColumnHeader).toBeTruthy()
    expect(rightActionColumn).toBeTruthy()
    expect(await dataTable.columnIsFrozen(rightActionColumnHeader)).toBe(false)
    expect(await dataTable.columnIsFrozen(rightActionColumn)).toBe(false)
  })

  it('should render an pinned action column on the specified side of the table', async () => {
    component.viewTableRow.subscribe((event) => console.log(event))

    component.frozenActionColumn = true
    component.actionColumnPosition = 'left'

    expect(await dataTable.getActionColumnHeader('right')).toBe(null)
    expect(await dataTable.getActionColumn('right')).toBe(null)

    const leftActionColumnHeader = await dataTable.getActionColumnHeader('left')
    const leftActionColumn = await dataTable.getActionColumn('left')
    expect(leftActionColumnHeader).toBeTruthy()
    expect(leftActionColumn).toBeTruthy()
    expect(await dataTable.columnIsFrozen(leftActionColumnHeader)).toBe(true)
    expect(await dataTable.columnIsFrozen(leftActionColumn)).toBe(true)
  })
})
