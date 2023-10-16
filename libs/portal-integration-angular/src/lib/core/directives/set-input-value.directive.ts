import { Directive, Input, Optional } from '@angular/core'
import { NgControl } from '@angular/forms'

@Directive({
  selector: '[ocxSetInputValue]',
})
export class SetInputValueDirective {
  @Input()
  set ocxSetInputValue(val: any) {
    if (this.ngControl.control) {
      this.ngControl.control.setValue(val, { emitEvent: false })
    }
  }

  constructor(@Optional() private ngControl: NgControl) {}
}
