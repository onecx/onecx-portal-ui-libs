export type AiProviderErrorCode =
  | 'NO_PROVIDER'
  | 'AGENT_NOT_FOUND'
  | 'PROVIDER_ERROR'
  | 'INVALID_JSON'
  | 'SCHEMA_MISMATCH'
  | 'TIMEOUT'
  | 'RETRIES_EXHAUSTED'

export interface AiProviderErrorOptions {
  status?: number
  retryable?: boolean
}

/**
 * Typed error returned by AI providers (or raised by the AI services) instead of data.
 * `code` and `retryable` are safe to inspect; the message must not contain prompts or model output.
 */
export class AiProviderError extends Error {
  readonly status?: number
  readonly retryable: boolean

  constructor(
    readonly code: AiProviderErrorCode,
    message: string,
    options: AiProviderErrorOptions = {}
  ) {
    super(message)
    this.name = 'AiProviderError'
    this.status = options.status
    this.retryable = options.retryable ?? false
  }
}

/**
 * Checks the error by its name and code instead of `instanceof`, so errors created by another copy
 * of this package (for example in a different micro-frontend bundle) are recognised too.
 */
export function isAiProviderError(value: unknown): value is AiProviderError {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { name?: unknown }).name === 'AiProviderError' &&
    typeof (value as { code?: unknown }).code === 'string'
  )
}
