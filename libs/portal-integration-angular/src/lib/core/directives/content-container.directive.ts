import { Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxContentContainer]', standalone: false })
export class OcxContentContainerDirective implements OnInit, OnChanges {
  private el = inject(ElementRef)

  /**
   * Used for passing the direction, in which the content inside the container should be rendered.
   * Default: horizontal
   * @example [ocxContentContainer]="horizontal"
   * @example [ocxContentContainer]="vertical"
   */
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'

  /**
   * Used for passing in the breakpoint below which a horizontal layout should switch to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  @Input() breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  ngOnInit() {
    this.addContainerStyles()
  }

  ngOnChanges() {
    this.addContainerStyles()
  }

  private addContainerStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    const removeClasses = (classes: string[]) => this.el.nativeElement.classList.remove(...classes)
    // We need to ensure that all breakpoint dependent flex-row classes are removed from the element
    // This way we can avoid multiple contradictory layout classes and unexpected effects
    const removeResponsiveLayoutClasses = () => {
      const classesToRemove: string[] = []
      const regexPattern = /\w+:flex-row$/
      this.el.nativeElement.classList.forEach((className: string) => {
        if (regexPattern.test(className)) {
          classesToRemove.push(className)
        }
      })
      removeClasses(classesToRemove)
    }
    const sharedClasses = ['flex', 'gap-3', 'flex-column']
    removeResponsiveLayoutClasses()
    addClasses(sharedClasses)
    if (this.layout != 'vertical') {
      const responsiveLayoutClass = `${this.breakpoint || 'md'}:flex-row`
      addClasses([responsiveLayoutClass])
    }
  }
}
