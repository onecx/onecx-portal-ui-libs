import { Directive, AfterViewInit, OnChanges, inject, Renderer2, TemplateRef, NgZone, ViewContainerRef, SimpleChanges, Input } from "@angular/core"
import { Tooltip, TooltipStyle } from "primeng/tooltip"

@Directive({ selector: '[ocxTooltip]', providers: [TooltipStyle], standalone: true })
export class OcxTooltipDirective extends Tooltip implements AfterViewInit, OnChanges {
  override readonly renderer = inject(Renderer2)

  @Input()
  get ocxTooltip(): string | TemplateRef<HTMLElement> | undefined {
    return this.content
  }

  set ocxTooltip(value: string | TemplateRef<HTMLElement> | undefined) {
    this.content = value
    this.setOption({ tooltipLabel: value })
    this.ensureIdAndAriaDescribedBy()
    this.applyCursor()
  }

  /**
   * CSS cursor applied to the host element while a tooltip text is set.
   * - Not set (default): `pointer` is applied.
   * - Any CSS cursor value (e.g. `default`, `help`): that value is applied instead.
   * - `null`: the directive does not set or remove the cursor style, so the host's own styling applies.
   *
   * Use a non-pointer value on elements that are not clickable, e.g. `ocxTooltipCursor="default"`.
   */
  @Input()
  get ocxTooltipCursor(): string | null | undefined {
    return this._ocxTooltipCursor
  }

  set ocxTooltipCursor(value: string | null | undefined) {
    this._ocxTooltipCursor = value
    this.applyCursor()
  }

  private _ocxTooltipCursor: string | null | undefined = 'pointer'
  private cursorApplied = false
  private hostCursor = ''

  private generatedId: string | undefined
  private resolvedId: string | undefined
  private removeEscapeKeyListener: (() => void) | undefined
  
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

  private applyCursor(): void {
    const cursor = this._ocxTooltipCursor
    if (cursor === null) {
      // Leave the host's own styling untouched, only revert a cursor this directive applied before
      if (this.cursorApplied) {
        this.restoreHostCursor()
      }
      return
    }
    if (this.content) {
      if (!this.cursorApplied) {
        this.hostCursor = this.el.nativeElement.style?.cursor ?? ''
      }
      this.renderer.setStyle(this.el.nativeElement, 'cursor', cursor || 'pointer')
      this.cursorApplied = true
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'cursor')
      this.cursorApplied = false
    }
  }

  private restoreHostCursor(): void {
    if (this.hostCursor) {
      this.renderer.setStyle(this.el.nativeElement, 'cursor', this.hostCursor)
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'cursor')
    }
    this.cursorApplied = false
  }

  private ensureIdAndAriaDescribedBy(): void {
    const idFromOptions = this.tooltipOptions?.id
    const idFromInternal = this._tooltipOptions?.id
    const resolvedId = this.normalizeId(idFromOptions) ?? this.normalizeId(idFromInternal) ?? this.getOrCreateGeneratedId()
    this.resolvedId = resolvedId
    if (this.tooltipOptions) {
      const tooltipOptions = this.tooltipOptions
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
    if (!this.isTooltipCreated() || !this.resolvedId) return
    this.renderer.setAttribute(this.container, 'id', this.resolvedId)
  }

  private isTooltipCreated(): boolean {
    return this.container !== null && this.container !== undefined
  }

  private getOrCreateGeneratedId(): string {
    if (this.generatedId) return this.generatedId
    const randomPart = this.getRandomPart()
    const timePart = Date.now().toString(36)
    this.generatedId = `ocx-tooltip-${timePart}-${randomPart}`
    return this.generatedId
  }

  private getRandomPart(): string {
    const buffer = new Uint32Array(2)
    globalThis.crypto.getRandomValues(buffer)
    return Array.from(buffer, (value) => value.toString(36)).join('')
  }

  private setEscapeKeyListener(): void {
    if (!this.container || this.removeEscapeKeyListener) return
    this.removeEscapeKeyListener = this.renderer.listen(this.container, 'keydown', (event: KeyboardEvent) => {
      if (!(event.key === 'Escape' || event.key === 'Esc')) return
      this.hide()
    })
  }

  override ngOnDestroy(): void {
    if (this.removeEscapeKeyListener) {
      this.removeEscapeKeyListener()
      this.removeEscapeKeyListener = undefined
    }
    super.ngOnDestroy()
  }
}