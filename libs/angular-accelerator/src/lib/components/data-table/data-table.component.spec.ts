import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateService } from '@ngx-translate/core'
import { provideUserServiceMock, UserServiceMock } from '@onecx/angular-integration-interface/mocks'
import { PTableCheckboxHarness } from '@onecx/angular-testing'
import { DataTableHarness, provideTranslateTestingService } from '../../../../testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DataTableComponent, Row } from './data-table.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { QueryList } from '@angular/core'
import { PrimeTemplate } from 'primeng/api'
import { firstValueFrom } from 'rxjs'

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
      imports: [AngularAcceleratorPrimeNgModule, BrowserAnimationsModule, AngularAcceleratorModule],
      providers: [
        provideTranslateTestingService(TRANSLATIONS),
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
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
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

  it('should display the paginator rowsPerPageOptions', async () => {
    const dataTable = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    const paginator = await dataTable.getPaginator()
    const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
    const rowsPerPageOptionsText = await rowsPerPageOptions.selectedSelectItemText(0)
    expect(rowsPerPageOptionsText).toEqual('10')
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

    it('should render a pinned action column on the specified side of the table', async () => {
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

  const setUpActionButtonMockData = async () => {
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

    fixture.detectChanges()
    await fixture.whenStable()
  }

  describe('Disable action buttons based on field path', () => {
    it('should not disable any action button by default', async () => {
      expect(component.viewTableRowObserved).toBe(false)
      expect(component.editTableRowObserved).toBe(false)
      expect(component.deleteTableRowObserved).toBe(false)

      await setUpActionButtonMockData()

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
      await setUpActionButtonMockData()
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

      await setUpActionButtonMockData()

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
      await setUpActionButtonMockData()
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

      fixture.detectChanges()
      await fixture.whenStable()

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
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.viewTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
    })

    it('should assign id to edit button', async () => {
      component.editTableRow.subscribe(() => console.log())
      component.editPermission = 'EDIT'
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.editTableRowObserved).toBe(true)

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-editButton')
    })

    it('should assign id to delete button', async () => {
      component.deleteTableRow.subscribe(() => console.log())
      component.deletePermission = 'DELETE'
      fixture.detectChanges()
      await fixture.whenStable()

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
      fixture.detectChanges()
      await fixture.whenStable()

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')
    })
  })

  describe('permissions for action buttons', () => {
    let userService: UserServiceMock
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

      userService = TestBed.inject(UserService) as unknown as UserServiceMock
    })

    it('should show view, delete and edit action buttons when user has VIEW, EDIT and DELETE permissions', async () => {
      userService.permissionsTopic$.publish(['TABLE#VIEW', 'TABLE#EDIT', 'TABLE#DELETE'])

      const tableActions = await dataTable.getActionButtons()
      expect(tableActions.length).toBe(3)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
      expect(await tableActions[1].getAttribute('id')).toEqual('rowId-editButton')
      expect(await tableActions[2].getAttribute('id')).toEqual('rowId-deleteButton')

      userService.permissionsTopic$.publish([])

      const newTableActions = await dataTable.getActionButtons()
      expect(newTableActions.length).toBe(0)
    })

    it('should show custom inline actions if user has permission', async () => {
      userService.permissionsTopic$.publish(['ADDITIONAL#VIEW'])

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

      userService.permissionsTopic$.publish([])

      const newTableActions = await dataTable.getActionButtons()
      expect(newTableActions.length).toBe(0)
    })

    it('should show overflow menu when user has permission for at least one action', async () => {
      userService.permissionsTopic$.publish(['OVERFLOW#VIEW'])

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

      userService.permissionsTopic$.publish([])
      const newMenuItems = await overflowMenu!.getAllMenuItems()
      expect(newMenuItems!.length).toBe(0)
    })

    it('should display action buttons based on multiple permissions', async () => {
      userService.permissionsTopic$.publish(['ADDITIONAL#VIEW1', 'ADDITIONAL#VIEW2', 'OVERFLOW#VIEW', 'OVERFLOW#VIEW2'])

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
    let liveAnnouncer: LiveAnnouncer
    let announceSpy: jest.SpyInstance

    beforeEach(() => {
      liveAnnouncer = TestBed.inject(LiveAnnouncer)
      announceSpy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('should announce "results found" when data has entries', () => {
      it('de', async () => {
        translateService.use('de')

        component.rows = mockData
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('5 Ergebnisse gefunden')
      })

      it('en', async () => {
        translateService.use('en')

        component.rows = mockData
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('5 Results Found')
      })
    })

    describe('should announce "no results found" when data is empty', () => {
      it('de', async () => {
        translateService.use('de')

        component.rows = []
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('Keine Ergebnisse gefunden')
      })

      it('en', async () => {
        translateService.use('en')

        component.rows = []
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('No Results Found')
      })
    })

    describe('should announce "results found" when data changes', () => {
      it('de', async () => {
        translateService.use('de')

        component.rows = mockData
        fixture.detectChanges()
        await fixture.whenStable()

        component.rows = mockData.slice(0, 2)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(2)
        expect(announceSpy).toHaveBeenNthCalledWith(1, '5 Ergebnisse gefunden')
        expect(announceSpy).toHaveBeenNthCalledWith(2, '2 Ergebnisse gefunden')
      })

      it('en', async () => {
        translateService.use('en')

        component.rows = mockData
        fixture.detectChanges()
        await fixture.whenStable()

        component.rows = mockData.slice(0, 2)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(2)
        expect(announceSpy).toHaveBeenNthCalledWith(1, '5 Results Found')
        expect(announceSpy).toHaveBeenNthCalledWith(2, '2 Results Found')
      })
    })
  })

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

      component.rows = Array.from({ length: 10 }).map((_, i) => ({ id: i, name: i }) as any)

      expect(resetSpy).not.toHaveBeenCalled()
      expect(component.page).toBe(2)
      expect(pageSpy).not.toHaveBeenCalled()
    })

    it('should resetPage on every filters assignment', () => {
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

    it('should update BehaviorSubject before resetPage so emitted state contains current filters', () => {
      const initialFilters = [
        { columnId: 'name', value: 'a' },
        { columnId: 'description', value: 'b' },
      ] as any
      component.filters = initialFilters

      const newFilters = [{ columnId: 'name', value: 'a' }] as any
      const emittedStates: any[] = []
      component.componentStateChanged.subscribe((state: any) => emittedStates.push(state))

      component.filters = newFilters

      const statesWithFilters = emittedStates.filter((s) => s.filters)
      statesWithFilters.forEach((state) => {
        expect(state.filters).toEqual(newFilters)
      })
    })

    it('should update BehaviorSubject before resetPage so emitted state contains current rows', () => {
      component.rows = mockData
      const reducedRows = mockData.slice(0, 2)

      const emittedStates: any[] = []
      component.componentStateChanged.subscribe((state: any) => emittedStates.push(state))

      component.rows = reducedRows

      const statesWithRows = emittedStates.filter((s) => s.selectedRows !== undefined)
      statesWithRows.forEach((state) => {
        expect(state.selectedRows).toBeDefined()
      })
    })
  })

  describe('onMultiselectFilterChange', () => {
    it('should call resetPage via filters setter when clientSideFiltering is true', () => {
      component.clientSideFiltering = true
      const resetSpy = jest.spyOn(component, 'resetPage')
      component.page = 3

      component.onMultiselectFilterChange({ id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' } as any, {
        value: ['a', 'b'],
      })

      expect(resetSpy).toHaveBeenCalled()
      expect(component.page).toBe(0)
      expect(component.filters.length).toBe(2)
    })

    it('should call resetPage directly when clientSideFiltering is false', () => {
      component.clientSideFiltering = false
      const resetSpy = jest.spyOn(component, 'resetPage')
      component.page = 3

      component.onMultiselectFilterChange({ id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' } as any, {
        value: ['a', 'b'],
      })

      expect(resetSpy).toHaveBeenCalled()
      expect(component.page).toBe(0)
    })

    it('should emit filtered event with correct filters', () => {
      component.clientSideFiltering = true
      const filteredSpy = jest.spyOn(component.filtered, 'emit')

      component.onMultiselectFilterChange({ id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' } as any, {
        value: ['test1', 'test2'],
      })

      expect(filteredSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ columnId: 'name', value: 'test1' }),
          expect.objectContaining({ columnId: 'name', value: 'test2' }),
        ])
      )
    })

    it('should emit componentStateChanged with correct filters', () => {
      component.clientSideFiltering = true
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.onMultiselectFilterChange({ id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' } as any, {
        value: ['test1'],
      })

      expect(stateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.arrayContaining([expect.objectContaining({ columnId: 'name', value: 'test1' })]),
        })
      )
    })

    it('should not update internal filters when clientSideFiltering is false', () => {
      component.clientSideFiltering = false
      component.filters = []

      component.onMultiselectFilterChange({ id: 'name', columnType: ColumnType.STRING, nameKey: 'NAME' } as any, {
        value: ['test1'],
      })

      expect(component.filters).toEqual([])
    })
  })

  describe('Row expansion', () => {
    const row1 = mockData[0]
    const row2 = mockData[1]

    describe('expandedRows setter', () => {
      it('should set expandedRowIds$ and expandedRowKeys from Row objects', () => {
        component.expandedRows = [row1, row2]

        expect(component.expandedRowIds$.getValue()).toEqual([row1.id, row2.id])
        expect(component.expandedRowKeys).toEqual({ [row1.id]: true, [row2.id]: true })
      })

      it('should set expandedRowIds$ and expandedRowKeys from string ids', () => {
        component.expandedRows = [row1.id, row2.id]

        expect(component.expandedRowIds$.getValue()).toEqual([row1.id, row2.id])
        expect(component.expandedRowKeys).toEqual({ [row1.id]: true, [row2.id]: true })
      })

      it('should overwrite previously expanded rows', () => {
        component.expandedRows = [row1]

        expect(component.expandedRowIds$.getValue()).toEqual([row1.id])
        expect(component.expandedRowKeys).toEqual({ [row1.id]: true })

        component.expandedRows = [row2]

        expect(component.expandedRowIds$.getValue()).toEqual([row2.id])
        expect(component.expandedRowKeys).toEqual({ [row2.id]: true })
      })

      it('should clear expandedRowIds$ and expandedRowKeys when empty array is passed', () => {
        component.expandedRows = [row1]
        component.expandedRows = []

        expect(component.expandedRowIds$.getValue()).toEqual([])
        expect(component.expandedRowKeys).toEqual({})
      })

      it('should treat null as an empty array and clear expanded state', () => {
        component.expandedRows = [row1]
        component.expandedRows = null as any

        expect(component.expandedRowIds$.getValue()).toEqual([])
        expect(component.expandedRowKeys).toEqual({})
      })

      it('should treat undefined as an empty array and clear expanded state', () => {
        component.expandedRows = [row1]
        component.expandedRows = undefined as any

        expect(component.expandedRowIds$.getValue()).toEqual([])
        expect(component.expandedRowKeys).toEqual({})
      })

      it('should filter out null entries inside the array', () => {
        component.expandedRows = [row1, null as any, row2]

        expect(component.expandedRowIds$.getValue()).toEqual([row1.id, row2.id])
        expect(component.expandedRowKeys).toEqual({ [row1.id]: true, [row2.id]: true })
      })

      it('should filter out undefined entries inside the array', () => {
        component.expandedRows = [row1, undefined as any, row2]

        expect(component.expandedRowIds$.getValue()).toEqual([row1.id, row2.id])
        expect(component.expandedRowKeys).toEqual({ [row1.id]: true, [row2.id]: true })
      })
    })

    describe('isRowExpanded', () => {
      it('should return true when row is expanded', () => {
        component.expandedRows = [row1]

        expect(component.isRowExpanded(row1)).toBe(true)
      })

      it('should return false when row is not expanded', () => {
        component.expandedRows = [row1]

        expect(component.isRowExpanded(row2)).toBe(false)
      })

      it('should return false when no rows are expanded', () => {
        component.expandedRows = []

        expect(component.isRowExpanded(row1)).toBe(false)
      })
    })

    describe('onRowExpand', () => {
      it('should add row id to expandedRowIds$ if not already present', () => {
        component.expandedRows = []
        component.onRowExpand({ data: row1 })

        expect(component.expandedRowIds$.getValue()).toContain(row1.id)
      })

      it('should not add duplicate row id to expandedRowIds$', () => {
        component.expandedRows = [row1]
        component.onRowExpand({ data: row1 })

        const ids = component.expandedRowIds$.getValue()
        const matchingIds = ids.filter((id) => id === row1.id)
        expect(matchingIds.length).toBe(1)
      })

      it('should emit rowExpanded with the row data', () => {
        const spy = jest.spyOn(component.rowExpanded, 'emit')

        component.onRowExpand({ data: row1 })

        expect(spy).toHaveBeenCalledWith(row1)
      })

      it('should emit componentStateChanged', () => {
        const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
        component.onRowExpand({ data: row1 })

        expect(stateSpy).toHaveBeenCalled()
      })
    })

    describe('onRowCollapse', () => {
      beforeEach(() => {
        component.expandedRows = [row1, row2]
      })

      it('should remove row id from expandedRowIds$', () => {
        component.onRowCollapse({ data: row1 })

        expect(component.expandedRowIds$.getValue()).not.toContain(row1.id)
        expect(component.expandedRowIds$.getValue()).toContain(row2.id)
      })

      it('should emit rowCollapsed with the row data', () => {
        const spy = jest.spyOn(component.rowCollapsed, 'emit')

        component.onRowCollapse({ data: row1 })

        expect(spy).toHaveBeenCalledWith(row1)
      })

      it('should emit componentStateChanged', () => {
        const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')
        component.onRowCollapse({ data: row1 })

        expect(stateSpy).toHaveBeenCalled()
      })
    })

    describe('toggleRowExpansion', () => {
      it('should expand a collapsed row', () => {
        component.expandedRows = []
        component.toggleRowExpansion(row1)

        const expanded = component.isRowExpanded(row1)
        const expandedRowKey = component.expandedRowKeys[row1.id]

        expect(expanded).toBe(true)
        expect(expandedRowKey).toBe(true)
      })

      it('should collapse an expanded row', () => {
        component.expandedRows = [row1]
        component.toggleRowExpansion(row1)

        const expanded = component.isRowExpanded(row1)
        const expandedRowKey = component.expandedRowKeys[row1.id]

        expect(expanded).toBe(false)
        expect(expandedRowKey).toBeUndefined()
      })
    })

    describe('allTemplates$ observable', () => {
      it('should emit empty array when all template sources are undefined', async () => {
        component.templates$.next(undefined)
        component.viewTemplates$.next(undefined)
        component.parentTemplates$.next(undefined)

        if (component.allTemplates$) {
          const result = await firstValueFrom(component.allTemplates$)

          expect(result).toEqual([])
        }
      })

      it('should combine templates from content, view and parent sources', async () => {
        const contentTemplate = { getType: () => 'stringCell' }
        const viewTemplate = { getType: () => 'numberCell' }
        const parentTemplate = { getType: () => 'dateCell' }

        component.templates$.next(createQueryList([contentTemplate]))
        component.viewTemplates$.next(createQueryList([viewTemplate]))
        component.parentTemplates$.next(createQueryList([parentTemplate]))

        if (component.allTemplates$) {
          const result = await firstValueFrom(component.allTemplates$)
          const resultTypes = result.map((t) => t.getType())

          expect(result).toHaveLength(3)
          expect(resultTypes).toContain('stringCell')
          expect(resultTypes).toContain('numberCell')
          expect(resultTypes).toContain('dateCell')
        }
      })

      it('should deduplicate templates with the same type, keeping the first occurrence', async () => {
        const firstTemplate = { getType: () => 'expansion' }
        const secondTemplate = { getType: () => 'expansion' }

        component.templates$.next(createQueryList([firstTemplate, secondTemplate]))
        component.viewTemplates$.next(undefined)
        component.parentTemplates$.next(null)
        if (component.allTemplates$) {
          const result = await firstValueFrom(component.allTemplates$)

          expect(result).toHaveLength(1)
          expect(result[0]).toBe(firstTemplate)
        }
      })

      it('should prefer content templates over view templates when types clash', async () => {
        const contentTemplate = { getType: () => 'expansion' }
        const viewTemplate = { getType: () => 'expansion' }

        component.templates$.next(createQueryList([contentTemplate]))
        component.viewTemplates$.next(createQueryList([viewTemplate]))
        component.parentTemplates$.next(null)

        if (component.allTemplates$) {
          const result = await firstValueFrom(component.allTemplates$)

          expect(result).toHaveLength(1)
          expect(result[0]).toBe(contentTemplate)
        }
      })
    })

    describe('expansionTemplate$ observable', () => {
      it('should find and return the expansion template from combined templates', async () => {
        const expansionTemplate = { getType: () => 'expansion' }
        const otherTemplate = { getType: () => 'stringCell' }

        component.templates$.next(createQueryList([expansionTemplate, otherTemplate]))
        component.viewTemplates$.next(undefined)
        component.parentTemplates$.next(null)

        if (component.expansionTemplate$) {
          const result = await firstValueFrom(component.expansionTemplate$)

          expect(result).toBe(expansionTemplate)
        }
      })
    })
  })

  describe('actionColumnVisible', () => {
    it('should return false when no row actions are observed and no additional actions are set', () => {
      expect(component.actionColumnVisible).toBe(false)
    })

    it('should return true when any row action is observed', () => {
      jest.spyOn(component, 'anyRowActionObserved', 'get').mockReturnValue(true)
      expect(component.actionColumnVisible).toBe(true)
    })

    it('should return true when additionalActions is non-empty', () => {
      component.additionalActions = [
        {
          permission: 'VIEW',
          callback: () => {
            // empty callback for testing
          },
        },
      ]
      expect(component.actionColumnVisible).toBe(true)
    })

    it('should return false when additionalActions becomes empty', () => {
      component.additionalActions = [
        {
          permission: 'VIEW',
          callback: () => {
            // empty callback for testing
          },
        },
      ]
      component.additionalActions = []
      expect(component.actionColumnVisible).toBe(false)
    })
  })

  describe('getRowColspan', () => {
    it('should return columns.length when no optional columns are active', () => {
      expect(component.getRowColspan(false)).toBe(mockColumns.length)
    })

    it('should add 1 for selection column when selectionChanged is observed', () => {
      jest.spyOn(component, 'selectionChangedObserved', 'get').mockReturnValue(true)
      expect(component.getRowColspan(false)).toBe(mockColumns.length + 1)
    })

    it('should add 1 for expansion column when expandable is true and hasExpansionTemplate is true', () => {
      component.expandable = true
      expect(component.getRowColspan(true)).toBe(mockColumns.length + 1)
    })

    it('should not add expansion column when expandable is false even if hasExpansionTemplate is true', () => {
      component.expandable = false
      expect(component.getRowColspan(true)).toBe(mockColumns.length)
    })

    it('should not add expansion column when hasExpansionTemplate is false even if expandable is true', () => {
      component.expandable = true
      expect(component.getRowColspan(false)).toBe(mockColumns.length)
    })

    it('should add 1 for action column when action column is visible', () => {
      jest.spyOn(component, 'actionColumnVisible', 'get').mockReturnValue(true)
      expect(component.getRowColspan(false)).toBe(mockColumns.length + 1)
    })

    it('should count all active columns correctly when all optional columns are active', () => {
      component.expandable = true
      jest.spyOn(component, 'selectionChangedObserved', 'get').mockReturnValue(true)
      jest.spyOn(component, 'actionColumnVisible', 'get').mockReturnValue(true)
      expect(component.getRowColspan(true)).toBe(mockColumns.length + 3)
    })
  })
})

function createQueryList(items: Partial<PrimeTemplate>[]): QueryList<PrimeTemplate> {
  const list = new QueryList<PrimeTemplate>()
  list.reset(items as PrimeTemplate[])
  return list
}
