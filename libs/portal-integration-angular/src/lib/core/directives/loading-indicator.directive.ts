import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Directive({ selector: '[onecxLoadingIndicator]' })
  export class LoadingIndicatorDirective implements OnChanges {
    @Input() onecxLoadingIndicator = false;
    @Input() overlayFullPage = true;
  
    private componentRef: ComponentRef<LoadingIndicatorComponent>;
  
    constructor(
      private viewContainerRef: ViewContainerRef,
      private componentFactoryResolver: ComponentFactoryResolver
    ) {}
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes.onecxLoadingIndicator || changes.overlayFullPage) {
        this.toggleLoadingIndicator();
      }
    }
  
    private toggleLoadingIndicator() {
      if (this.onecxLoadingIndicator) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(
          LoadingIndicatorComponent
        );
        this.componentRef = this.viewContainerRef.createComponent(factory);
        this.componentRef.instance.fullPageOverlay = this.overlayFullPage;
      } else {
        this.viewContainerRef.clear();
        if (this.componentRef) {
          this.componentRef.destroy();
        }
      }
    }

  }

