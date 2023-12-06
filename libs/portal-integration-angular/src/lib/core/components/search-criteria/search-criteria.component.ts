import { Component, ComponentRef, EventEmitter, Host, Inject, Input, OnInit, Optional, Output } from '@angular/core'
import { BreadcrumbService } from '../../../services/breadcrumb.service'
import { Action, PageHeaderComponent } from '../page-header/page-header.component'
import { PortalSearchPage } from './search-page'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService } from '../../../services/app-state.service'

/**
 * @deprecated Will be replaced by ocx-search-header
 */
@Component({
  selector: 'ocx-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.scss'],
})
export class SearchCriteriaComponent extends PageHeaderComponent implements OnInit {
  /** Whether to show advanced toggle button or not*/
  @Input() disableAdvancedToggle = false

  /**
   * Unique identifier of this search.
   * It is used for search template fetching, preferences and other usecases.
   * Recommended structure is `app_object_search` e.g. `ibt_order_search` */
  @Input() searchId?: string

  private _criteriaTemplateEnabled = false

  /**
   * Whether criteria template feature is enabled or not. Data is fetch based on 'searchId' attribute. */
  @Input()
  get criteriaTemplate(): boolean {
    return this._criteriaTemplateEnabled
  }
  set criteriaTemplate(value: boolean) {
    if (!this.searchId) {
      throw new Error('Search template feature requires `searchId` parameter to be set')
    }
    this._criteriaTemplateEnabled = value
  }

  /** Event emitted when the search button has been pressed. */
  @Output() readonly search: EventEmitter<'basic' | 'advanced'> = new EventEmitter<'basic' | 'advanced'>()

  /** Event emitted when the reset button has been pressed. */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly reset: EventEmitter<'basic' | 'advanced'> = new EventEmitter<'basic' | 'advanced'>()

  /** Event emitted when the adnvanced view has been toggled. */
  @Output() readonly advancedViewToggle = new EventEmitter()

  protected advancedSearchActive = false

  // in BASIC mode ... enable switching to ADVANCED
  private enableAdvancedSearch: Action = {
    label: 'Advanced',
    title: 'Switch to Advanced Search',
    show: 'always',
    actionCallback: () => {
      this.activateAdvancedSearch(true)
    },
  }
  // in ADVANCED mode ... enable switching to BASIC
  private enableBasicSearch: Action = {
    label: 'Basic',
    title: 'Switch to Basic Search',
    show: 'always',
    actionCallback: () => {
      this.activateAdvancedSearch(false)
    },
  }

  constructor(
    breadcrumbs: BreadcrumbService,
    @Inject(AUTH_SERVICE) authService: IAuthService,
    translateService: TranslateService,
    appStateService: AppStateService,
    @Inject(PortalSearchPage) @Optional() private searchPage?: PortalSearchPage<unknown>,
    @Host() @Optional() private searchPage2?: PortalSearchPage<unknown>,
    @Host() @Optional() private ref?: ComponentRef<unknown>
  ) {
    super(breadcrumbs, authService, translateService, appStateService)
  }

  override ngOnInit(): void {
    if (!this.actions) {
      this.actions = []
    }
    if (!this.disableAdvancedToggle) {
      this.actions.push(this.enableAdvancedSearch)
    }
    super.ngOnInit()
  }

  protected switchCriteriaBlock($event: { checked: boolean }) {
    this.advancedSearchActive = $event.checked
    this.advancedViewToggle.emit()
  }
  protected emitSearchEvent() {
    this.search.emit(this.advancedSearchActive ? 'advanced' : 'basic')
    if (this.searchPage) {
      this.searchPage.onSearch(this.advancedSearchActive ? 'advanced' : 'basic')
    }
  }
  protected emitResetEvent() {
    this.reset.emit(this.advancedSearchActive ? 'advanced' : 'basic')
    if (this.searchPage) {
      this.searchPage.onReset(this.advancedSearchActive ? 'advanced' : 'basic')
    }
  }

  public activateAdvancedSearch(advanced: boolean) {
    this.advancedSearchActive = advanced
    const actions = [...(this.actions || [])]
    const index = actions.findIndex(
      (a) => (advanced && a === this.enableAdvancedSearch) || (!advanced && a === this.enableBasicSearch)
    )
    if (index >= 0) {
      actions[index] = advanced ? this.enableBasicSearch : this.enableAdvancedSearch
    } else {
      actions.push(advanced ? this.enableBasicSearch : this.enableAdvancedSearch)
    }
    this.actions = actions
  }
}
