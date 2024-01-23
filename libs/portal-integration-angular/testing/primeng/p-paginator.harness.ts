import { ContentContainerComponentHarness } from "@angular/cdk/testing";
import { SpanHarness } from "../span.harness";
import { PDropdownHarness } from "./p-dropdown.harness";

export class PPaginatorHarness extends ContentContainerComponentHarness {
    static hostSelector = 'p-paginator'
    getCurrentPageReport = this.locatorFor(SpanHarness.with({ class: 'p-paginator-current' }))
    getRowsPerPageOptions = this.locatorFor(PDropdownHarness)

    async getCurrentPageReportText(): Promise<string | undefined> {
        return await (await this.getCurrentPageReport()).getText()
    }

}