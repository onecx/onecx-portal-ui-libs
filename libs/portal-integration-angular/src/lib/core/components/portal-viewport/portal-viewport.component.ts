import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { NavigationEnd, Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { catchError, combineLatest, filter, first, map, mergeMap, Observable, of, withLatestFrom } from 'rxjs'
import { MenuItem, MessageService } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'
import { AppStateService, UserService, ThemeService, PortalMessageService } from '@onecx/angular-integration-interface'
import { SupportTicketApiService } from './../../../services/support-ticket-api.service'
import { PortalUIService } from '../../../services/portal-ui.service'
import { SupportTicket } from '../../../model/support-ticket'
import { HelpData } from '../../../model/help-data'
import { NoHelpItemComponent } from '../no-help-item/no-help-item.component'
import { HelpPageAPIService } from '../../../services/help-api-service'
import { PrimeNG } from 'primeng/config'

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
  pageName$: Observable<string> | undefined
  helpArticleId$: Observable<string> | undefined
  applicationId$: Observable<string> | undefined
  helpDataItem$: Observable<HelpData> | undefined

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private primengConfig: PrimeNG,
    private portalUIConfig: PortalUIService,
    private appStateService: AppStateService,
    private themeService: ThemeService,
    private messageService: MessageService,
    private supportTicketApiService: SupportTicketApiService,
    private helpDataService: HelpPageAPIService,
    private dialogService: DialogService,
    private userService: UserService,
    private portalMessageService: PortalMessageService,
    private httpClient: HttpClient
  ) {
    this.portalMessageService.message$.subscribe((message) => this.messageService.add(message))
    this.hideMenuButtonTitle = this.portalUIConfig.getTranslation('hideMenuButton')
    this.showMenuButtonTitle = this.portalUIConfig.getTranslation('showMenuButton')

    this.portalHomeMenuItem$ = this.appStateService.currentWorkspace$.asObservable().pipe(
      map((workspace) => ({
        url: workspace.homePage,
        label: 'Home',
      }))
    )

    this.themeService.currentTheme$
      .pipe(
        first(),
        mergeMap((theme) => {
          return theme.faviconUrl
            ? this.httpClient
                .get(theme.faviconUrl, { responseType: 'blob' })
                .pipe(map((blob) => URL.createObjectURL(blob)))
            : of('')
        })
      )
      .subscribe((url) => {
        let link = document.querySelector("link[rel~='icon']") as any
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.onload = () => {
          URL.revokeObjectURL(url)
        }
        link.href = url
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

    this.userService.profile$.pipe(untilDestroyed(this)).subscribe((profile) => {
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
    this.primengConfig.ripple.set(true)

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
          this.portalMessageService.success({
            summaryKey: 'OCX_PORTAL_VIEWPORT.SUCCESS',
            detailKey: 'OCX_PORTAL_VIEWPORT.TICKET_SUCCESS',
          })
        },
        error: () =>
          this.portalMessageService.error({
            summaryKey: 'OCX_PORTAL_VIEWPORT.ERROR',
            detailKey: 'OCX_PORTAL_VIEWPORT.TICKET_ERROR',
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
          this.portalMessageService.error({
            summaryKey: 'OCX_PORTAL_VIEWPORT.OPEN_HELP_PAGE_EDITOR_ERROR',
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
              this.portalMessageService.error({
                summaryKey: 'OCX_PORTAL_VIEWPORT.OPEN_HELP_PAGE_ERROR',
              })
            }
          }
        } else {
          this.dialogService.open(NoHelpItemComponent, {
            header: 'OCX_PORTAL_VIEWPORT.OPEN_HELP_PAGE_DIALOG_HEADER',
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

            this.portalMessageService.info({
              summaryKey: 'OCX_PORTAL_VIEWPORT.UPDATE_HELP_ARTICLE_INFO',
            })
            if (helpItem.helpItemId && applicationId) {
              this.loadHelpArticle(applicationId, helpItem.helpItemId)
            }
            this.helpPageEditorDisplayed = false
          }
        },
        error: (error) => {
          console.log(`Could not save help item`)
          this.portalMessageService.error({
            summaryKey: 'OCX_PORTAL_VIEWPORT.UPDATE_HELP_ARTICLE_ERROR',
            detailKey: `Server error: ${error.status}`,
          })
          this.helpPageEditorDisplayed = false
        },
      })
  }
}
