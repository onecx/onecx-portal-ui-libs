import { Directive, DoCheck, Optional, TemplateRef, ViewContainerRef } from '@angular/core'
import { SearchHeaderComponent } from '@onecx/angular-accelerator'

@Directive({ selector: '[ocxBasic]' })
export class BasicDirective implements DoCheck {
  constructor(
    private viewContainer: ViewContainerRef,
    @Optional() private templateRef?: TemplateRef<any>,
    @Optional() private searchHeader?: SearchHeaderComponent
  ) {
    if (!searchHeader) {
      throw 'Basic directive can only be used inside search header component'
    }
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'basic') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}
