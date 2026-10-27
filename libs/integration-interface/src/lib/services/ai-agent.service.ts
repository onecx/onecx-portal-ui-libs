import { AiAgentGatherer } from '../gatherers/ai-agent/v1/ai-agent.gatherer'
import type { AiAgentRequest, AiAgentResponse } from '../gatherers/ai-agent/v1/ai-agent.model'

export async function consumerAiAgentProvider(_request: AiAgentRequest): Promise<AiAgentResponse[] | null> {
  return null
}

/**
 * Thin service wrapper around AiAgentGatherer that lets consumers collect the available AI agents.
 *
 * It forwards the request unchanged through the gatherer and merges the agent lists returned by all
 * providers. Agents are de-duplicated by id, keeping the first occurrence. If no provider contributes,
 * an empty list is returned.
 */
export class OneCXAiAgentService {
  private readonly aiAgentGatherer = new AiAgentGatherer(consumerAiAgentProvider)

  async getAgents(request: AiAgentRequest = {}): Promise<AiAgentResponse[]> {
    const responses = await this.aiAgentGatherer.gather(request)
    const agents = new Map<string, AiAgentResponse>()
    for (const providerAgents of responses) {
      for (const agent of providerAgents ?? []) {
        if (!agents.has(agent.id)) {
          agents.set(agent.id, agent)
        }
      }
    }
    return [...agents.values()]
  }

  destroy(): void {
    this.aiAgentGatherer.destroy()
  }
}
