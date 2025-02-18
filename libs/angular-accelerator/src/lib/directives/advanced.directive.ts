import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxAdvanced]', standalone: false })
export class AdvancedDirective implements DoCheck {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

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
