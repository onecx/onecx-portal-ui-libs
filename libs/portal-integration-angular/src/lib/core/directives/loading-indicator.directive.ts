import { Directive, DoCheck, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core'
import { LoadingIndicatorComponent } from '../components/loading-indicator/loading-indicator.component'

@Directive({ selector: '[onecxLoadingIndicator]' })
  export class LoadingIndicatorDirective {
    constructor(
        private viewContainer: ViewContainerRef,
        @Optional() private templateRef?: TemplateRef<any>,
        @Optional() private loadingIndicator?: LoadingIndicatorComponent
      ) {}
  
    @Input() 
    set onecxLoadingIndicator(loading: boolean) {
      this.viewContainer.clear();
  
      if (loading)
    {
      // create and embed an instance of the loading component
      this.loadingIndicator = this.viewContainer.createComponent(this.loadingIndicator);
    }
    else
    {
      // embed the contents of the host template
      this.viewContainer.createEmbeddedView(this.templateRef);
    }    
    }
  }

