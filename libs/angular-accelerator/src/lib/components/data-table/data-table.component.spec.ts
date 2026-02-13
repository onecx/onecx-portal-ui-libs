import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PTableCheckboxHarness } from '@onecx/angular-testing'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { DataTableComponent, Row } from './data-table.component'
import { ColumnType } from '../../model/column-type.model'
import { DataTableHarness } from '../../../../testing'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { LiveAnnouncer } from '@angular/cdk/a11y'

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
      SEARCH_RESULTS_FOUND: '{{results}} Results Found',
      NO_SEARCH_RESULTS_FOUND: 'No Results Found',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} von {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})',
      ALL: 'Alle',
      SEARCH_RESULTS_FOUND: '{{results}} Ergebnisse gefunden',
      NO_SEARCH_RESULTS_FOUND: 'Keine Ergebnisse gefunden',
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
      id: '734e21ba-14d7-4565-ba0d-ddd25f807931',
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
      id: '02220a5a-b556-4d7a-ac6e-6416911a00f2',
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
        AngularAcceleratorPrimeNgModule,
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        AngularAcceleratorModule,
      ],
      providers: [
        provideUserServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataTableComponent)
    component = fixture.componentInstance
    component.rows = mockData
    component.columns = mockColumns
    component.paginator = true
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    const userService = TestBed.inject(UserService)
    userService.permissions$.next(['VIEW', 'EDIT', 'DELETE'])
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
      fixture.componentRef.setInput('totalRecordsOnServer', 10)
      translateService.use('de')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5 (10)')
    })

    it('en', async () => {
      fixture.componentRef.setInput('totalRecordsOnServer', 10)
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
      fixture = TestBed.createComponent(DataTableComponent)
      component = fixture.componentInstance
      component.rows = mockData
      component.columns = mockColumns
      component.paginator = true
      fixture.detectChanges()
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
      let rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(0)
      expect(rowsPerPageOptionsText).toEqual('10')

      component.showAllOption = true
      rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(0)
      expect(rowsPerPageOptionsText).toEqual('Alle')
    })

    it('en', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      translateService.use('en')
      const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataTable.getPaginator()
      const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
      let rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(0)
      expect(rowsPerPageOptionsText).toEqual('10')

      component.showAllOption = true
      rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(0)
      expect(rowsPerPageOptionsText).toEqual('All')
    })
  })

  it('should display 10 rows by default for 1000 rows', async () => {
    component.rows = Array.from(Array(1000).keys()).map((number) => {
      return {
        id: number,
        name: number,
      }
    })
    component.columns = [
      {
        columnType: ColumnType.NUMBER,
        id: 'name',
        nameKey: 'COLUMN_HEADER_NAME.NAME',
      },
    ]
    component.paginator = true
    fixture.detectChanges()

    const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    const rows = await dataTable.getRows()
    expect(rows.length).toBe(10)
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

    it('should not change selection if selection disabled', async () => {
      let selectionChangedEvent: Row[] | undefined

      component.selectionEnabledField = 'selectionEnabled'

      component.rows = mockData.map((m) => ({
        ...m,
        selectionEnabled: false,
      }))

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
      expect(unselectedCheckBoxes.length).toBe(5)
      expect(selectedCheckBoxes.length).toBe(0)
    })
  })

  describe('Frozen action column', () => {
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

  const setUpActionButtonMockData = () => {
    component.columns = [
      ...mockColumns,
      {
        columnType: ColumnType.STRING,
        id: 'ready',
        nameKey: 'Ready',
      },
    ]

    component.rows = [
      {
        version: 0,
        creationDate: '2023-09-12T09:34:27.184086Z',
        creationUser: '',
        modificationDate: '2023-09-12T09:34:27.184086Z',
        modificationUser: '',
        id: 'bd7962b8-4887-420e-bb27-36978ebf10ab',
        name: 'name 3',
        description: '',
        status: 'status name 3',
        responsible: '',
        endDate: '2023-09-15T09:34:24Z',
        startDate: '2023-09-14T09:34:22Z',
        imagePath: '',
        testNumber: '7.1',
        ready: false,
      },
    ]
    component.viewTableRow.subscribe(() => console.log())
    component.editTableRow.subscribe(() => console.log())
    component.deleteTableRow.subscribe(() => console.log())
    component.viewPermission = 'VIEW'
    component.editPermission = 'EDIT'
    component.deletePermission = 'DELETE'
  }

  describe('Disable action buttons based on field path', () => {
    it('should not disable any action button by default', async () => {
      expect(component.viewTableRowObserved).toBe(false)
      expect(component.editTableRowObserved).toBe(false)
      expect(component.deleteTableRowObserved).toBe(false)

      setUpActionButtonMockData()

      expect(component.viewTableRowObserved).toBe(true)
      expect(component.editTableRowObserved).toBe(true)
      expect(component.deleteTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of tableActions) {
        expect(await action.matchesSelector('.p-button:disabled')).toBe(false)
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically enable/disable an action button based on the contents of a specified column', async () => {
      setUpActionButtonMockData()
      component.viewActionEnabledField = 'ready'

      let tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        const isDisabled = await dataTable.actionButtonIsDisabled(action)
        if (icon === 'pi pi-eye') {
          expect(isDisabled).toBe(true)
        } else {
          expect(isDisabled).toBe(false)
        }
      }

      const tempRows = [...component.rows]

      tempRows[0]['ready'] = true

      component.rows = [...tempRows]

      tableActions = await dataTable.getActionButtons()

      for (const action of tableActions) {
        expect(await dataTable.actionButtonIsDisabled(action)).toBe(false)
      }
    })
  })

  describe('Hide action buttons based on field path', () => {
    it('should not hide any action button by default', async () => {
      expect(component.viewTableRowObserved).toBe(false)
      expect(component.editTableRowObserved).toBe(false)
      expect(component.deleteTableRowObserved).toBe(false)

      setUpActionButtonMockData()

      expect(component.viewTableRowObserved).toBe(true)
      expect(component.editTableRowObserved).toBe(true)
      expect(component.deleteTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically hide/show an action button based on the contents of a specified column', async () => {
      setUpActionButtonMockData()
      component.viewActionVisibleField = 'ready'

      let tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(2)

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        expect(icon === 'pi pi-eye').toBe(false)
      }

      const tempRows = [...component.rows]

      tempRows[0]['ready'] = true

      component.rows = [...tempRows]

      tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of tableActions) {
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })
  })

  describe('Assign ids to action buttons', () => {
    beforeEach(() => {
      component.rows = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:27.184086Z',
          creationUser: '',
          modificationDate: '2023-09-12T09:34:27.184086Z',
          modificationUser: '',
          id: 'rowId',
          name: 'name 3',
          description: '',
          status: 'status name 3',
          responsible: '',
          endDate: '2023-09-15T09:34:24Z',
          startDate: '2023-09-14T09:34:22Z',
          imagePath: '',
          testNumber: '7.1',
          ready: false,
        },
      ]
    })

    it('should assign id to view button', async () => {
      component.viewTableRow.subscribe(() => console.log())
      component.viewPermission = 'VIEW'
      expect(component.viewTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
    })

    it('should assign id to edit button', async () => {
      component.editTableRow.subscribe(() => console.log())
      component.editPermission = 'EDIT'
      expect(component.editTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-editButton')
    })

    it('should assign id to delete button', async () => {
      component.deleteTableRow.subscribe(() => console.log())
      component.deletePermission = 'DELETE'
      expect(component.deleteTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-deleteButton')
    })

    it('should assign id to additional action button', async () => {
      component.additionalActions = [
        {
          permission: 'VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
      ]

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')
    })
  })

  describe('permissions for action buttons', () => {
    let userService: UserService
    beforeEach(() => {
      component.rows = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:27.184086Z',
          creationUser: '',
          modificationDate: '2023-09-12T09:34:27.184086Z',
          modificationUser: '',
          id: 'rowId',
          name: 'name 3',
          description: '',
          status: 'status name 3',
          responsible: '',
          endDate: '2023-09-15T09:34:24Z',
          startDate: '2023-09-14T09:34:22Z',
          imagePath: '',
          testNumber: '7.1',
          ready: false,
        },
      ]

      // Show actions
      component.viewTableRow.subscribe(() => console.log())
      component.editTableRow.subscribe(() => console.log())
      component.deleteTableRow.subscribe(() => console.log())
      component.viewPermission = 'TABLE#VIEW'
      component.editPermission = 'TABLE#EDIT'
      component.deletePermission = 'TABLE#DELETE'
      component.additionalActions = []

      userService = TestBed.inject(UserService)
    })

    it('should show view, delete and edit action buttons when user has VIEW, EDIT and DELETE permissions', async () => {
      userService.permissions$.next(['TABLE#VIEW', 'TABLE#EDIT', 'TABLE#DELETE'])

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
      expect(await tableActions[1].getAttribute('id')).toEqual('rowId-editButton')
      expect(await tableActions[2].getAttribute('id')).toEqual('rowId-deleteButton')

      userService.permissions$.next([])

      const newTableActions = await dataTable.getActionButtons()
      expect(newTableActions.length).toBe(0)
    })

    it('should show custom inline actions if user has permission', async () => {
      userService.permissions$.next(['ADDITIONAL#VIEW'])

      component.additionalActions = [
        {
          permission: 'ADDITIONAL#VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
      ]

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')

      userService.permissions$.next([])

      const newTableActions = await dataTable.getActionButtons()
      expect(newTableActions.length).toBe(0)
    })

    it('should show overflow menu when user has permission for at least one action', async () => {
      userService.permissions$.next(['OVERFLOW#VIEW'])

      component.additionalActions = [
        {
          permission: 'OVERFLOW#VIEW',
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
          labelKey: 'Label',
          showAsOverflow: true,
        },
      ]

      await (await dataTable.getOverflowActionMenuButton())?.click()
      const overflowMenu = await dataTable.getOverflowMenu()
      expect(overflowMenu).toBeTruthy()

      const menuItems = await overflowMenu!.getAllMenuItems()
      expect(menuItems!.length).toBe(1)
      const menuItemText = await menuItems![0].getText()
      expect(menuItemText).toBe('Label')

      userService.permissions$.next([])
      const newMenuItems = await overflowMenu!.getAllMenuItems()
      expect(newMenuItems!.length).toBe(0)
    })

    it('should display action buttons based on multiple permissions', async () => {
      userService.permissions$.next(['ADDITIONAL#VIEW1', 'ADDITIONAL#VIEW2', 'OVERFLOW#VIEW', 'OVERFLOW#VIEW2'])

      component.additionalActions = [
        {
          permission: ['ADDITIONAL#VIEW1', 'ADDITIONAL#VIEW2'],
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
        },
        {
          permission: ['OVERFLOW#VIEW', 'OVERFLOW#VIEW2'],
          callback: () => {
            console.log('custom action clicked')
          },
          id: 'actionId',
          labelKey: 'Label',
          showAsOverflow: true,
        },
      ]

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')

      await (await dataTable.getOverflowActionMenuButton())?.click()
      const overflowMenu = await dataTable.getOverflowMenu()
      expect(overflowMenu).toBeTruthy()

      const menuItems = await overflowMenu!.getAllMenuItems()
      expect(menuItems!.length).toBe(1)
      const menuItemText = await menuItems![0].getText()
      expect(menuItemText).toBe('Label')
    })
  })

  describe('LiveAnnouncer announcements', () => {
    let liveAnnouncer: LiveAnnouncer;
    let announceSpy: jest.SpyInstance;

    beforeEach(() => {
      liveAnnouncer = TestBed.inject(LiveAnnouncer);
      announceSpy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('should announce "results found" when data has entries', () => {
      it('de', async () => {
        translateService.use('de');

        component.rows = mockData;
        fixture.detectChanges();

        await fixture.whenStable();

        expect(announceSpy).toHaveBeenCalledTimes(1);
        expect(announceSpy).toHaveBeenCalledWith('5 Ergebnisse gefunden');
      });

      it('en', async () => {
        translateService.use('en');

        component.rows = mockData;
        fixture.detectChanges();

        await fixture.whenStable();

        expect(announceSpy).toHaveBeenCalledTimes(1);
        expect(announceSpy).toHaveBeenCalledWith('5 Results Found');
      });
    });

    describe('should announce "no results found" when data is empty', () => {
      it('de', async () => {
        translateService.use('de');

        component.rows = [];
        fixture.detectChanges();

        await fixture.whenStable();

        expect(announceSpy).toHaveBeenCalledTimes(1);
        expect(announceSpy).toHaveBeenCalledWith('Keine Ergebnisse gefunden');
      });

      it('en', async () => {
        translateService.use('en');

        component.rows = [];
        fixture.detectChanges();

        await fixture.whenStable();

        expect(announceSpy).toHaveBeenCalledTimes(1);
        expect(announceSpy).toHaveBeenCalledWith('No Results Found');
      });
    });

    describe('should announce "results found" when data changes', () => {
      it('de', async () => {
        translateService.use('de');

        component.rows = mockData;
        fixture.detectChanges();
        await fixture.whenStable();

        component.rows = mockData.slice(0, 2);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(announceSpy).toHaveBeenCalledTimes(2);
        expect(announceSpy).toHaveBeenNthCalledWith(1, '5 Ergebnisse gefunden');
        expect(announceSpy).toHaveBeenNthCalledWith(2, '2 Ergebnisse gefunden');
      });

      it('en', async () => {
        translateService.use('en');

        component.rows = mockData;
        fixture.detectChanges();
        await fixture.whenStable();

        component.rows = mockData.slice(0, 2);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(announceSpy).toHaveBeenCalledTimes(2);
        expect(announceSpy).toHaveBeenNthCalledWith(1, '5 Results Found');
        expect(announceSpy).toHaveBeenNthCalledWith(2, '2 Results Found');
      });
    });
  });


  describe('rows & filters setter (resetPage)', () => {
    it('should call resetPage when rows length decreases', () => {
      const resetSpy = jest.spyOn(component, 'resetPage')
      const pageSpy = jest.spyOn(component.pageChanged, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
      component.page = 2

      component.rows = mockData.slice(0, 3)

      expect(resetSpy).toHaveBeenCalled()
      expect(component.page).toBe(0)
      expect(pageSpy).toHaveBeenCalledWith(0)
      expect(stateSpy).toHaveBeenCalled()
    })

    it('should not call resetPage when rows length increases', () => {
      const resetSpy = jest.spyOn(component, 'resetPage')
      const pageSpy = jest.spyOn(component.pageChanged, 'emit')
      component.page = 2

      component.rows = Array.from({ length: 10 }).map((_, i) => ({ id: i, name: i } as any))

      expect(resetSpy).not.toHaveBeenCalled()
      expect(component.page).toBe(2)
      expect(pageSpy).not.toHaveBeenCalled()
    })

    it('should resetPage when filters length changes', () => {
      const resetSpy = jest.spyOn(component, 'resetPage')
      component.page = 4
      component.filters = [
        { columnId: 'a', value: 1 },
        { columnId: 'b', value: 2 },
      ] as any
      resetSpy.mockClear()

      component.filters = [{ columnId: 'a', value: 1 }] as any

      component.page = 2

      component.filters = [
        { columnId: 'a', value: 1 },
        { columnId: 'b', value: 2 },
        { columnId: 'c', value: 3 },
      ] as any

      expect(resetSpy).toHaveBeenCalledTimes(2)
      expect(component.page).toBe(0)
    })
  })
  describe('DataTableComponent rowTrackByFunction & selection behaviour', () => {
    it('should return item id', () => {
      const item = { id: 'abc-123' } as Row
      const callRowTrackBy = (c: DataTableComponent, i: any) =>
        (c.rowTrackByFunction as any).length >= 2 ? (c.rowTrackByFunction as any)(0, i) : (c.rowTrackByFunction as any)(i)

      const result = callRowTrackBy(component, item)

      expect(result).toBe(item.id)
    })

    it('should render preselected rows correctly across pages ', async () => {
      component.selectionChanged.subscribe()

      component.pageSizes = [2]
      component.pageSize = 2
      fixture.detectChanges()

      const page2Rows = mockData.slice(2, 4)
      component.selectedRows = page2Rows

      let unchecked = await dataTable.getHarnessesForCheckboxes('unchecked')
      let checked = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unchecked.length).toBe(2)
      expect(checked.length).toBe(0)

      component.onPageChange({ first: 2, rows: 2 })
      fixture.detectChanges()

      unchecked = await dataTable.getHarnessesForCheckboxes('unchecked')
      checked = await dataTable.getHarnessesForCheckboxes('checked')
      expect(unchecked.length).toBe(0)
      expect(checked.length).toBe(2)
    })
  })

})
