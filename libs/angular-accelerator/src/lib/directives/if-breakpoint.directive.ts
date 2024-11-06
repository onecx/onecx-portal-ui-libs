import { Directive, HostListener, Input, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core'

@Directive({ selector: '[ocxIfBreakpoint]' })
export class IfBreakpointDirective implements OnInit {
  @Input('ocxIfBreakpoint') breakpoint: 'mobile' | 'desktop' | undefined

  @Input()
  ocxIfBreakpointElseTemplate: TemplateRef<any> | undefined

  state: 'mobile' | 'desktop' | undefined

  constructor(
    private viewContainer: ViewContainerRef,
    @Optional() private templateRef?: TemplateRef<unknown>
  ) {}

  ngOnInit() {
    this.onResize()
  }

  @HostListener('window:resize')
  onResize() {
    const mobileBreakpointVar = getComputedStyle(document.documentElement).getPropertyValue('--mobile-break-point')
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpointVar})`).matches
    const isDesktop = !isMobile
    const newState = isMobile ? 'mobile' : 'desktop'
    if ((this.breakpoint === 'mobile' && isMobile) || (this.breakpoint === 'desktop' && isDesktop)) {
      if (this.templateRef && newState !== this.state) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      if (this.ocxIfBreakpointElseTemplate && newState !== this.state) {
        this.viewContainer.clear()
        this.viewContainer.createEmbeddedView(this.ocxIfBreakpointElseTemplate)
      }
    }
    this.state = newState
  }
}
