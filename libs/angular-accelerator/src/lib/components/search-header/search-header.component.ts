import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { Action } from '../page-header/page-header.component'
import { SLOT_SERVICE, SlotService } from '@onecx/angular-remote-components'
// import { SearchConfigInfo } from '../../model/search-config-info'
import { DataTableColumn } from '../../model/data-table-column.model'
import { FormControlName, FormGroup, FormGroupDirective } from '@angular/forms'
import { Observable, combineLatest, debounceTime, map, of, startWith } from 'rxjs'

export interface SearchHeaderComponentState {
  activeViewMode?: 'basic' | 'advanced'
  selectedSearchConfig?:
    | {
        fieldValues: { [key: string]: string }
        displayedColumnsIds: string[]
        viewMode: 'basic' | 'advanced'
      }
    | undefined
}

/**
 * To trigger the search when Enter key is pressed inside a search parameter field,
 * an EventListener for keyup enter event is added for HTML elements which have an input.
 * Please add the EventListener yourself manually, if you want to have that functionality for some other elements
 * which do not have an input element.
 */
@Component({
  selector: 'ocx-search-header',
  templateUrl: './search-header.component.html',
  providers: [{ provide: SLOT_SERVICE, useExisting: SlotService }],
})
export class SearchHeaderComponent implements AfterContentInit, AfterViewInit {
  @Input() header = ''

  /**
   * @deprecated Will be replaced by header
   */
  @Input()
  get headline(): string {
    return this.header
  }
  set headline(value: string) {
    this.header = value
  }
  @Input() subheader: string | undefined
  _viewMode: 'basic' | 'advanced' = 'basic'
  @Input()
  get viewMode(): 'basic' | 'advanced' {
    return this._viewMode
  }
  set viewMode(viewMode: 'basic' | 'advanced') {
    if (this.viewMode !== viewMode) {
      this._viewMode = viewMode
      this.viewModeChanged?.emit(this.viewMode)
      this.componentStateChanged.emit({
        activeViewMode: this.viewMode,
      })
      this.updateHeaderActions()
      setTimeout(() => this.addKeyUpEventListener())
    }
  }
  @Input() manualBreadcrumbs = false
  _actions: Action[] = []
  @Input()
  get actions() {
    return this._actions
  }
  set actions(value) {
    this._actions = value
    this.updateHeaderActions()
  }
  @Input() searchButtonDisabled = false
  @Input() resetButtonDisabled = false
  @Input() pageName = ''
  @Input() layout = ''

  _displayedColumnsIds: string[] = []
  get displayedColumnsIds(): string[] {
    return this._displayedColumnsIds
  }

  _displayedColumns: DataTableColumn[] = []
  @Input() get displayedColumns(): DataTableColumn[] {
    return this._displayedColumns
  }
  set displayedColumns(value: DataTableColumn[]) {
    this._displayedColumns = [...value]
    this._displayedColumnsIds = this._displayedColumns.map((column) => column.id)
  }

  @Output() searched: EventEmitter<any> = new EventEmitter()
  @Output() resetted: EventEmitter<any> = new EventEmitter()
  @Output() selectedSearchConfigChanged: EventEmitter<
    | {
        fieldValues: { [key: string]: string }
        displayedColumnsIds: string[]
        viewMode: 'basic' | 'advanced'
      }
    | undefined
  > = new EventEmitter()
  @Output() viewModeChanged: EventEmitter<'basic' | 'advanced'> = new EventEmitter()
  @Output() componentStateChanged: EventEmitter<SearchHeaderComponentState> = new EventEmitter()
  @ContentChild('additionalToolbarContent')
  additionalToolbarContent: TemplateRef<any> | undefined

  get _additionalToolbarContent(): TemplateRef<any> | undefined {
    return this.additionalToolbarContent
  }
  @ContentChild('additionalToolbarContentLeft')
  additionalToolbarContentLeft: TemplateRef<any> | undefined

  get _additionalToolbarContentLeft(): TemplateRef<any> | undefined {
    return this.additionalToolbarContentLeft
  }

  get searchConfigChangeObserved(): boolean {
    return this.selectedSearchConfigChanged.observed
  }

  @ContentChild(FormGroupDirective) formGroup: FormGroup | undefined
  @ContentChildren(FormControlName, { descendants: true }) visibleFormControls!: QueryList<FormControlName>

  @ViewChild('searchParameterFields') searchParameterFields: ElementRef | undefined

  hasAdvanced = false
  headerActions: Action[] = []

  fieldValues$: Observable<{ [key: string]: unknown }> | undefined = of({})

  constructor() {
    this.selectedSearchConfigChanged.subscribe((config) => {
      this.componentStateChanged.emit({
        selectedSearchConfig: config,
      })
    })
  }

  ngAfterContentInit(): void {
    if (this.formGroup) {
      this.fieldValues$ = combineLatest([
        this.formGroup.valueChanges,
        this.visibleFormControls.changes.pipe(startWith(null)),
      ]).pipe(
        debounceTime(100),
        map(([values, _]) =>
          Object.entries(values ?? {}).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: this.isVisible(key) ? value || undefined : undefined,
            }),
            {}
          )
        )
      )
    }
  }

  ngAfterViewInit(): void {
    this.addKeyUpEventListener()
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'basic' ? 'advanced' : 'basic'
  }

  onResetClicked() {
    this.resetted.emit()
  }

  onSearchClicked() {
    this.searched.emit()
  }

  updateHeaderActions() {
    const headerActions: Action[] = []
    if (this.hasAdvanced) {
      headerActions.push({
        id: 'simpleAdvancedButton',
        labelKey:
          this.viewMode === 'basic'
            ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.TEXT'
            : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.TEXT',
        actionCallback: () => this.toggleViewMode(),
        show: 'always',
        titleKey:
          this.viewMode === 'basic'
            ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.DETAIL'
            : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.DETAIL',
      })
    }
    this.headerActions = headerActions.concat(this.actions)
  }

  addKeyUpEventListener() {
    const inputElements = this.searchParameterFields?.nativeElement.querySelectorAll('input')
    inputElements.forEach((inputElement: any) => {
      if (!inputElement.listenerAdded) {
        inputElement.addEventListener('keyup', (event: any) => this.onSearchKeyup(event))
        inputElement.listenerAdded = true
      }
    })
  }

  onSearchKeyup(event: any) {
    if (event.code === 'Enter') {
      this.onSearchClicked()
    }
  }

  private isVisible(control: string) {
    return this.visibleFormControls.some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }
}
