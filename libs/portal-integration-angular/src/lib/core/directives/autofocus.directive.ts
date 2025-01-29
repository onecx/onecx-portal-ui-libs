import { Directive, ElementRef, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxAutofocus]' })
export class AutofocusDirective implements OnInit {
  private el = inject(ElementRef);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit() {
    window.setTimeout(() => this.el.nativeElement.focus())
  }
}
