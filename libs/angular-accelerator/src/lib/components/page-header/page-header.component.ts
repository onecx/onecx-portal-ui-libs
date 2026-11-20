import { injectInstanceIdSuffix } from '../../utils/instance-id.utils'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  TemplateRef,
  Type,
  ViewChild,
  ViewEncapsulation,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
  ChangeDetectionStrategy,
  isDevMode,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, UserService } from '@onecx/angular-integration-interface'
import { MenuItem, OpenngIcons } from '@openng/optimus-ui/api'
import { Observable, concat, map, of, switchMap, tap } from 'rxjs'
import { BreadcrumbService } from '../../services/breadcrumb.service'
import { OptimusIcon } from '../../utils/optimus-icon.utils'
import { HAS_PERMISSION_CHECKER } from '@onecx/angular-utils'
import { TranslationKey } from '../../model/translation.model'
import { toObservable } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { RouterLink } from '../../model/data-action'
import { handleAction, handleActionSync } from '../../utils/action-router.utils'

/**
 * Action definition.
 */
export interface Action {
  /**
   * Element id of the action button or overflow menu item. The first `ocx-page-header` on a page uses it as is,
   * further instances add the instance suffix (`<id>-1`, `<id>-2`, ...) so that ids stay unique per page.
   */
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
  actionCallback?(): void
  routerLink?: RouterLink
  loading?: boolean
  disabled?: boolean
  disabledTooltip?: string
  disabledTooltipKey?: string
  show?: 'always' | 'asOverflow'
  conditional?: boolean
  // Note: This currently doesn't work with dynamic values, since a passed in Action is just a copy of the original object.
  // As a workaround, you can manually update/replace the passed in Action if you wish to update a showCondition
  showCondition?: boolean
}

interface ObjectDetailItemBase {
  label: string
  value?: string
  icon?: OptimusIcon
  iconStyleClass?: string
  labelPipe?: Type<any>
  valuePipe?: Type<any>
  valuePipeArgs?: string
  valueCssClass?: string
  actionItemIcon?: OptimusIcon
  actionItemAriaLabel?: string
  actionItemTooltipKey?: TranslationKey
  labelTooltipKey?: TranslationKey
  valueTooltipKey?: TranslationKey
}

/**
 * Object detail without an action button.
 */
export interface ObjectDetailItemWithoutAction extends ObjectDetailItemBase {
  actionItemCallback?: undefined
  /** Only allowed together with `actionItemCallback`, see {@link ObjectDetailItemWithAction}. */
  actionItemAriaLabelKey?: never
}

/**
 * Object detail with an icon-only action button (rendered when `actionItemIcon` is set as well).
 * The button has no visible text, so `actionItemAriaLabelKey` is required: it is the accessible name of the button.
 */
export interface ObjectDetailItemWithAction extends ObjectDetailItemBase {
  actionItemCallback: () => void
  actionItemAriaLabelKey: TranslationKey
}

/**
 * Object detail shown in the page header. Setting `actionItemCallback` requires `actionItemAriaLabelKey`.
 */
