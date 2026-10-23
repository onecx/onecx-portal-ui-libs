import {
  Directive,
  AfterViewInit,
  OnChanges,
  inject,
  Renderer2,
  TemplateRef,
  NgZone,
  ViewContainerRef,
  SimpleChanges,
  input,
  effect,
} from '@angular/core'
import { Tooltip, TooltipStyle } from '@openng/optimus-ui/tooltip'

const FOCUSABLE_SELECTOR =
  'button, a[href], input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
const KEYBOARD_NAVIGATION_KEYS = new Set(['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])
/** Fallback (no :focus-visible support): focus counts as keyboard only if it follows a navigation key this closely. */
const KEYBOARD_FOCUS_WINDOW_MS = 300
/** Focus following a pointer press or a dialog-closing key within this window is not tooltip-worthy. */
const FOCUS_RESTORE_WINDOW_MS = 300
const DIALOG_CLOSE_KEYS = new Set(['Escape', 'Enter', ' ', 'Spacebar'])

let lastKeyboardNavigation = 0
let lastPointerPress = 0
let lastDialogCloseKey = 0
let keyboardTrackingRegistered = false

function registerKeyboardTracking(): void {
  if (keyboardTrackingRegistered || typeof document === 'undefined') return
  keyboardTrackingRegistered = true
  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const now = Date.now()
      lastPointerPress = 0
      if (KEYBOARD_NAVIGATION_KEYS.has(event.key)) lastKeyboardNavigation = now
      lastDialogCloseKey = DIALOG_CLOSE_KEYS.has(event.key) ? now : 0
    },
    true
  )
  document.addEventListener(
    'mousedown',
    () => {
      lastKeyboardNavigation = 0
      lastDialogCloseKey = 0
      lastPointerPress = Date.now()
    },
    true
  )
}

function isWithin(timestamp: number, windowMs: number): boolean {
  return timestamp > 0 && Date.now() - timestamp <= windowMs
}

function isDialogFocusRestore(event: FocusEvent): boolean {
  const from = event.relatedTarget
  const inDialog = from instanceof Element && !!from.closest('[role="dialog"], [role="alertdialog"]')
  return inDialog || isWithin(lastDialogCloseKey, FOCUS_RESTORE_WINDOW_MS)
}

function isKeyboardFocus(focused: HTMLElement, event: FocusEvent): boolean {
  let focusVisible: boolean
  try {
    focusVisible = focused.matches(':focus-visible')
  } catch {
    // :focus-visible unsupported (e.g. older DOM implementations): only trust a recent navigation key
    return isWithin(lastKeyboardNavigation, KEYBOARD_FOCUS_WINDOW_MS)
  }
  // Trust :focus-visible (it also covers screen reader browse-mode navigation, which sends no keydown)
  // and block only focus that follows a pointer press or a dialog focus restore.
  return focusVisible && !isWithin(lastPointerPress, FOCUS_RESTORE_WINDOW_MS) && !isDialogFocusRestore(event)
}

@Directive({ selector: '[ocxTooltip]', providers: [TooltipStyle], standalone: true })
export class OcxTooltipDirective extends Tooltip implements AfterViewInit, OnChanges {
  override readonly renderer = inject(Renderer2)
  readonly ocxTooltip = input<string | TemplateRef<HTMLElement> | undefined>(undefined)

