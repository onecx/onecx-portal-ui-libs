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
