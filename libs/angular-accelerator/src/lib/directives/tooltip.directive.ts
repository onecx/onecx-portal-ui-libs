import { Directive, AfterViewInit, OnChanges, inject, Renderer2, TemplateRef, NgZone, ViewContainerRef, SimpleChanges, input, effect } from "@angular/core"
import { Tooltip, TooltipStyle } from "@openng/optimus-ui/tooltip"

const FOCUSABLE_SELECTOR =
  'button, a[href], input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
const KEYBOARD_NAVIGATION_KEYS = new Set([
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End'
])
/** A focus event counts as keyboard navigation only if it follows a navigation key this closely. */
const KEYBOARD_FOCUS_WINDOW_MS = 300

let lastKeyboardNavigation = 0
let keyboardTrackingRegistered = false

function registerKeyboardTracking(): void {
  if (keyboardTrackingRegistered || typeof document === 'undefined') return
  keyboardTrackingRegistered = true
  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (KEYBOARD_NAVIGATION_KEYS.has(event.key)) lastKeyboardNavigation = Date.now()
    },
    true
  )
  document.addEventListener('mousedown', () => (lastKeyboardNavigation = 0), true)
}

function isKeyboardFocus(): boolean {
  return lastKeyboardNavigation > 0 && Date.now() - lastKeyboardNavigation <= KEYBOARD_FOCUS_WINDOW_MS
}

@Directive({ selector: '[ocxTooltip]', providers: [TooltipStyle], standalone: true })
export class OcxTooltipDirective extends Tooltip implements AfterViewInit, OnChanges {
  override readonly renderer = inject(Renderer2)
  readonly ocxTooltip = input<string | TemplateRef<HTMLElement> | undefined>(undefined)

  private generatedId: string | undefined
  private resolvedId: string | undefined
  private removeEscapeKeyListener: (() => void) | undefined
  private focusCleanups: (() => void)[] = []
  private describedTarget: HTMLElement | undefined
  
  constructor() {
    const zone = inject(NgZone)
    const viewContainer = inject(ViewContainerRef)
    super(zone, viewContainer)
    this.tooltipEvent = 'both'
    effect(() => {
      const value = this.ocxTooltip()
      this.content = value
      this.setOption({ tooltipLabel: value })
      this.ensureIdAndAriaDescribedBy()
      if (value) {
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer')
      } else {
        this.renderer.removeStyle(this.el.nativeElement, 'cursor')
      }
    })
  }

  override ngAfterViewInit(): void {
    // The base class attaches focus listeners to the host (or its .p-component), which never
    // fires for non-focusable hosts and cannot tell keyboard focus from programmatic focus.
    // Let it attach hover/touch listeners only and handle focus here.
    this.setOption({ tooltipEvent: 'hover' })
    super.ngAfterViewInit()
    this.ensureIdAndAriaDescribedBy()
    this.bindFocusListeners()
  }

  private bindFocusListeners(): void {
    if (typeof document === 'undefined') return
    registerKeyboardTracking()
    const host = this.el.nativeElement as HTMLElement
    const targets = new Set<HTMLElement>([host])
    const ancestor = this.getFocusTarget()
    if (ancestor && !host.contains(ancestor)) targets.add(ancestor)
    for (const target of targets) {
      const onFocusIn = () => {
        if (isKeyboardFocus()) this.activate()
      }
      const onFocusOut = (event: FocusEvent) => {
        if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return
        this.deactivate()
      }
      target.addEventListener('focusin', onFocusIn)
      target.addEventListener('focusout', onFocusOut)
      this.focusCleanups.push(() => {
        target.removeEventListener('focusin', onFocusIn)
        target.removeEventListener('focusout', onFocusOut)
      })
    }
  }

  /**
   * The element keyboard users actually focus: the host itself, a focusable descendant
   * (e.g. the button inside p-button) or, for decorative hosts such as an icon, the closest focusable ancestor.
   */
  private getFocusTarget(): HTMLElement | null {
    const host = this.el.nativeElement as HTMLElement
    if (host.matches?.(FOCUSABLE_SELECTOR)) return host
    return host.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? host.parentElement?.closest<HTMLElement>(FOCUSABLE_SELECTOR) ?? null
  }

  private addDescription(): void {
    const target = this.getFocusTarget()
    if (!target || !this.resolvedId) return
    const ids = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean)
    if (!ids.includes(this.resolvedId)) ids.push(this.resolvedId)
    target.setAttribute('aria-describedby', ids.join(' '))
    this.describedTarget = target
  }

  private removeDescription(): void {
    const target = this.describedTarget
    this.describedTarget = undefined
    if (!target || !this.resolvedId) return
    const ids = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id && id !== this.resolvedId)
    if (ids.length) target.setAttribute('aria-describedby', ids.join(' '))
    else target.removeAttribute('aria-describedby')
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
    // aria-describedby must always resolve to an existing element, so reference the tooltip only while it is rendered
    if (this.isTooltipCreated()) {
      this.applyIdToContainer()
      this.addDescription()
    }
  }

  override hide(): void {
    this.removeDescription()
    if (this.removeEscapeKeyListener) {
      this.removeEscapeKeyListener()
      this.removeEscapeKeyListener = undefined
    }
    super.hide()
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

    this.setOption({ id: resolvedId, tooltipEvent: 'both', autoHide: false })
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
    this.removeDescription()
    this.focusCleanups.forEach((cleanup) => cleanup())
    this.focusCleanups = []
    if (this.removeEscapeKeyListener) {
      this.removeEscapeKeyListener()
      this.removeEscapeKeyListener = undefined
    }
    super.ngOnDestroy()
  }
}