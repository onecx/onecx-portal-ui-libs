import { AiAgentGatherer } from '../gatherers/ai-agent/v1/ai-agent.gatherer'
import type { AiAgentProviderResult, AiAgentRequest, AiAgentResponse } from '../gatherers/ai-agent/v1/ai-agent.model'
import { isAiProviderError } from '../errors/ai-provider-error'
import type { AiProviderError } from '../errors/ai-provider-error'
import { createLogger } from '../utils/logger.utils'
import { withTimeout } from '../utils/with-timeout'

const AGENT_LOOKUP_TIMEOUT_MS = 15000

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
 * - A provider fails while another one answers: its error is logged (code only) and the answered agents are returned.
 * - Every contributing provider fails: the first AiProviderError is thrown.
 */
export class OneCXAiAgentService {
  private readonly logger = createLogger('OneCXAiAgentService')

  private readonly aiAgentGatherer = new AiAgentGatherer(consumerAiAgentProvider)

  async getAgents(request: AiAgentRequest = {}): Promise<AiAgentResponse[]> {
    this.logger.debug('getAgents', request)
    const responses = await withTimeout(
      this.aiAgentGatherer.gather(request),
      AGENT_LOOKUP_TIMEOUT_MS,
      'AI agent lookup timed out'
    )
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
    if (errors.length > 0) {
      this.logger.warn('AI agent provider failed', errors.map((error) => error.code))
      if (answeringProviders === 0) {
        throw errors[0]
      }
    }
    if (agents.size === 0) {
      this.logger.warn('No AI provider returned any agents for the request', request)
    } else {
      this.logger.debug('getAgents resolved', agents.size)
    }
    return [...agents.values()]
  }

  destroy(): void {
    this.aiAgentGatherer.destroy()
  }
}
