import { animate, style, transition, trigger } from '@angular/animations'
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { combineLatest, filter, map, Observable } from 'rxjs'
import { MenuItem } from 'primeng/api/menuitem'
import { PrimeIcons } from 'primeng/api'

import {
  AppStateService,
  UserService,
  ThemeService,
  AUTH_SERVICE,
  ConfigurationService,
  CONFIG_KEY,
} from '@onecx/angular-integration-interface'

import { IAuthService } from '@onecx/angular-accelerator'
import { UserProfile } from '../../../model/user-profile.model'
import { MenuService } from '../../../services/app.menu.service'
import { ImageLogoUrlUtils } from '../../utils/image-logo-url.utils'

type MenuItemPerm = MenuItem & { permission: string }
@Component({
  selector: 'ocx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('topbarActionPanelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)' }),
        animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
      ]),
      transition(':leave', [animate('.1s linear', style({ opacity: 0 }))]),
    ]),
  ],
})
@UntilDestroy()
export class HeaderComponent implements OnInit {
  menuExpanded = false
  searchUrl: string | undefined
  favoritesDisabled = false
  feedbackDisabled = false
  supportTicketDisabled = false
  searchDisabled = false
  announcementHelpDisabled = false
  passwordChangeDisabled = false
  settingsDisabled = false
  myRolesPermissionsDisabled = false
  helpDisabled = false
  helpEditorDisabled = false
  userMenuItems: MenuItem[] = []
  moreMenuItems: MenuItemPerm[] = []
  fallbackImg = false

  @ViewChild('searchInput')
  searchInputViewChild: ElementRef | undefined

  // TODO doesn't always work (cd related?)
  @Input()
  menuButtonTitle: string | undefined
  @Output()
  menuButtonClick: EventEmitter<any> = new EventEmitter()
  @Output()
  topbarItemClick: EventEmitter<any> = new EventEmitter()
  @Output()
  openHelpPage: EventEmitter<any> = new EventEmitter()
  @Output()
  openHelpPageEditor: EventEmitter<any> = new EventEmitter()
  @Output()
  openFeedback: EventEmitter<any> = new EventEmitter()
  @Output()
  openAddToLaunchpad: EventEmitter<any> = new EventEmitter()
  @Output()
  openSupportTicket: EventEmitter<any> = new EventEmitter()
  @Output()
  searchClick: EventEmitter<any> = new EventEmitter()

  @Input()
  activeTopbarItem: any
  @Input()
  disableBreadcrumbs = false
  @Input()
  fullPortalLayout = true
  @Input()
  homeNavUrl = '/'
  @Input()
  homeNavTitle = 'Home'

  logoUrl$!: Observable<string | null>
  currentUser$: Observable<UserProfile>

  constructor(
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    private config: ConfigurationService,
    private menuService: MenuService,
    private themeService: ThemeService,
    private userService: UserService,
    private appStateService: AppStateService
  ) {
    this.currentUser$ = this.userService.profile$
      .pipe(untilDestroyed(this))
      .pipe(filter((x) => x !== undefined)) as Observable<UserProfile>

    this.logoUrl$ = combineLatest([
      this.themeService.currentTheme$.asObservable(),
      this.appStateService.currentPortal$.asObservable(),
    ]).pipe(
      map(([theme, portal]) => {
        return ImageLogoUrlUtils.createLogoUrl(theme.logoUrl || portal.logoUrl)
      })
    )
  }

