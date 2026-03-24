import {
  AfterViewInit,
  Directive,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  inject,
} from '@angular/core'
import { TooltipStyle } from 'primeng/tooltip'
import { OcxTooltipDirective } from './tooltip.directive'

@Directive({ selector: '[ocxTooltipOnOverflow]', standalone: false, providers: [TooltipStyle] })
export class TooltipOnOverflowDirective extends OcxTooltipDirective implements OnDestroy, AfterViewInit {
  mutationObserver = new MutationObserver(() => {
    this.zone.run(() => {
      this.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
      this.setOption({ disabled: this.disabled })
    }, this)
  })

  @Input()
  get ocxTooltipOnOverflow(): string | TemplateRef<HTMLElement> | undefined {
    return this.content
  }
  set ocxTooltipOnOverflow(value: string | TemplateRef<HTMLElement> | undefined) {
    this.content = value
    this.setOption({ tooltipLabel: value })
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy()
    this.mutationObserver.disconnect()
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
    setTimeout(() => {
      // Needed to ensure change detection picks up the correct state of 'disabled'
      // Without this the tooltip for some elements won't update properly
      this.zone.run(() => {
        this.disabled = this.el.nativeElement.scrollWidth <= this.el.nativeElement.offsetWidth
        this.setOption({ disabled: this.disabled })
      }, this)
      this.mutationObserver.observe(this.el.nativeElement, { subtree: true, characterData: true, childList: true })
    }, 0)
  }
  constructor() {
    const renderer = inject(Renderer2)
    super()
    renderer.setStyle(this.el.nativeElement, 'text-overflow', 'ellipsis')
    renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden')
    renderer.setStyle(this.el.nativeElement, 'white-space', 'nowrap')
    this.disabled = true
    this.setOption({ disabled: this.disabled })
  }
}
