import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core'

@Directive({ selector: '[ocxContentContainer]' })
export class OcxContentContainerDirective implements OnInit, OnChanges {
  /**
   * Used for passing the direction, in which the content inside the container should be rendered.
   * Default: horizontal
   * @example [ocxContentContainer]="horizontal"
   * @example [ocxContentContainer]="vertical"
   */
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Apply style classes to element that directive is added to
    this.addContainerStyles()
  }

  ngOnChanges() {
    // Re-apply style classes to element that directive is added to
    this.addContainerStyles()
  }

  private addContainerStyles() {
    // Add array of given css classes to classList of element that directive was added to
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    const removeClasses = (classes: string[]) => this.el.nativeElement.classList.remove(...classes)

    // Classes that should be applied to all elements regardless of their layout direction
    const sharedClasses = ['flex', 'p-3', 'gap-3', 'flex-column']
    
    // Remove all potentially applied classes to avoid duplicates
    removeClasses([...sharedClasses, 'sm:flex-row'])

    // Apply shared classes
    addClasses(sharedClasses)

    if (this.layout != 'vertical') {
      // Apply horizontal classes
      addClasses(['sm:flex-row'])
    }
  }
}
