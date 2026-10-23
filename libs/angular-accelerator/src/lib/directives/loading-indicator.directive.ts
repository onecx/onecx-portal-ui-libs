import { LiveAnnouncer } from '@angular/cdk/a11y'
import { Directive, ElementRef, Renderer2, ViewContainerRef, effect, inject, input, untracked } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { firstValueFrom } from 'rxjs'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Directive({
  selector: '[ocxLoadingIndicator]',
  standalone: false,
})
export class LoadingIndicatorDirective {
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly renderer = inject(Renderer2)
  private readonly liveAnnouncer = inject(LiveAnnouncer)
  private readonly translate = inject(TranslateService)

  ocxLoadingIndicator = input<boolean>(false)
  overlayFullPage = input<boolean>(false)
  isLoaderSmall = input<boolean>(false)

  private loaderElement: HTMLDivElement | undefined
  private loading = false
  private previousFocus: HTMLElement | undefined

  constructor() {
    effect(() => {
      const loading = this.ocxLoadingIndicator()
      const fullPage = this.overlayFullPage()
      const small = this.isLoaderSmall()
      untracked(() => this.update(loading, fullPage, small))
    })
  }

  private update(loading: boolean, fullPage: boolean, small: boolean) {
    this.removeOverlay()
    if (loading) {
      this.renderOverlay(fullPage, small)
    }
    if (loading === this.loading) {
      return
    }
    this.loading = loading
    if (loading) {
      this.startLoading()
    } else {
      this.endLoading()
    }
  }

  private renderOverlay(fullPage: boolean, small: boolean) {
    if (fullPage) {
      this.viewContainerRef.createComponent(LoadingIndicatorComponent)
      return
    }
    const host = this.el.nativeElement
    this.renderer.addClass(host, 'element-overlay')
    const loaderElement: HTMLDivElement = this.renderer.createElement('div')
    loaderElement.className = small ? 'loader loader-small' : 'loader'
    this.renderer.setAttribute(loaderElement, 'aria-hidden', 'true')
    this.renderer.appendChild(host, loaderElement)
    this.loaderElement = loaderElement
  }

  private removeOverlay() {
    this.viewContainerRef.clear()
    this.renderer.removeClass(this.el.nativeElement, 'element-overlay')
    this.loaderElement?.remove()
    this.loaderElement = undefined
  }

  private startLoading() {
    const host = this.el.nativeElement
    const active = document.activeElement
    this.previousFocus = active instanceof HTMLElement && host.contains(active) ? active : undefined
    this.renderer.setAttribute(host, 'aria-busy', 'true')
    this.renderer.setAttribute(host, 'inert', '')
    this.announce('OCX_LOADING_INDICATOR.LOADING_STARTED')
  }

  private endLoading() {
    const host = this.el.nativeElement
    this.renderer.removeAttribute(host, 'inert')
    this.renderer.removeAttribute(host, 'aria-busy')
    this.restoreFocus()
    this.announce('OCX_LOADING_INDICATOR.LOADING_FINISHED')
  }

  private restoreFocus() {
    const previousFocus = this.previousFocus
    this.previousFocus = undefined
    if (!previousFocus) {
      return
    }
    const host = this.el.nativeElement
    const active = document.activeElement
    const focusMovedElsewhere = !!active && active !== document.body && !host.contains(active)
    if (focusMovedElsewhere) {
      return
    }
    if (previousFocus.isConnected && host.contains(previousFocus)) {
      previousFocus.focus()
      return
    }
    if (!host.hasAttribute('tabindex')) {
      this.renderer.setAttribute(host, 'tabindex', '-1')
    }
    host.focus()
  }

  private announce(key: string) {
    firstValueFrom(this.translate.get(key)).then((text: string) => this.liveAnnouncer.announce(text, 'polite'))
  }
}
