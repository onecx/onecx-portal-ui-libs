import { Directive, Input, TemplateRef } from '@angular/core'

@Directive({ selector: '[ocxTemplate]' })
export class TemplateDirective {
  @Input('ocxTemplate') name: string | undefined

  constructor(public template: TemplateRef<any>) {}

  getType(): string {
    return this.name!
  }
}
