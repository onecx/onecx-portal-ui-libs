import { Gatherer } from '@onecx/accelerator'

import { AiAgentGatherer } from './ai-agent.gatherer'
import type { AiAgentRequest, AiAgentResponse } from './ai-agent.model'

jest.mock('@onecx/accelerator', () => ({
  Gatherer: jest.fn(),
}))

describe('AiAgentGatherer', () => {
  const GathererMock = Gatherer as unknown as jest.Mock

  beforeEach(() => {
    GathererMock.mockClear()
  })

  it('should register the aiAgent gatherer with version 1', () => {
    const callback = jest.fn()

    new AiAgentGatherer(callback)

    expect(GathererMock).toHaveBeenCalledTimes(1)
    expect(GathererMock).toHaveBeenCalledWith('aiAgent', 1, callback)
  })

  it('should pass the provider callback through unchanged', async () => {
    const agents: AiAgentResponse[] = [{ id: 'agent-1', name: 'Agent' }]
    const callback = jest.fn().mockResolvedValue(agents)
    const request: AiAgentRequest = { appId: 'app-1' }

    new AiAgentGatherer(callback)
    const registeredCallback = GathererMock.mock.calls[0][2] as (r: AiAgentRequest) => Promise<AiAgentResponse[] | null>

    await expect(registeredCallback(request)).resolves.toEqual(agents)
    expect(callback).toHaveBeenCalledWith(request)
  })
})
