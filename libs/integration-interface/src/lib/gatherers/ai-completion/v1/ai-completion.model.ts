import type { AiProviderError } from '../../../errors/ai-provider-error'

export interface AiCompletionRequest {
    agent: {
        id: string;
        name: string;
    }
    aiContext: string[]
    message: string
    systemPrompt: string
}

export interface AiCompletionResponse {
    message: string
}

/**
 * What a provider answers to a completion request: a response, null when it does not contribute,
 * or an AiProviderError when it failed. Callbacks must not reject.
 */
export type AiCompletionProviderResult = AiCompletionResponse | AiProviderError | null
