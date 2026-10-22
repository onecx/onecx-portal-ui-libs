import { normalizeHeadingLevel } from '../utils/heading-level.utils'
import { Directive, ElementRef, OnInit, effect, inject, input, signal } from '@angular/core'

@Directive({ selector: '[ocxContent]', standalone: false })
export class OcxContentDirective implements OnInit {
  private readonly el = inject(ElementRef)

  /**
   * Used for passing a title text which should be rendered in the upper left corner of the content area.
   * @example [ocxContent]="My Cool Title"
   */
  ocxContent = input<string>('')

  /**
   * Heading level (aria-level, 1-6) exposed for the title. Defaults to 2, because the page header renders the level 1 heading.
   * @example [ocxContentHeadingLevel]="3"
   */
  ocxContentHeadingLevel = input<number>(2)

  private readonly baseId = signal<string>('ocx_content_title_element')
  private readonly titleElementId = signal<string | undefined>(undefined)

  constructor() {
    effect(() => {
      this.init()
    })
  }

  ngOnInit() {
    this.titleElementId.set(this.getUniqueTitleID(this.baseId()))
    this.init()
  }

  private init() {
    this.addContentStyles()
    if (this.ocxContent()) {
      this.prependTitle()
    } else {
      this.removeTitle()
    }
  }

  private addContentStyles() {
    const addClasses = (classes: string[]) => this.el.nativeElement.classList.add(...classes)
    addClasses(['ocx-card'])
  }

  private prependTitle() {
    const titleElementId = this.titleElementId()
    if (titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${titleElementId}`)
      if (titleElement) {
        titleElement.textContent = this.ocxContent()
        titleElement.setAttribute('aria-level', String(normalizeHeadingLevel(this.ocxContentHeadingLevel())))
      } else {
        const title = document.createElement('p')
        title.classList.add('font-medium')
        title.classList.add('text-lg')
        title.id = titleElementId
        title.setAttribute('role', 'heading')
        title.setAttribute('aria-level', String(normalizeHeadingLevel(this.ocxContentHeadingLevel())))
        title.textContent = this.ocxContent()
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
    const titleElementId = this.titleElementId()
    if (titleElementId) {
      const titleElement = this.el.nativeElement.querySelector(`#${titleElementId}`)
      if (titleElement) {
        titleElement.remove()
      }
    }
  }
}
