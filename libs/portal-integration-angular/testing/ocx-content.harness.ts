import { ComponentHarness } from "@angular/cdk/testing";

export class OcxContentHarness extends ComponentHarness {
    static hostSelector = 'ocx-content'

    async getCSSClassList() {
        return await (await this.host()).getAttribute('classList')
    }
}