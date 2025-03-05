import { Component, Input } from '@angular/core'

export interface LifecycleStep {
  id: string
  title: string
  details?: string
}

@Component({
  selector: 'ocx-lifecycle',
  templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent {
  @Input() steps: LifecycleStep[] = []
  @Input() activeStepId: string | undefined
}
