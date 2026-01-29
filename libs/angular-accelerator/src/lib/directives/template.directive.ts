import { Directive, TemplateRef, inject, input } from '@angular/core'

@Directive({ selector: '[ocxTemplate]', standalone: false })
export class TemplateDirective {
  template = inject<TemplateRef<any>>(TemplateRef)

  name = input.required<string>({
    alias: 'ocxTemplate',
  })

  getType(): string {
    return this.name()
  }
}
