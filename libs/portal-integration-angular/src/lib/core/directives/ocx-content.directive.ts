import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core'

@Directive({ selector: '[ocxContent]' })
export class OcxContentDirective implements OnInit, OnChanges {
  /**
   * Used for passing a title text which should be rendered in the upper left corner of the content area.
   * @example [ocxContent]="My Cool Title"
   */
  @Input() ocxContent = ''

  private titleElemID = 'ocxContentTitleElement'

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.init()
  }

  ngOnChanges() {
    this.init()
  }

  private init() {
    // Apply style classes to element that directive is added to
    this.addContentStyles()
    if (this.ocxContent) {
      // Prepend title as first child of element that directive is added to
      this.prependTitle()
    } else {
      // Ensure that title element doesn't remain in DOM when ocxContent is set to '' | null | undefined
      this.removeTitle()
    }
  }

  private addContentStyles() {
    // Helper methods
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    const removeClasses = (classes: string[]) => this.el.nativeElement.classList.remove(...classes)

    // Classes that should be applied to the content element
    const sharedClasses = ['card']
    
    // Remove all potentially applied classes to avoid duplicates
    removeClasses(sharedClasses)

    // Apply shared classes
    addClasses(sharedClasses)
  }

  private prependTitle() {
    // Query for ocxContentTitleElement to check if it exists
    const titleElement = this.el.nativeElement.querySelector(`#${this.titleElemID}`)
    if (titleElement) {
      // If element already exists don't re-render everything and only change the text content of the element
      titleElement.textContent = this.ocxContent
    } else {
      // If element doesn't exist create it and add the text to it
      const title = document.createElement('p')
      title.classList.add('font-medium')
      title.classList.add('text-lg')
      title.id = this.titleElemID
      title.textContent = this.ocxContent
      this.el.nativeElement.prepend(title)
    }
  }

  private removeTitle() {
    // Query for ocxContentTitleElement to check if it exists
    const titleElement = this.el.nativeElement.querySelector(`#${this.titleElemID}`)
    if (titleElement) {
      // If element exists remove it, if not do nothing
      titleElement.remove()
    }
  }
}
