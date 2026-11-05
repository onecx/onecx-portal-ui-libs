import { Gatherer } from "@onecx/accelerator"

import type { AiAgentProviderResult, AiAgentRequest } from "./ai-agent.model"

/**
 * This class lets consumers gather the AI agents that are available to them.
 * Each provider (for example the AI Provider remote component) registers a callback and answers
 * with its agents, with null if it does not want to contribute, or with an AiProviderError if it failed.
 * The callback must not reject: the underlying gatherer does not handle rejections.
 *
 * @example
 * ```ts
 *
 * // in the provider (remote component), answer agent requests
 * // in ngOnDestroy, call the gatherer.destroy() method to clean up resources
 *
 * const aiAgentGatherer = new AiAgentGatherer(async (request) => {
 *     // return the agents visible for request.appId, or null if you do not want to contribute
 *     return [{ id: 'agent-1', name: 'Agent' }]
 * });
 * ```
 */
export class AiAgentGatherer extends Gatherer<AiAgentRequest, AiAgentProviderResult> {
    constructor(callback: (request: AiAgentRequest) => Promise<AiAgentProviderResult>) {
        super("aiAgent", 1, callback)
    }
}
