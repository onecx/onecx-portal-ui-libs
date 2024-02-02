import { Directive, Input } from '@angular/core'

@Directive({
  selector: '[ocxPatchFormGroupValues]',
})
export class PatchFormGroupValuesDirective {
  @Input() formGroup: any
  @Input() emitEvents = false
  @Input()
  set ocxPatchFormGroupValues(val: any) {
    if (!val) return
    this.formGroup.patchValue(val, { emitEvent: this.emitEvents })
  }
}
