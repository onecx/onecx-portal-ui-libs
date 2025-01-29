import { Directive, Input, TemplateRef, inject } from '@angular/core'

@Directive({ selector: '[ocxTemplate]', standalone: false })
export class TemplateDirective {
  template = inject<TemplateRef<any>>(TemplateRef)

  @Input({
    required: true,
    alias: 'ocxTemplate',
  })
  name = ''

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  getType(): string {
    return this.name
  }
}
