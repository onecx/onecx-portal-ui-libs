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
    this.addContainerStyles()
  }

  ngOnChanges() {
    this.addContainerStyles()
  }

  private addContainerStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    const removeClasses = (classes: string[]) => this.el.nativeElement.classList.remove(...classes)
    const sharedClasses = ['flex', 'p-3', 'gap-3', 'flex-column']
    removeClasses(['sm:flex-row'])
    addClasses(sharedClasses)
    if (this.layout != 'vertical') {
      addClasses(['sm:flex-row'])
    }
  }
}
