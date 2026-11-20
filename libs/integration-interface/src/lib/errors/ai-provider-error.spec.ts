import { AiProviderError, isAiProviderError } from './ai-provider-error'

describe('isAiProviderError', () => {
  it('should recognise an AiProviderError instance', () => {
    expect(isAiProviderError(new AiProviderError('TIMEOUT', 'timeout'))).toBe(true)
  })

  it('should recognise an error with the same name and code created by another copy of the package', () => {
    const foreign = Object.assign(new Error('provider failed'), { name: 'AiProviderError', code: 'PROVIDER_ERROR' })

    expect(isAiProviderError(foreign)).toBe(true)
  })

  it('should reject errors and values without the AiProviderError shape', () => {
    expect(isAiProviderError(new Error('boom'))).toBe(false)
    expect(isAiProviderError({ name: 'AiProviderError' })).toBe(false)
    expect(isAiProviderError({ name: 'AiProviderError', code: 42 })).toBe(false)
    expect(isAiProviderError(null)).toBe(false)
    expect(isAiProviderError('TIMEOUT')).toBe(false)
  })
})
