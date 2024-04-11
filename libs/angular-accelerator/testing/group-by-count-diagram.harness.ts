import { ComponentHarness } from '@angular/cdk/testing'
import { DiagramHarness } from './diagram.harness'

export class GroupByCountDiagramHarness extends ComponentHarness {
    static hostSelector = 'ocx-group-by-count-diagram'

    getDiagram = this.locatorFor(DiagramHarness)
}