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
  styleUrls: ['./lifecycle.component.scss'],
})
export class LifecycleComponent {
  steps = input<LifecycleStep[]>([])
  activeStepId = input<string | undefined>(undefined)

  /**
   * Heading level (1-6) of the step titles. Defaults to 2 as the page header renders the level 1 heading.
   */
  stepTitleHeadingLevel = input<number>(2)

  protected readonly headingLevel = computed(() => normalizeHeadingLevel(this.stepTitleHeadingLevel()))

  /**
   * Exposes the timeline as a list of steps (WCAG 1.3.1).
   */
  protected readonly timelinePt = {
    root: { role: 'list' },
    event: { role: 'listitem' },
  }

  protected isActive(step: LifecycleStep): boolean {
    const activeStepId = this.activeStepId()
    return !!activeStepId && activeStepId === step.id
  }
}
