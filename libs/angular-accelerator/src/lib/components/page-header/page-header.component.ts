import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  Type,
  ViewEncapsulation,
  inject,
  isDevMode,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MenuItem, PrimeIcons } from 'primeng/api'
import { BehaviorSubject, Observable, concat, map, of, switchMap } from 'rxjs'
import { BreadcrumbService } from '../../services/breadcrumb.service'
import { PrimeIcon } from '../../utils/primeicon.utils'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { TranslationKey } from '../../model/translation.model'

/**
 * Action definition.
 */
export interface Action {
  id?: string
  label?: string
  labelKey?: string
  icon?: string
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  routerLink?: string
  /**
   * Permission for this action. If the current user does not have this permission, the action will not be shown.
   */
  permission?: string
  title?: string
  titleKey?: string
  ariaLabel?: string
  ariaLabelKey?: string
  btnClass?: string
  actionCallback?(): void
  disabled?: boolean
  disabledTooltip?: string
  disabledTooltipKey?: string
  show?: 'always' | 'asOverflow'
  conditional?: boolean
  // Note: This currently doesn't work with dynamic values, since a passed in Action is just a copy of the original object.
  // As a workaround, you can manually update/replace the passed in Action if you wish to update a showCondition
  showCondition?: boolean
}

export interface ObjectDetailItem {
  label: string
  value?: string
  icon?: PrimeIcon
  iconStyleClass?: string
  labelPipe?: Type<any>
  valuePipe?: Type<any>
  valuePipeArgs?: string
  valueCssClass?: string
  actionItemIcon?: PrimeIcon
  actionItemCallback?: () => void
  actionItemAriaLabel?: string
  actionItemAriaLabelKey?: TranslationKey
  actionItemTooltipKey?: TranslationKey
  labelTooltipKey?: TranslationKey
  valueTooltipKey?: TranslationKey
}

export interface HomeItem {
  menuItem: MenuItem
  page?: string
}

export type GridColumnOptions = 1 | 2 | 3 | 4 | 6 | 12

