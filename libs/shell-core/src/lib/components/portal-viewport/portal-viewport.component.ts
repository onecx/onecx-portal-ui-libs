import { HttpClient } from '@angular/common/http'
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  AppStateService,
  Message,
  PortalMessageService,
  ThemeService,
  UserService,
} from '@onecx/angular-integration-interface'
import { MessageService } from 'primeng/api'
import { PrimeNG } from 'primeng/config'
import { debounceTime, filter, first, from, fromEvent, map, mergeMap, Observable, of, pairwise, startWith } from 'rxjs'
import { SHOW_CONTENT_PROVIDER, ShowContentProvider } from '../../shell-interface/show-content-provider'
import {
  WORKSPACE_CONFIG_BFF_SERVICE_PROVIDER,
  WorkspaceConfigBffService,
} from '../../shell-interface/workspace-config-bff-service-provider'
import { SlotService } from '@onecx/angular-remote-components'
import { StaticMenuVisibleTopic } from '@onecx/integration-interface'

@Component({
  standalone: false,
  selector: 'ocx-shell-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
})
@UntilDestroy()
export class PortalViewportComponent implements OnInit, OnDestroy {
  private primengConfig = inject(PrimeNG)
  private messageService = inject(MessageService)
  private appStateService = inject(AppStateService)
  private portalMessageService = inject(PortalMessageService)
  private userService = inject(UserService)
  themeService = inject(ThemeService)
  private httpClient = inject(HttpClient)
  showContentProvider = inject<ShowContentProvider | undefined>(SHOW_CONTENT_PROVIDER, { optional: true })
  workspaceConfigBffService = inject<WorkspaceConfigBffService | undefined>(WORKSPACE_CONFIG_BFF_SERVICE_PROVIDER, {
    optional: true,
  })
  private slotService = inject(SlotService)
  private readonly staticMenuVisibleTopic$ = new StaticMenuVisibleTopic()
  private readonly onResize$: Observable<Event>
  private readonly isMobile$: Observable<boolean>

  menuButtonTitle = ''
  menuActive = true
  activeTopbarItem: string | undefined

  removeDocumentClickListener: (() => void) | undefined

  colorScheme: 'auto' | 'light' | 'dark' = 'light'
  menuMode: 'horizontal' | 'static' | 'overlay' | 'slim' | 'slimplus' = 'static'
  inputStyle = 'outline'
  ripple = true
  isMobile = false
  globalErrMsg: string | undefined
  verticalMenuSlotName = 'onecx-shell-vertical-menu'
  isVerticalMenuComponentDefined$: Observable<boolean>
  footerSlotName = 'onecx-shell-footer'
  isFooterComponentDefined$: Observable<boolean>

  constructor() {
    this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
    this.userService.profile$.pipe(untilDestroyed(this)).subscribe((profile) => {
      this.menuMode =
        (profile?.accountSettings?.layoutAndThemeSettings?.menuMode?.toLowerCase() as
          | typeof this.menuMode
          | undefined) ?? this.menuMode

      this.colorScheme =
        (profile?.accountSettings?.layoutAndThemeSettings?.colorScheme?.toLowerCase() as
          | typeof this.colorScheme
          | undefined) ?? this.colorScheme
    })

    this.themeService.currentTheme$
      .pipe(
        first(),
        mergeMap((theme) => {
          return (
            theme.faviconUrl
              ? this.httpClient.get(theme.faviconUrl ?? '', { responseType: 'blob' })
              : (this.workspaceConfigBffService?.getThemeFaviconByName(theme.name ?? '') ?? of())
          ).pipe(
            filter((blob) => !!blob),
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

    this.isVerticalMenuComponentDefined$ = this.slotService.isSomeComponentDefinedForSlot(this.verticalMenuSlotName)
    this.isFooterComponentDefined$ = this.slotService.isSomeComponentDefinedForSlot(this.footerSlotName)

    this.onResize$ = fromEvent(window, 'resize').pipe(debounceTime(100), untilDestroyed(this))
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    this.isMobile$ = this.onResize$.pipe(
      map(() => window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches),
      startWith(
        !window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches,
        window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
      )
    )
    this.isMobile$
      .pipe(
        pairwise(),
        filter(([oldIsMobile, newIsMobile]) => {
          return oldIsMobile !== newIsMobile
        }),
        map(([, isMobile]) => ({ isVisible: !isMobile }))
      )
      .subscribe((state) => {
        this.staticMenuVisibleTopic$.publish(state)
      })
  }

  ngOnInit() {
    this.primengConfig.ripple.set(true)

    this.appStateService.globalError$
      .pipe(untilDestroyed(this))
      .pipe(filter((i) => i !== undefined))
      .subscribe((err: string | undefined) => {
        console.error('global error')
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
    this.staticMenuVisibleTopic$.publish({ isVisible: this.menuActive })
    event.preventDefault()
    event.stopPropagation()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    // auto show sidebar when changing to desktop, hide when changing to mobile
    if (isMobile !== this.isMobile) {
      this.menuActive = !isMobile
    }
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
