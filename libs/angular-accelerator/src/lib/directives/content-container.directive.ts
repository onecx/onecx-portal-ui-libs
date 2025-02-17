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

  /**
   * Used for passing in the breakpoint below which a horizontal layout should switch to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  @Input() breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

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
    const addSharedClasses = () => {
      const styleClasses = Array.from(this.el.nativeElement.classList as string[])
      const classList: string[] = ['flex']

      if (!styleClasses.some((cls) => cls.startsWith('gap-'))) {
        classList.push('gap-3')
      }
      const flexClasses = ['flex-row', 'flex-column', 'flex-row-reverse', 'flex-column-reverse']
      if (!styleClasses.some((cls) => flexClasses.includes(cls))) {
        classList.push('flex-column')
      }
      if (this.layout != 'vertical') {
        const responsiveLayoutClass = `${this.breakpoint || 'md'}:flex-row`
        classList.push(responsiveLayoutClass)
      }
      addClasses(classList)
    }

    removeResponsiveLayoutClasses()
    addSharedClasses()
  }
}
