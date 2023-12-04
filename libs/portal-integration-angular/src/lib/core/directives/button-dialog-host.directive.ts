import { Directive, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[ocxButtonDialogHost]',
})
export class ButtonDialogHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
