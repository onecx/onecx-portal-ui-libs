// import { ComponentFixture, TestBed } from '@angular/core/testing'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// import { TranslateModule, TranslateService } from '@ngx-translate/core'
// import { DataListGridComponent } from './data-list-grid.component'
// import { PrimeNgModule } from '../../primeng.module';
// import { TranslateTestingModule } from 'ngx-translate-testing';
// import { ColumnType } from '../../../model/column-type.model';
// import { PortalCoreModule } from '../../portal-core.module';
// import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
// import { DataListGridHarness, DataTableHarness } from '../../../../../../../libs/portal-integration-angular/testing';
// import { MockAuthModule } from '../../../mock-auth/mock-auth.module';
// import { ActivatedRoute, RouterModule } from '@angular/router';

// describe('DataListGridComponent', () => {
//     let fixture: ComponentFixture<DataListGridComponent>
//     let component: DataListGridComponent
//     let translateService: TranslateService

//     const ENGLISH_LANGUAGE = 'en';
//     const ENGLISH_TRANSLATIONS = {
//         OCX_DATA_TABLE: {
//             SHOWING: "{{first}} - {{last}} of {{totalRecords}}",
//             SHOWING_WITH_TOTAL_ON_SERVER: "{{first}} - {{last}} of {{totalRecords}} ({{totalRecordsOnServer}})",
//             ALL: "All"
//         }
//     };

//     const GERMAN_LANGUAGE = 'de';
//     const GERMAN_TRANSLATIONS = {
//         OCX_DATA_TABLE: {
//             SHOWING: "{{first}} - {{last}} von {{totalRecords}}",
//             SHOWING_WITH_TOTAL_ON_SERVER: "{{first}} - {{last}} von {{totalRecords}} ({{totalRecordsOnServer}})",
//             ALL: "Alle"
//         }
//     };

//     const TRANSLATIONS = {
//         [ENGLISH_LANGUAGE]: ENGLISH_TRANSLATIONS,
//         [GERMAN_LANGUAGE]: GERMAN_TRANSLATIONS
//     };

//     const mockData = [
//         {
//             version: 0,
//             creationDate: '2023-09-12T09:34:11.997048Z',
//             creationUser: 'creation user',
//             modificationDate: '2023-09-12T09:34:11.997048Z',
//             modificationUser: '',
//             id: '195ee34e-41c6-47b7-8fc4-3f245dee7651',
//             name: 'some name',
//             description: '',
//             status: 'some status',
//             responsible: 'someone responsible',
//             endDate: '2023-09-14T09:34:09Z',
//             startDate: '2023-09-13T09:34:05Z',
//             imagePath: '/path/to/image',
//             testNumber: '1',
//         },
//         {
//             version: 0,
//             creationDate: '2023-09-12T09:33:58.544494Z',
//             creationUser: '',
//             modificationDate: '2023-09-12T09:33:58.544494Z',
//             modificationUser: '',
//             id: '5f8bb05b-d089-485e-a234-0bb6ff25234e',
//             name: 'example',
//             description: 'example description',
//             status: 'status example',
//             responsible: '',
//             endDate: '2023-09-13T09:33:55Z',
//             startDate: '2023-09-12T09:33:53Z',
//             imagePath: '',
//             testNumber: '3.141',
//         },
//         {
//             version: 0,
//             creationDate: '2023-09-12T09:34:27.184086Z',
//             creationUser: '',
//             modificationDate: '2023-09-12T09:34:27.184086Z',
//             modificationUser: '',
//             id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
//             name: 'name 1',
//             description: '',
//             status: 'status name 1',
//             responsible: '',
//             endDate: '2023-09-15T09:34:24Z',
//             startDate: '2023-09-14T09:34:22Z',
//             imagePath: '',
//             testNumber: '123456789',
//         },
//         {
//             version: 0,
//             creationDate: '2023-09-12T09:34:27.184086Z',
//             creationUser: '',
//             modificationDate: '2023-09-12T09:34:27.184086Z',
//             modificationUser: '',
//             id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
//             name: 'name 2',
//             description: '',
//             status: 'status name 2',
//             responsible: '',
//             endDate: '2023-09-15T09:34:24Z',
//             startDate: '2023-09-14T09:34:22Z',
//             imagePath: '',
//             testNumber: '12345.6789',
//         },
//         {
//             version: 0,
//             creationDate: '2023-09-12T09:34:27.184086Z',
//             creationUser: '',
//             modificationDate: '2023-09-12T09:34:27.184086Z',
//             modificationUser: '',
//             id: 'cf9e7d6b-5362-46af-91f8-62f7ef5c6064',
//             name: 'name 3',
//             description: '',
//             status: 'status name 3',
//             responsible: '',
//             endDate: '2023-09-15T09:34:24Z',
//             startDate: '2023-09-14T09:34:22Z',
//             imagePath: '',
//             testNumber: '7.1',
//         },
//     ]
//     const mockColumns = [
//         {
//             columnType: ColumnType.STRING,
//             id: 'name',
//             nameKey: 'COLUMN_HEADER_NAME.NAME',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.STRING,
//             id: 'description',
//             nameKey: 'COLUMN_HEADER_NAME.DESCRIPTION',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.DATE,
//             id: 'startDate',
//             nameKey: 'COLUMN_HEADER_NAME.START_DATE',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.DATE,
//             id: 'endDate',
//             nameKey: 'COLUMN_HEADER_NAME.END_DATE',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.TRANSLATION_KEY,
//             id: 'status',
//             nameKey: 'COLUMN_HEADER_NAME.STATUS',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.STRING,
//             id: 'responsible',
//             nameKey: 'COLUMN_HEADER_NAME.RESPONSIBLE',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.DEFAULT', 'PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.RELATIVE_DATE,
//             id: 'modificationDate',
//             nameKey: 'COLUMN_HEADER_NAME.MODIFICATION_DATE',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.STRING,
//             id: 'creationUser',
//             nameKey: 'COLUMN_HEADER_NAME.CREATION_USER',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.FULL'],
//         },
//         {
//             columnType: ColumnType.NUMBER,
//             id: 'testNumber',
//             nameKey: 'COLUMN_HEADER_NAME.TEST_NUMBER',
//             filterable: true,
//             sortable: true,
//             predefinedGroupKeys: ['PREDEFINED_GROUP.EXTENDED', 'PREDEFINED_GROUP.FULL'],
//         },
//     ]
//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [DataListGridComponent],
//             imports: [PrimeNgModule, BrowserAnimationsModule, TranslateModule.forRoot(), TranslateTestingModule.withTranslations(TRANSLATIONS),
//                 PortalCoreModule, MockAuthModule, RouterModule],
//             providers: [
//                 {
//                     provide: ActivatedRoute,
//                     useValue: {
//                         snapshot: {
//                             paramMap: {
//                                 get: () => '1',
//                             },
//                         },
//                     },
//                 },
//             ],
//         }).compileComponents()

