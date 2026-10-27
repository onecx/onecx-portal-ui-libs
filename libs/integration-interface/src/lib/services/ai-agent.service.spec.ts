import { OneCXAiAgentService, consumerAiAgentProvider } from './ai-agent.service'
import type { AiAgentRequest, AiAgentResponse } from '../gatherers/ai-agent/v1/ai-agent.model'
import { AiProviderError } from '../errors/ai-provider-error'

const createGathererMock = () => {
  const gather = jest.fn()
  const destroy = jest.fn()
  return { gather, destroy }
}

jest.mock('../gatherers/ai-agent/v1/ai-agent.gatherer', () => ({
  AiAgentGatherer: jest.fn().mockImplementation(() => createGathererMock()),
}))

const sampleRequest: AiAgentRequest = { appId: 'app-1' }

describe('OneCXAiAgentService', () => {
  let service: OneCXAiAgentService
  let gathererMock: { gather: jest.Mock; destroy: jest.Mock }

  const getGathererMock = (instance: OneCXAiAgentService) =>
    (instance as unknown as { aiAgentGatherer: { gather: jest.Mock; destroy: jest.Mock } }).aiAgentGatherer

  beforeEach(() => {
    service = new OneCXAiAgentService()
    gathererMock = getGathererMock(service)
  })

  it('should create the aiAgentGatherer during construction', () => {
    expect(gathererMock).toBeTruthy()
    expect(getGathererMock(new OneCXAiAgentService())).not.toBe(gathererMock)
  })

  it('should forward the request unchanged to gatherer.gather', async () => {
    gathererMock.gather.mockResolvedValue([])

    await service.getAgents(sampleRequest)

    expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    expect(gathererMock.gather).toHaveBeenCalledWith(sampleRequest)
  })

  it('should use an empty request when none is given', async () => {
    gathererMock.gather.mockResolvedValue([])

    await service.getAgents()

    expect(gathererMock.gather).toHaveBeenCalledWith({})
  })

  it('should merge agents of all providers and skip null responses', async () => {
    const first: AiAgentResponse = { id: 'a1', name: 'Agent 1' }
    const second: AiAgentResponse = { id: 'a2', name: 'Agent 2' }
    gathererMock.gather.mockResolvedValue([null, [first], null, [second]])

    const result = await service.getAgents(sampleRequest)

    expect(result).toEqual([first, second])
  })

  it('should de-duplicate agents by id and keep the first occurrence', async () => {
    const original: AiAgentResponse = { id: 'a1', name: 'Original' }
    const duplicate: AiAgentResponse = { id: 'a1', name: 'Duplicate' }
    gathererMock.gather.mockResolvedValue([[original], [duplicate, { id: 'a2', name: 'Agent 2' }]])

    const result = await service.getAgents(sampleRequest)

    expect(result).toEqual([original, { id: 'a2', name: 'Agent 2' }])
  })

  it('should return an empty list when no provider responds', async () => {
    gathererMock.gather.mockResolvedValue([null, null])

    expect(await service.getAgents(sampleRequest)).toEqual([])
  })

  it('should return an empty list when the gatherer returns no responses at all', async () => {
    gathererMock.gather.mockResolvedValue([])

    expect(await service.getAgents(sampleRequest)).toEqual([])
  })

  it('should return the answered agents and log (not throw) when another provider fails', async () => {
    const agent: AiAgentResponse = { id: 'a1', name: 'Agent 1' }
    const failure = new AiProviderError('PROVIDER_ERROR', 'boom', { status: 500, retryable: true })
    gathererMock.gather.mockResolvedValue([failure, [agent]])
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    const result = await service.getAgents(sampleRequest)

    expect(result).toEqual([agent])
    warnSpy.mockRestore()
  })

  it('should throw the first AiProviderError when every answering provider fails', async () => {
    const first = new AiProviderError('TIMEOUT', 'timeout', { retryable: true })
    const second = new AiProviderError('PROVIDER_ERROR', 'boom', { status: 500 })
    gathererMock.gather.mockResolvedValue([first, second])
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    await expect(service.getAgents(sampleRequest)).rejects.toBe(first)
    warnSpy.mockRestore()
  })

  it('should throw when the only failing provider is combined with providers that declined', async () => {
    const failure = new AiProviderError('PROVIDER_ERROR', 'boom')
    gathererMock.gather.mockResolvedValue([failure, null])
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)

    await expect(service.getAgents(sampleRequest)).rejects.toBe(failure)
    warnSpy.mockRestore()
  })

  it('should pass appId through to the gatherer request without modifying it', async () => {
    gathererMock.gather.mockResolvedValue([[{ id: 'a1', name: 'Agent 1', appId: 'app-1' }]])

    await service.getAgents({ appId: 'app-1' })

    expect(gathererMock.gather).toHaveBeenCalledWith({ appId: 'app-1' })
  })

  it('should destroy the gatherer on destroy', () => {
    service.destroy()

    expect(gathererMock.destroy).toHaveBeenCalledTimes(1)
  })
})

describe('consumerAiAgentProvider', () => {
  it('should decline to contribute (return null) for any request', async () => {
    const result = await consumerAiAgentProvider(sampleRequest)

    expect(result).toBeNull()
  })
})
