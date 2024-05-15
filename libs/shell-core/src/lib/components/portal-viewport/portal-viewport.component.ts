import { HttpClient } from '@angular/common/http'
import { Component, HostListener, Inject, InjectionToken, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  AppStateService,
  Message,
  PortalMessageService,
  ThemeService,
  UserService,
} from '@onecx/angular-integration-interface'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { BehaviorSubject, filter, first, from, mergeMap, of } from 'rxjs'

export const SHOW_CONTENT_PROVIDER = new InjectionToken<ShowContentProvider>('SHOW_CONTENT_PROVIDER')

export interface ShowContentProvider {
  showContent$: BehaviorSubject<boolean>
}

@Component({
  selector: 'ocx-shell-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
})
@UntilDestroy()
export class PortalViewportComponent implements OnInit, OnDestroy {
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

  constructor(
    private renderer: Renderer2,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public appStateService: AppStateService,
    private portalMessageService: PortalMessageService,
    private userService: UserService,
    private themeService: ThemeService,
    private httpClient: HttpClient,
    private router: Router,
    @Optional() @Inject(SHOW_CONTENT_PROVIDER) public showContentProvider: ShowContentProvider | undefined
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
            ? this.httpClient.get(theme.faviconUrl, { responseType: 'blob' }).pipe(
                mergeMap((blob) => {
                  return from(
                    new Promise((resolve) => {
                      const reader = new FileReader()
                      reader.onload = (e) => resolve(e.target?.result)
                      reader.readAsDataURL(blob)
                    })
                  )
                })
              )
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
