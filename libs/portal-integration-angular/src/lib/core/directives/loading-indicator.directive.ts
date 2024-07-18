import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Directive({
  selector: '[ocxLoadingIndicator]',
})
export class LoadingIndicatorDirective implements OnChanges {
  @Input() ocxLoadingIndicator = false
  @Input() overlayFullPage = false
  @Input() isLoaderSmall? = false

  private componentRef: ComponentRef<LoadingIndicatorComponent> | undefined

  constructor(private viewContainerRef: ViewContainerRef, private el: ElementRef, private renderer: Renderer2) {}

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
