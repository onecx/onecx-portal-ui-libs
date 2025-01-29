import { Directive, Input, inject } from '@angular/core'
import { NgControl } from '@angular/forms'

@Directive({
  selector: '[ocxSetInputValue]',
  standalone: false,
})
export class SetInputValueDirective {
  private ngControl = inject(NgControl, { optional: true })!

  @Input()
  set ocxSetInputValue(val: any) {
    if (this.ngControl.control) {
      this.ngControl.control.setValue(val, { emitEvent: false })
    }
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}
}