  ngOnInit() {
    this.searchUrl = this.config.getProperty(CONFIG_KEY.TKIT_SEARCH_BASE_URL) || '/ops/enterprise-search'

    /* previous idea made by Matusz & Co => to be rethink later
        Use parameter management (MFE) to manipulate these config values
        Fallback are permission management?
      Trian's decision 10/2023
        First we use permissions only (auth service) => strong dependency between shell/mfe/auth!
    */
    /*
    this.favoritesDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_FAVORITES_DISABLED) === 'true'
    this.feedbackDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_FEEDBACK_DISABLED) === 'true'
    this.supportTicketDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_SUPPORT_TICKET_DISABLED) === 'true'
    this.searchDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_SEARCH_DISABLED) === 'true'
    this.announcementHelpDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_ANNOUNCEMENTS_DISABLED) === 'true'
    this.passwordChangeDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_PASSWORD_CHANGE_DISABLED) === 'true'
    this.settingsDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_SETTINGS_DISABLED) === 'true'
    this.myRolesPermissionsDisabled =
      this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_MY_ROLES_PERMISSIONS_DISABLED) === 'true'
    this.helpDisabled = this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_HELP_DISABLED) === 'true'
    this.helpEditorDisabled =
      this.config.getProperty(CONFIG_KEY_ONECX_PORTAL_HELP_DISABLED) === 'true' ||
      !this.authService.hasPermission('PORTAL_HEADER_HELP_ITEM_EDITOR#VIEW')
    */
    this.menuService.getMenuItems().subscribe((el) => this.createMenu(el))

    // TODO add translations
    this.moreMenuItems = [
      {
        command: (e) => this.onOpenFeedback(e),
        icon: PrimeIcons.COMMENT,
        label: 'Feedback',
        disabled: this.feedbackDisabled,
        permission: 'PORTAL_HEADER_GIVE_FEEDBACK#VIEW',
      },
      {
        command: (e) => this.onAddToFavourites(e),
        icon: PrimeIcons.STAR,
        label: 'Add to Favorites',
        disabled: this.favoritesDisabled,
        permission: 'PORTAL_HEADER_ADD_TO_MY_FAVORITES#VIEW',
      },
      {
        command: (e) => this.onOpenSupportTicket(e),
        icon: PrimeIcons.TICKET,
        label: 'Create Support Ticket',
        disabled: this.supportTicketDisabled,
        permission: 'PORTAL_HEADER_CREATE_SUPPORT_TICKET#VIEW',
      },
      {
        command: (e) => this.onTopbarItemClick(e, 'search'),
        icon: PrimeIcons.SEARCH,
        label: 'Search',
        disabled: this.searchDisabled,
        permission: 'PORTAL_HEADER_ENTERPRISE_SEARCH#VIEW',
      },
      {
        command: (e) => this.onOpenHelpPage(e),
        icon: PrimeIcons.QUESTION_CIRCLE,
        label: 'Show Help for this article',
        disabled: this.helpDisabled,
        permission: 'PORTAL_HEADER_HELP#VIEW',
      },
      {
        command: (e) => this.onOpenHelpPageEditor(e),
        icon: PrimeIcons.PENCIL,
        label: 'Edit Help for this article',
        disabled: this.helpEditorDisabled,
        permission: 'PORTAL_HEADER_HELP_ITEM_EDITOR#VIEW',
      },
    ]
  }

  private createMenu(menuItems: MenuItem[]) {
    this.userMenuItems = menuItems.find(({ id }) => id === 'USER_PROFILE_MENU')?.items || []
  }

  logout(event: Event) {
    event.preventDefault()
    this.authService.logout()
  }

  onMenuButtonClick(e: Event) {
    this.menuButtonClick.emit(e)
  }
  onTopbarItemClick(e: Event, arg: any) {
    this.topbarItemClick.emit({ event: e, arg })
  }
  onOpenHelpPageEditor(e: Event) {
    this.openHelpPageEditor.emit(e)
  }
  onOpenHelpPage(e: Event) {
    this.openHelpPage.emit(e)
  }
  onOpenFeedback(e: Event) {
    this.openFeedback.emit(e)
  }
  onAddToFavourites(e: Event) {
    this.openAddToLaunchpad.emit(e)
  }
  onOpenSupportTicket(e: Event) {
    this.openSupportTicket.emit(e)
  }

  onSearchClick(e: Event, val: boolean) {
    this.searchClick.emit({ event: e, val })
  }
}
