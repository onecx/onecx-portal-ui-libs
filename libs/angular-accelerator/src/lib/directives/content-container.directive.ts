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
    
    // Remove default classes first
    const defaultClasses = ['gap-3', 'flex-column', 'md:flex-row']
    removeClasses(defaultClasses)
    
    // Remove all breakpoint-dependent flex-row classes (e.g., sm:flex-row, md:flex-row, etc.)
    const classesToRemove: string[] = []
    const regexPattern = /\w+:flex-row$/
    this.el.nativeElement.classList.forEach((className: string) => {
      if (regexPattern.test(className)) {
        classesToRemove.push(className)
      }
    })
    removeClasses(classesToRemove)
    
    // Parse the ngClass input to see what custom classes are being applied
    const customClasses = this.ngClass() ? this.ngClass()!.split(' ').filter(cls => cls.length > 0) : []
    
    // Now get the current state after removals (includes classes from ngClass after it's applied)
    const currentClasses = Array.from(this.el.nativeElement.classList as string[])
    
    // Combine current classes with custom classes from ngClass input to check what's available
    const allRelevantClasses = [...currentClasses, ...customClasses]
    
    // Determine what to add back
    const classesToAdd: string[] = []
    
    // Check if there's a custom gap class, otherwise use default
    if (!allRelevantClasses.some((cls) => cls.startsWith('gap-'))) {
      classesToAdd.push('gap-3')
    }
    
    // Check if there's a custom flex direction class, otherwise use default
    const flexClasses = ['flex-row', 'flex-row-reverse', 'flex-column-reverse']
    if (!allRelevantClasses.some((cls) => flexClasses.includes(cls))) {
      classesToAdd.push('flex-column')
    }
    
    // Add responsive layout class for horizontal layouts
    if (this.layout() !== 'vertical') {
      const responsiveLayoutClass = `${this.breakpoint() || 'md'}:flex-row`
      classesToAdd.push(responsiveLayoutClass)
    }
    
    addClasses(classesToAdd)
  }
}
