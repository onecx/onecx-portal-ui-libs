import { Directive, HostListener, OnInit, TemplateRef, ViewContainerRef, inject, input, signal } from '@angular/core'

@Directive({ selector: '[ocxIfBreakpoint]', standalone: false })
export class IfBreakpointDirective implements OnInit {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef, { optional: true })

  breakpoint = input<'mobile' | 'desktop' | undefined>(undefined, { alias: 'ocxIfBreakpoint' })

  ocxIfBreakpointElseTemplate = input<TemplateRef<any> | undefined>(undefined)

  state = signal<'mobile' | 'desktop' | undefined>(undefined)

  ngOnInit() {
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    const isDesktop = !isMobile
    const newState = isMobile ? 'mobile' : 'desktop'

    const breakpoint = this.breakpoint()
    const elseTemplate = this.ocxIfBreakpointElseTemplate()

    if ((breakpoint === 'mobile' && isMobile) || (breakpoint === 'desktop' && isDesktop)) {
      if (this.templateRef && newState !== this.state()) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      if (elseTemplate && newState !== this.state()) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(elseTemplate)
      }
    }

    this.state.set(newState)
  }
}
