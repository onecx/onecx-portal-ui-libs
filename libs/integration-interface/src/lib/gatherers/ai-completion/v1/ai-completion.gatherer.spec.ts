import { Gatherer } from '@onecx/accelerator'

import { AiCompletionGatherer } from './ai-completion.gatherer'
import type { AiCompletionRequest, AiCompletionResponse } from './ai-completion.model'

jest.mock('@onecx/accelerator', () => ({
  Gatherer: jest.fn(),
}))

describe('AiCompletionGatherer', () => {
  const GathererMock = Gatherer as unknown as jest.Mock

  beforeEach(() => {
    GathererMock.mockClear()
  })

  it('should register the aiCompletion gatherer with version 1', () => {
    const callback = jest.fn()

    new AiCompletionGatherer(callback)

    expect(GathererMock).toHaveBeenCalledTimes(1)
    expect(GathererMock).toHaveBeenCalledWith('aiCompletion', 1, callback)
  })

  it('should pass the provider callback through unchanged', async () => {
    const response: AiCompletionResponse = { message: '{"text":"hello"}' }
    const callback = jest.fn().mockResolvedValue(response)
    const request = { agent: { id: 'agent-1', name: 'Agent' }, message: 'hi' } as AiCompletionRequest

    new AiCompletionGatherer(callback)
    const registeredCallback = GathererMock.mock.calls[0][2] as (
      r: AiCompletionRequest
    ) => Promise<AiCompletionResponse | null>

    await expect(registeredCallback(request)).resolves.toEqual(response)
    expect(callback).toHaveBeenCalledWith(request)
  })
})
