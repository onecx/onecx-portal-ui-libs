import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  Signal,
  TemplateRef,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  ChangeDetectionStrategy
} from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { FormControlName, FormGroup } from '@angular/forms'
import {
  Observable,
  combineLatest,
  debounceTime,
  filter,
  firstValueFrom,
  from,
  map,
  mergeMap,
  of,
  startWith,
} from 'rxjs'
import { getLocation } from '@onecx/accelerator'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Action } from '../page-header/page-header.component'
import { observableOutput } from '../../utils/observable-output.utils'
import { PermissionInput } from '../../model/permission.model'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { ResultsAnnouncementService } from '../../services/results-announcement.service'
import { TranslateService } from '@ngx-translate/core'

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
 * The search is triggered when the Enter key is pressed inside an input of the projected search parameter fields
 * (one delegated keydown listener on the criteria container, no per-input listeners).
 * Please trigger the search yourself, if you want to have that functionality for other elements
 * which are not an input element.
 */
@Component({
  standalone: false,
  selector: 'ocx-search-header',
  templateUrl: './search-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [],
})
export class SearchHeaderComponent {
  private readonly translate = inject(TranslateService)
  private readonly liveAnnouncer = inject(LiveAnnouncer)
  private readonly resultsAnnouncement = inject(ResultsAnnouncementService)
  private searchResultsAnnouncementPending = false
  header = input<string>('')
  subheader = input<string | undefined>(undefined)

  loading = input<boolean>(false)

  viewMode = model<'basic' | 'advanced'>('basic')

  manualBreadcrumbs = input<boolean>(false)

  actions = input<Action[]>([])
  searchResultsCount = input<number | null>(null)

  searchConfigPermission = input<PermissionInput>(undefined)
  searchButtonDisabled = input<boolean>(false)
  searchButtonLabel = input<string>('')
  searchButtonAriaLabel = input<string>('')
  searchButtonTooltip = input<string>('')
  resetButtonDisabled = input<boolean>(false)
  resetButtonLabel = input<string>('')
  resetButtonAriaLabel = input<string>('')
  resetButtonTooltip = input<string>('')
  pageName = input<string | undefined>(getLocation().applicationPath)

  searched = output<void>()
  @Output() resetted = observableOutput<void>()

  @Output() selectedSearchConfigChanged = observableOutput<SearchConfigData | undefined>()
  viewModeChanged = output<'basic' | 'advanced'>()
  componentStateChanged = output<SearchHeaderComponentState>()
  _additionalToolbarContent = contentChild<TemplateRef<any>>('additionalToolbarContent')

  _additionalToolbarContentLeft = contentChild<TemplateRef<any>>('additionalToolbarContentLeft')

  get searchConfigChangeObserved(): Signal<boolean> {
    return this.selectedSearchConfigChanged.observed
  }

  formGroup = contentChild<FormGroup | undefined>(FormGroup)
  visibleFormControls = contentChildren<FormControlName>(FormControlName, { descendants: true })

  hasAdvanced = signal<boolean>(false)

  simpleAdvancedAction: Action = {
    id: 'simpleAdvancedButton',
    actionCallback: () => this.toggleViewMode(),
    show: 'always',
  }

  headerActions = signal<Action[]>([])

  searchButtonsReversed$: Observable<boolean | null> = of(null)
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
      untracked(() => {
        this.viewModeChanged?.emit(viewMode)
        this.componentStateChanged.emit({
          activeViewMode: viewMode,
        })
      })
    })

    // Update header actions whenever view mode, advanced availability or actions input changes
    effect(() => {
      this.viewMode()
      this.hasAdvanced()
      this.actions()
      untracked(() => {
        this.updateHeaderActions()
      })
    })

    this.resultsAnnouncement.registerSearchHeader(inject(DestroyRef))
    this.announceSearchResults()

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
    this.viewMode.update((current) => (current === 'basic' ? 'advanced' : 'basic'))
  }

  onResetClicked() {
    this.resetted.emit()
  }

  onSearchClicked() {
    this.prepareSearchResultsAnnouncement()
    this.searched.emit()
  }

  updateHeaderActions() {
    const headerActions: Action[] = []

    if (this.hasAdvanced()) {
      const simpleAdvancedAction = this.simpleAdvancedAction
      simpleAdvancedAction.labelKey =
        this.viewMode() === 'basic'
          ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.TEXT'
          : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.TEXT'
      simpleAdvancedAction.titleKey =
        this.viewMode() === 'basic'
          ? 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.ADVANCED.DETAIL'
          : 'OCX_SEARCH_HEADER.TOGGLE_BUTTON.SIMPLE.DETAIL'

      headerActions.push(simpleAdvancedAction)
    }

    this.headerActions.set(headerActions.concat(this.actions()))
  }

  /**
   * Handles Enter (including NumpadEnter) pressed inside the search criteria and triggers a single search.
   * Ignored for non-input targets (e.g. textarea, buttons), for Enter events already handled by a widget
   * (defaultPrevented), for Enter that picks an option of an open combobox/overlay and for inputs inside a
   * listbox (e.g. a multiple autocomplete, where Enter edits the selection).
   */
  onSearchKeydown(event: Event) {
    const keyEvent = event as KeyboardEvent
    const target = keyEvent.target as HTMLElement
    if (
      keyEvent.defaultPrevented ||
      keyEvent.isComposing ||
      target.tagName !== 'INPUT' ||
      target.getAttribute('aria-expanded') === 'true' ||
      target.closest('[role="listbox"], [role="dialog"]')
    ) {
      return
    }
    this.onSearchClicked()
  }

  private isVisible(control: string) {
    return this.visibleFormControls().some(
      (formControl) => formControl.name !== null && String(formControl.name) === control
    )
  }

  /**
   * Without a result count, the data component announces the next new data instead.
   */
  private prepareSearchResultsAnnouncement() {
    if (this.searchResultsCount() === null) {
      this.resultsAnnouncement.requestSearchResultsAnnouncement()
    } else {
      this.searchResultsAnnouncementPending = true
    }
  }

  /**
   * Announces the result count once after each search, when loading has finished
   * or the count has changed. Nothing is announced at page load.
   */
  private announceSearchResults() {
    effect(() => {
      const loading = this.loading()
      const count = this.searchResultsCount()
      if (loading || !this.searchResultsAnnouncementPending) {
        return
      }
      this.searchResultsAnnouncementPending = false
      const announcementKey = count
        ? 'OCX_SEARCH_HEADER.ANNOUNCEMENTS.RESULTS_FOUND'
        : 'OCX_SEARCH_HEADER.ANNOUNCEMENTS.NO_RESULTS'

      firstValueFrom(this.translate.get(announcementKey, { count: count || null })).then((translatedText: string) => {
        this.liveAnnouncer.announce(translatedText, 'polite')
      })
    })
  }
}