export type ObjectDetailItem = ObjectDetailItemWithoutAction | ObjectDetailItemWithAction

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
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class PageHeaderComponent implements OnInit, AfterViewInit {
  /** Keeps the element ids unique per instance; empty for the first instance, see {@link injectInstanceIdSuffix}. */
  readonly idSuffix = injectInstanceIdSuffix('ocx-page-header')
  private readonly translateService = inject(TranslateService)
  private readonly appStateService = inject(AppStateService)
  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  private readonly renderer = inject(Renderer2)
  private readonly hasPermissionChecker = inject(HAS_PERMISSION_CHECKER, { optional: true })
  protected readonly breadcrumbs = inject(BreadcrumbService)
  private breadcrumbRef?: ElementRef<HTMLElement>
  @ViewChild('breadcrumbRef', { read: ElementRef })
  set breadcrumbElementRef(ref: ElementRef<HTMLElement> | undefined) {
    this.breadcrumbRef = ref
    this.applyBreadcrumbAriaLabels()
  }

  header = input<string | undefined>(undefined)

  loading = input<boolean>(false)

  figureBackground = input<boolean>(true)

  showFigure = input<boolean>(true)

  // image for preview in top-header left side
  figureImage = input<string | undefined>(undefined)

  disableDefaultActions = input<boolean>(false)

  subheader = input<string | undefined>(undefined)

  actions = model<Action[]>([])

  objectDetails = input<ObjectDetailItem[] | undefined>(undefined)

  showBreadcrumbs = input<boolean>(true)

  manualBreadcrumbs = input<boolean>(false)

  enableGridView = input<boolean | undefined>(undefined)

  gridLayoutDesktopColumns = input<GridColumnOptions | undefined>(undefined)

  save = output<void>()

  _additionalToolbarContent = contentChild<TemplateRef<any> | undefined>('additionalToolbarContent')

  _additionalToolbarContentLeft = contentChild<TemplateRef<any> | undefined>('additionalToolbarContentLeft')

  overflowActions$: Observable<MenuItem[]> = toObservable(this.actions).pipe(
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
  inlineActions$: Observable<Action[]> = toObservable(this.actions).pipe(
    map(this.filterInlineActions),
    switchMap((actions) => this.filterActionsBasedOnPermissions(actions))
  )
  breadcrumbs$!: Observable<MenuItem[]>

  home$!: Observable<HomeItem>

  figureImageLoadError = signal<boolean>(false)

  objectPanelGridLayoutClasses = signal<string>('grid grid-cols-12 gap-y-2 m-0')
  objectPanelColumnLayoutClasses = signal<string>('flex flex-row justify-between overflow-x-auto')
  objectPanelDefaultLayoutClasses = signal<string>('flex flex-col gap-y-2 md:flex-row md:justify-between')
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

  objectInfoGridLayoutClasses = signal<string>('col-span-12 flex gap-4 md:col-span-6 items-center p-0')
  objectInfoColumnLayoutClasses = signal<string>('flex flex-col items-center gap-2 min-w-[120px]')
  objectInfoDefaultLayoutClasses = signal<string>('flex flex-row md:flex-col md:items-center md:gap-2')
  objectInfoLayoutClasses = computed(() => {
    const enableGridView = this.enableGridView()
    if (enableGridView) {
      return `${this.objectInfoGridLayoutClasses()} lg:col-span-${
        this.gridLayoutDesktopColumns() ? 12 / this.gridLayoutDesktopColumns()! : 4
      }`
    }
    if (enableGridView === false) {
      return this.objectInfoColumnLayoutClasses()
    }
    return this.objectInfoDefaultLayoutClasses()
  })

  constructor() {
    this.home$ = concat(
      of({ menuItem: { icon: OpenngIcons.HOME, routerLink: '/' } }),
      this.appStateService.currentWorkspace$.pipe(
        map((workspace) => ({
          menuItem: {
            icon: OpenngIcons.HOME,
            routerLink: workspace.baseUrl,
          },
          page: workspace.workspaceName,
        }))
      )
    )
  }

  ngOnInit(): void {
    if (this.manualBreadcrumbs()) {
      this.breadcrumbs$ = this.breadcrumbs.itemsHandler.pipe(
        tap(() => {
          setTimeout(() => this.applyBreadcrumbAriaLabels(), 0)
        })
      )
    } else {
      this.breadcrumbs$ = this.breadcrumbs.generatedItemsSource.pipe(
        tap(() => {
          setTimeout(() => this.applyBreadcrumbAriaLabels(), 0)
        })
      )
    }
  }

  ngAfterViewInit() {
    this.applyBreadcrumbAriaLabels()
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

  private readonly warnedItems = new Set<string>()

  private translateKey(key: TranslationKey | undefined): string | undefined {
    if (!key) return undefined
    const translated =
      typeof key === 'string'
        ? this.translateService.instant(key)
        : this.translateService.instant(key.key, key.parameters)
    return translated || undefined
  }

  /** A disabled action that explains why; its wrapper is made keyboard-focusable to expose the reason. */
  hasDisabledReason(action: Action): boolean {
    return !!action.disabled && !!(action.disabledTooltipKey || action.disabledTooltip)
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
    if (isDevMode() && !this.warnedItems.has(item.label)) {
      this.warnedItems.add(item.label)
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
    if (item.icon) style = style.concat(style, ' ', 'gap-1 items-center')
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
      id: this.scopedActionId(a.id),
      label: a.labelKey ? translations[a.labelKey] : a.label,
      icon: a.icon,
      tooltipOptions: {
        tooltipLabel: a.titleKey ? translations[a.titleKey] : a.title,
        tooltipEvent: 'hover',
        tooltipPosition: 'top',
      },
      routerLink: typeof a.routerLink === 'string' ? a.routerLink : undefined,
      command: typeof a.routerLink === 'string' ? undefined : () => handleActionSync(this.router, a),
      disabled: a.disabled,
    }))
  }

  /**
   * Element id of an action button or overflow menu item: the `id` of the action plus the instance suffix,
   * so the first page header keeps the given id and further instances get `<id>-1`, `<id>-2`, ...
   *
   * @param id the `id` of the action
   * @returns the instance-scoped id, or `undefined` when the action has no id
   */
  scopedActionId(id: string | undefined): string | undefined {
    return id ? id + this.idSuffix : undefined
  }

  async onActionClick(action: Action): Promise<void> {
    await handleAction(this.router, action)
  }

  private applyBreadcrumbAriaLabels(): void {
    const breadcrumbHost = this.breadcrumbRef?.nativeElement
    if (!breadcrumbHost) {
      return
    }

    const breadcrumbItems = breadcrumbHost.querySelectorAll(`.p-breadcrumb-item .p-breadcrumb-item-link`)
    breadcrumbItems.forEach((item: Element, index: number) => {
      const text = (item as HTMLElement)?.innerText?.trim()
      if (!text) return

      this.translateService
        .get('OCX_PAGE_HEADER.BREADCRUMB_ARIA_LABEL', { breadcrumb: text })
        .subscribe((ariaLabel) => {
          this.renderer.setAttribute(item, 'aria-label', ariaLabel)
        })

      if (index === breadcrumbItems.length - 1) {
        this.renderer.setAttribute(item, 'aria-current', 'page')
      }
    })
  }
}
