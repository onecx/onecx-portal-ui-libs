import {
  AfterViewInit,
  Directive,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { Tooltip } from 'primeng/tooltip'

@Directive({ selector: '[ocxTooltipOnOverflow]' })
export class TooltipOnOverflowDirective extends Tooltip implements OnDestroy, AfterViewInit {
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
    this.mutationObserver.observe(this.el.nativeElement, { subtree: true, characterData: true, childList: true })
  }

  constructor(zone: NgZone, renderer: Renderer2, viewContainer: ViewContainerRef) {
    super(zone, viewContainer)
    renderer.setStyle(this.el.nativeElement, 'text-overflow', 'ellipsis')
    renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden')
    renderer.setStyle(this.el.nativeElement, 'white-space', 'nowrap')
    this.disabled = true
    this.setOption({ disabled: this.disabled })
  }
}
