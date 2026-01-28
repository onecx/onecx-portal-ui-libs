import { Directive, DoCheck, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { SearchHeaderComponent } from '../components/search-header/search-header.component'

@Directive({ selector: '[ocxBasic]', standalone: false })
export class BasicDirective implements DoCheck {
  private readonly viewContainer = inject(ViewContainerRef)
  private readonly templateRef = inject<TemplateRef<any>>(TemplateRef, { optional: true })
  private readonly searchHeader = inject(SearchHeaderComponent, { optional: true })

  constructor() {
    const searchHeader = this.searchHeader

    if (!searchHeader) {
      throw new Error('Basic directive can only be used inside search header component')
    }
  }
  ngDoCheck(): void {
    if (this.searchHeader?.effectiveViewMode() === 'basic') {
      if (this.templateRef && !this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef)
      }
    } else {
      this.viewContainer.clear()
    }
  }
}
