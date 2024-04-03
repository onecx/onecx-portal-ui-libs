import { Directive, DoCheck, Optional, TemplateRef, ViewContainerRef } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxAdvanced]' })
export class AdvancedDirective implements DoCheck {
  constructor(
    private viewContainer: ViewContainerRef,
    @Optional() private templateRef?: TemplateRef<any>,
    @Optional() private searchHeader?: SearchHeaderComponent
  ) {
    if (!searchHeader) {
      throw 'Advanced directive can only be used inside search header component'
    }
    searchHeader.hasAdvanced = true
  }
  ngDoCheck(): void {
    if (this.searchHeader?.viewMode === 'advanced') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}
