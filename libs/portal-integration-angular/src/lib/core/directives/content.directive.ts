import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core'

@Directive({ selector: '[ocxContent]' })
export class OcxContentDirective implements OnInit, OnChanges {
  /**
   * Used for passing a title text which should be rendered in the upper left corner of the content area.
   * @example [ocxContent]="My Cool Title"
   */
  @Input() ocxContent = ''

  private titleElemID = 'ocx_content_title_element'

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.titleElemID = this.titleElemID + Math.round(Math.random() * 1000)
    this.init()
  }

  ngOnChanges() {
    this.init()
  }

  private init() {
    this.addContentStyles()
    if (this.ocxContent) {
      this.prependTitle()
    } else {
      this.removeTitle()
    }
  }

  private addContentStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    addClasses(['card'])
  }

  private prependTitle() {
    const titleElement = this.el.nativeElement.querySelector(`#${this.titleElemID}`)
    if (titleElement) {
      titleElement.textContent = this.ocxContent
    } else {
      const title = document.createElement('p')
      title.classList.add('font-medium')
      title.classList.add('text-lg')
      title.id = this.titleElemID
      title.textContent = this.ocxContent
      this.el.nativeElement.prepend(title)
    }
  }

  private removeTitle() {
    const titleElement = this.el.nativeElement.querySelector(`#${this.titleElemID}`)
    if (titleElement) {
      titleElement.remove()
    }
  }
}
