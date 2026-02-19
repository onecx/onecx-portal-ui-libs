import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { UserService } from '@onecx/angular-integration-interface'
import {
  provideAppStateServiceMock,
  provideUserServiceMock,
  UserServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { ensureIntersectionObserverMockExists, ensureOriginMockExists } from '@onecx/angular-testing'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { TooltipStyle } from 'primeng/tooltip'
import { firstValueFrom } from 'rxjs'
import { DataListGridHarness } from '../../../../testing/data-list-grid.harness'
import { DataTableHarness } from '../../../../testing/data-table.harness'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { ColumnType } from '../../model/column-type.model'
import { DataListGridComponent } from './data-list-grid.component'
import { LiveAnnouncer } from '@angular/cdk/a11y'

ensureOriginMockExists()
ensureIntersectionObserverMockExists()

describe('DataListGridComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  globalThis.MutationObserver = mutationObserverMock

  let fixture: ComponentFixture<DataListGridComponent>
  let component: DataListGridComponent
  let translateService: TranslateService
  let listGrid: DataListGridHarness
  let router: Router

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} of {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})',
    },
    OCX_DATA_LIST_GRID: {
      SEARCH_RESULTS_FOUND: '{{results}} Results Found',
      NO_SEARCH_RESULTS_FOUND: 'No Results Found',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    OCX_DATA_TABLE: {
      SHOWING: '{{first}} - {{last}} von {{totalRecords}}',
      SHOWING_WITH_TOTAL_ON_SERVER: '{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})',
    },
    OCX_DATA_LIST_GRID: {
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
      declarations: [DataListGridComponent],
      imports: [AngularAcceleratorPrimeNgModule, AngularAcceleratorModule, RouterModule, NoopAnimationsModule],
      providers: [
        provideTranslateTestingService(TRANSLATIONS),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        provideUserServiceMock(),
        provideAppStateServiceMock(),
        TooltipStyle,
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridComponent)
    component = fixture.componentInstance
    component.data = mockData
    component.columns = mockColumns
    component.paginator = true
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    const userServiceMock = TestBed.inject(UserServiceMock)
    userServiceMock.permissionsTopic$.publish(['VIEW', 'EDIT', 'DELETE'])
    fixture.detectChanges()
    listGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
    router = TestBed.inject(Router)
  })

  it('should create the data list grid component', () => {
    expect(component).toBeTruthy()
  })

  it('loads dataListGrid', async () => {
    const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
    expect(dataListGrid).toBeTruthy()
  })

  describe('should display the paginator currentPageReport -', () => {
    it('de', async () => {
      translateService.use('de')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5')
    })

    it('en', async () => {
      translateService.use('en')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5')
    })
  })

  describe('should display the paginator currentPageReport  with totalRecordsOnServer -', () => {
    it('de', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('de')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 von 5 (10)')
    })

    it('en', async () => {
      component.totalRecordsOnServer = 10
      translateService.use('en')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
      const paginator = await dataListGrid.getPaginator()
      const currentPageReport = await paginator.getCurrentPageReportText()
      expect(currentPageReport).toEqual('1 - 5 of 5 (10)')
    })
  })

  it('should display the paginator rowsPerPageOptions', async () => {
    const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
    const paginator = await dataListGrid.getPaginator()
    const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
    const rowsPerPageOptionsText = await rowsPerPageOptions.selectedSelectItemText(0)
    expect(rowsPerPageOptionsText).toEqual('10')
  })

  const setUpListActionButtonMockData = async () => {
    component.columns = [
      ...mockColumns,
      {
        columnType: ColumnType.STRING,
        id: 'ready',
        nameKey: 'Ready',
      },
    ]

    component.data = [
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
        ready: false,
      },
    ]
    component.viewItem.subscribe(() => console.log())
    component.editItem.subscribe(() => console.log())
    component.deleteItem.subscribe(() => console.log())
    component.viewPermission = 'VIEW'
    component.editPermission = 'EDIT'
    component.deletePermission = 'DELETE'

    fixture.detectChanges()
    await fixture.whenStable()
  }
  describe('Disable list action buttons based on field path', () => {
    it('should not disable any list action button by default', async () => {
      component.layout = 'list'

      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpListActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of listActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'list')).toBe(false)
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically enable/disable an action button based on the contents of a specified field', async () => {
      component.layout = 'list'
      await setUpListActionButtonMockData()
      component.viewActionEnabledField = 'ready'

      let listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(3)

      for (const action of listActions) {
        const icon = await action.getAttribute('icon')
        const isDisabled = await listGrid.actionButtonIsDisabled(action, 'list')
        if (icon === 'pi pi-eye') {
          expect(isDisabled).toBe(true)
        } else {
          expect(isDisabled).toBe(false)
        }
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      listActions = await listGrid.getActionButtons('list')

      for (const action of listActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'list')).toBe(false)
      }
    })
  })

  describe('Hide list action buttons based on field path', () => {
    it('should not hide any list action button by default', async () => {
      component.layout = 'list'

      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpListActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(3)
      const expectedIcons = ['pi pi-eye', 'pi pi-trash', 'pi pi-pencil']

      for (const action of listActions) {
        const icon = await action.getAttribute('icon')
        if (icon) {
          const index = expectedIcons.indexOf(icon)
          expect(index).toBeGreaterThanOrEqual(0)
          expectedIcons.splice(index, 1)
        }
      }

      expect(expectedIcons.length).toBe(0)
    })

    it('should dynamically hide/show an action button based on the contents of a specified field', async () => {
      component.layout = 'list'
      await setUpListActionButtonMockData()
      component.viewActionVisibleField = 'ready'

      let listActions = await listGrid.getActionButtons('list')
      expect(listActions.length).toBe(2)

      for (const action of listActions) {
        const icon = await action.getAttribute('icon')
        expect(icon === 'pi pi-eye').toBe(false)
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      listActions = await listGrid.getActionButtons('list')

      expect(listActions.length).toBe(3)
    })
  })
  describe('Assign ids to list action buttons', () => {
    beforeEach(() => {
      component.layout = 'list'

      component.data = [
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
      component.viewItem.subscribe(() => console.log())
      component.viewPermission = 'VIEW'

      fixture.autoDetectChanges()
      await fixture.whenStable()

      expect(component.viewItemObserved).toBe(true)

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-viewButton')
    })

    it('should assign id to edit button', async () => {
      component.editItem.subscribe(() => console.log())
      component.editPermission = 'EDIT'

      fixture.autoDetectChanges()
      await fixture.whenStable()

      expect(component.editItemObserved).toBe(true)

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-editButton')
    })

    it('should assign id to delete button', async () => {
      component.deleteItem.subscribe(() => console.log())
      component.deletePermission = 'DELETE'

      fixture.autoDetectChanges()
      await fixture.whenStable()

      expect(component.deleteItemObserved).toBe(true)

      const tableActions = await listGrid.getActionButtons('list')
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

      fixture.autoDetectChanges()
      await fixture.whenStable()

      const tableActions = await listGrid.getActionButtons('list')
      expect(tableActions.length).toBe(1)

      expect(await tableActions[0].getAttribute('id')).toEqual('rowId-actionIdActionButton')
    })
  })

  const setUpGridActionButtonMockData = async () => {
    component.columns = [
      ...mockColumns,
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
        property1: 'Card 1',
        ready: false,
      },
    ]
    component.titleLineId = 'property1'
    component.viewItem.subscribe(() => console.log())
    component.editItem.subscribe(() => console.log())
    component.deleteItem.subscribe(() => console.log())
    component.viewPermission = 'VIEW'
    component.editPermission = 'EDIT'
    component.deletePermission = 'DELETE'

    fixture.detectChanges()
    await fixture.whenStable()
  }
  describe('Disable grid action buttons based on field path', () => {
    it('should not disable any grid action button by default', async () => {
      component.layout = 'grid'
      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpGridActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const gridMenuButton = await listGrid.getGridMenuButton()

      await gridMenuButton.click()

      const gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)

      for (const action of gridActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'grid')).toBe(false)
      }
    })

    it('should dynamically enable/disable an action button based on the contents of a specified field', async () => {
      component.layout = 'grid'
      await setUpGridActionButtonMockData()
      component.viewActionEnabledField = 'ready'
      const gridMenuButton = await listGrid.getGridMenuButton()

      await gridMenuButton.click()

      let gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)

      for (const action of gridActions) {
        const isDisabled = await listGrid.actionButtonIsDisabled(action, 'grid')
        const text = await action.text()
        if (gridActions.indexOf(action) === 0) {
          expect(text).toBe('OCX_DATA_LIST_GRID.MENU.VIEW')
          expect(isDisabled).toBe(true)
        } else {
          expect(text === 'OCX_DATA_LIST_GRID.MENU.VIEW').toBe(false)
          expect(isDisabled).toBe(false)
        }
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      await gridMenuButton.click()
      await gridMenuButton.click()

      gridActions = await listGrid.getActionButtons('grid')

      for (const action of gridActions) {
        expect(await listGrid.actionButtonIsDisabled(action, 'grid')).toBe(false)
      }
    })
  })

  describe('Hide grid action buttons based on field path', () => {
    it('should not hide any grid action button by default', async () => {
      component.layout = 'grid'
      expect(component.viewItemObserved).toBe(false)
      expect(component.editItemObserved).toBe(false)
      expect(component.deleteItemObserved).toBe(false)

      await setUpGridActionButtonMockData()

      expect(component.viewItemObserved).toBe(true)
      expect(component.editItemObserved).toBe(true)
      expect(component.deleteItemObserved).toBe(true)

      const gridMenuButton = await listGrid.getGridMenuButton()

      await gridMenuButton.click()

      const gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
    })

    it('should dynamically hide/show an action button based on the contents of a specified field', async () => {
      component.layout = 'grid'
      await setUpGridActionButtonMockData()
      const gridMenuButton = await listGrid.getGridMenuButton()

      await gridMenuButton.click()

      let gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
      await gridMenuButton.click()

      component.viewActionVisibleField = 'ready'

      await gridMenuButton.click()
      gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(2)

      for (const action of gridActions) {
        const text = await action.text()
        expect(text === 'OCX_DATA_LIST_GRID.MENU.VIEW').toBe(false)
      }

      const tempData = [...component.data]

      tempData[0]['ready'] = true

      component.data = [...tempData]

      await gridMenuButton.click()
      await gridMenuButton.click()
      gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
    })
  })

  describe('permissions for action buttons', () => {
    let userService: UserServiceMock

    beforeEach(() => {
      component.data = [
        {
          version: 0,
          creationDate: '2023-09-12T09:34:11.997048Z',
          creationUser: 'creation user',
          modificationDate: '2023-09-12T09:34:11.997048Z',
          modificationUser: '',
          id: 'id1',
          name: 'name1',
          description: 'desc1',
          status: 'status1',
          responsible: 'responsible1',
          endDate: '2023-09-14T09:34:09Z',
          startDate: '2023-09-13T09:34:05Z',
          imagePath: '/path/to/image1',
          testNumber: '1',
        },
      ]

      component.viewItem.subscribe(() => console.log('view item'))
      component.editItem.subscribe(() => console.log('edit item'))
      component.deleteItem.subscribe(() => console.log('delete item'))

      userService = TestBed.inject(UserService) as unknown as UserServiceMock
    })

    describe('list layout', () => {
      beforeEach(() => {
        component.layout = 'list'
        component.viewPermission = 'LIST#VIEW'
        component.editPermission = 'LIST#EDIT'
        component.deletePermission = 'LIST#DELETE'
        component.additionalActions = []
      })

      it('should show view, delete and edit action buttons when user has VIEW, EDIT and DELETE permissions', async () => {
        userService.permissionsTopic$.publish(['LIST#VIEW', 'LIST#EDIT', 'LIST#DELETE'])

        fixture.detectChanges()
        await fixture.whenStable()

        let listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(3)

        expect(await listActions[0].getAttribute('icon')).toEqual('pi pi-eye')
        expect(await listActions[1].getAttribute('icon')).toEqual('pi pi-pencil')
        expect(await listActions[2].getAttribute('icon')).toEqual('pi pi-trash')

        userService.permissionsTopic$.publish([])

        listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(0)
      })

      it('should show custom inline actions if user has the required permission', async () => {
        userService.permissionsTopic$.publish(['CUSTOM#ACTION'])

        component.additionalActions = [
          {
            permission: 'CUSTOM#ACTION',
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            icon: 'pi pi-check',
            showAsOverflow: false,
          },
        ]

        fixture.detectChanges()
        await fixture.whenStable()

        let listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(1)
        expect(await listActions[0].getAttribute('id')).toEqual('id1-customActionActionButton')
        userService.permissionsTopic$.publish([])

        listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(0)
      })

      it('should show overflow menu when user has permission for at least one action', async () => {
        userService.permissionsTopic$.publish(['OVERFLOW#ACTION'])

        component.additionalActions = [
          {
            permission: 'OVERFLOW#ACTION',
            callback: () => {
              console.log('overflow action clicked')
            },
            id: 'overflowAction',
            labelKey: 'OVERFLOW_ACTION_KEY',
            showAsOverflow: true,
          },
        ]

        fixture.detectChanges()
        await fixture.whenStable()

        const button = await listGrid.getListOverflowMenuButton()
        await button.click()

        const overflowMenu = await listGrid.getListOverflowMenu()
        expect(overflowMenu).toBeTruthy()
        const menuItems = await overflowMenu?.getAllMenuItems()
        expect(menuItems!.length).toBe(1)
        expect(await menuItems![0].getText()).toEqual('OVERFLOW_ACTION_KEY')

        userService.permissionsTopic$.publish([])
        const newMenuItems = await overflowMenu?.getAllMenuItems()
        expect(newMenuItems!.length).toBe(0)
      })
      it('should display action buttons based on multiple permissions', async () => {
        component.additionalActions = [
          {
            permission: ['CUSTOM#ACTION1', 'CUSTOM#ACTION2'],
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            icon: 'pi pi-check',
            showAsOverflow: false,
          },
          {
            permission: ['OVERFLOW#ACTION1', 'OVERFLOW#ACTION2'],
            callback: () => {
              console.log('overflow action clicked')
            },
            id: 'overflowAction',
            labelKey: 'OVERFLOW_ACTION_KEY',
            showAsOverflow: true,
          },
        ]

        component.viewPermission = ['LIST#VIEW1', 'LIST#VIEW2']
        component.editPermission = ['LIST#EDIT1', 'LIST#EDIT2']
        component.deletePermission = ['LIST#DELETE1', 'LIST#DELETE2']

        userService.permissionsTopic$.publish([
          'LIST#VIEW1',
          'LIST#VIEW2',
          'LIST#EDIT1',
          'LIST#EDIT2',
          'LIST#DELETE1',
          'LIST#DELETE2',
          'CUSTOM#ACTION1',
          'CUSTOM#ACTION2',
          'OVERFLOW#ACTION1',
          'OVERFLOW#ACTION2',
        ])

        fixture.detectChanges()
        await fixture.whenStable()

        const listActions = await listGrid.getActionButtons('list')
        expect(listActions.length).toBe(4)
        expect(await listActions[0].getAttribute('icon')).toEqual('pi pi-eye')
        expect(await listActions[1].getAttribute('icon')).toEqual('pi pi-pencil')
        expect(await listActions[2].getAttribute('icon')).toEqual('pi pi-trash')
        expect(await listActions[3].getAttribute('id')).toEqual('id1-customActionActionButton')

        const button = await listGrid.getListOverflowMenuButton()
        await button.click()

        const overflowMenu = await listGrid.getListOverflowMenu()
        expect(overflowMenu).toBeTruthy()
        const menuItems = await overflowMenu?.getAllMenuItems()
        expect(menuItems!.length).toBe(1)
        expect(await menuItems![0].getText()).toEqual('OVERFLOW_ACTION_KEY')
      })

      describe('action buttons with routerLink', () => {
        it('should render inline action button with routerLink', async () => {
          userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
          const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
          jest.spyOn(console, 'log')

          component.additionalActions = [
            {
              id: 'routerLinkAction',
              callback: () => {
                console.log('My routing Action')
              },
              routerLink: '/inline',
              permission: 'CUSTOM#ACTION',
            },
          ]

          fixture.detectChanges()
          await fixture.whenStable()

          const tableActions = await listGrid.getActionButtons('list')
          expect(tableActions.length).toBe(1)

          await tableActions[0].click()
          expect(spy).toHaveBeenCalledTimes(1)
          expect(spy).toHaveBeenCalledWith(['/inline'])
          expect(console.log).not.toHaveBeenCalledWith('My routing Action')
        })

        it('should render overflow action button with routerLink', async () => {
          userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
          const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

          jest.spyOn(console, 'log')

          component.additionalActions = [
            {
              id: 'routerLinkAction',
              callback: () => {
                console.log('My overflow routing Action')
              },
              routerLink: '/overflow',
              permission: 'CUSTOM#ACTION',
              showAsOverflow: true,
            },
          ]

          fixture.detectChanges()
          await fixture.whenStable()

          const overflowButton = await listGrid.getListOverflowMenuButton()
          await overflowButton.click()

          const overflowMenu = await listGrid.getListOverflowMenu()
          expect(overflowMenu).toBeTruthy()
          const tableActions = await overflowMenu?.getAllMenuItems()
          expect(tableActions!.length).toBe(1)

          await tableActions![0].selectItem()
          expect(spy).toHaveBeenCalledTimes(1)
          expect(spy).toHaveBeenCalledWith(['/overflow'])
          expect(console.log).not.toHaveBeenCalledWith('My overflow routing Action')
        })

        describe('callback actions', () => {
          it('should handle routerLink as function returning string', async () => {
            userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
            const routerLinkFunction = jest.fn(() => '/function-link')

            component.additionalActions = [
              {
                id: 'functionRouterLink',
                callback: jest.fn(),
                routerLink: routerLinkFunction,
                permission: 'CUSTOM#ACTION',
              },
            ]

            fixture.detectChanges()
            await fixture.whenStable()

            const tableActions = await listGrid.getActionButtons('list')
            await tableActions[0].click()

            expect(routerLinkFunction).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(['/function-link'])
          })

          it('should handle routerLink as function returning Promise<string>', async () => {
            userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
            const routerLinkPromiseFunction = jest.fn(() => Promise.resolve('/promise-function-link'))

            component.additionalActions = [
              {
                id: 'promiseFunctionRouterLink',
                callback: jest.fn(),
                routerLink: routerLinkPromiseFunction,
                permission: 'CUSTOM#ACTION',
              },
            ]

            fixture.detectChanges()
            await fixture.whenStable()

            const tableActions = await listGrid.getActionButtons('list')
            await tableActions[0].click()

            expect(routerLinkPromiseFunction).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(['/promise-function-link'])
          })

          it('should handle routerLink as Promise<string>', async () => {
            userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)

            component.additionalActions = [
              {
                id: 'promiseRouterLink',
                callback: jest.fn(),
                routerLink: Promise.resolve('/promise-link'),
                permission: 'CUSTOM#ACTION',
              },
            ]

            fixture.detectChanges()
            await fixture.whenStable()

            const tableActions = await listGrid.getActionButtons('list')
            await tableActions[0].click()

            expect(spy).toHaveBeenCalledWith(['/promise-link'])
          })

          it('should prioritize routerLink over actionCallback when both are provided', async () => {
            userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
            const callbackSpy = jest.fn()

            component.additionalActions = [
              {
                id: 'routerLinkWithCallback',
                callback: callbackSpy,
                routerLink: '/prioritized-link',
                permission: 'CUSTOM#ACTION',
              },
            ]

            fixture.detectChanges()
            await fixture.whenStable()

            const tableActions = await listGrid.getActionButtons('list')
            await tableActions[0].click()

            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(['/prioritized-link'])
            expect(callbackSpy).not.toHaveBeenCalled()
          })

          it('should prioritize routerLink over actionCallback in overflow menu when both are provided', async () => {
            userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
            const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
            const callbackSpy = jest.fn()

            component.additionalActions = [
              {
                id: 'overflowRouterLinkWithCallback',
                callback: callbackSpy,
                routerLink: '/overflow-prioritized',
                permission: 'CUSTOM#ACTION',
                showAsOverflow: true,
              },
            ]

            fixture.detectChanges()
            await fixture.whenStable()

            const overflowButton = await listGrid.getListOverflowMenuButton()
            await overflowButton.click()

            const overflowMenu = await listGrid.getListOverflowMenu()
            expect(overflowMenu).toBeTruthy()
            const tableActions = await overflowMenu?.getAllMenuItems()
            expect(tableActions!.length).toBe(1)

            await tableActions![0].selectItem()
            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith(['/overflow-prioritized'])
            expect(callbackSpy).not.toHaveBeenCalled()
          })
        })
    
        it('should execute actionCallback when no routerLink is provided', async () => {
          userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
          const spy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
          const callbackSpy = jest.fn()

          component.additionalActions = [
            {
              id: 'callbackOnlyAction',
              callback: callbackSpy,
              permission: 'CUSTOM#ACTION',
            },
          ]

          fixture.detectChanges()
          await fixture.whenStable()

          const tableActions = await listGrid.getActionButtons('list')
          await tableActions[0].click()

          expect(spy).not.toHaveBeenCalled()
          expect(callbackSpy).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('grid layout', () => {
      beforeEach(() => {
        component.layout = 'grid'
        component.viewPermission = 'GRID#VIEW'
        component.viewMenuItemKey = 'GRID_VIEW_KEY'
        component.editPermission = 'GRID#EDIT'
        component.editMenuItemKey = 'GRID_EDIT_KEY'
        component.deletePermission = 'GRID#DELETE'
        component.deleteMenuItemKey = 'GRID_DELETE_KEY'
        component.additionalActions = []
      })
      it('should show view, delete and edit action buttons when user has VIEW, DELETE and EDIT permissions', async () => {
        userService.permissionsTopic$.publish(['GRID#VIEW', 'GRID#EDIT', 'GRID#DELETE'])

        const gridMenuButton = await listGrid.getGridMenuButton()
        await gridMenuButton.click()

        let gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(3)

        expect(await gridActions[0].text()).toEqual('GRID_VIEW_KEY')
        expect(await gridActions[1].text()).toEqual('GRID_EDIT_KEY')
        expect(await gridActions[2].text()).toEqual('GRID_DELETE_KEY')

        userService.permissionsTopic$.publish([])

        await gridMenuButton.click()
        gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(0)
      })

      it('should show custom additional action buttons when user has the required permission', async () => {
        userService.permissionsTopic$.publish(['CUSTOM#ACTION'])

        component.additionalActions = [
          {
            permission: 'CUSTOM#ACTION',
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            labelKey: 'CUSTOM_ACTION_KEY',
          },
        ]

        const gridMenuButton = await listGrid.getGridMenuButton()
        await gridMenuButton.click()

        let gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(1)
        expect(await gridActions[0].text()).toEqual('CUSTOM_ACTION_KEY')

        userService.permissionsTopic$.publish([])

        await gridMenuButton.click()
        gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(0)
      })

      it('should display action buttons based on multiple permissions', async () => {
        component.additionalActions = [
          {
            permission: ['CUSTOM#ACTION1', 'CUSTOM#ACTION2'],
            callback: () => {
              console.log('custom action clicked')
            },
            id: 'customAction',
            labelKey: 'CUSTOM_ACTION_KEY',
          },
        ]

        component.viewPermission = ['GRID#VIEW1', 'GRID#VIEW2']
        component.editPermission = ['GRID#EDIT1', 'GRID#EDIT2']
        component.deletePermission = ['GRID#DELETE1', 'GRID#DELETE2']

        userService.permissionsTopic$.publish([
          'GRID#VIEW1',
          'GRID#VIEW2',
          'GRID#EDIT1',
          'GRID#EDIT2',
          'GRID#DELETE1',
          'GRID#DELETE2',
          'CUSTOM#ACTION1',
          'CUSTOM#ACTION2',
        ])

        const gridMenuButton = await listGrid.getGridMenuButton()
        await gridMenuButton.click()

        const gridActions = await listGrid.getActionButtons('grid')
        expect(gridActions.length).toBe(4)
        expect(await gridActions[0].text()).toEqual('GRID_VIEW_KEY')
        expect(await gridActions[1].text()).toEqual('GRID_EDIT_KEY')
        expect(await gridActions[2].text()).toEqual('GRID_DELETE_KEY')
        expect(await gridActions[3].text()).toEqual('CUSTOM_ACTION_KEY')
      })

      it('should execute handleActionSync when grid menu item with routerLink is clicked', async () => {
        userService.permissionsTopic$.publish(['CUSTOM#ACTION'])
        const routerSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
        
        component.additionalActions = [
          {
            permission: 'CUSTOM#ACTION',
            routerLink: '/test-route',
            id: 'customAction',
            labelKey: 'CUSTOM_ACTION_KEY',
            callback: jest.fn()
          },
        ]
        
        component.setSelectedItem(mockData[0])
        fixture.detectChanges()
        await fixture.whenStable()

        const menuItems = await firstValueFrom(component.gridMenuItems$)
        
        const customMenuItem = menuItems.find(item => item.label === 'CUSTOM_ACTION_KEY')
        expect(customMenuItem).toBeTruthy()
        expect(customMenuItem?.command).toBeDefined()
        
        const dummyEvent = { originalEvent: new Event('click') } as any
        customMenuItem!.command!(dummyEvent)

        await fixture.whenStable()
        
        expect(routerSpy).toHaveBeenCalledWith(['/test-route'])
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

        component.data = mockData
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('5 Ergebnisse gefunden')
      })

      it('en', async () => {
        translateService.use('en')

        component.data = mockData
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('5 Results Found')
      })
    })

    describe('should announce "no results found" when data is empty', () => {
      it('de', async () => {
        translateService.use('de')

        component.data = []
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('Keine Ergebnisse gefunden')
      })

      it('en', async () => {
        translateService.use('en')

        component.data = []
        fixture.detectChanges()

        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(1)
        expect(announceSpy).toHaveBeenCalledWith('No Results Found')
      })
    })

    describe('should announce "results found" when data changes', () => {
      it('de', async () => {
        translateService.use('de')

        component.data = mockData
        fixture.detectChanges()
        await fixture.whenStable()

        component.data = mockData.slice(0, 2)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(2)
        expect(announceSpy).toHaveBeenNthCalledWith(1, '5 Ergebnisse gefunden')
        expect(announceSpy).toHaveBeenNthCalledWith(2, '2 Ergebnisse gefunden')
      })

      it('en', async () => {
        translateService.use('en')

        component.data = mockData
        fixture.detectChanges()
        await fixture.whenStable()

        component.data = mockData.slice(0, 2)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(announceSpy).toHaveBeenCalledTimes(2)
        expect(announceSpy).toHaveBeenNthCalledWith(1, '5 Results Found')
        expect(announceSpy).toHaveBeenNthCalledWith(2, '2 Results Found')
      })
    })
  })
})
