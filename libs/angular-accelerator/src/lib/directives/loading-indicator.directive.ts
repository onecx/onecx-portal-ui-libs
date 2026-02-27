import { ComponentRef, Directive, ElementRef, Renderer2, ViewContainerRef, effect, inject, input } from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Directive({
  selector: '[ocxLoadingIndicator]',
  standalone: false,
})
export class LoadingIndicatorDirective {
  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly el = inject(ElementRef)
  private readonly renderer = inject(Renderer2)

  ocxLoadingIndicator = input<boolean>(false)
  overlayFullPage = input<boolean>(false)
  isLoaderSmall = input<boolean>(false)

  private componentRef: ComponentRef<LoadingIndicatorComponent> | undefined

  constructor() {
    effect(() => {
      this.toggleLoadingIndicator()
    })
  }

  private elementLoader() {
    this.renderer.addClass(this.el.nativeElement, 'element-overlay')
    const loaderElement = document.createElement('div')
    loaderElement.className = 'loader'
    if (this.isLoaderSmall()) {
      loaderElement.className = 'loader loader-small'
    }
    this.renderer.appendChild(this.el.nativeElement, loaderElement)
  }

  private toggleLoadingIndicator() {
    if (this.ocxLoadingIndicator()) {
      if (this.overlayFullPage()) {
        this.componentRef = this.viewContainerRef.createComponent(LoadingIndicatorComponent)
      } else {
        this.elementLoader()
      }
    } else {
      this.viewContainerRef.clear()
      if (this.componentRef) {
        this.componentRef.destroy()
      }
    }
  }
}
