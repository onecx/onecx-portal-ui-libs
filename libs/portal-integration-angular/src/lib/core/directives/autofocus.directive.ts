import { Directive, ElementRef, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxAutofocus]', standalone: false })
export class AutofocusDirective implements OnInit {
  private el = inject(ElementRef)

  ngOnInit() {
    window.setTimeout(() => this.el.nativeElement.focus())
  }
}
