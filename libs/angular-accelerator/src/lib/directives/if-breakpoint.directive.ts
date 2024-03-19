import { Directive, HostListener, Input, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core'

@Directive({ selector: '[ocxIfBreakpoint]' })
export class IfBreakpointDirective implements OnInit {
  @Input('ocxIfBreakpoint') breakpoint: 'mobile' | 'desktop' | undefined

  constructor(private viewContainer: ViewContainerRef, @Optional() private templateRef?: TemplateRef<unknown>) {}

  ngOnInit() {
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    const isDesktop = !isMobile
    if ((this.breakpoint === 'mobile' && isMobile) || (this.breakpoint === 'desktop' && isDesktop)) {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}