@Component({
  standalone: false,
  selector: 'ocx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageHeaderComponent implements OnInit {
  private translateService = inject(TranslateService)
  private appStateService = inject(AppStateService)
  private userService = inject(UserService)
  private readonly hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })

  @Input()
  public header: string | undefined

  @Input()
  loading = false

  @Input()
  figureBackground = true

  @Input()
  showFigure = true

  //image fot preview in top-header left side
  @Input()
  figureImage: string | undefined

  @Input()
  disableDefaultActions = false

  @Input()
  subheader: string | undefined

  _actions = new BehaviorSubject<Action[]>([])
  @Input()
  get actions() {
    return this._actions.getValue()
  }
  set actions(value) {
    this._actions.next(value)
  }

  @Input()
  objectDetails: ObjectDetailItem[] | undefined

  @Input()
  showBreadcrumbs = true

  @Input()
  manualBreadcrumbs = false

  @Input()
  enableGridView: undefined | boolean

  @Input()
  gridLayoutDesktopColumns: undefined | GridColumnOptions

  @Output()
  save = new EventEmitter()

  @ContentChild('additionalToolbarContent')
  additionalToolbarContent: TemplateRef<any> | undefined

  @ContentChild('additionalToolbarContentLeft')
  additionalToolbarContentLeft: TemplateRef<any> | undefined

  overflowActions$ = new BehaviorSubject<MenuItem[]>([])
  inlineActions$ = new BehaviorSubject<Action[]>([])
  dd = new Date()
  breadcrumbs$!: Observable<MenuItem[]>

  home$!: Observable<HomeItem>

  figureImageLoadError = false

  objectPanelGridLayoutClasses = 'grid row-gap-2 m-0'
  objectPanelColumnLayoutClasses = 'flex flex-row justify-content-between overflow-x-auto'

  objectPanelDefaultLayoutClasses = 'flex flex-column row-gap-2 md:flex-row md:justify-content-between'

  objectInfoGridLayoutClasses = 'col-12 flex gap-4 md:col-6 align-items-center p-0'
  objectInfoColumnLayoutClasses = 'flex flex-column align-items-center gap-2 min-w-120'

  objectInfoDefaultLayoutClasses = 'flex flex-row md:flex-column md:align-items-center md:gap-2'

  protected breadcrumbs: BreadcrumbService

  constructor() {
    const breadcrumbs = inject(BreadcrumbService)

    this.breadcrumbs = breadcrumbs
    this.home$ = concat(
      of({ menuItem: { icon: PrimeIcons.HOME, routerLink: '/' } }),
      this.appStateService.currentWorkspace$.pipe(
        map((workspace) => ({
          menuItem: {
            icon: PrimeIcons.HOME,
            routerLink: workspace.baseUrl,
          },
          page: workspace.workspaceName,
        }))
      )
    )
    this._actions
      .pipe(
        map(this.filterInlineActions),
        switchMap((actions) => this.filterActionsBasedOnPermissions(actions))
      )
      .subscribe(this.inlineActions$)

    this._actions
      .pipe(
        map(this.filterOverflowActions),
        switchMap((actions) => {
          return this.getActionTranslationKeys(actions).pipe(map((translations) => ({ actions, translations })))
        }),
        switchMap(({ actions, translations }) => {
          return this.filterActionsBasedOnPermissions(actions).pipe(
            map((filteredActions) => ({ filteredActions, translations }))
          )
        }),
        map(({ filteredActions, translations }) => this.mapOverflowActionsToMenuItems(filteredActions, translations))
      )
      .subscribe(this.overflowActions$)
  }

  ngOnInit(): void {
    if (!this.manualBreadcrumbs) {
      this.breadcrumbs$ = this.breadcrumbs.generatedItemsSource
    } else {
      this.breadcrumbs$ = this.breadcrumbs.itemsHandler
    }
  }

  onAction(action: string) {
    switch (action) {
      case 'save':
        this.save.emit()
        break
      default:
        break
    }
  }

  handleImageError() {
    this.figureImageLoadError = true
  }

  private readonly warnedItems = new WeakSet<ObjectDetailItem>()

  private translateKey(key: TranslationKey | undefined): string | undefined {
    if (!key) return undefined
    const translated =
      typeof key === 'string'
        ? this.translateService.instant(key)
        : this.translateService.instant(key.key, key.parameters)
    return translated || undefined
  }

  /**
   * Accessible name of the inline action. A visible label always wins (WCAG 2.5.3), so no override is set then.
   * Icon-only actions are named by ariaLabelKey, ariaLabel, titleKey, title.
   */
  getInlineActionAriaLabel(action: Action): string | undefined {
    const visibleLabel = action.labelKey ? this.translateService.instant(action.labelKey) : action.label
    if (visibleLabel) return undefined
    return (
      this.translateKey(action.ariaLabelKey) ||
      action.ariaLabel ||
      this.translateKey(action.titleKey) ||
      action.title ||
      undefined
    )
  }

  /**
   * Accessible name of the object detail action button:
   * actionItemAriaLabelKey, actionItemAriaLabel, actionItemTooltipKey, object detail label.
   */
  getActionItemAriaLabel(item: ObjectDetailItem): string {
    const name =
      this.translateKey(item.actionItemAriaLabelKey) ||
      item.actionItemAriaLabel ||
      this.translateKey(item.actionItemTooltipKey)
    if (name) return name
    if (isDevMode() && !this.warnedItems.has(item)) {
      this.warnedItems.add(item)
      console.warn(
        `ocx-page-header: object detail "${item.label}" has an action button without actionItemAriaLabelKey, actionItemAriaLabel or actionItemTooltipKey. Falling back to the detail label.`
      )
    }
    return item.label
  }

  /** Text alternative for an icon-only object detail value. */
  getIconOnlyDetailText(item: ObjectDetailItem): string | undefined {
    return this.translateKey(item.valueTooltipKey)
  }

  public generateItemStyle(item: ObjectDetailItem): string {
    let style = ''
    if (item.icon) style = style.concat(style, ' ', 'gap-1 align-items-center')
    if (item.valueCssClass) style = style.concat(style, ' ', item.valueCssClass)
    return style
  }

  public getObjectPanelLayoutClasses() {
    if (this.enableGridView) {
      return this.objectPanelGridLayoutClasses
    }
    if (this.enableGridView === false) {
      return this.objectPanelColumnLayoutClasses
    }
    return this.objectPanelDefaultLayoutClasses
  }

  public getObjectInfoLayoutClasses() {
    if (this.enableGridView) {
      return `${this.objectInfoGridLayoutClasses} lg:col-${
        this.gridLayoutDesktopColumns ? 12 / this.gridLayoutDesktopColumns : 4
      }`
    }
    if (this.enableGridView === false) {
      return this.objectInfoColumnLayoutClasses
    }
    return this.objectInfoDefaultLayoutClasses
  }

  private filterInlineActions(actions: Action[]): Action[] {
    return actions
      .filter((a) => a.show === 'always')
      .filter((a) => {
        if (a.conditional) {
          return a.showCondition
        }
        return true
      })
  }

  private filterOverflowActions(actions: Action[]): Action[] {
    return actions
      .filter((a) => a.show === 'asOverflow')
      .filter((a) => {
        if (a.conditional) {
          return a.showCondition
        }
        return true
      })
  }

  private filterActionsBasedOnPermissions(actions: Action[]): Observable<Action[]> {
    const getPermissions =
      this.hasPermissionChecker?.getPermissions?.bind(this.hasPermissionChecker) ||
      this.userService.getPermissions.bind(this.userService)
    return getPermissions().pipe(
      map((permissions) => {
        return actions.filter((action) => {
          if (action.permission) {
            return permissions.includes(action.permission!)
          }
          return true
        })
      })
    )
  }

  private getActionTranslationKeys(actions: Action[]): Observable<{ [key: string]: string }> {
    const translationKeys = [
      ...actions.map((a) => a.labelKey || '').filter((a) => !!a),
      ...actions.map((a) => a.titleKey || '').filter((a) => !!a),
    ]
    return translationKeys.length ? this.translateService.get(translationKeys) : of({})
  }

  private mapOverflowActionsToMenuItems(actions: Action[], translations: { [key: string]: string }): MenuItem[] {
    return actions.map<MenuItem>((a) => ({
      id: a.id,
      label: (a.labelKey ? translations[a.labelKey] : undefined) || a.label || a.title || a.id || 'Action',
      icon: a.icon,
      routerLink: a.routerLink,
      tooltipOptions: {
        tooltipLabel: a.titleKey ? translations[a.titleKey] : a.title,
        tooltipEvent: 'hover',
        tooltipPosition: 'top',
      },
      command: a.routerLink ? undefined : a.actionCallback,
      disabled: a.disabled,
    }))
  }
}
