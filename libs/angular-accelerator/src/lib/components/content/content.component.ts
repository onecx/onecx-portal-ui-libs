import { Component, input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-content',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './content.component.html',
})
export class OcxContentComponent {
  /**
   * Optionally allows specifying a title for the content card
   */
  title = input<string>('')

  /**
   * Optionally allows specifying styles for the content card
   */
  /**
   * Heading level (1-6) of the title. Defaults to 2 as the page header renders the level 1 heading.
   */
  titleHeadingLevel = input<number>(2)

  styleClass = input<string | undefined>(undefined)
}
