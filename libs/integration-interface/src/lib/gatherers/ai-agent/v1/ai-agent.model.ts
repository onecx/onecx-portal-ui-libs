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