//         fixture = TestBed.createComponent(DataListGridComponent)
//         component = fixture.componentInstance
//         component.data = mockData
//         component.columns = mockColumns
//         component.paginator = true
//         translateService = TestBed.inject(TranslateService)
//         translateService.use('en')
//         fixture.detectChanges()
//     })

//     it('should create the data list grid component', () => {
//         expect(component).toBeTruthy()
//     })

//     it('loads dataListGrid', async () => {
//         const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
//         expect(dataListGrid).toBeTruthy()
//     })

//     describe('should display the paginator currentPageReport -', () => {
//         it('de', async () => {
//             translateService.use('de')
//             const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
//             const paginator = await dataListGrid.getPaginator()
//             const currentPageReport = await paginator.getCurrentPageReportText()
//             expect(currentPageReport).toEqual('1 - 5 von 5')
//         })

//         it('en', async () => {
//             translateService.use('en')
//             const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
//             const paginator = await dataListGrid.getPaginator()
//             const currentPageReport = await paginator.getCurrentPageReportText()
//             expect(currentPageReport).toEqual('1 - 5 of 5')
//         })
//     })

//     describe('should display the paginator currentPageReport  with totalRecordsOnServer -', () => {
//         it('de', async () => {
//             component.totalRecordsOnServer = 10
//             translateService.use('de')
//             const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
//             const paginator = await dataListGrid.getPaginator()
//             const currentPageReport = await paginator.getCurrentPageReportText()
//             expect(currentPageReport).toEqual('1 - 5 von 5 (10)')
//         })

//         it('en', async () => {
//             component.totalRecordsOnServer = 10
//             translateService.use('en')
//             const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataListGridHarness)
//             const paginator = await dataListGrid.getPaginator()
//             const currentPageReport = await paginator.getCurrentPageReportText()
//             expect(currentPageReport).toEqual('1 - 5 of 5 (10)')
//         })
//     })

//     describe('should display the paginator rowsPerPageOptions -', () => {
//         it('de', async () => {
//             window.HTMLElement.prototype.scrollIntoView = jest.fn()
//             translateService.use('de')
//             const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
//             const paginator = await dataListGrid.getPaginator()
//             const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
//             const rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(3)
//             expect(rowsPerPageOptionsText).toEqual('Alle')
//           })

//           it('en', async () => {
//             window.HTMLElement.prototype.scrollIntoView = jest.fn()
//             translateService.use('en')
//             const dataListGrid = await TestbedHarnessEnvironment.harnessForFixture(fixture, DataTableHarness)
//             const paginator = await dataListGrid.getPaginator()
//             const rowsPerPageOptions = await paginator.getRowsPerPageOptions()
//             const rowsPerPageOptionsText = await rowsPerPageOptions.selectedDropdownItemText(3)
//             expect(rowsPerPageOptionsText).toEqual('All')
//           })
//     })

// })
