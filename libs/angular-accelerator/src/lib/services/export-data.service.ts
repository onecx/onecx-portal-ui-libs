import { Injectable, LOCALE_ID, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, firstValueFrom, map, of } from 'rxjs'
import { DateUtils } from '../utils/dateutils'
import { ColumnType } from '../model/column-type.model'
import { ObjectUtils } from '../utils/objectutils'
import * as ExcelJS from '@protobi/exceljs';
import { DataTableColumn } from '../model/data-table-column.model'

type DataExportColumn = { id: string; nameKey: string; columnType: ColumnType, name?: string }

@Injectable({ providedIn: 'any' })
export class ExportDataService {
  private readonly dateUtils = inject(DateUtils)
  private readonly translateService = inject(TranslateService)
  private readonly locale = inject(LOCALE_ID)

  private readonly EXCEL_TABLE_STARTING_CELL = 'A1'

  async exportCsv<T extends string | number | symbol>(
    columns: { id: string; nameKey: string; columnType: ColumnType }[],
    data: Partial<Record<T, unknown | undefined>>[],
    fileName: string
  ): Promise<void> {
    if (!columns.length) {
      return
    }
    const dataToExport = await this.getDataToExport(columns, data)
    const delimiter = this.locale.startsWith('de') ? ';' : ','
    const dataString = dataToExport
      .map((d) =>
        columns
          .reduce((arr: unknown[], c) => [...arr, d[c.id]], [])
          .map((d) => this.escapeDelimiterAndLineBreaks(delimiter, d))
          .join(delimiter)
      )
      .join('\r\n')
    const headerString = (await firstValueFrom(this.translateColumnNames(columns)))
      .map((c) => c.name)
      .map((c) => this.escapeDelimiterAndLineBreaks(delimiter, c))
      .join(delimiter)

    const csvString = headerString + '\r\n' + dataString

    const blob = new Blob(['\ufeff' + csvString], {
      type: 'text/csv;charset=utf-8;',
    })
    this.handleFileDownload(blob, fileName)
  }

  async exportToExcel<T extends string | number>(
    columns: DataExportColumn[],
    data: Partial<Record<T, unknown | undefined>>[],
    fileName: string
  ): Promise<void> {
    if (!columns.length) {
      return
    }
    const dataToExport = await this.getDataToExport(columns, data)
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet()
    await this.addWorksheetTable(worksheet, columns, dataToExport, fileName)

    const excelBuffer = await workbook.xlsx.writeBuffer()
    const excelBlob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    this.handleFileDownload(excelBlob, fileName)
  }

  private async getDataToExport(columns: DataTableColumn[], data: Partial<Record<string, unknown | undefined>>[]) {
    const flattenedData = data.map((d) =>
      columns.reduce((obj, c) => ({ ...obj, [c.id]: ObjectUtils.resolveFieldData(d, c.id) }), {})
    )
    const translatedData = await firstValueFrom(this.translateData(columns, flattenedData))
    return this.formatData(columns, translatedData)
  }

  private translateColumnNames(
    columns: DataExportColumn[]
  ): Observable<DataExportColumn[]> {
    return this.translateService
      .get(columns.map((c) => c.nameKey))
      .pipe(map((translations) => columns.map((c) => ({ ...c, name: translations[c.nameKey] }))))
  }

  private formatData(
    columns: DataExportColumn[],
    data: Record<string, unknown>[]
  ): { [columnId: string]: unknown }[] {
    return data.map((d) =>
      columns.reduce((obj, c) => {
        if (c.columnType === ColumnType.DATE || c.columnType === ColumnType.RELATIVE_DATE) {
          return {
            ...obj,
            [c.id]: this.dateUtils.localizedDate(d[c.id] ? String(d[c.id]) : undefined),
          }
        }
        return { ...obj, [c.id]: d[c.id] }
      }, {})
    )
  }

  private translateData(
    columns: DataExportColumn[],
    data: Record<string, unknown>[]
  ): Observable<{ [columnId: string]: unknown }[]> {
    let translationKeys: string[] = []
    const translatedColumns = columns.filter((c) => c.columnType === ColumnType.TRANSLATION_KEY)
    translatedColumns.forEach((c) => {
      translationKeys = [...translationKeys, ...data.map((i) => i[c.id]?.toString() ?? '')]
    })
    if (translationKeys.length) {
      return this.translateService.get(translationKeys).pipe(
        map((translatedValues: Record<string, string>) => {
          return data.map((d) =>
            columns.reduce(
              (obj, c) => ({
                ...obj,
                [c.id]: c.columnType === ColumnType.TRANSLATION_KEY ? translatedValues[String(d[c.id])] : d[c.id],
              }),
              {}
            )
          )
        })
      )
    }
    return of(data)
  }

  private escapeDelimiterAndLineBreaks(delimiter: ';' | ',', data: unknown) {
    if (data === null || data === undefined) {
      return data
    }

    let str = String(data)

    if (str.includes('"')) {
      str = str.replaceAll('"', '""')
    }

    if (str.includes(delimiter) || str.includes('\n') || str.includes('\r')) {
      str = `"${str}"`
    }
    return str
  }

  private async addWorksheetTable(worksheet: ExcelJS.Worksheet, columns: DataExportColumn[], 
                            data: {[columnId: string]: unknown}[], fileName: string) {
    const translatedColumns = await firstValueFrom(this.getExcelColumnDefinitions(columns))
    const tableName = await firstValueFrom(this.getTableName(fileName))
    worksheet.addTable({
      name: tableName,
      ref: this.EXCEL_TABLE_STARTING_CELL,
      headerRow: true,
      totalsRow: false,
      style: {
        showRowStripes: true
      },
      columns: translatedColumns,
      rows: this.transformDataForExcel(data)
    })
  }

  private getExcelColumnDefinitions(columns: DataExportColumn[]): Observable<ExcelJS.TableColumnProperties[]> {
    return this.translateColumnNames(columns).pipe(
      map((columns) => columns.map((column: DataExportColumn) => ({
        name: column.name || column.id,
        filterButton: true
      })))
    )
  }

  private transformDataForExcel(data: {[columnId: string]: unknown}[]): unknown[][] {
    return data.map((dataEntry) => Object.values(dataEntry));
  }

  private getTableName(fileName: string): Observable<string> {
    const formattedFileName = fileName.replace('.xlsx', '')
    return this.translateService.get('OCX_DATA_EXPORT.EXCEL_TABLE_NAME', {fileName: formattedFileName})
  }

  private handleFileDownload(fileBlob: Blob, fileName: string) {
    const downloadLink = document.createElement('a')
    const excelURL = URL.createObjectURL(fileBlob)
    downloadLink.setAttribute('href', excelURL)
    downloadLink.setAttribute('download', fileName)
    downloadLink.click()
    URL.revokeObjectURL(excelURL)
  }
}
