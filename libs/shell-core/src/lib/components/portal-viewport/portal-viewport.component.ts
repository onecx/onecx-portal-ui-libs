import { Component, HostListener, Input, Renderer2 } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { UserService } from '@onecx/angular-integration-interface'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { filter } from 'rxjs'

@Component({
  selector: 'ocx-shell-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
})

@UntilDestroy()
export class PortalViewportComponent {
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
    // private appStateService: AppStateService,
    // private portalMessageService: PortalMessageService,
    private userService: UserService
  ) {
    // this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
    this.userService.profile$.pipe(untilDestroyed(this)).subscribe((profile) => {
      this.menuMode =
        (profile?.accountSettings?.layoutAndThemeSettings?.menuMode?.toLowerCase() as
          | typeof this.menuMode
          | undefined) || this.menuMode

      this.colorScheme =
        (profile?.accountSettings?.layoutAndThemeSettings?.colorScheme?.toLowerCase() as
          | typeof this.colorScheme
          | undefined) || this.colorScheme

          console.log('MENU MODE AND COLORSCHEME', this.menuMode, this.colorScheme)
    })
  }

  ngOnInit() {
    this.primengConfig.ripple = true

    // this.appStateService.globalError$
    //   .pipe(untilDestroyed(this))
    //   .pipe(filter((i) => i !== undefined))
    //   .subscribe((err) => {
    //     this.globalErrMsg = err
    //   })

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
