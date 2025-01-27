import { Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild, ElementRef } from '@angular/core'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TranslateService } from '@ngx-translate/core'
import { Column } from '../../../model/column'
import { ColumnViewTemplate } from '../../../model/column-view-template'
import { ColumnTogglerComponent } from './column-toggler-component/column-toggler.component'
import { ViewTemplatePickerComponent } from './view-template-picker/view-template-picker.component'
import { PrimeIcons } from 'primeng/api'
import { PrimeIcon } from '@onecx/angular-accelerator'
import { DropdownChangeEvent } from 'primeng/dropdown'

interface ViewingModes {
  icon: PrimeIcon
  mode: string
  title?: string
  titleKey?: string
}

type ViewMode = {
  id: string
  icon: PrimeIcon
  mode: string
  labelKey: string
  tooltipKey: string
}

const ALL_VIEW_MODES: ViewMode[] = [
  {
    id: 'ocx-data-layout-selection-list',
    icon: PrimeIcons.LIST,
    mode: 'list',
    tooltipKey: 'OCX_DATA_VIEW_CONTROLS.LAYOUT.LIST',
    labelKey: 'OCX_DATA_VIEW_CONTROLS.LAYOUT.LIST',
  },
  {
    id: 'ocx-data-layout-selection-grid',
    icon: PrimeIcons.TH_LARGE,
    mode: 'grid',
    tooltipKey: 'OCX_DATA_VIEW_CONTROLS.LAYOUT.GRID',
    labelKey: 'OCX_DATA_VIEW_CONTROLS.LAYOUT.GRID',
  },
  {
    id: 'ocx-data-layout-selection-table',
    icon: PrimeIcons.TABLE,
    mode: 'table',
    tooltipKey: 'OCX_DATA_VIEW_CONTROLS.LAYOUT.TABLE',
    labelKey: 'OCX_DATA_VIEW_CONTROLS.LAYOUT.TABLE',
  },
]

interface DefaultColumnDefinition {
  active: string[]
  disabled: string[]
}

/**
 * Can be used to pass in translation that are used in several places in the data-view-controls component.
 *
 * The component provides fallbacks for all configurable translations.
 */
export interface DataViewControlTranslations {
  /**
   * Placeholder for the filter input field
   */
  filterInputPlaceholder?: string
  /**
   * Tooltip for the filter input
   */
  filterInputTooltip?: string
  /**
   * Placeholder for the sorting dropdown
   */
  sortDropdownPlaceholder?: string
  /**
   * Tooltip for the sorting dropdown
   */
  sortDropdownTooltip?: string
  /**
   * Tooltips displayed for the sort order toggle button
   */
  sortOrderTooltips?: {
    ascending?: string
    descending?: string
  }
  /**
   * Tooltips displayed for the data view mode toggle button
   */
  viewModeToggleTooltips?: {
    list?: string
    grid?: string
    table?: string
  }
  /**
   * Placeholder for the template picker dropdown
   */
  templatePickerDropdownPlaceholder?: string
  /**
   * Tooltip for the column toggle button
   */
  toggleColumnButtonTooltip?: string
  /**
   * Header text displayed at the top of the column toggle dialog
   */
  columnDialogHeaderText?: string
  /**
   * Column header text for active/shown columns in the column toggle dialog
   */
  columnDialogActiveHeader?: string
  /**
   * Column header text for inactive/hidden columns in the column toggle dialog
   */
  columnDialogInactiveHeader?: string
  /**
   * Label text for the save button displayed in the column toggle dialog
   */
  columnDialogSaveButtonLabel?: string
}

/**
 * @deprecated Will be split up in separate compoments for better abstraction layers
 */
@Component({
  selector: 'ocx-data-view-controls',
  templateUrl: './data-view-controls.component.html',
  styleUrls: ['./data-view-controls.component.scss'],
  providers: [DialogService],
})
export class DataViewControlsComponent implements OnInit, OnChanges {
  @Input() supportedViews: Array<string> = []
  @Input() initialViewMode: string | undefined
  @Input() filterValue: string | undefined
  @Input() enableFiltering = false
  @Input() enableSorting = false
  @Input() sortingOptions: { label: string; value: string }[] = []
  @Input() defaultSortOption = ''
  @Input() defaultSortDirection = false
  @Input() columnDefinitions: { field: string; header: string; active?: boolean; translationPrefix?: string }[] = []
  @Input() columnTemplates: ColumnViewTemplate[] = []
  /**
   * @deprecated Instead, please use the `translations` input and specify the `templatePickerDropdownPlaceholder` property.
   *
   * Will be overwritten by `translations.templatePickerDropdownPlaceholder` if it is specified.
   */
  @Input() dropdownPlaceholderText = ''
  @Input() filterColumns: Array<string> = []
  @Input() translations: DataViewControlTranslations | undefined

  @Output() sortChange: EventEmitter<string> = new EventEmitter()
  @Output() filterChange: EventEmitter<string> = new EventEmitter()
  @Output() dataViewChange: EventEmitter<'list' | 'grid'> = new EventEmitter()
  @Output() sortDirectionChange: EventEmitter<boolean> = new EventEmitter()
  @Output() columnsChange: EventEmitter<string[]> = new EventEmitter()

  @ViewChild(ViewTemplatePickerComponent) templatePicker!: ViewTemplatePickerComponent
  @ViewChild('dvFilterInput') dvFilter: ElementRef | undefined

