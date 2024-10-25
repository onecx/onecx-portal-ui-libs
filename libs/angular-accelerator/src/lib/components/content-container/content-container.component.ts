import { Component, Input } from '@angular/core'

@Component({
  selector: 'ocx-content-container',
  templateUrl: './content-container.component.html',
})
export class OcxContentContainerComponent {
  /**
   * Allows specifying the layout direction of the container
   */
  @Input() layout: 'vertical' | 'horizontal' = 'horizontal'

  /**
   * Allows specifying the breakpoint below which a horizontal layout switches to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  @Input() breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  /**
   * Optionally allows specifying styles for the container
   */
  @Input() styleClass: string | undefined
}
