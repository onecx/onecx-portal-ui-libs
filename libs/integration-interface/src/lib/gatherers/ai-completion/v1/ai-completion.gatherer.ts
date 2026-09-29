import { Gatherer } from "@onecx/accelerator"

import type { AiCompletionRequest, AiCompletionResponse } from "./ai-completion.model"

/**
 * This class acts as a thin communication layer for AI completions between consumers inside
 * onecx-portal-ui-libs and the AI Provider Remote Component. It publishes AI completion requests, 
 * collects responses from the registered provider instance and returns them to the caller. 
 *
 * @example
 * ```ts
 *
 * // create the gatherer in the provider (remote component) so it can answer completion requests
 * // in ngOnDestroy, call the gatherer.destroy() method to clean up resources
 *
 * const aiCompletionGatherer = new AiCompletionGatherer(async (request) => {
 *     // request the AI provider BFF with request.agent / request.message / ...
 *     // and return the response: { message: string }
 *     // return null if you do not want to contribute to this request
 *     return { message: "..." }
 * });
 *
 * // on the consumer side, publish the request and get the responses back:
 * const responses = await aiCompletionGatherer.gather(request)
 * // responses is an array of (AiCompletionResponse | null)
 * ```
 */
export class AiCompletionGatherer extends Gatherer<AiCompletionRequest, AiCompletionResponse | null> {
    constructor(callback: (request: AiCompletionRequest) => Promise<AiCompletionResponse | null>) {
        super("aiCompletion", 1, callback)
    }
}
