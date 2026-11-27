import { AiProviderError } from '../errors/ai-provider-error'

export function withTimeout<R>(promise: Promise<R>, ms: number, message: string): Promise<R> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new AiProviderError('TIMEOUT', message)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}
