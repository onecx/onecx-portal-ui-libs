import { Directive, AfterViewInit, OnChanges, inject, Renderer2, TemplateRef, NgZone, ViewContainerRef, SimpleChanges, Input } from "@angular/core"
import { TooltipOptions } from "primeng/api"
import { Tooltip, TooltipStyle } from "primeng/tooltip"

@Directive({ selector: '[ocxTooltip]', standalone: false, providers: [TooltipStyle] })
export class OcxTooltipDirective extends Tooltip implements AfterViewInit, OnChanges {
  override readonly renderer = inject(Renderer2)
  private generatedId: string | undefined
  private resolvedId: string | undefined
  private removeEscapeKeyListener: (() => void) | undefined

  @Input()
  get ocxTooltip(): string | TemplateRef<HTMLElement> | undefined {
    return this.content
  }

  set ocxTooltip(value: string | TemplateRef<HTMLElement> | undefined) {
    this.content = value
    this.setOption({ tooltipLabel: value })
    this.ensureIdAndAriaDescribedBy()
  }

  constructor() {
    const zone = inject(NgZone)
    const viewContainer = inject(ViewContainerRef)
    super(zone, viewContainer)
    this.tooltipEvent = 'both'
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit()
    this.ensureIdAndAriaDescribedBy()
  }

  override ngOnChanges(simpleChange: SimpleChanges): void {
    super.ngOnChanges(simpleChange)
    this.ensureIdAndAriaDescribedBy()
  }

  override create(): void {
    super.create()
    this.applyIdToContainer()
    this.setEscapeKeyListener()
  }

  override show(): void {
    super.show()
  }

  private ensureIdAndAriaDescribedBy(): void {
    const idFromOptions = this.tooltipOptions?.id
    const idFromInternal = this._tooltipOptions?.id
    const resolvedId = this.normalizeId(idFromOptions) ?? this.normalizeId(idFromInternal) ?? this.getOrCreateGeneratedId()
    this.resolvedId = resolvedId
    if (this.tooltipOptions) {
      const tooltipOptions = this.tooltipOptions as TooltipOptions & { id?: string }
      if (!this.normalizeId(tooltipOptions.id)) {
        tooltipOptions.id = resolvedId
      }
    }

    this.setOption({ id: resolvedId, tooltipEvent: 'both' })
    this.renderer.setAttribute(this.el.nativeElement, 'aria-describedby', resolvedId)
  }

  private normalizeId(id: string | undefined | null): string | null {
    if (!id) return null
    const trimmed = String(id).trim()
    return trimmed.length ? trimmed : null
  }

  private applyIdToContainer(): void {
    if (this.isTooltipCreated()) {
      this.renderer.setAttribute(this.container, 'id', this.resolvedId ?? '')
    }
  }

  private isTooltipCreated(): boolean {
    return this.container !== null && this.container !== undefined
  }

  private getOrCreateGeneratedId(): string {
    if (this.generatedId) return this.generatedId
    const randomPart = Math.random().toString(36).slice(2, 10)
    const timePart = Date.now().toString(36)
    this.generatedId = `ocx-tooltip-${timePart}-${randomPart}`
    return this.generatedId
  }

  private setEscapeKeyListener(): void {
    if (this.container && !this.removeEscapeKeyListener) {
      this.removeEscapeKeyListener = this.renderer.listen(this.container, 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          this.hide()
        }
      })
    }
  }

  override ngOnDestroy(): void {
    if (this.removeEscapeKeyListener) {
      this.removeEscapeKeyListener()
      this.removeEscapeKeyListener = undefined
    }
    super.ngOnDestroy()
  }
}