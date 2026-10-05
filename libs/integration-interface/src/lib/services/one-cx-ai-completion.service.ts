import { AiCompletionGatherer } from '../gatherers/ai-completion/v1/ai-completion.gatherer'
import type { AiCompletionRequest, AiCompletionResponse } from '../gatherers/ai-completion/v1/ai-completion.model'
import { createLogger } from '../utils/logger.utils'

export async function consumerAiCompletionProvider(
  _request: AiCompletionRequest
): Promise<AiCompletionResponse | null> {
  return null
}

/**
 * Thin service wrapper around AiCompletionGatherer that lets consumers inside request AI completions.
 *
 * It forwards the given request unchanged through the gatherer and returns the first
 * non-null response collected from the registered AI provider instance (for example the
 * ocx-ai-connector-component). If no provider contributes a response, an error is thrown.
 */
export class OneCXAiCompletionService {
  private readonly logger = createLogger('OneCXAiCompletionService')

  private _aiCompletionGatherer: AiCompletionGatherer | undefined
  get aiCompletionGatherer() {
    this._aiCompletionGatherer ??= new AiCompletionGatherer(consumerAiCompletionProvider)
    return this._aiCompletionGatherer
  }
  set aiCompletionGatherer(source: AiCompletionGatherer) {
    this._aiCompletionGatherer = source
  }

  async getCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    this.logger.debug('getCompletion', request)
    const responses = await this.aiCompletionGatherer.gather(request)
    const response = responses.find((r) => r !== null)
    if (!response) {
      throw new Error('No AI provider responded to the completion request')
    }
    this.logger.debug('getCompletion resolved', response)
    return response
  }

  destroy(): void {
    this.aiCompletionGatherer.destroy()
  }
}
