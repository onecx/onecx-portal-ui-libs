import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { UserService } from '@onecx/angular-integration-interface'
import { MockUserService, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DataListGridComponent } from './data-list-grid.component'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { ColumnType } from '../../model/column-type.model'
import { DataListGridHarness } from '../../../../testing/data-list-grid.harness'
import { DataTableHarness } from '../../../../testing/data-table.harness'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'

describe('DataListGridComponent', () => {
  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock
  
  let fixture: ComponentFixture<DataListGridComponent>
  let component: DataListGridComponent
  let translateService: TranslateService
  let listGrid: DataListGridHarness

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
      declarations: [DataListGridComponent],
      imports: [
        AngularAcceleratorPrimeNgModule,
        TranslateModule.forRoot(),
        TranslateTestingModule.withTranslations(TRANSLATIONS),
        AngularAcceleratorModule,
        RouterModule,
        NoopAnimationsModule,
      ],
      providers: [
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
        { provide: UserService, useClass: MockUserService },
        provideAppStateServiceMock(),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DataListGridComponent)
    component = fixture.componentInstance
    component.data = mockData
    component.columns = mockColumns
    component.paginator = true
    translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    fixture.detectChanges()
    listGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
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

  describe('should display the paginator rowsPerPageOptions -', () => {
    it('de', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      translateService.use('de')
      fixture = TestBed.createComponent(DataListGridComponent)
      component = fixture.componentInstance
      component.data = mockData
      component.columns = mockColumns
      component.paginator = true
      fixture.detectChanges()
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataListGrid.getPaginator()
      const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
      const rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(0)
      expect(rowsPerPageOptionsText).toEqual('Alle')
    })

    it('en', async () => {
      window.HTMLElement.prototype.scrollIntoView = jest.fn()
      translateService.use('en')
      const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
      const paginator = await dataListGrid.getPaginator()
      const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
      const rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(0)
      expect(rowsPerPageOptionsText).toEqual('All')
    })
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

      const gridMenuButton = await listGrid.getMenuButton()

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
      const gridMenuButton = await listGrid.getMenuButton()

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

      const gridMenuButton = await listGrid.getMenuButton()

      await gridMenuButton.click()

      const gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(3)
    })

    it('should dynamically hide/show an action button based on the contents of a specified field', async () => {
      component.layout = 'grid'
      await setUpGridActionButtonMockData()
      component.viewActionVisibleField = 'ready'
      const gridMenuButton = await listGrid.getMenuButton()

      await gridMenuButton.click()

      let gridActions = await listGrid.getActionButtons('grid')
      expect(gridActions.length).toBe(2)

      let hiddenGridActions = await listGrid.getActionButtons('grid-hidden')
      expect(hiddenGridActions.length).toBe(1)
      expect(await hiddenGridActions[0].text()).toBe('OCX_DATA_LIST_GRID.MENU.VIEW')

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
      hiddenGridActions = await listGrid.getActionButtons('grid-hidden')
      expect(hiddenGridActions.length).toBe(0)
    })
  })
})
