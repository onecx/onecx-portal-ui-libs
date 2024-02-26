import { Directive, DoCheck, Optional, TemplateRef, ViewContainerRef } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxSimple]' })
export class SimpleDirective implements DoCheck {
  constructor(
    private viewContainer: ViewContainerRef,
    @Optional() private templateRef?: TemplateRef<any>,
    @Optional() private searchHeader?: SearchHeaderComponent
  ) {
    if (!searchHeader) {
      throw 'Simple directive can only be used inside search header component'
    }
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'simple') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}
