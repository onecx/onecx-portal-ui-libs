import { SupportTicketApiService } from './../../../services/support-ticket-api.service'
import { AfterViewInit, Component, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api'
import { PortalUIService } from '../../../services/portal-ui.service'
import { catchError, combineLatest, filter, first, map, mergeMap, Observable, of, withLatestFrom } from 'rxjs'
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
import { HttpResponse } from '@angular/common/http'

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

  globalErrMsg: string | undefined
  portalHomeMenuItem$: Observable<MenuItem> | undefined
  showMenuButtonTitle: string | undefined
  hideMenuButtonTitle: string | undefined
  logoUrl$: Observable<string> | undefined
  pageName$: Observable<string> | undefined
  helpArticleId$: Observable<string> | undefined
  applicationId$: Observable<string> | undefined
  helpDataItem$: Observable<HelpData> | undefined

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private portalUIConfig: PortalUIService,
    private appStateService: AppStateService,
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

    this.portalHomeMenuItem$ = this.appStateService.currentPortal$.asObservable().pipe(
      untilDestroyed(this),
      map((portal) => ({
        url: portal.homePage,
        label: 'Home',
      }))
    )

    this.logoUrl$ = combineLatest([
      this.themeService.currentTheme$.pipe(untilDestroyed(this)),
      this.appStateService.currentPortal$.asObservable().pipe(untilDestroyed(this)),
    ]).pipe(
      map(([theme, portal]) => {
        return theme.logoUrl || portal.logoUrl || ''
      })
    )

    this.themeService.currentTheme$.pipe(untilDestroyed(this)).subscribe((theme) => {
      document.getElementById('favicon')?.setAttribute('href', theme.faviconUrl || '')
    })

    this.pageName$ = this.appStateService.currentPage$.pipe(map((page) => page?.pageName ?? ''))
    this.helpArticleId$ = combineLatest([
      this.appStateService.currentPage$.asObservable(),
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    ]).pipe(
      map(
        ([page, routerEvent]) =>
          page?.helpArticleId ??
          page?.pageName ??
          (routerEvent instanceof NavigationEnd ? routerEvent.url.split('#')[0] : '')
      )
    )

    this.applicationId$ = combineLatest([
      this.appStateService.currentPage$.asObservable(),
      this.appStateService.currentMfe$.asObservable(),
    ]).pipe(map(([page, mfe]) => page?.applicationId ?? mfe.displayName ?? ''))

    this.helpDataItem$ = combineLatest([this.applicationId$, this.helpArticleId$]).pipe(
      mergeMap(([applicationId, helpArticleId]) => {
        if (applicationId && helpArticleId) return this.loadHelpArticle(applicationId, helpArticleId)
        return of()
      }),
      catchError(() => {
        console.log(`Failed to load help article`)
        return of()
      })
    )

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

    this.appStateService.globalError$
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
    this.pageName$
      ?.pipe(
        first(),
        mergeMap((pageName) => this.supportTicketApiService.createSupportTicket(ticket, pageName))
      )
      .subscribe({
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
    combineLatest([this.helpArticleId$ ?? of(), this.applicationId$ ?? of(), this.helpDataItem$ ?? of()])
      .pipe(first())
      .subscribe(([helpArticleId, applicationId, helpDataItem]) => {
        if (helpArticleId && applicationId) {
          if (!helpDataItem) {
            helpDataItem = { appId: applicationId, helpItemId: helpArticleId }
          }
          this.helpPageEditorDisplayed = true
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Cannot edit the Help Item. HelpItemId or ApplicationId are undefined or null.',
          })
        }
      })
  }

  public openHelpPage(event: any) {
    this.helpDataItem$
      ?.pipe(withLatestFrom(this.helpArticleId$ ?? of()), first())
      .subscribe(([helpDataItem, helpArticleId]) => {
        if (helpDataItem && helpDataItem.id) {
          const url = helpDataItem.resourceUrl
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
              helpArticleId: helpArticleId,
            },
          })
        }
      })
    event.preventDefault()
  }
  private loadHelpArticle(appId: string, helpItemId: string) {
    return this.helpDataService.getHelpDataItem(appId, helpItemId)
  }
  public updateHelpArticle(helpItem: HelpData) {
    this.applicationId$
      ?.pipe(
        first(),
        mergeMap((applicationId) =>
          this.helpDataService
            .saveHelpPage(applicationId, helpItem)
            .pipe(map((res): [string, HttpResponse<any>] => [applicationId, res]))
        )
      )
      .subscribe({
        next: ([applicationId, res]) => {
          if (applicationId && helpItem) {
            console.log(`Help item saved: ${res.status}`)
            this.helpPageEditorDisplayed = false

            this.messageService.add({
              severity: 'info',
              summary: 'Help Item definition updated',
            })
            if (helpItem.helpItemId && applicationId) {
              this.loadHelpArticle(applicationId, helpItem.helpItemId)
            }
            this.helpPageEditorDisplayed = false
          }
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
