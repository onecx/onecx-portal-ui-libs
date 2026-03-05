import { Component, input } from '@angular/core'

@Component({
  standalone: false,
  selector: 'ocx-content-container',
  templateUrl: './content-container.component.html',
})
export class OcxContentContainerComponent {
  /**
   * Allows specifying the layout direction of the container
   */
  layout = input<'vertical' | 'horizontal'>('horizontal')

  /**
   * Allows specifying the breakpoint below which a horizontal layout switches to a vertical layout.
   * Only necessary if horizontal layout is used
   * Default: md
   */
  breakpoint = input<'sm' | 'md' | 'lg' | 'xl'>('md')

  /**
   * Optionally allows specifying styles for the container
   */
  styleClass = input<string | undefined>(undefined)
}
