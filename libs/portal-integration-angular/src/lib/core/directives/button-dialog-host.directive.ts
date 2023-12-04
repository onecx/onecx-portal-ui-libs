import { Directive, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[buttonDialogHost]',
})
export class ButtonDialogHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
