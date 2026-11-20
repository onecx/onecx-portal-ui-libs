import { AiAgentGatherer } from '../gatherers/ai-agent/v1/ai-agent.gatherer'
import type { AiAgentProviderResult, AiAgentRequest, AiAgentResponse } from '../gatherers/ai-agent/v1/ai-agent.model'
import { AiProviderError, isAiProviderError } from '../errors/ai-provider-error'

export function consumerAiAgentProvider(_request: AiAgentRequest): Promise<AiAgentProviderResult> {
  return Promise.resolve(null)
}

/**
 * Thin service wrapper around AiAgentGatherer that lets consumers collect the available AI agents.
 *
 * It forwards the request unchanged through the gatherer and merges the agent lists returned by all
 * providers. Agents are de-duplicated by id, keeping the first occurrence.
 *
 * - No provider contributes: an empty list is returned.
 * - A provider fails while another one answers: its error is ignored and the answered agents are returned.
 * - Every contributing provider fails: the first AiProviderError is thrown.
 */
export class OneCXAiAgentService {
  private readonly aiAgentGatherer = new AiAgentGatherer(consumerAiAgentProvider)

  async getAgents(request: AiAgentRequest = {}): Promise<AiAgentResponse[]> {
    const responses = await this.aiAgentGatherer.gather(request)
    const agents = new Map<string, AiAgentResponse>()
    const errors: AiProviderError[] = []
    let answeringProviders = 0
    for (const providerResult of responses) {
      if (isAiProviderError(providerResult)) {
        errors.push(providerResult)
        continue
      }
      if (providerResult === null || providerResult === undefined) {
        continue
      }
      answeringProviders++
      for (const agent of providerResult) {
        if (!agents.has(agent.id)) {
          agents.set(agent.id, agent)
        }
      }
    }
    if (errors.length > 0 && answeringProviders === 0) {
      throw errors[0]
    }
    return [...agents.values()]
  }

  destroy(): void {
    this.aiAgentGatherer.destroy()
  }
}

