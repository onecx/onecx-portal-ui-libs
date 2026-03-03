import { Component, input } from '@angular/core'

export interface LifecycleStep {
  id: string
  title: string
  details?: string
}

@Component({
  standalone: false,
  selector: 'ocx-lifecycle',
  templateUrl: './lifecycle.component.html',
})
export class LifecycleComponent {
  steps = input<LifecycleStep[]>([])
  activeStepId = input<string | undefined>(undefined)
}
