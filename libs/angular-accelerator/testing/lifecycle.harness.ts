import { ContentContainerComponentHarness } from "@angular/cdk/testing"

export class LifecycleHarness extends ContentContainerComponentHarness {
    static hostSelector = 'ocx-lifecycle'

    getSteps = this.locatorForAll('.p-timeline-event-content .card')
    getHighlightedSteps = this.locatorForAll('.p-timeline-event-content .card.bg-primary')
}