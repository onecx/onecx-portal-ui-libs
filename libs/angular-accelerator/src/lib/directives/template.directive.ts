import { Directive, Input, TemplateRef } from '@angular/core'

@Directive({ selector: '[ocxTemplate]' })
export class TemplateDirective {
  @Input({
    required: true,
    alias: 'ocxTemplate',
  })
  name = ''

  constructor(public template: TemplateRef<any>) {}

  getType(): string {
    return this.name
  }
}
