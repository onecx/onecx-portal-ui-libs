import { Directive, ElementRef, Input, OnChanges, OnInit, inject } from '@angular/core'

@Directive({ selector: '[ocxContent]' })
export class OcxContentDirective implements OnInit, OnChanges {
  private el = inject(ElementRef);

  /**
   * Used for passing a title text which should be rendered in the upper left corner of the content area.
   * @example [ocxContent]="My Cool Title"
   */
  @Input() ocxContent = ''

  private baseId = 'ocx_content_title_element'
  private titleElementId: string | undefined

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit() {
    this.titleElementId = this.getUniqueTitleID(this.baseId)
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
    if (this.titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${this.titleElementId}`)
      if (titleElement) {
        titleElement.textContent = this.ocxContent
      } else {
        const title = document.createElement('p')
        title.classList.add('font-medium')
        title.classList.add('text-lg')
        title.id = this.titleElementId
        title.textContent = this.ocxContent
        this.el.nativeElement.prepend(title)
      }
    }
  }

  private getUniqueTitleID(baseId: string) {
    let counter = 0
    let generatedID = baseId

    while (document.getElementById(generatedID)) {
      generatedID = baseId + counter
      counter++
    }

    return generatedID
  }

  private removeTitle() {
    if (this.titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${this.titleElementId}`)
      if (titleElement) {
        titleElement.remove()
      }
    }
  }
}
