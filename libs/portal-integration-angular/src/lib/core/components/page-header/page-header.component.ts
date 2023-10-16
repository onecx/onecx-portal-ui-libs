import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewEncapsulation,
} from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Observable, of } from 'rxjs'
import { BreadcrumbService } from '../../../services/breadcrumb.service'
import { ConfigurationService } from '../../../services/configuration.service'
import { IAuthService } from '../../../api/iauth.service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { TranslateService } from '@ngx-translate/core'

/**
 * Action definition.
 */
export interface Action {
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
  tooltip?: string
  labelPipe?: Type<any>
  valuePipe?: Type<any>
  valuePipeArgs?: string
}

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

  @Output()
  save = new EventEmitter()
  overflowActions: MenuItem[] = []
  inlineActions: Action[] | undefined

  dd = new Date()
  breadcrumbs$!: Observable<MenuItem[]>

  home = { icon: 'pi pi-home', routerLink: '/' }

  protected breadcrumbs: BreadcrumbService

  constructor(
    breadcrumbs: BreadcrumbService,
    private config: ConfigurationService,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    private translateService: TranslateService
  ) {
    this.breadcrumbs = breadcrumbs
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actions']) {
      this.generateInlineActions()
      this.generateOverflowActions()
    }
  }

  ngOnInit(): void {
    this.home.routerLink = this.config.getPortal().baseUrl
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
      if (this.authService.hasPermission(action.permission)) {
        // Push action to allowed array if user has sufficient permissions
        allowedActions.push(action)
      }
    } else {
      // Push action to allowed array if no permission was specified
      allowedActions.push(action)
    }
  }
}
