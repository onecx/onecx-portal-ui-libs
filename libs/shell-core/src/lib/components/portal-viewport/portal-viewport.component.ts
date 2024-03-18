import { Component, HostListener, Input, Renderer2 } from '@angular/core'
import { untilDestroyed } from '@ngneat/until-destroy'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { filter } from 'rxjs'

@Component({
  selector: 'ocx-shell-portal-viewport',
  templateUrl: './portal-viewport.component.html',
  styleUrls: ['./portal-viewport.component.scss'],
})
export class PortalViewportComponent {
  @Input()
  fullPortalLayout = true

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
  ) {
    // this.portalMessageService.message$.subscribe((message: Message) => this.messageService.add(message))
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
