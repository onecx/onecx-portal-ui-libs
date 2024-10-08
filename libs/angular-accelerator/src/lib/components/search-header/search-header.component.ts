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
import { FormControlName, FormGroup, FormGroupDirective } from '@angular/forms'
import { Observable, combineLatest, debounceTime, map, of, startWith } from 'rxjs'
import { getLocation } from '@onecx/accelerator'

export interface SearchHeaderComponentState {
  activeViewMode?: 'basic' | 'advanced'
  selectedSearchConfig?: string | null
}

export interface SearchConfigData {
  name: string | undefined
  fieldValues: { [key: string]: string }
  displayedColumnsIds: string[]
  viewMode: 'basic' | 'advanced'
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
  providers: [],
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
  @Input() searchConfigPermission: string | undefined
  @Input() searchButtonDisabled = false
  @Input() resetButtonDisabled = false
  @Input() pageName: string | undefined = getLocation().applicationPath

  @Output() searched: EventEmitter<any> = new EventEmitter()
  @Output() resetted: EventEmitter<any> = new EventEmitter()
  @Output() selectedSearchConfigChanged: EventEmitter<SearchConfigData | undefined> = new EventEmitter()
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
  searchConfigChangedSlotEmitter: EventEmitter<SearchConfigData | undefined> = new EventEmitter()

  constructor() {
    this.searchConfigChangedSlotEmitter.subscribe((config) => {
      this.componentStateChanged.emit({
        selectedSearchConfig: config?.name ?? null,
      })
      this.selectedSearchConfigChanged.emit(config)
    })
  }

  ngAfterContentInit(): void {
    if (this.formGroup) {
      this.fieldValues$ = combineLatest([
        this.formGroup.valueChanges.pipe(startWith({})),
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
