import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component';

@Directive({
  selector: '[onecxLoadingIndicator]',
})
export class LoadingIndicatorDirective implements OnChanges {
  @Input() onecxLoadingIndicator = false;
  @Input() overlayFullPage = false;
  @Input() loaderSize? = false;

  private componentRef: ComponentRef<LoadingIndicatorComponent>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.onecxLoadingIndicator || changes.overlayFullPage) {
      this.toggleLoadingIndicator();
    }
  }

  private setLoaderIndicatorStyle() {
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
    .element-overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    .element-overlay {
      position : relative;
      width : 100%;
      cursor: default;
      pointer-events: none;
    }
    .loader {
      width: 28px;
      height: 28px;
      border: 3px solid var(--primary-color);
      border-bottom-color: transparent;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    .loader.loader-small {
      width: 20px;
      height: 20px;
      top: 20%;
      left: 45%;
    }
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;
    document.head.appendChild(loaderStyle);
  }

  private elementLoader() {
    this.renderer.addClass(this.el.nativeElement, 'element-overlay');
    const loaderElement = document.createElement('div');
    loaderElement.className = 'loader';
    if (this.loaderSize) {
      loaderElement.className = 'loader loader-small';
    }
    this.renderer.appendChild(this.el.nativeElement, loaderElement);
  }

  private toggleLoadingIndicator() {
    if (this.onecxLoadingIndicator) {
      this.setLoaderIndicatorStyle();
      if (this.overlayFullPage == false) {
        this.elementLoader();
      } else {
        const factory = this.componentFactoryResolver.resolveComponentFactory(
          LoadingIndicatorComponent
        );
        this.componentRef = this.viewContainerRef.createComponent(factory);
        this.componentRef.instance.fullPageOverlay = this.overlayFullPage;
      }
    } else {
      this.viewContainerRef.clear();
      if (this.componentRef) {
        this.componentRef.destroy();
      }
    }
  }
}
