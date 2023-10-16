import { Directive, ElementRef, OnInit } from '@angular/core'

@Directive({ selector: '[ocxAutofocus]' })
export class AutofocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    window.setTimeout(() => this.el.nativeElement.focus())
  }
}
