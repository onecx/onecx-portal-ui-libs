import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Directive({
  selector: '[ocxLoadingIndicator]',
  standalone: false,
})
export class LoadingIndicatorDirective implements OnChanges {
  private viewContainerRef = inject(ViewContainerRef)
  private el = inject(ElementRef)
  private renderer = inject(Renderer2)

  @Input() ocxLoadingIndicator = false
  @Input() overlayFullPage = false
  @Input() isLoaderSmall? = false

  private componentRef: ComponentRef<LoadingIndicatorComponent> | undefined

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ocxLoadingIndicator'] || changes['overlayFullPage']) {
      this.toggleLoadingIndicator()
    }
  }

  private elementLoader() {
    this.renderer.addClass(this.el.nativeElement, 'element-overlay')
    const loaderElement = document.createElement('div')
    loaderElement.className = 'loader'
    if (this.isLoaderSmall) {
      loaderElement.className = 'loader loader-small'
    }
    this.renderer.appendChild(this.el.nativeElement, loaderElement)
  }

  private toggleLoadingIndicator() {
    if (this.ocxLoadingIndicator) {
      if (this.overlayFullPage == false) {
        this.elementLoader()
      } else {
        this.componentRef = this.viewContainerRef.createComponent(LoadingIndicatorComponent)
      }
    } else {
      this.viewContainerRef.clear()
      if (this.componentRef) {
        this.componentRef.destroy()
      }
    }
  }
}
