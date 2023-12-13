import { Directive, ElementRef, Input, OnInit } from '@angular/core'

@Directive({ selector: '[ocxContentContainer]' })
export class OcxContentContainerDirective implements OnInit {
  /**
   * Used for passing the direction, in which the content inside the container should be rendered.
   * Default: horizontal
   * @example [ocxContentContainer]="horizontal"
   * @example [ocxContentContainer]="vertical"
   */
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.addContainerStyles()
  }

  private addContainerStyles() {
    // Add array of given css classes to classList of element that directive was added to
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)

    // Classes that should be applied to all elements regardless of their layout direction
    const sharedClasses = ['flex', 'p-3', 'gap-3', 'flex-column']
    addClasses(sharedClasses)

    if (this.layout != 'vertical') {
      // Apply horizontal classes
      addClasses(['sm:flex-row'])
    }
  }
}
