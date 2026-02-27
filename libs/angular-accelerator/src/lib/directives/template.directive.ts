import { Directive, TemplateRef, inject, input } from '@angular/core'

@Directive({ selector: '[ocxTemplate]', standalone: false })
export class TemplateDirective {
  template = inject<TemplateRef<any>>(TemplateRef)

  ocxTemplate = input.required<string>()

  getType(): string {
    return this.ocxTemplate()
  }
}
