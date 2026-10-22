import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core'
import { normalizeHeadingLevel } from '../../utils/heading-level.utils'

export interface LifecycleStep {
  id: string
  title: string
  details?: string
}

@Component({
  standalone: false,
  selector: 'ocx-lifecycle',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent {
  steps = input<LifecycleStep[]>([])
  activeStepId = input<string | undefined>(undefined)

  /**
   * Heading level (1-6) of the step titles. Defaults to 2 as the page header renders the level 1 heading.
   */
  stepTitleHeadingLevel = input<number>(2)

  protected readonly headingLevel = computed(() => normalizeHeadingLevel(this.stepTitleHeadingLevel()))
}
