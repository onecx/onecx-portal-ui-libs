import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxBasic]', standalone: false })
export class BasicDirective implements DoCheck {
  private viewContainer = inject(ViewContainerRef)
  private templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

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
