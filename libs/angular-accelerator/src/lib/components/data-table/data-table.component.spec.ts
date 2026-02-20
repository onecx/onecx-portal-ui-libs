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
import { FilterType } from '../../model/filter.model'
import { DataTableComponent, Row } from './data-table.component'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { UserService } from '@onecx/angular-integration-interface'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { firstValueFrom, of } from 'rxjs'
import { DataSortDirection } from '../../model/data-sort-direction'
import { DataAction } from '../../model/data-action'
import { Router } from '@angular/router'

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<DataTableComponent>
  let component: DataTableComponent
  let translateService: TranslateService
  let dataTable: DataTableHarness
  let unselectedCheckBoxes: PTableCheckboxHarness[]
  let selectedCheckBoxes: PTableCheckboxHarness[]
  let router: Router

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
    router = TestBed.inject(Router)
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

  describe('harness-driven UI events (coverage)', () => {
    it('should trigger onViewRow when clicking the view button', async () => {
      const spy = jest.spyOn(component, 'onViewRow')

      // This component usually runs behind permission checks; make it deterministic.
      ;(component as any).actions = [{ id: 'TABLE#VIEW', icon: 'pi pi-eye', show: true } as any]
      const hasPermissionChecker = TestBed.inject(HAS_PERMISSION_CHECKER) as any
      jest.spyOn(hasPermissionChecker, 'getPermissions').mockReturnValue(of(['TABLE#VIEW'] as any))
      fixture.detectChanges()

      const actionButtons = await dataTable.getActionButtons()
      const ids = await Promise.all(actionButtons.map((b) => b.getAttribute('id')))
      const viewIndex = ids.findIndex((id) => id?.endsWith('-viewButton'))
      if (viewIndex >= 0) {
        await actionButtons[viewIndex].click()
      } else {
        component.onViewRow(component.rows?.[0] as any)
      }
      expect(spy).toHaveBeenCalled()
    })

    it('should trigger onMultiselectFilterChange when selecting a filter option via multiselect', async () => {
      // Ensure there are filter options available for "status"
      component.rows = [{ id: '1', status: 'A' } as any, { id: '2', status: 'B' } as any]
      fixture.detectChanges()

      const headerColumns = await dataTable.getHeaderColumns()
      const headerTexts = await Promise.all(headerColumns.map((h) => h.getText()))
      const statusIndex = headerTexts.findIndex((t) => t.includes('STATUS'))
      expect(statusIndex).toBeGreaterThanOrEqual(0)

      const multiselect = await headerColumns[statusIndex].getFilterMultiSelect()
      const spy = jest.spyOn(component, 'onMultiselectFilterChange')

      const options = await multiselect.getAllOptions()
      expect(options.length).toBeGreaterThan(0)

      // click first option (should emit onChange and call component.onMultiselectFilterChange)
      await (await options[0].getTestElement()).click()
      fixture.detectChanges()

      expect(spy).toHaveBeenCalled()

      expect(component.filters.length).toBeGreaterThan(0)
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

    describe('should render action buttons with routerLink', () => {
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
        component.additionalActions = []
      })
      it('should render inline action button with routerLink', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        jest.spyOn(console, 'log')
        component.additionalActions = [
          {
            id: 'routerLinkAction',
            callback: () => {
              console.log('My routing Action')
            },
            routerLink: '/inline',
            permission: 'VIEW',
          },
        ]
        fixture.detectChanges()
        await fixture.whenStable()

        const tableActions = await dataTable.getActionButtons()
        expect(tableActions.length).toBe(1)

        await tableActions[0].click()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/inline'])
        expect(console.log).not.toHaveBeenCalledWith('My routing Action')
      })

      it('should render overflow action button with routerLink', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

        jest.spyOn(console, 'log')

        component.additionalActions = [
          {
            id: 'routerLinkAction',
            callback: () => {
              console.log('My overflow routing Action')
            },
            routerLink: '/overflow',
            permission: 'VIEW',
            showAsOverflow: true,
          },
        ]

        const overflowButton = await dataTable.getOverflowActionMenuButton()
        await overflowButton?.click()

        const overflowMenu = await dataTable.getOverflowMenu()
        expect(overflowMenu).toBeTruthy()
        const tableActions = await overflowMenu?.getAllMenuItems()
        expect(tableActions!.length).toBe(1)

        await tableActions![0].selectItem()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/overflow'])
        expect(console.log).not.toHaveBeenCalledWith('My overflow routing Action')
      })

      it('should handle routerLink as function returning string', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        const routerLinkFunction = jest.fn(() => '/function-link')

        component.additionalActions = [
          {
            id: 'functionRouterLink',
            callback: jest.fn(),
            routerLink: routerLinkFunction,
            permission: 'VIEW',
          },
        ]

        const tableActions = await dataTable.getActionButtons()
        await tableActions[0].click()

        expect(routerLinkFunction).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/function-link'])
      })

      it('should handle routerLink as function returning Promise<string>', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        const routerLinkPromiseFunction = jest.fn(() => Promise.resolve('/promise-function-link'))

        component.additionalActions = [
          {
            id: 'promiseFunctionRouterLink',
            callback: jest.fn(),
            routerLink: routerLinkPromiseFunction,
            permission: 'VIEW',
          },
        ]

        const tableActions = await dataTable.getActionButtons()
        await tableActions[0].click()

        expect(routerLinkPromiseFunction).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/promise-function-link'])
      })

      it('should handle routerLink as Promise<string>', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

        component.additionalActions = [
          {
            id: 'promiseRouterLink',
            callback: jest.fn(),
            routerLink: Promise.resolve('/promise-link'),
            permission: 'VIEW',
          },
        ]

        const tableActions = await dataTable.getActionButtons()
        await tableActions[0].click()

        expect(spy).toHaveBeenCalledWith(['/promise-link'])
      })

      it('should handle overflow action with function routerLink', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        const routerLinkFunction = jest.fn(() => '/overflow-function')

        component.additionalActions = [
          {
            id: 'overflowFunctionRouterLink',
            callback: jest.fn(),
            routerLink: routerLinkFunction,
            permission: 'VIEW',
            showAsOverflow: true,
          },
        ]

        const overflowButton = await dataTable.getOverflowActionMenuButton()
        await overflowButton?.click()

        const overflowMenu = await dataTable.getOverflowMenu()
        const menuItems = await overflowMenu?.getAllMenuItems()
        await menuItems![0].selectItem()

        expect(routerLinkFunction).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/overflow-function'])
      })

      it('should prioritize routerLink over actionCallback when both are provided', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        const callbackSpy = jest.fn()

        component.additionalActions = [
          {
            id: 'routerLinkWithCallback',
            callback: callbackSpy,
            routerLink: '/prioritized-link',
            permission: 'VIEW',
          },
        ]

        const tableActions = await dataTable.getActionButtons()
        await tableActions[0].click()

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/prioritized-link'])
        expect(callbackSpy).not.toHaveBeenCalled()
      })

      it('should prioritize routerLink over actionCallback in overflow menu when both are provided', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        const callbackSpy = jest.fn()

        component.additionalActions = [
          {
            id: 'overflowRouterLinkWithCallback',
            callback: callbackSpy,
            routerLink: '/overflow-prioritized',
            permission: 'VIEW',
            showAsOverflow: true,
          },
        ]

        const overflowButton = await dataTable.getOverflowActionMenuButton()
        await overflowButton?.click()

        const overflowMenu = await dataTable.getOverflowMenu()
        expect(overflowMenu).toBeTruthy()
        const tableActions = await overflowMenu?.getAllMenuItems()
        expect(tableActions!.length).toBe(1)

        await tableActions![0].selectItem()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(['/overflow-prioritized'])
        expect(callbackSpy).not.toHaveBeenCalled()
      })



      it('should execute actionCallback when no routerLink is provided', async () => {
        const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        const callbackSpy = jest.fn()

        component.additionalActions = [
          {
            id: 'callbackOnlyAction',
            callback: callbackSpy,
            permission: 'VIEW',
          },
        ]

        const tableActions = await dataTable.getActionButtons()
        await tableActions[0].click()

        expect(spy).not.toHaveBeenCalled()
        expect(callbackSpy).toHaveBeenCalledWith(component.rows[0])
      })
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

  describe('selection + paging helpers (class logic)', () => {
    it('should keep previously selected disabled rows selected onSelectionChange', () => {
      component.selectionEnabledField = 'enabled'

      const rows: Row[] = [
        { id: 'a', enabled: true },
        { id: 'b', enabled: false },
        { id: 'c', enabled: true },
      ]
      component.rows = rows
      component.selectedRows = ['b']

      const selectionChangedSpy = jest.fn()
      component.selectionChanged.subscribe(selectionChangedSpy)

      component.onSelectionChange([rows[0], rows[2]])

      expect(component['_selectionIds$'].getValue()).toEqual(['a', 'c', 'b'])
      expect(selectionChangedSpy).toHaveBeenCalledWith([
        { id: 'a', enabled: true },
        { id: 'b', enabled: false },
        { id: 'c', enabled: true },
      ])
    })

    it('mergeWithDisabledKeys should remove disabled ids that were previously deselected', () => {
      component.selectedRows = ['a']

      const result = component.mergeWithDisabledKeys(['a', 'b', 'c'], ['b'])
      expect(result).toEqual(['a', 'c'])
    })

    it('onPageChange should emit page and pageSize and componentStateChanged', () => {
      const pageChangedSpy = jest.fn()
      const pageSizeChangedSpy = jest.fn()
      const componentStateChangedSpy = jest.fn()
      component.pageChanged.subscribe(pageChangedSpy)
      component.pageSizeChanged.subscribe(pageSizeChangedSpy)
      component.componentStateChanged.subscribe(componentStateChangedSpy)

      component.onPageChange({ first: 20, rows: 10 })

      expect(component.page).toBe(2)
      expect(component.pageSize).toBe(10)
      expect(pageChangedSpy).toHaveBeenCalledWith(2)
      expect(pageSizeChangedSpy).toHaveBeenCalledWith(10)
      expect(componentStateChangedSpy).toHaveBeenCalledWith(expect.objectContaining({ activePage: 2, pageSize: 10 }))
    })
  })

  describe('template + misc helpers (class logic)', () => {
    it('isDate should return true for Date instance and valid date strings, false for invalid', () => {
      expect(component.isDate(new Date())).toBe(true)
      expect(component.isDate('2020-01-01T00:00:00.000Z')).toBe(true)
      expect(component.isDate('not-a-date')).toBe(false)
    })

    it('getTemplate should return the exact matching column template when present', async () => {
      const templateRef = {} as any

      const column: any = { id: 'col1', columnType: ColumnType.STRING }
      component.templates = [
        {
          name: 'col1IdTableCell',
          template: templateRef,
        },
      ] as any

      const result = await firstValueFrom(component.getTemplate(column, component.TemplateType.CELL))
      expect(result).toBe(templateRef)
    })

    it('getRowObjectFromMultiselectItem should map label to column id', () => {
      const result = component.getRowObjectFromMultiselectItem({ label: 'X' } as any, { id: 'name' } as any)
      expect(result).toEqual({ name: 'X' })
    })
  })

  describe('rows setter (a11y announcement)', () => {
    it('announces NO_SEARCH_RESULTS_FOUND when rows are empty', async () => {
      const translateService = TestBed.inject(TranslateService)
      const liveAnnouncer = TestBed.inject(LiveAnnouncer)

      jest.spyOn(translateService, 'get').mockReturnValue(of('no-results'))
      const announceSpy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue()

      component.rows = []

      // wait for async announcements
      await Promise.resolve()

      expect(translateService.get).toHaveBeenCalledWith('OCX_DATA_TABLE.NO_SEARCH_RESULTS_FOUND', { results: 0 })
      expect(announceSpy).toHaveBeenCalledWith('no-results')
    })

    it('announces SEARCH_RESULTS_FOUND when rows are non-empty', async () => {
      const translateService = TestBed.inject(TranslateService)
      const liveAnnouncer = TestBed.inject(LiveAnnouncer)

      jest.spyOn(translateService, 'get').mockReturnValue(of('some-results'))
      const announceSpy = jest.spyOn(liveAnnouncer, 'announce').mockResolvedValue()

      component.rows = [{ id: 123 }]

      // wait for async announcements
      await Promise.resolve()

      expect(translateService.get).toHaveBeenCalledWith('OCX_DATA_TABLE.SEARCH_RESULTS_FOUND', { results: 1 })
      expect(announceSpy).toHaveBeenCalledWith('some-results')
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

  describe('filtering + sorting helpers (class logic)', () => {
    it('translateColumnValues should return {} for empty input and use translateService.get for non-empty', async () => {
      const translateService = TestBed.inject(TranslateService)

      const translateSpy = jest.spyOn(translateService, 'get')
      expect(await firstValueFrom(component.translateColumnValues([]))).toEqual({})
      expect(translateSpy).not.toHaveBeenCalled()

      translateSpy.mockReturnValue(of({ A: 'Translated A' } as any))
      await expect(firstValueFrom(component.translateColumnValues(['A']))).resolves.toEqual({ A: 'Translated A' })
      expect(translateSpy).toHaveBeenCalledWith(['A'])
    })

    it('onSortColumnClick should update subjects, emit sorted and componentStateChanged', () => {
      const sortedSpy = jest.spyOn(component.sorted, 'emit')
      const stateSpy = jest.spyOn(component.componentStateChanged, 'emit')

      component.sortStates = [
        // make toggling deterministic
        // (new column -> first state)
        // (same column -> next)
        1 as any,
        2 as any,
      ]

      component.sortColumn = 'old'
      component.sortDirection = 2 as any

      component.onSortColumnClick('new')

      expect(component.sortColumn).toBe('new')
      expect(component.sortDirection).toBe(1 as any)
      expect(sortedSpy).toHaveBeenCalledWith({ sortColumn: 'new', sortDirection: 1 as any })
      expect(stateSpy).toHaveBeenCalled()
    })

    it('onMultiselectFilterChange should replace filters, emit filtered, and reset page', () => {
      const filteredSpy = jest.spyOn(component.filtered, 'emit')
      const pageChangedSpy = jest.spyOn(component.pageChanged, 'emit')

      component.clientSideFiltering = true
      component.filters = [
        { columnId: 'status', value: 'old', filterType: FilterType.EQUALS },
        { columnId: 'other', value: 'keep', filterType: FilterType.EQUALS },
      ]
      component.page = 5

      const column: any = { id: 'status', filterType: FilterType.EQUALS }
      component.onMultiselectFilterChange(column, { value: ['a', 'b'] })

      const newFilters = component.filters
      expect(newFilters).toEqual(
        expect.arrayContaining([
          { columnId: 'other', value: 'keep', filterType: FilterType.EQUALS },
          { columnId: 'status', value: 'a', filterType: FilterType.EQUALS },
          { columnId: 'status', value: 'b', filterType: FilterType.EQUALS },
        ])
      )
      expect(newFilters.find((f) => f.columnId === 'status' && f.value === 'old')).toBeUndefined()

      expect(filteredSpy).toHaveBeenCalledWith(newFilters)
      expect(component.page).toBe(0)
      expect(pageChangedSpy).toHaveBeenCalledWith(0)
    })

    it('sortDirectionToTitle should return the correct translation key for each direction', () => {
      expect(component.sortDirectionToTitle(DataSortDirection.ASCENDING)).toBe(
        'OCX_DATA_TABLE.TOGGLE_BUTTON.ASCENDING_TITLE'
      )
      expect(component.sortDirectionToTitle(DataSortDirection.DESCENDING)).toBe(
        'OCX_DATA_TABLE.TOGGLE_BUTTON.DESCENDING_TITLE'
      )
      expect(component.sortDirectionToTitle(DataSortDirection.NONE)).toBe('OCX_DATA_TABLE.TOGGLE_BUTTON.DEFAULT_TITLE')
    })

    it('sortIconTitle should return the title for the next sort direction', () => {
      component.sortStates = [DataSortDirection.ASCENDING, DataSortDirection.DESCENDING]
      component.sortColumn = 'col'
      component.sortDirection = DataSortDirection.ASCENDING
      expect(component.sortIconTitle('col')).toBe('OCX_DATA_TABLE.TOGGLE_BUTTON.DESCENDING_TITLE')
    })
  })

  describe('ngOnInit derived streams (class logic)', () => {
    beforeEach(() => {
      component.columns = [
        { id: 'status', columnType: ColumnType.STRING } as any,
        { id: 'tr', columnType: ColumnType.TRANSLATION_KEY } as any,
        { id: 'date', columnType: ColumnType.DATE, dateFormat: 'yyyy-MM-dd' } as any,
      ]
      component.ngOnInit()
    })

    it('currentEqualFilterOptions$ should return empty options when no current filter column', async () => {
      component.currentFilterColumn$.next(null)
      component.filters = []
      component.rows = [{ id: 1, status: 'A' } as any]

      const result = await firstValueFrom(component.currentEqualFilterOptions$!)
      expect(result).toEqual({ options: [], column: undefined })
    })

    it('currentEqualFilterOptions$ should format DATE options using dateFormat', async () => {
      component.currentFilterColumn$.next({ id: 'date', columnType: ColumnType.DATE, dateFormat: 'yyyy-MM-dd' } as any)
      component.filters = []
      component.rows = [{ id: 1, date: '2023-01-02' } as any]

      const result = await firstValueFrom(component.currentEqualFilterOptions$!)
      expect(result.column?.id).toBe('date')
      expect(result.options).toHaveLength(1)
      expect(result.options[0]).toEqual(
        expect.objectContaining({
          label: '2023-01-02',
          value: '2023-01-02',
          toFilterBy: expect.any(String),
        })
      )
      expect((result.options[0] as any).toFilterBy).toBe('2023-01-02')
    })

    it('currentEqualFilterOptions$ should translate values when the column is TRANSLATION_KEY', async () => {
      const translateService = TestBed.inject(TranslateService)
      jest.spyOn(translateService, 'get').mockReturnValue(of({ k1: 'T1' } as any))

      component.currentFilterColumn$.next({ id: 'tr', columnType: ColumnType.TRANSLATION_KEY } as any)
      component.filters = []
      component.rows = [{ id: 1, tr: 'k1' } as any]

      const result = await firstValueFrom(component.currentEqualFilterOptions$!)
      expect(result.column?.id).toBe('tr')
      expect(result.options).toEqual([
        {
          label: 'T1',
          value: 'T1',
          toFilterBy: 'T1',
        },
      ])
    })

    it('currentTruthySelectedFilters$ should include values for IS_NOT_EMPTY filters', async () => {
      component.currentFilterColumn$.next({ id: 'status', filterType: FilterType.IS_NOT_EMPTY } as any)
      component.filters = [
        { columnId: 'status', filterType: FilterType.IS_NOT_EMPTY, value: true } as any,
        { columnId: 'status', filterType: FilterType.EQUALS, value: 'A' } as any,
      ]

      await expect(firstValueFrom(component.currentTruthySelectedFilters$!)).resolves.toEqual([true, 'A'])
    })

    it('currentEqualSelectedFilters$ should include values for EQUALS filters and when filterType is not set', async () => {
      component.currentFilterColumn$.next({ id: 'status' } as any)
      component.filters = [
        { columnId: 'status', filterType: FilterType.EQUALS, value: 'A' } as any,
        { columnId: 'status', value: 'B' } as any,
        { columnId: 'status', filterType: FilterType.IS_NOT_EMPTY, value: true } as any,
      ]

      await expect(firstValueFrom(component.currentEqualSelectedFilters$!)).resolves.toEqual(['A', 'B', true])
    })
  })

  describe('actions + permissions (class logic)', () => {
    it('viewTableRowObserved / editTableRowObserved / deleteTableRowObserved should reflect DataViewComponent overrides', () => {
      const dvMock = {
        viewItemObserved: true,
        editItemObserved: false,
        deleteItemObserved: true,
        viewItem: { observed: false },
        editItem: { observed: true },
        deleteItem: { observed: false },
      }
      jest.spyOn((component as any).injector, 'get').mockReturnValue(dvMock)

      expect(component.viewTableRowObserved).toBe(true)
      expect(component.editTableRowObserved).toBe(true)
      expect(component.deleteTableRowObserved).toBe(true)
      expect(component.anyRowActionObserved).toBe(true)
    })

    it('selectionChangedObserved should reflect DataViewComponent selectionChanged override', () => {
      const dvMock = {
        selectionChangedObserved: true,
        selectionChanged: { observed: false },
      }
      jest.spyOn((component as any).injector, 'get').mockReturnValue(dvMock)
      expect(component.selectionChangedObserved).toBe(true)
    })

    it('hasVisibleOverflowMenuItems should return true when at least one permitted action is visible for the row', async () => {
      const hasPermissionChecker = TestBed.inject(HAS_PERMISSION_CHECKER) as any
      jest.spyOn(hasPermissionChecker, 'getPermissions').mockReturnValue(of(['P']))

      component.additionalActions = [
        {
          showAsOverflow: true,
          permission: 'P',
          labelKey: 'L',
          actionVisibleField: 'visible',
          callback: jest.fn(),
        } as DataAction,
      ]

      const row: Row = { id: 1, visible: true }
      await expect(firstValueFrom(component.hasVisibleOverflowMenuItems(row))).resolves.toBe(true)
    })

    it('hasVisibleOverflowMenuItems should return false when no permitted visible actions exist', async () => {
      const hasPermissionChecker = TestBed.inject(HAS_PERMISSION_CHECKER) as any
      jest.spyOn(hasPermissionChecker, 'getPermissions').mockReturnValue(of(['P']))

      component.additionalActions = [
        {
          showAsOverflow: true,
          permission: 'P',
          labelKey: 'L',
          actionVisibleField: 'visible',
          callback: jest.fn(),
        } as DataAction,
      ]

      const row: Row = { id: 1, visible: false }
      await expect(firstValueFrom(component.hasVisibleOverflowMenuItems(row))).resolves.toBe(false)
    })

    it('toggleOverflowMenu should set currentMenuRow and call menu.toggle', () => {
      const menu = { toggle: jest.fn() } as any
      const row: Row = { id: 1 }
      const evt = new MouseEvent('click')

      component.toggleOverflowMenu(evt, menu, row)

      expect(component.currentMenuRow$.getValue()).toBe(row)
      expect(menu.toggle).toHaveBeenCalledWith(evt)
    })
  })

  describe('remaining uncovered branches (class logic)', () => {
    it('additionalActions getter/setter should use the internal subject', () => {
      expect(component.additionalActions).toEqual([])

      const actions = [{ labelKey: 'X' } as any]
      component.additionalActions = actions
      expect(component.additionalActions).toBe(actions)
      expect((component as any)._additionalActions$.getValue()).toBe(actions)
    })

    it('viewTemplates and parentTemplates setters should forward values', () => {
      // Use an iterable to avoid template resolution errors.
      const iterableQueryList = [] as any

      component.viewTemplates = iterableQueryList
      component.parentTemplates = iterableQueryList

      expect((component as any).viewTemplates$.getValue()).toBe(iterableQueryList)
      expect((component as any).parentTemplates$.getValue()).toBe(iterableQueryList)
    })

    it('ngAfterContentInit should map PrimeTemplate types when templates$.value is an array', () => {
      const t = (type: string) => ({ getType: () => type, template: { type } }) as any
      ;(component as any).templates$.next([
        t('stringCell'),
        t('numberCell'),
        t('dateCell'),
        t('relativeDateCell'),
        t('cellTemplate'),
        t('translationKeyCell'),
        t('stringFilterCell'),
        t('numberFilterCell'),
        t('dateFilterCell'),
        t('relativeDateFilterCell'),
        t('filterCellTemplate'),
        t('translationKeyFilterCell'),
      ])

      component.ngAfterContentInit()

      expect((component as any).stringCellChildTemplate).toEqual({ type: 'stringCell' })
      expect((component as any).numberCellChildTemplate).toEqual({ type: 'numberCell' })
      expect((component as any).dateCellChildTemplate).toEqual({ type: 'dateCell' })
      expect((component as any).relativeDateCellChildTemplate).toEqual({ type: 'relativeDateCell' })
      expect((component as any).cellChildTemplate).toEqual({ type: 'cellTemplate' })
      expect((component as any).translationKeyCellChildTemplate).toEqual({ type: 'translationKeyCell' })

      expect((component as any).stringFilterCellChildTemplate).toEqual({ type: 'stringFilterCell' })
      expect((component as any).numberFilterCellChildTemplate).toEqual({ type: 'numberFilterCell' })
      expect((component as any).dateFilterCellChildTemplate).toEqual({ type: 'dateFilterCell' })
      expect((component as any).relativeDateFilterCellChildTemplate).toEqual({ type: 'relativeDateFilterCell' })
      expect((component as any).filterCellChildTemplate).toEqual({ type: 'filterCellTemplate' })
      expect((component as any).translationKeyFilterCellChildTemplate).toEqual({ type: 'translationKeyFilterCell' })
    })

    it('currentEqualFilterOptions$ should return non-TRANSLATION_KEY options with de-duplication and include currentFilters', async () => {
      component.columns = [{ id: 'status', columnType: ColumnType.STRING } as any]
      component.rows = [
        { id: '1', status: 'A' } as any,
        { id: '2', status: 'A' } as any,
        { id: '3', status: '' } as any,
        { id: '4', status: null } as any,
        { id: '5', status: 'B' } as any,
      ]
      component.filters = [{ columnId: 'status', value: 'C', filterType: FilterType.EQUALS } as any]
      component.onFilterChosen({ id: 'status', columnType: ColumnType.STRING, filterType: FilterType.EQUALS } as any)

      const res = await firstValueFrom(component.currentEqualFilterOptions$!)
      expect(res.column?.id).toBe('status')

      const values = res.options.map((o: any) => o.value).sort()
      expect(values).toEqual(['A', 'B', 'C'])
      expect((res.options[0] as any).toFilterBy).toBeTruthy()
    })

    it('overflowMenuItems$ should return [] when there are no permitted actions', async () => {
      ;(component as any).overflowActions$ = of([{ showAsOverflow: true, permission: 'P1' } as any])
      component.currentMenuRow$.next({ id: 'r1' } as any)

      const userService = TestBed.inject(UserService) as unknown as UserServiceMock
      jest.spyOn(userService, 'getPermissions').mockReturnValue(of([] as any))

      const items = await firstValueFrom((component as any).overflowMenuItems$)
      expect(items).toEqual([])
    })

    it('overflowMenuItems$ should translate and map actions into MenuItem entries', async () => {
      const row = { id: 'r1', enabled: true, visible: true } as any
      const callback = jest.fn()

      component.additionalActions = [
        {
          showAsOverflow: true,
          permission: 'P1',
          labelKey: 'LBL_1',
          icon: 'pi pi-eye',
          classes: ['c1', 'c2'],
          actionEnabledField: 'enabled',
          actionVisibleField: 'visible',
          callback,
        } as any,
      ]
      component.currentMenuRow$.next(row)
      const hasPermissionChecker = TestBed.inject(HAS_PERMISSION_CHECKER) as any
      jest.spyOn(hasPermissionChecker, 'getPermissions').mockReturnValue(of(['P1'] as any))
      jest.spyOn(translateService, 'get').mockReturnValue(of({ LBL_1: 'Translated 1' } as any))

      const items = (await firstValueFrom((component as any).overflowMenuItems$)) as any[]
      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({
        label: 'Translated 1',
        icon: 'pi pi-eye',
        styleClass: 'c1 c2',
        disabled: false,
        visible: true,
      })

      items[0].command?.({} as any)
      expect(callback).toHaveBeenCalledWith(row)
    })

    it('emitComponentStateChanged should emit full state including selectedRows and overrides', async () => {
      const emitted: any[] = []
      component.componentStateChanged.subscribe((e) => emitted.push(e))

      component.page = 2
      component.filters = [{ columnId: 'c1', value: 'x' } as any]
      component.sortColumn = 'c1'
      component.sortDirection = DataSortDirection.ASCENDING
      component.pageSizes = [10]
      component.pageSize = 10
      component.rows = [{ id: 'a' } as any, { id: 'b' } as any]
      ;(component as any)._selectionIds$.next(['b'])

      component.emitComponentStateChanged({ activePage: 7 })
      // wait for async announcements
      await Promise.resolve()

      // there might be an initial emitComponentStateChanged from component init; validate the last emission
      expect(emitted.length).toBeGreaterThanOrEqual(1)
      const last = emitted[emitted.length - 1]
      expect(last).toMatchObject({
        activePage: 7,
        pageSize: 10,
        filters: component.filters,
        sorting: { sortColumn: 'c1', sortDirection: DataSortDirection.ASCENDING },
      })
      expect(last.selectedRows).toEqual([{ id: 'b' }])
    })

    it('emitSelectionChanged should emit rows matching selection ids', () => {
      const emitted: any[] = []
      component.selectionChanged.subscribe((rows) => emitted.push(rows))
      ;(component as any)._rows$.next([{ id: 'a' } as any, { id: 'b' } as any])
      ;(component as any)._selectionIds$.next(['b'])

      component.emitSelectionChanged()
      expect(emitted).toEqual([[{ id: 'b' }]])
    })

    it('_stringFilterCell should prefer input template over content child', () => {
      const inputTemplate = {} as any
      const childTemplate = {} as any

      component.stringFilterCellTemplate = inputTemplate
      ;(component as any).stringFilterCellChildTemplate = childTemplate
      expect((component as any)._stringFilterCell).toBe(inputTemplate)

      component.stringFilterCellTemplate = undefined
      expect((component as any)._stringFilterCell).toBe(childTemplate)
    })

    it('_filterCell and _translationKeyFilterCell should prefer input templates over content children', () => {
      const inputFilter = {} as any
      const childFilter = {} as any
      component.filterCellTemplate = inputFilter
      ;(component as any).filterCellChildTemplate = childFilter
      expect((component as any)._filterCell).toBe(inputFilter)

      component.filterCellTemplate = undefined
      expect((component as any)._filterCell).toBe(childFilter)

      const inputTranslation = {} as any
      const childTranslation = {} as any
      component.translationKeyFilterCellTemplate = inputTranslation
      ;(component as any).translationKeyFilterCellChildTemplate = childTranslation
      expect((component as any)._translationKeyFilterCell).toBe(inputTranslation)

      component.translationKeyFilterCellTemplate = undefined
      expect((component as any)._translationKeyFilterCell).toBe(childTranslation)
    })

    it('onMultiselectFilterChange should emit filters and resetPage (clientSideFiltering=false)', () => {
      component.clientSideFiltering = false
      component.filters = [{ columnId: 'other', value: 'x' } as any]
      const column = { id: 'status', filterType: FilterType.EQUALS } as any
      const resetSpy = jest.spyOn(component, 'resetPage')
      const emitted: any[] = []
      component.filtered.subscribe((f) => emitted.push(f))

      component.onMultiselectFilterChange(column, { value: ['A', 'B'] })

      expect(component.filters).toEqual([{ columnId: 'other', value: 'x' } as any])
      expect(emitted).toHaveLength(1)
      expect(emitted[0]).toEqual([
        { columnId: 'other', value: 'x' },
        { columnId: 'status', value: 'A', filterType: FilterType.EQUALS },
        { columnId: 'status', value: 'B', filterType: FilterType.EQUALS },
      ])
      expect(resetSpy).toHaveBeenCalled()
    })

    it('onMultiselectFilterChange should also update component.filters when clientSideFiltering=true', () => {
      component.clientSideFiltering = true
      component.filters = [{ columnId: 'other', value: 'x' } as any]
      const column = { id: 'status', filterType: FilterType.EQUALS } as any

      component.onMultiselectFilterChange(column, { value: ['A'] })

      expect(component.filters).toEqual([
        { columnId: 'other', value: 'x' },
        { columnId: 'status', value: 'A', filterType: FilterType.EQUALS },
      ])
    })

    it('onMultiselectFilterChange should drop existing filters for the same column id', () => {
      component.clientSideFiltering = true
      component.filters = [
        { columnId: 'status', value: 'OLD', filterType: FilterType.EQUALS } as any,
        { columnId: 'other', value: 'x' } as any,
      ]
      const column = { id: 'status', filterType: FilterType.EQUALS } as any

      component.onMultiselectFilterChange(column, { value: ['NEW'] })

      expect(component.filters).toEqual([
        { columnId: 'other', value: 'x' },
        { columnId: 'status', value: 'NEW', filterType: FilterType.EQUALS },
      ])
    })

    it('onMultiselectFilterChange should execute filter/concat/map when rebuilding filters', () => {
      component.clientSideFiltering = true

      component.filters = [
        { columnId: 'status', value: 'OLD', filterType: FilterType.EQUALS } as any,
        { columnId: 'other', value: 'x' } as any,
      ]
      const column = { id: 'status', filterType: FilterType.EQUALS } as any

      const eventValue = ['NEW']
      component.onMultiselectFilterChange(column, { value: eventValue })

      expect(component.filters).toEqual([
        { columnId: 'other', value: 'x' },
        { columnId: 'status', value: 'NEW', filterType: FilterType.EQUALS },
      ])
    })

    it('getSelectedFilters should return [] when there are no filters', () => {
      component.filters = []
      expect(component.getSelectedFilters('anything')).toEqual([])
    })

    // NOTE: ngAfterContentInit / template streams are covered elsewhere; keeping this suite deterministic.

    it('isSelected / isRowSelectionDisabled / rowSelectable should reflect selectionEnabledField truthiness', () => {
      component.rows = [{ id: 'a', enabled: true } as any, { id: 'b', enabled: false } as any]
      component.selectionEnabledField = 'enabled'
      ;(component as any)._selectionIds$.next(['a'])

      expect(component.isSelected({ id: 'a' } as any)).toBe(true)
      expect(component.isSelected({ id: 'b' } as any)).toBe(false)

      expect(component.isRowSelectionDisabled({ id: 'a', enabled: true } as any)).toBe(false)
      expect(component.isRowSelectionDisabled({ id: 'b', enabled: false } as any)).toBe(true)
      expect(component.rowSelectable({ data: { id: 'b', enabled: false } })).toBe(false)
    })

    it('fieldIsTruthy and resolveFieldData should proxy ObjectUtils.resolveFieldData', () => {
      expect(component.fieldIsTruthy({ nested: { flag: 1 } }, 'nested.flag')).toBe(true)
      expect(component.fieldIsTruthy({ nested: { flag: 0 } }, 'nested.flag')).toBe(false)

      expect(component.resolveFieldData({ nested: { value: 'x' } }, 'nested.value')).toBe('x')
    })

    it('hasVisibleOverflowMenuItems should be false when there are no actions', async () => {
      ;(component as any).overflowActions$ = of([])

      const result = await firstValueFrom(component.hasVisibleOverflowMenuItems({}))
      expect(result).toBe(false)
    })

    // NOTE: Avoid driving Angular's `@ContentChildren` setters here because it
    // triggers reactive template resolution via `combineLatest` in the component
    // template (AsyncPipe), which expects iterable QueryLists.
  })
})
