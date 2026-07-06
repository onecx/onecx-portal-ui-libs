import { Gatherer } from "@onecx/accelerator"

import type { AiContextRequest, AiContextResponse } from "./ai-context.model"

export class AiContextGatherer extends Gatherer<AiContextRequest, AiContextResponse | null> {

    constructor(callback: (request: AiContextRequest) => Promise<AiContextResponse | null>) {
        super("aiContext", 1, callback)
    }
}