import { TestBed } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { ColumnType } from '../model/column-type.model'
import { ExportDataService } from './export-data.service'

describe('ExportDataService', () => {
  class ElementMock {
    attributes: Record<string, unknown> = {}
    setAttribute(name: string, value: unknown) {
      this.attributes[name] = value
    }
    click() {}
  }

  let blobs: Blob[] = []

  let translateService: TranslateService
  let exportDataService: ExportDataService

  const ENGLISH_LANGUAGE = 'en'
  const ENGLISH_TRANSLATIONS = {
    SOME_STATUS: 'some status',
    STATUS_EXAMPLE: 'some status example',
    STATUS_NAME_1: 'status name 1',
    STATUS_NAME_2: 'status name 2',
    STATUS_NAME_3: 'status name 3',
    COLUMN_HEADER_NAME: {
      NAME: 'Name',
      STATUS: 'Status',
      DESCRIPTION: 'Description',
      RESPONSIBLE: 'Responsible',
      START_DATE: 'Start date',
      END_DATE: 'End date',
      MODIFICATION_DATE: 'Modification date',
      CREATION_USER: 'Creation user',
      TEST_NUMBER: 'Test number',
    },
  }

  const GERMAN_LANGUAGE = 'de'
  const GERMAN_TRANSLATIONS = {
    SOME_STATUS: 'irgendein Status',
    STATUS_EXAMPLE: 'irgendein Beispielstatus',
    STATUS_NAME_1: 'Status Name 1',
    STATUS_NAME_2: 'Status Name 2',
    STATUS_NAME_3: 'Status Name 3',
    COLUMN_HEADER_NAME: {
      NAME: 'Name',
      STATUS: 'Status',
      DESCRIPTION: 'Beschreibung',
      RESPONSIBLE: 'Verantwortlich',
      START_DATE: 'Startdatum',
      END_DATE: 'Enddatum',
      MODIFICATION_DATE: 'Änderungsdatum',
      CREATION_USER: 'Erstellungsbenutzer',
      TEST_NUMBER: 'Testnummer',
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
      status: 'SOME_STATUS',
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
      status: 'STATUS_EXAMPLE',
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
      status: 'STATUS_NAME_1',
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
      status: 'STATUS_NAME_2',
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
      status: 'STATUS_NAME_3',
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
      declarations: [],
      imports: [TranslateModule.forRoot(), TranslateTestingModule.withTranslations(TRANSLATIONS)],
      providers: [ExportDataService],
    }).compileComponents()

    translateService = TestBed.inject(TranslateService)
    translateService.use('en')

    exportDataService = TestBed.inject(ExportDataService)

    blobs = []
  })

  it('should export data as csv in en', async () => {
    const expectedHref =
      'Name,Description,Start date,End date,Status,Responsible,Modification date,Creation user,Test number' +
      '\r\nsome name,,Sep 13, 2023, 11:34:05 AM,Sep 14, 2023, 11:34:09 AM,some status,someone responsible,Sep 12, 2023, 11:34:11 AM,creation user,1' +
      '\r\nexample,example description,Sep 12, 2023, 11:33:53 AM,Sep 13, 2023, 11:33:55 AM,some status example,,Sep 12, 2023, 11:33:58 AM,,3.141' +
      '\r\nname 1,,Sep 14, 2023, 11:34:22 AM,Sep 15, 2023, 11:34:24 AM,status name 1,,Sep 12, 2023, 11:34:27 AM,,123456789' +
      '\r\nname 2,,Sep 14, 2023, 11:34:22 AM,Sep 15, 2023, 11:34:24 AM,status name 2,,Sep 12, 2023, 11:34:27 AM,,12345.6789' +
      '\r\nname 3,,Sep 14, 2023, 11:34:22 AM,Sep 15, 2023, 11:34:24 AM,status name 3,,Sep 12, 2023, 11:34:27 AM,,7.1'
    const expectedFilename = 'some-test.csv'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.export(mockColumns, mockData, 'some-test.csv')

    expect(expectedHref).toEqual(await blobs[Number(mock.attributes['href'])].text())
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })

  it('should export data as csv in de', async () => {
    translateService.use('de')
    const expectedFilename = 'some-test.csv'
    const expectedHref =
      'Name,Beschreibung,Startdatum,Enddatum,Status,Verantwortlich,Änderungsdatum,Erstellungsbenutzer,Testnummer' +
      '\r\nsome name,,Sep 13, 2023, 11:34:05 AM,Sep 14, 2023, 11:34:09 AM,irgendein Status,someone responsible,Sep 12, 2023, 11:34:11 AM,creation user,1' +
      '\r\nexample,example description,Sep 12, 2023, 11:33:53 AM,Sep 13, 2023, 11:33:55 AM,irgendein Beispielstatus,,Sep 12, 2023, 11:33:58 AM,,3.141' +
      '\r\nname 1,,Sep 14, 2023, 11:34:22 AM,Sep 15, 2023, 11:34:24 AM,Status Name 1,,Sep 12, 2023, 11:34:27 AM,,123456789' +
      '\r\nname 2,,Sep 14, 2023, 11:34:22 AM,Sep 15, 2023, 11:34:24 AM,Status Name 2,,Sep 12, 2023, 11:34:27 AM,,12345.6789' +
      '\r\nname 3,,Sep 14, 2023, 11:34:22 AM,Sep 15, 2023, 11:34:24 AM,Status Name 3,,Sep 12, 2023, 11:34:27 AM,,7.1'
    const mock = new ElementMock()

    jest.spyOn(document, 'createElement').mockReturnValue(<any>mock)
    URL.createObjectURL = jest.fn().mockImplementation((b: Blob) => {
      blobs.push(b)
      return (blobs.length - 1).toString()
    })
    await exportDataService.export(mockColumns, mockData, 'some-test.csv')

    expect(expectedHref).toEqual(await blobs[Number(mock.attributes['href'])].text())
    expect(expectedFilename).toEqual(mock.attributes['download'])
  })
})
