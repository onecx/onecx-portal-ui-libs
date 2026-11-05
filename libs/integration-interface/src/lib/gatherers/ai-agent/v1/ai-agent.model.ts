import type { AiProviderError } from '../../../errors/ai-provider-error'

export interface AiAgentRequest {
  /**
   * Optional application id. When set, providers should only return agents assigned to this application.
   */
  appId?: string
}

export interface AiAgentResponse {
  id: string
  name: string
  description?: string
  languageCode?: string
  voiceEnabled?: boolean
  appId?: string
}

/**
 * What a provider answers to an agent request:
 * - an array of agents (possibly empty) when it contributes,
 * - `null` when it does not want to contribute to the request,
 * - an `AiProviderError` when it failed. Callbacks must not reject.
 */
export type AiAgentProviderResult = AiAgentResponse[] | AiProviderError | null