  activeColumnIds: string[] = []
  inactiveColumnIds: string[] = []
  selectedSortingOption = ''
  selectedSortDirection: boolean | undefined = false

  viewingModes: ViewingModes[] = []

  selectedViewMode: ViewingModes | undefined

  toggleColumnActive = false

  ref: DynamicDialogRef = new DynamicDialogRef()

  defaultCols: DefaultColumnDefinition = {
    active: [],
    disabled: [],
  }

  constructor(
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.defaultCols = this.generateDefaultColumnDefinitions(this.columnDefinitions)
    this.viewingModes = ALL_VIEW_MODES.filter((vm) => this.supportedViews.includes(vm.mode))
    this.viewingModes.forEach((v) => {
      if (v.mode === 'list') {
        v.title = this.translations?.viewModeToggleTooltips?.list
      } else if (v.mode === 'grid') {
        v.title = this.translations?.viewModeToggleTooltips?.grid
      } else {
        v.title = this.translations?.viewModeToggleTooltips?.table
      }
    })

    if (this.initialViewMode) {
      this.selectedViewMode = this.viewingModes.find((v) => v.mode === this.initialViewMode)
    }
    this.toggleColumnActive = this.supportedViews.includes('table')

    this.selectedSortingOption = this.defaultSortOption
    this.selectedSortDirection = this.defaultSortDirection
  }

  ngOnChanges(): void {
    this.changeFilterValue()
  }

  toggleColumns() {
    this.ref = this.dialogService.open(ColumnTogglerComponent, {
      data: {
        colDef: this.columnDefinitions,
        activeColIds: this.activeColumnIds,
        inactiveColIds: this.inactiveColumnIds,
        inactiveColumnHeader: this.translations?.columnDialogInactiveHeader,
        activeColumnHeader: this.translations?.columnDialogActiveHeader,
        saveButtonLabel: this.translations?.columnDialogSaveButtonLabel,
      },
      header:
        this.translations?.columnDialogHeaderText || this.translate.instant('OCX_DATA_VIEW_CONTROLS.DIALOG_TITLE'),
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto', padding: 0 },
    })

    this.ref.onClose.subscribe(
      (col: { field: string; header: string; active: boolean; translationPrefix?: string }[]) => {
        if (col) {
          if (this.templatePicker) {
            this.templatePicker.reset()
          }
          this.initActiveColumnIds(col)
          this.initInactiveColumnIds(col)
        }
      }
    )
  }

  initActiveColumnIds(col: { field: string; header: string; active: boolean; translationPrefix?: string }[]): void {
    this.activeColumnIds = col
      .filter((c) => {
        return c.active === true
      })
      .map((a) => {
        return a.field
      })
    this.columnsChange.emit(this.activeColumnIds)
  }

  handleTemplateChange(event: { activeCols: string[]; inactiveCols: string[] }) {
    this.activeColumnIds = event.activeCols
    this.inactiveColumnIds = event.inactiveCols
    this.columnDefinitions.forEach((col) => {
      if (this.activeColumnIds.includes(col.field)) {
        col.active = true
      } else if (this.inactiveColumnIds.includes(col.field)) {
        col.active = false
      }
    })
    this.columnsChange.emit(this.activeColumnIds)
  }

  handleTemplateReset() {
    this.columnDefinitions.forEach((col) => {
      if (this.defaultCols.active.includes(col.field)) {
        col.active = true
      } else {
        col.active = false
      }
    })
    this.activeColumnIds = this.defaultCols.active
    this.inactiveColumnIds = this.defaultCols.disabled
    this.columnsChange.emit(this.activeColumnIds)
  }

  initInactiveColumnIds(col: { field: string; header: string; active: boolean; translationPrefix?: string }[]): void {
    this.inactiveColumnIds = col
      .filter((c) => {
        return c.active === false
      })
      .map((a) => {
        return a.field
      })
  }

  viewModeChange(event: { icon: PrimeIcon; mode: 'list' | 'grid' }): void {
    this.dataViewChange.emit(event.mode)
    this.enableToggleColumnButton(event.mode)
  }

  enableToggleColumnButton(mode: string) {
    this.toggleColumnActive = mode === 'table' ? true : false
  }

  selectSorting(event: DropdownChangeEvent): void {
    this.sortChange.emit(event.value)
  }

  searchFilterInput(event: Event): void {
    this.filterChange.emit((event.target as HTMLInputElement).value)
  }

  sortDirection(event: any): void {
    this.selectedSortDirection = event.checked
    this.sortDirectionChange.emit(event.checked)
  }

  generateDefaultColumnDefinitions(cols: Column[]): DefaultColumnDefinition {
    const active: string[] = []
    const disabled: string[] = []
    cols.forEach((col) => {
      if (col.active) {
        active.push(col.field)
      } else {
        disabled.push(col.field)
      }
    })
    return {
      active,
      disabled,
    }
  }

  public onClearFilter() {
    if (this.dvFilter) {
      this.dvFilter.nativeElement.value = ''
      this.filterChange.emit('')
    }
  }
  private changeFilterValue() {
    if (this.dvFilter) {
      if (this.filterValue) {
        this.dvFilter.nativeElement.value = this.filterValue
        this.filterChange.emit(this.filterValue)
      } else {
        this.dvFilter.nativeElement.value = ''
        this.filterChange.emit('')
      }
    }
  }
}
