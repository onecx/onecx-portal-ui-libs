import { HttpClient } from '@angular/common/http'
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  AppStateService,
  Message,
  PortalMessageService,
  ThemeService,
  UserService,
} from '@onecx/angular-integration-interface'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import {
  bufferCount,
  combineLatest,
  filter,
  first,
  map,
  mergeMap,
  of,
  startWith
} from 'rxjs'

@Component({
  selector: 'ocx-shell-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
})
@UntilDestroy()
export class PortalViewportComponent implements OnInit, AfterViewInit, OnDestroy {
  menuButtonTitle = ''
  menuActive = true
  activeTopbarItem: string | undefined

  removeDocumentClickListener: (() => void) | undefined

  topbarTheme = 'var'
  colorScheme: 'auto' | 'light' | 'dark' = 'light'
  layoutMode: 'auto' | 'light' | 'dark' = 'light'
  menuMode: 'horizontal' | 'static' | 'overlay' | 'slim' | 'slimplus' = 'static'
  inputStyle = 'outline'
  ripple = true
  isMobile = false

  globalErrMsg: string | undefined

  showContent$ = combineLatest([
    this.appStateService.globalLoading$.asObservable().pipe(startWith(true, true), bufferCount(3, 1)),
    this.router.events
      .pipe(
        filter(
          (e): e is NavigationEnd | RoutesRecognized => e instanceof NavigationEnd || e instanceof RoutesRecognized
        )
      )
      .pipe(startWith({ url: undefined }), bufferCount(3, 1)),
  ]).pipe(
    map(([[beforeLastGlobalLoading, lastGlobalLoading, globalLoading], [beforeLastEvent, lastEvent, event]]) => {
      if (!lastGlobalLoading && globalLoading) {
        return false
      }
      if (beforeLastGlobalLoading) {
        return true
      }
      if (!beforeLastEvent.url) {
        return false
      }
      if (lastEvent.url !== event.url) {
        return false
      }
      return true
    })
  )

  constructor(
    private renderer: Renderer2,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public appStateService: AppStateService,
    private portalMessageService: PortalMessageService,
    private userService: UserService,
    private themeService: ThemeService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
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
  }

  ngOnInit() {
    this.primengConfig.ripple = true

    this.appStateService.globalError$
      .pipe(untilDestroyed(this))
      .pipe(filter((i) => i !== undefined))
      .subscribe((err: string | undefined) => {
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

  onMenuButtonClick(event: MouseEvent) {
    this.activeTopbarItem = undefined
    this.menuActive = !this.menuActive
    event.preventDefault()
    event.stopPropagation()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    // auto show sidebar when changing to desktop, hide when changing to mobile
    if (isMobile !== this.isMobile) this.menuActive = !isMobile
    this.isMobile = isMobile
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
}