  private generatedId: string | undefined
  private resolvedId: string | undefined
  private focusCleanups: (() => void)[] = []
  private describedTarget: HTMLElement | undefined
  private focusedElement: HTMLElement | undefined
  private autoHideExplicit = false

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
    const hostIsFocusable = this.hasFocusableInside(host)
    const ancestor = hostIsFocusable ? null : this.getFocusableAncestor()
    const listen = (target: HTMLElement, accepts: (focused: HTMLElement) => boolean) => {
      const onFocusIn = (event: FocusEvent) => {
        const focused = event.target as HTMLElement
        if (!accepts(focused) || !isKeyboardFocus(focused, event)) return
        this.focusedElement = focused
        this.activate()
      }
      const onFocusOut = (event: FocusEvent) => {
        if (event.target !== this.focusedElement) return
        this.focusedElement = undefined
        this.deactivate()
      }
      target.addEventListener('focusin', onFocusIn)
      target.addEventListener('focusout', onFocusOut)
      this.focusCleanups.push(() => {
        target.removeEventListener('focusin', onFocusIn)
        target.removeEventListener('focusout', onFocusOut)
      })
    }
    if (hostIsFocusable) listen(host, (focused) => focused.matches?.(FOCUSABLE_SELECTOR) ?? false)
    // a decorative host (e.g. an icon) is described through the focusable ancestor it sits in; only that element itself counts
    if (ancestor) listen(ancestor, (focused) => focused === ancestor)
  }

  private hasFocusableInside(host: HTMLElement): boolean {
    return !!host.matches?.(FOCUSABLE_SELECTOR) || !!host.querySelector(FOCUSABLE_SELECTOR)
  }

  private getFocusableAncestor(): HTMLElement | null {
    // stop at the nearest interactive boundary so a decorative icon is not bound to a distant focusable container
    const match = (this.el.nativeElement as HTMLElement).parentElement?.closest<HTMLElement>(
      `${FOCUSABLE_SELECTOR}, [tabindex="-1"], button:disabled`
    )
    return match?.matches(FOCUSABLE_SELECTOR) && !match.matches('button:disabled, [tabindex="-1"]') ? match : null
  }

  /** The element that carries the description: the focused element, else the host, a focusable descendant or ancestor. */
  private getDescriptionTarget(): HTMLElement | null {
    if (this.focusedElement) return this.focusedElement
    const host = this.el.nativeElement as HTMLElement
    if (host.matches?.(FOCUSABLE_SELECTOR)) return host
    return host.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? this.getFocusableAncestor()
  }

  private addDescription(): void {
    this.removeDescription()
    const target = this.getDescriptionTarget()
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
    const ids = (target.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((id) => id && id !== this.resolvedId)
    if (ids.length) target.setAttribute('aria-describedby', ids.join(' '))
    else target.removeAttribute('aria-describedby')
  }

  override ngOnChanges(simpleChange: SimpleChanges): void {
    if (simpleChange['autoHide'] || simpleChange['tooltipOptions']?.currentValue?.autoHide !== undefined) {
      this.autoHideExplicit = true
    }
    super.ngOnChanges(simpleChange)
    this.ensureIdAndAriaDescribedBy()
  }

  override create(): void {
    super.create()
    this.applyIdToContainer()
  }

  override show(): void {
    super.show()
    // aria-describedby must always resolve to an existing element, so reference the tooltip only while it is rendered
    if (this.isTooltipCreated()) {
      this.applyIdToContainer()
      this.addDescription()
    }
  }

  private isKeyboardFocusRetained(): boolean {
    return !!this.focusedElement && this.focusedElement === document.activeElement
  }

  // moving the pointer away must not dismiss a tooltip (and its description) while keyboard focus remains on the element
  override onMouseLeave(e: MouseEvent): void {
    if (this.isKeyboardFocusRetained()) {
      this.pointerInside = false
      return
    }
    super.onMouseLeave(e)
  }

  override bindContainerMouseleaveListener(): void {
    if (this.containerMouseleaveListener) return
    this.containerMouseleaveListener = this.renderer.listen(this.container, 'mouseleave', () => {
      if (!this.isKeyboardFocusRetained()) this.deactivate()
    })
  }

  override hide(): void {
    this.removeDescription()
    super.hide()
  }

  private ensureIdAndAriaDescribedBy(): void {
    const idFromOptions = this.tooltipOptions?.id
    const idFromInternal = this._tooltipOptions?.id
    const resolvedId =
      this.normalizeId(idFromOptions) ?? this.normalizeId(idFromInternal) ?? this.getOrCreateGeneratedId()
    this.resolvedId = resolvedId
    if (this.tooltipOptions) {
      const tooltipOptions = this.tooltipOptions
      if (!this.normalizeId(tooltipOptions.id)) {
        tooltipOptions.id = resolvedId
      }
    }

    // keep the tooltip hoverable (WCAG 1.4.13) unless the consumer explicitly chose autoHide
    this.setOption(
      this.autoHideExplicit
        ? { id: resolvedId, tooltipEvent: 'both' }
        : { id: resolvedId, tooltipEvent: 'both', autoHide: false }
    )
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

  override ngOnDestroy(): void {
    this.removeDescription()
    this.focusCleanups.forEach((cleanup) => cleanup())
    this.focusCleanups = []
    super.ngOnDestroy()
  }
}
