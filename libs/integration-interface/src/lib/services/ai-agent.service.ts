import { AiAgentGatherer } from '../gatherers/ai-agent/v1/ai-agent.gatherer'
import type { AiAgentRequest, AiAgentResponse } from '../gatherers/ai-agent/v1/ai-agent.model'
import { createLogger } from '../utils/logger.utils'
import { withTimeout } from '../utils/with-timeout'

const AGENT_LOOKUP_TIMEOUT_MS = 15000

export function consumerAiAgentProvider(_request: AiAgentRequest): Promise<AiAgentResponse[] | null> {
  return Promise.resolve(null)
}

/**
 * Thin service wrapper around AiAgentGatherer that lets consumers collect the available AI agents.
 *
 * It forwards the request unchanged through the gatherer and merges the agent lists returned by all
 * providers. Agents are de-duplicated by id, keeping the first occurrence. If no provider contributes,
 * an empty list is returned.
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
    for (const providerAgents of responses) {
      for (const agent of providerAgents ?? []) {
        if (!agents.has(agent.id)) {
          agents.set(agent.id, agent)
        }
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
