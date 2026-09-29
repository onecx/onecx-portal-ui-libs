import { Component, Input, inject, importProvidersFrom } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Meta, applicationConfig, componentWrapperDecorator, moduleMetadata } from '@storybook/angular'
import { ButtonModule } from 'primeng/button'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TooltipModule } from 'primeng/tooltip'
import { DialogMessageContentComponent } from '../../dialog/dialog-message-content/dialog-message-content.component'
import { DialogContentComponent } from '../../dialog/dialog-content/dialog-content.component'
import { DialogFooterComponent } from '../../dialog/dialog-footer/dialog-footer.component'
import { StorybookTranslateModule } from '../../../storybook-translate.module'
import { StorybookThemeModule } from '../../../storybook-theme.module'
import { OcxTooltipDirective } from '../../../directives/tooltip.directive'
import { PortalDialogService } from '../../../services/portal-dialog.service'
import { ColumnType } from '../../../model/column-type.model'
import { Filter, FilterType } from '../../../model/filter.model'
import { DataTableColumn } from '../../../model/data-table-column.model'
import { RowListGridData } from '../../../model/row-list-grid-data.model'
import { AddFilterDialogComponent } from './add-filter-dialog.component'

/**
 * Sample columns / data used by the story so the Add Filter dialog shows realistic
 * options. `product` (STRING) and `date` (DATE) are the two interesting columns:
 * STRING values are shown raw, DATE values are formatted via the locale.
 */
const sampleColumns: DataTableColumn[] = [
  {
    id: 'product',
    columnType: ColumnType.STRING,
    nameKey: 'Product',
    sortable: false,
    filterable: true,
    predefinedGroupKeys: ['test', 'all'],
  },
  {
    id: 'amount',
    columnType: ColumnType.NUMBER,
    nameKey: 'Amount',
    sortable: true,
    predefinedGroupKeys: ['test', 'test1', 'all'],
  },
  {
    id: 'date',
    columnType: ColumnType.DATE,
    nameKey: 'Date',
    sortable: false,
    filterable: true,
    predefinedGroupKeys: ['test2', 'all'],
  },
]

const sampleData: RowListGridData[] = [
  { id: 1, product: 'Apples', amount: 2, imagePath: '', date: new Date(2022, 1, 1, 13, 14, 55, 120) },
  { id: 2, product: 'Bananas', amount: 10, imagePath: '', date: new Date(2022, 1, 1, 13, 14, 55, 120) },
  { id: 3, product: 'Strawberries', amount: 5, imagePath: '', date: new Date(2022, 1, 3, 13, 14, 55, 120) },
  { id: 4, product: 'Apples', amount: 7, imagePath: '', date: new Date(2022, 1, 5, 13, 14, 55, 120) },
]

/**
 * Host that opens the Add Filter dialog through the real PortalDialogService - the
 * same wiring the Filter View uses (see filter-view.component.ts `onAddFilter`).
 */
@Component({
  standalone: false,
  selector: 'ocx-add-filter-dialog-host',
  template: `<p-button label="Open Add Filter dialog" icon="pi pi-plus" (click)="openDialog()" id="openAddFilterDialog"/>`,
})
class AddFilterDialogHostComponent {
  private readonly portalDialogService = inject(PortalDialogService)

  @Input() columns: DataTableColumn[] = sampleColumns
  @Input() data: RowListGridData[] = sampleData
  @Input() existingFilters: Filter[] = []
  @Input() preselectColumnId?: string

  openDialog() {
    this.portalDialogService
      .openDialog<Filter[]>(
        'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.TITLE',
        {
          type: AddFilterDialogComponent,
          inputs: {
            columns: this.columns,
            data: this.data,
            existingFilters: this.existingFilters,
            preselectColumnId: this.preselectColumnId,
          },
        },
        'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CONFIRM_BUTTON',
        'OCX_FILTER_VIEW.ADD_FILTER.DIALOG.CANCEL_BUTTON',
        { closeAriaLabel: 'Close add filter dialog' }
      )
      .subscribe((state) => {
        if (state?.result) {
          console.log('Add Filter dialog confirmed', state.result)
        }
      })
  }
}

export default {
  title: 'Components/FilterView/AddFilterDialog',
  component: AddFilterDialogComponent,
  decorators: [
    // The real PortalDialogService opens the dialog (see the PortalDialogService story
    // for the proven wiring). Only the explicit PrimeNG DialogService + DynamicDialog
    // tokens need to be provided here; Router / AppStateService / ShellCapabilityService
    // resolve in this Storybook environment.
    applicationConfig({
      providers: [
        importProvidersFrom(BrowserModule),
        importProvidersFrom(BrowserAnimationsModule),
        DialogService,
        DynamicDialogConfig,
        DynamicDialogRef,
        PortalDialogService,
        importProvidersFrom(StorybookTranslateModule),
        importProvidersFrom(StorybookThemeModule),
      ],
    }),
    moduleMetadata({
      declarations: [
        AddFilterDialogHostComponent,
        // Non-standalone shell components used by the PortalDialogService.
        DialogMessageContentComponent,
        DialogContentComponent,
        DialogFooterComponent,
      ],
      imports: [StorybookTranslateModule, ButtonModule, TooltipModule, FormsModule, OcxTooltipDirective],
    }),
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
} as Meta<AddFilterDialogHostComponent>

export const Basic = {
  render: (args: any) => ({
    props: { ...args },
    template: `<ocx-add-filter-dialog-host [columns]="columns" [data]="data" [existingFilters]="existingFilters" [preselectColumnId]="preselectColumnId"/>`,
  }),
  args: {
    columns: sampleColumns,
    data: sampleData,
    existingFilters: [],
    preselectColumnId: 'product',
  },
}

export const WithPreselectedValues = {
  render: (args: any) => ({
    props: { ...args },
    template: `<ocx-add-filter-dialog-host [columns]="columns" [data]="data" [existingFilters]="existingFilters" [preselectColumnId]="preselectColumnId"/>`,
  }),
  args: {
    columns: sampleColumns,
    data: sampleData,
    // Existing EQUALS filter on `product` -> "Apples" is pre-selected in the dialog,
    // mirroring the Filter View's behaviour when re-opening a column's filter.
    existingFilters: [{ columnId: 'product', value: 'Apples', filterType: FilterType.EQUALS }],
    preselectColumnId: 'product',
  },
}

export const PreselectDateColumn = {
  render: (args: any) => ({
    props: { ...args },
    template: `<ocx-add-filter-dialog-host [columns]="columns" [data]="data" [existingFilters]="existingFilters" [preselectColumnId]="preselectColumnId"/>`,
  }),
  args: {
    columns: sampleColumns,
    data: sampleData,
    existingFilters: [],
    preselectColumnId: 'date',
  },
}
