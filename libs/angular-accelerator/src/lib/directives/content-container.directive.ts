import { Directive, ElementRef, OnInit, effect, inject, input } from '@angular/core'

@Directive({ selector: '[ocxContentContainer]', standalone: false })
export class OcxContentContainerDirective implements OnInit {
  private el = inject(ElementRef)

  /**
   * Used for passing the direction, in which the content inside the container should be rendered.
   * Default: horizontal
   * @example [ocxContentContainer]="horizontal"
   * @example [ocxContentContainer]="vertical"
   */
  layout = input<'horizontal' | 'vertical'>('horizontal')

  /**
   * Used for passing in the breakpoint below which a horizontal layout should switch to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  breakpoint = input<'sm' | 'md' | 'lg' | 'xl'>('md')

  /**
   * Optionally allows specifying styles for the container
   */
  ngClass = input<string | undefined>(undefined)

  ngOnInit() {
    this.el.nativeElement.classList.add('flex', 'gap-3', 'flex-column', 'md:flex-row')
    this.addContainerStyles()
  }

  constructor() {
    effect(() => {
      this.addContainerStyles()
    })
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
      let styleClasses = Array.from(this.el.nativeElement.classList as string[])
      const defaultClasses = ['gap-3', 'flex-column', 'md:flex-row']
      removeClasses(defaultClasses)
      if (styleClasses.some((cls) => cls.startsWith('gap-') && cls !== 'gap-3')) {
        styleClasses = styleClasses.filter((cls) => !cls.startsWith('gap-3'))
      }
      const flexClasses = ['flex-row', 'flex-row-reverse', 'flex-column-reverse']
      if (styleClasses.some((cls) => flexClasses.includes(cls))) {
        styleClasses = styleClasses.filter((cls) => cls !== 'flex-column')
      }
      if (this.layout() != 'vertical') {
        const responsiveLayoutClass = `${this.breakpoint() || 'md'}:flex-row`
        styleClasses.push(responsiveLayoutClass)
      }
      addClasses(styleClasses)
    }

    removeResponsiveLayoutClasses()
    addSharedClasses()
  }
}
