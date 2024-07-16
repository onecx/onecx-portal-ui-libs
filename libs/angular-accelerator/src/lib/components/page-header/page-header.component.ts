import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewEncapsulation,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MenuItem, PrimeIcons } from 'primeng/api'
import { concat, map, Observable, of } from 'rxjs'
import { AppStateService } from '@onecx/angular-integration-interface'
import { UserService } from '@onecx/angular-integration-interface'
import { BreadcrumbService } from '../../services/breadcrumb.service'
import { PrimeIcon } from '../../utils/primeicon.utils'

/**
 * Action definition.
 */
export interface Action {
  id?: string
  label?: string
  labelKey?: string
  icon?: string
  /**
   * Permission for this action. If the current user does not have this permission, the action will not be shown.
   */
  permission?: string
  title?: string
  titleKey?: string
  btnClass?: string
  actionCallback(): void
  disabled?: boolean
  show?: 'always' | 'asOverflow'
  conditional?: boolean
  // Note: This currently doesn't work with dynamic values, since a passed in Action is just a copy of the original object.
  // As a workaround, you can manually update/replace the passed in Action if you wish to update a showCondition
  showCondition?: boolean
}

export interface ObjectDetailItem {
  label: string
  value?: string
  /**
   * @deprecated Use `valueTooltip` instead
   */
  tooltip?: string
  labelTooltip?: string
  valueTooltip?: string
  icon?: PrimeIcon
  iconStyleClass?: string
  labelPipe?: Type<any>
  valuePipe?: Type<any>
  valuePipeArgs?: string
  valueCssClass?: string
  actionItemIcon?: PrimeIcon
  actionItemCallback?: () => void
  actionItemTooltip?: string
}

export interface HomeItem {
  menuItem: MenuItem
  page?: string
}

export type GridColumnOptions = 1 | 2 | 3 | 4 | 6 | 12

@Component({
  selector: 'ocx-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageHeaderComponent implements OnInit, OnChanges {
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

  _actions: Action[] | undefined
  @Input()
  get actions() {
    return this._actions
  }
  set actions(value) {
    this._actions = value
    this.generateInlineActions()
    this.generateOverflowActions()
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

  @ContentChild('customPageHeaderContent', { static: false })
  customPageHeaderContent: TemplateRef<any> | undefined

  overflowActions: MenuItem[] = []
  inlineActions: Action[] | undefined
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

  constructor(
    breadcrumbs: BreadcrumbService,
    private translateService: TranslateService,
    private appStateService: AppStateService,
    private userService: UserService
  ) {
    this.breadcrumbs = breadcrumbs
    this.home$ = concat(
      of({ menuItem: { icon: PrimeIcons.HOME, routerLink: '/' } }),
      this.appStateService.currentPortal$.pipe(
        map((portal) => ({
          menuItem: {
            icon: PrimeIcons.HOME,
            routerLink: portal.baseUrl,
          },
          page: portal.portalName,
        }))
      )
    )
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actions']) {
      this.generateInlineActions()
      this.generateOverflowActions()
    }
  }

  ngOnInit(): void {
    if (!this.manualBreadcrumbs) {
      this.breadcrumbs$ = this.breadcrumbs.generatedItemsSource
    } else {
      this.breadcrumbs$ = this.breadcrumbs.itemsHandler
    }
    this.generateInlineActions()
    this.generateOverflowActions()
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

  /**
   * Generates a list of actions that should be rendered in an overflow menu
   */
  private generateOverflowActions() {
    if (this.actions) {
      const translationKeys: string[] = [
        ...this.actions.map((a) => a.labelKey || '').filter((a) => !!a),
        ...this.actions.map((a) => a.titleKey || '').filter((a) => !!a),
      ]
      const translations$ = translationKeys.length ? this.translateService.get(translationKeys) : of([])
      translations$.subscribe((translations) => {
        const allowedActions: Action[] = []
        if (this.actions) {
          this.actions
            .filter((a) => a.show === 'asOverflow')
            .filter((a) => {
              if (a.conditional) {
                if (a.showCondition) return a
                return null
              } else return a
            })
            .forEach((action) => {
              this.checkActionPermission(allowedActions, action)
            })
          this.overflowActions = [
            ...allowedActions.map<MenuItem>((a) => ({
              label: a.labelKey ? translations[a.labelKey] : a.label,
              icon: a.icon,
              title:
                (a.titleKey ? translations[a.titleKey] : a.title) || (a.labelKey ? translations[a.labelKey] : a.label),
              command: a.actionCallback,
              disabled: a.disabled,
            })),
          ]
        }
      })
    }
  }

  /**
   * Generates a list of actions that should be rendered as inline buttons
   */
  private generateInlineActions() {
    if (this.actions) {
      // Temp array to hold all inline actions that should be visible to the current user
      const allowedActions: Action[] = []
      // Check permissions for all actions that should be rendered 'always'
      this.actions
        .filter((a) => a.show === 'always')
        .filter((a) => {
          if (a.conditional) {
            return a.showCondition ? a : null
          } else return a
        })
        .forEach((action) => {
          this.checkActionPermission(allowedActions, action)
        })
      this.inlineActions = [...allowedActions]
    }
  }
  /**
   * Adds a given action to a given array if the current user is allowed to see it
   * @param allowedActions Array that the action should be added to if the current user is allowed to see it
   * @param action Action for which a permission check should be executed
   */
  private checkActionPermission(allowedActions: Action[], action: Action) {
    if (action.permission) {
      if (this.userService.hasPermission(action.permission)) {
        // Push action to allowed array if user has sufficient permissions
        allowedActions.push(action)
      }
    } else {
      // Push action to allowed array if no permission was specified
      allowedActions.push(action)
    }
  }
}
