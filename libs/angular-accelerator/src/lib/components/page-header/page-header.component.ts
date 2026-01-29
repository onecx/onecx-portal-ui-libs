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
  computed,
  contentChild,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MenuItem, PrimeIcons } from 'primeng/api'
import { BehaviorSubject, Observable, concat, map, of, switchMap } from 'rxjs'
import { BreadcrumbService } from '../../services/breadcrumb.service'
import { PrimeIcon } from '../../utils/primeicon.utils'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { TranslationKey } from '../../model/translation.model'
import { toObservable } from '@angular/core/rxjs-interop'

/**
 * Action definition.
 */
export interface Action {
  id?: string
  label?: string
  labelKey?: string
  icon?: string
  iconPos?: 'left' | 'right' | 'top' | 'bottom'
  /**
   * Permission for this action. If the current user does not have this permission, the action will not be shown.
   */
  permission?: string
  title?: string
  titleKey?: string
  ariaLabel?: string
  ariaLabelKey?: string
  btnClass?: string
  actionCallback(): void
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
  protected breadcrumbs = inject(BreadcrumbService)

  header = input<string | undefined>(undefined)

  loading = input<boolean>(false)

  figureBackground = input<boolean>(true)

  showFigure = input<boolean>(true)

  // image for preview in top-header left side
  figureImage = input<string | undefined>(undefined)

  disableDefaultActions = input<boolean>(false)

  subheader = input<string | undefined>(undefined)

  _effectiveActions = signal<Action[]>([])
  actions = input<Action[]>([])

  objectDetails = input<ObjectDetailItem[] | undefined>(undefined)

  showBreadcrumbs = input<boolean>(true)

  manualBreadcrumbs = input<boolean>(false)

  enableGridView = input<boolean | undefined>(undefined)

  gridLayoutDesktopColumns = input<GridColumnOptions | undefined>(undefined)

  save = output<void>()

  _additionalToolbarContent = contentChild<TemplateRef<any> | undefined>('additionalToolbarContent')

  _additionalToolbarContentLeft = contentChild<TemplateRef<any> | undefined>('additionalToolbarContentLeft')

  overflowActions$: Observable<MenuItem[]> = toObservable(this._effectiveActions).pipe(
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
  inlineActions$: Observable<Action[]> = toObservable(this._effectiveActions).pipe(
    map(this.filterInlineActions),
    switchMap((actions) => this.filterActionsBasedOnPermissions(actions))
  )
  breadcrumbs$!: Observable<MenuItem[]>

  home$!: Observable<HomeItem>

  figureImageLoadError = signal<boolean>(false)

  objectPanelGridLayoutClasses = signal<string>('grid row-gap-2 m-0')
  objectPanelColumnLayoutClasses = signal<string>('flex flex-row justify-content-between overflow-x-auto')
  objectPanelDefaultLayoutClasses = signal<string>('flex flex-column row-gap-2 md:flex-row md:justify-content-between')
  objectPanelLayoutClasses = computed(() => {
    const enableGrid = this.enableGridView()
    if (enableGrid) {
      return this.objectPanelGridLayoutClasses()
    }
    if (enableGrid === false) {
      return this.objectPanelColumnLayoutClasses()
    }
    return this.objectPanelDefaultLayoutClasses()
  })

  objectInfoGridLayoutClasses = signal<string>('col-12 flex gap-4 md:col-6 align-items-center p-0')
  objectInfoColumnLayoutClasses = signal<string>('flex flex-column align-items-center gap-2 min-w-120')
  objectInfoDefaultLayoutClasses = signal<string>('flex flex-row md:flex-column md:align-items-center md:gap-2')
  objectInfoLayoutClasses = computed(() => {
    const enableGridView = this.enableGridView()
    if (enableGridView) {
      return `${this.objectInfoGridLayoutClasses()} lg:col-${
        this.gridLayoutDesktopColumns() ? 12 / this.gridLayoutDesktopColumns()! : 4
      }`
    }
    if (enableGridView === false) {
      return this.objectInfoColumnLayoutClasses()
    }
    return this.objectInfoDefaultLayoutClasses()
  })

  constructor() {
    effect(() => {
      const actions = this.actions()
      this._effectiveActions.set(actions)
    })

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
  }

  ngOnInit(): void {
    if (!this.manualBreadcrumbs()) {
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
    this.figureImageLoadError.set(true)
  }

  public generateItemStyle(item: ObjectDetailItem): string {
    let style = ''
    if (item.icon) style = style.concat(style, ' ', 'gap-1 align-items-center')
    if (item.valueCssClass) style = style.concat(style, ' ', item.valueCssClass)
    return style
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
      label: a.labelKey ? translations[a.labelKey] : a.label,
      icon: a.icon,
      tooltipOptions: {
        tooltipLabel: a.titleKey ? translations[a.titleKey] : a.title,
        tooltipEvent: 'hover',
        tooltipPosition: 'top',
      },
      command: a.actionCallback,
      disabled: a.disabled,
    }))
  }
}
