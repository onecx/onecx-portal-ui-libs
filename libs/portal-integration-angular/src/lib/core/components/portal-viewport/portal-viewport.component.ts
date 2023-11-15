import { SupportTicketApiService } from './../../../services/support-ticket-api.service'
import { AfterViewInit, Component, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api'
import { Portal } from '../../../model/portal'
import { ConfigurationService } from '../../../services/configuration.service'
import { PortalUIService } from '../../../services/portal-ui.service'
import { combineLatest, filter } from 'rxjs'
import { ThemeService } from '../../../services/theme.service'
import { AppStateService } from '../../../services/app-state.service'
import { SupportTicket } from '../../../model/support-ticket'
import { HelpData } from '../../../model/help-data'
import { DialogService } from 'primeng/dynamicdialog'
import { NoHelpItemComponent } from '../no-help-item/no-help-item.component'
import { NavigationEnd, Router } from '@angular/router'
import { HelpPageAPIService } from '../../../services/help-api-service'
import { AUTH_SERVICE } from '../../../api/injection-tokens'
import { IAuthService } from '../../../api/iauth.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@Component({
  selector: 'ocx-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
  providers: [DialogService],
})
@UntilDestroy()
export class PortalViewportComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  showProfileInSidebar = true

  @Input()
  enableBreadcrumbs = false

  @Input()
  fullPortalLayout = true

  activeTopbarItem: string | undefined
  inlineProfileActive = false
  menuActive = true
  supportTicketDisplayed = false
  helpPageEditorDisplayed = false

  removeDocumentClickListener: (() => void) | undefined

  topbarTheme = 'var'
  colorScheme: 'auto' | 'light' | 'dark' = 'light'
  layoutMode: 'auto' | 'light' | 'dark' = 'light'
  menuMode: 'horizontal' | 'static' | 'overlay' | 'slim' | 'slimplus' = 'static'
  inputStyle = 'outline'
  ripple = true
  isMobile = false

  currentRoute: string | undefined
  globalErrMsg: string | undefined
  portalHomeMenuItem: MenuItem = { url: this.config?.getPortal()?.homePage, label: 'Home' }
  showMenuButtonTitle: string | undefined
  hideMenuButtonTitle: string | undefined
  portalDefinition: Portal
  logoUrl: string | undefined
  pageName: string | undefined
  helpArticleId: string | undefined
  applicationId: string | undefined
  helpDataItem: HelpData | undefined

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private portalUIConfig: PortalUIService,
    private config: ConfigurationService,
    private initState: AppStateService,
    private themeService: ThemeService,
    private messageService: MessageService,
    private supportTicketApiService: SupportTicketApiService,
    private helpDataService: HelpPageAPIService,
    private dialogService: DialogService,
    @Inject(AUTH_SERVICE) public authService: IAuthService
  ) {
    // TODO
    this.hideMenuButtonTitle = this.portalUIConfig.getTranslation('hideMenuButton')
    this.showMenuButtonTitle = this.portalUIConfig.getTranslation('showMenuButton')
    this.portalDefinition = this.config.getPortal()

    this.themeService.currentTheme$.pipe(untilDestroyed(this)).subscribe((theme: any) => {
      this.logoUrl = theme.logoUrl || this.portalDefinition.logoUrl
      document.getElementById('favicon')?.setAttribute('href', theme.faviconUrl)
    })

    this.router.events
      .pipe(untilDestroyed(this))
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) this.currentRoute = event.url.split('#')[0]
      })

    combineLatest([this.initState.currentPageTopic$.asObservable(), this.initState.currentMfeTopic$.asObservable()])
      .pipe(untilDestroyed(this))
      .subscribe(([info, mfe]) => {
        this.pageName = info?.pageName
        this.helpArticleId = info?.helpArticleId || this.pageName || this.currentRoute
        this.applicationId = info?.applicationId || mfe?.displayName
        if (this.applicationId && this.helpArticleId) this.loadHelpArticle(this.applicationId, this.helpArticleId)
      })

    this.authService.currentUser$.pipe(untilDestroyed(this)).subscribe((profile) => {
      this.menuMode =
        (profile?.accountSettings?.layoutAndThemeSettings?.menuMode?.toLowerCase() as
          | typeof this.menuMode
          | undefined) || this.menuMode

      this.colorScheme =
        (profile?.accountSettings?.layoutAndThemeSettings?.colorScheme?.toLowerCase() as
          | typeof this.colorScheme
          | undefined) || this.colorScheme
    })
  }

  get menuButtonTitle(): string | undefined {
    return this.menuActive ? this.hideMenuButtonTitle : this.showMenuButtonTitle
  }

  ngOnInit() {
    this.primengConfig.ripple = true

    this.initState.globalErrorTopic$
      .pipe(untilDestroyed(this))
      .pipe(filter((i) => i !== undefined))
      .subscribe((err) => {
        this.globalErrMsg = err
      })

    this.onResize()
  }

  ngAfterViewInit() {
    // hides the horizontal submenus or top menu if outside is clicked
    this.removeDocumentClickListener = this.renderer.listen('body', 'click', () => {
      this.activeTopbarItem = undefined
      if (this.isMobile) this.menuActive = false
    })
  }

  ngOnDestroy() {
    this.removeDocumentClickListener?.()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    // auto show sidebar when changing to desktop, hide when changing to mobile
    if (isMobile !== this.isMobile) this.menuActive = !isMobile
    this.isMobile = isMobile
  }

  onMenuButtonClick(event: MouseEvent) {
    this.activeTopbarItem = undefined
    this.menuActive = !this.menuActive
    event.preventDefault()
    event.stopPropagation()
  }

  onInlineProfileClick(event: UIEvent) {
    this.inlineProfileActive = !this.inlineProfileActive
    event.preventDefault()
  }

  onTopbarItemClick(event: UIEvent, item: string) {
    if (this.isMobile) this.menuActive = false

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = undefined
    } else {
      this.activeTopbarItem = item
    }

    event.preventDefault()
    event.stopPropagation()
  }

  onTopbarSubItemClick(event: UIEvent) {
    event.preventDefault()
    event.stopPropagation()
  }
  onSupportTicketClick() {
    this.supportTicketDisplayed = true
  }
  onSubmitTicket(ticket: SupportTicket) {
    this.supportTicketApiService.createSupportTicket(ticket, this.pageName).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Ticket successfully submitted',
        })
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Error occured while submitting a ticket',
        }),
    })
  }
  isHorizontalMenuMode() {
    return this.menuMode === 'horizontal' && !this.isMobile
  }

  isStaticalMenuVisible() {
    return this.menuActive && !this.isHorizontalMenuMode()
  }

  isHorizontalMenuVisible() {
    return this.isHorizontalMenuMode()
  }

  public openHelpPageEditor(): void {
    if (this.helpArticleId && this.applicationId) {
      if (!this.helpDataItem) {
        this.helpDataItem = { appId: this.applicationId, helpItemId: this.helpArticleId }
      }
      this.helpPageEditorDisplayed = true
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot edit the Help Item. HelpItemId or ApplicationId are undefined or null.',
      })
    }
  }

  public openHelpPage(event: any) {
    if (this.helpDataItem && this.helpDataItem.id) {
      const url = this.helpDataItem.resourceUrl
      if (url) {
        console.log(`navigate to help page: ${url}`)
        try {
          window.open(new URL(url), '_blank')?.focus
        } catch (e) {
          console.log(`Error constructing help page URL`, e)
          this.messageService.add({
            severity: 'error',
            summary: 'Help Item URL not valid',
          })
        }
      }
    } else {
      this.dialogService.open(NoHelpItemComponent, {
        header: 'No help item defined for this page',
        width: '400px',
        data: {
          helpArticleId: this.helpArticleId,
        },
      })
    }
    event.preventDefault()
  }
  private loadHelpArticle(appId: string, helpItemId: string) {
    this.helpDataService.getHelpDataItem(appId, helpItemId).subscribe({
      next: (data) => {
        this.helpDataItem = data
      },
      error: () => console.log(`Failed to load help article: ${helpItemId}`),
    })
  }
  public updateHelpArticle(helpItem: HelpData) {
    if (this.applicationId && helpItem) {
      this.helpDataService.saveHelpPage(this.applicationId, helpItem).subscribe({
        next: (res) => {
          console.log(`Help item saved: ${res.status}`)
          this.helpPageEditorDisplayed = false

          this.messageService.add({
            severity: 'info',
            summary: 'Help Item definition updated',
          })
          if (helpItem.helpItemId && this.applicationId) {
            this.loadHelpArticle(this.applicationId, helpItem.helpItemId)
          }
          this.helpPageEditorDisplayed = false
        },
        error: (error) => {
          console.log(`Could not save help item`)
          this.messageService.add({
            severity: 'error',
            summary: 'Help Item definition update failed',
            detail: `Server error: ${error.status}`,
          })
          this.helpPageEditorDisplayed = false
        },
      })
    }
  }
}
