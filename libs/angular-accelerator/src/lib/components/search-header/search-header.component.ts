import {
  Component,
  ElementRef,
  EventEmitter,
  Signal,
  TemplateRef,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core'
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop'
import { FormControlName, FormGroup } from '@angular/forms'
import { Observable, Subject, combineLatest, debounceTime, filter, from, map, mergeMap, of, startWith } from 'rxjs'
import { getLocation } from '@onecx/accelerator'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Action } from '../page-header/page-header.component'
import { observableOutput } from '../../utils/observable-output.utils'

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
  standalone: false,
  selector: 'ocx-search-header',
  templateUrl: './search-header.component.html',
  providers: [],
})
export class SearchHeaderComponent {
  header = input<string>('')
  subheader = input<string | undefined>(undefined)

  effectiveViewMode = signal<'basic' | 'advanced'>('basic')
  viewMode = input<'basic' | 'advanced'>('basic')

  manualBreadcrumbs = input<boolean>(false)

  actions = input<Action[]>([])

  searchConfigPermission = input<string | string[] | undefined>(undefined)
  searchButtonDisabled = input<boolean>(false)
  resetButtonDisabled = input<boolean>(false)
  pageName = input<string | undefined>(getLocation().applicationPath)

  searched = output<void>()
  resetted$ = new Subject<void>()
  resetted = outputFromObservable(this.resetted$)

  selectedSearchConfigChanged = observableOutput<SearchConfigData | undefined>()
  viewModeChanged = output<'basic' | 'advanced'>()
  componentStateChanged = output<SearchHeaderComponentState>()
  _additionalToolbarContent = contentChild<TemplateRef<any>>('additionalToolbarContent')

  _additionalToolbarContentLeft = contentChild<TemplateRef<any>>('additionalToolbarContentLeft')

  get searchConfigChangeObserved(): Signal<boolean> {
    return this.selectedSearchConfigChanged.observed
  }

  formGroup = contentChild<FormGroup | undefined>(FormGroup)
  visibleFormControls = contentChildren<FormControlName>(FormControlName, { descendants: true })

  searchParameterFields = viewChild<ElementRef | undefined>('searchParameterFields')

  hasAdvanced = signal<boolean>(false)

  simpleAdvancedAction = signal<Action>({
    id: 'simpleAdvancedButton',
    actionCallback: () => this.toggleViewMode(),
    show: 'always',
  })

  headerActions = signal<Action[]>([])

  searchButtonsReversed$ = of(false)
  fieldValues$: Observable<{ [key: string]: unknown }> | undefined = combineLatest([
    toObservable(this.formGroup).pipe(
      filter((fg) => !!fg),
      mergeMap((fg) => fg.valueChanges.pipe(startWith({})))
    ),
    toObservable(this.visibleFormControls).pipe(startWith(null)),
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
  searchConfigChangedSlotEmitter: EventEmitter<SearchConfigData | undefined> = new EventEmitter()

  constructor() {
    effect(() => {
      const viewMode = this.viewMode()
      this.effectiveViewMode.set(viewMode)
    })
    effect(() => {
      const viewMode = this.effectiveViewMode()
      this.viewModeChanged?.emit(viewMode)
      this.componentStateChanged.emit({
        activeViewMode: viewMode,
      })
      this.updateHeaderActions()
      setTimeout(() => this.addKeyUpEventListener())
    })

    const configurationService = inject(ConfigurationService)

    this.searchConfigChangedSlotEmitter.subscribe((config) => {
      this.componentStateChanged.emit({
        selectedSearchConfig: config?.name ?? null,
      })
      this.selectedSearchConfigChanged.emit(config)
    })
    this.searchButtonsReversed$ = from(
      configurationService.getProperty(CONFIG_KEY.ONECX_PORTAL_SEARCH_BUTTONS_REVERSED)
    ).pipe(map((config) => config === 'true'))
  }

  toggleViewMode() {
    this.effectiveViewMode.update((current) => (current === 'basic' ? 'advanced' : 'basic'))
  }

  onResetClicked() {
    this.resetted$.next()
  }

  onSearchClicked() {
    this.searched.emit()
  }

  updateHeaderActions() {
    const headerActions: Action[] = []

    if (this.hasAdvanced()) {
      const simpleAdvancedAction = this.simpleAdvancedAction()
      simpleAdvancedAction.labelKey =
        this.effectiveViewMode() === 'basic'
          ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.TEXT'
          : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.TEXT'
      simpleAdvancedAction.titleKey =
        this.effectiveViewMode() === 'basic'
          ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.DETAIL'
          : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.DETAIL'

      headerActions.push(simpleAdvancedAction)
    }

    this.headerActions.set(headerActions.concat(this.actions()))
  }

  addKeyUpEventListener() {
    const inputElements = this.searchParameterFields()?.nativeElement.querySelectorAll('input')
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
    return this.visibleFormControls().some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }
}
