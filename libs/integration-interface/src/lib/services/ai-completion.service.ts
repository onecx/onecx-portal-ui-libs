import type { ZodType } from 'zod'

import { AiCompletionGatherer } from '../gatherers/ai-completion/v1/ai-completion.gatherer'
import type {
  AiCompletionProviderResult,
  AiCompletionRequest,
  AiCompletionResponse,
} from '../gatherers/ai-completion/v1/ai-completion.model'
import { AiProviderError, isAiProviderError } from '../errors/ai-provider-error'

export interface GetCompletionInput<T> {
  agentName: string
  agentId: string
  systemPrompt: string
  aiContext: string[]
  message: string
  outputSchema: ZodType<T>
}

const MAX_RETRIES = 2
const BASE_BACKOFF_MS = 250
const MAX_BACKOFF_MS = 2000
const COMPLETION_TIMEOUT_MS = 60000

export function consumerAiCompletionProvider(_request: AiCompletionRequest): Promise<AiCompletionProviderResult> {
  return Promise.resolve(null)
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Thin service wrapper around AiCompletionGatherer that lets consumers request AI completions.
 *
 * It maps the input to an AiCompletionRequest, asks the registered provider instance (for example the
 * ocx-ai-connector-component) and parses the returned message into the type described by `outputSchema`.
 * The schema is never sent to the provider.
 *
 * Only provider errors marked as retryable are retried, at most twice, with bounded exponential backoff.
 * Failures are thrown as AiProviderError.
 */
export class OneCXAiCompletionService {
  private readonly aiCompletionGatherer = new AiCompletionGatherer(consumerAiCompletionProvider)

  async getCompletion<T>(input: GetCompletionInput<T>): Promise<T> {
    const request: AiCompletionRequest = {
      agent: { id: input.agentId, name: input.agentName },
      aiContext: input.aiContext,
      message: input.message,
      systemPrompt: input.systemPrompt,
    }
    return this.attemptCompletion(request, input.outputSchema, 0)
  }

  destroy(): void {
    this.aiCompletionGatherer.destroy()
  }

  private async attemptCompletion<T>(request: AiCompletionRequest, outputSchema: ZodType<T>, attempt: number): Promise<T> {
    try {
      const response = await this.requestCompletion(request)
      return this.parseResponse(response, outputSchema)
    } catch (error) {
      if (!isAiProviderError(error) || !error.retryable) {
        throw error
      }
      if (attempt >= MAX_RETRIES) {
        throw new AiProviderError('RETRIES_EXHAUSTED', 'AI completion failed after retrying', { retryable: false })
      }
      await sleep(Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS))
      return this.attemptCompletion(request, outputSchema, attempt + 1)
    }
  }

  private async requestCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    let providerResults: AiCompletionProviderResult[]
    try {
      providerResults = await this.withTimeout(this.aiCompletionGatherer.gather(request))
    } catch (error) {
      if (isAiProviderError(error)) {
        throw error
      }
      throw new AiProviderError('PROVIDER_ERROR', 'AI provider failed to handle the completion request')
    }
    let providerError: AiProviderError | undefined
    for (const result of providerResults) {
      if (isAiProviderError(result)) {
        providerError ??= result
      } else if (result) {
        return result
      }
    }
    throw providerError ?? new AiProviderError('NO_PROVIDER', 'No AI provider responded to the completion request')
  }

  private parseResponse<T>(response: AiCompletionResponse, outputSchema: ZodType<T>): T {
    let parsed: unknown
    try {
      parsed = JSON.parse(response.message)
    } catch {
      throw new AiProviderError('INVALID_JSON', 'AI completion response is not valid JSON')
    }
    const result = outputSchema.safeParse(parsed)
    if (!result.success) {
      throw new AiProviderError('SCHEMA_MISMATCH', 'AI completion response does not match the expected schema')
    }
    return result.data
  }

  private withTimeout<R>(promise: Promise<R>): Promise<R> {
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new AiProviderError('TIMEOUT', 'AI completion request timed out')),
        COMPLETION_TIMEOUT_MS
      )
    })
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
  }
}
