import { Gatherer } from "@onecx/accelerator"

import type { AiContextRequest, AiContextResponse } from "./ai-context.model"

/**
 * This class can be used to provide a context for AI-specific features. 
 * It allows gathering information about all applications, products, and contexts in which the AI is being used.
 * 
 * @example
 * ```ts
 * 
 * // add a gatherer to the constructor of the page component that should provide AI context information
 * // in ngOnDestroy, call the gatherer.destroy() method to clean up resources
 * 
 * const aiContextGatherer = new AiContextGatherer(async (request) => {
 *     // decide if your app whats to contribute to the AI context or not
 *     // if you do not want to contribute, return null
 *     // if you want to contribute, return an AiContextResponse object
 * });
 * ```
 */
export class AiContextGatherer extends Gatherer<AiContextRequest, AiContextResponse | null> {

    constructor(callback: (request: AiContextRequest) => Promise<AiContextResponse | null>) {
        super("aiContext", 1, callback)
    }
}