import { OneCXAiCompletionService, consumerAiCompletionProvider } from './ai-completion.service'
import type { AiCompletionRequest, AiCompletionResponse } from '../gatherers/ai-completion/v1/ai-completion.model'

const createGathererMock = () => {
    const gather = jest.fn()
    const destroy = jest.fn()
    return { gather, destroy }
}

jest.mock('../gatherers/ai-completion/v1/ai-completion.gatherer', () => ({
    AiCompletionGatherer: jest.fn().mockImplementation(() => createGathererMock()),
}))

const sampleRequest: AiCompletionRequest = {
    agent: { id: 'agent-1', name: 'Sample Agent' },
    aiContext: ['context-1'],
    message: 'Hello',
    systemPrompt: 'System prompt',
}

describe('OneCXAiCompletionService', () => {
    let service: OneCXAiCompletionService
    let gathererMock: { gather: jest.Mock; destroy: jest.Mock }

    beforeEach(() => {
        service = new OneCXAiCompletionService()
        gathererMock = service.aiCompletionGatherer as unknown as { gather: jest.Mock; destroy: jest.Mock }
    })

    it('should lazily initialize aiCompletionGatherer', () => {
        expect(service.aiCompletionGatherer).toBeTruthy()
        expect(service.aiCompletionGatherer).toBe(service.aiCompletionGatherer)
    })

    it('should allow overriding aiCompletionGatherer through setter', () => {
        const custom = createGathererMock()
        service.aiCompletionGatherer = custom as any

        expect(service.aiCompletionGatherer).toBe(custom)
    })

    it('should forward the request unchanged to gatherer.gather and return the first non-null response', async () => {
        const responses: (AiCompletionResponse | null)[] = [null, { message: 'second' }, { message: 'third' }]
        gathererMock.gather.mockResolvedValue(responses)

        const result = await service.getCompletion(sampleRequest)

        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
        expect(gathererMock.gather).toHaveBeenCalledWith(sampleRequest)
        expect(result).toEqual({ message: 'second' })
    })

    it('should throw when no provider responds', async () => {
        gathererMock.gather.mockResolvedValue([null, null])

        await expect(service.getCompletion(sampleRequest)).rejects.toThrow('No AI provider responded to the completion request')
    })

    it('should throw when the gatherer returns no responses at all', async () => {
        gathererMock.gather.mockResolvedValue([])

        await expect(service.getCompletion(sampleRequest)).rejects.toThrow('No AI provider responded to the completion request')
    })

    it('should return the first response when there are no nulls', async () => {
        gathererMock.gather.mockResolvedValue([{ message: 'first' }, { message: 'second' }])

        const result = await service.getCompletion(sampleRequest)

        expect(result).toEqual({ message: 'first' })
    })

    it('should destroy the gatherer on destroy', () => {
        service.destroy()

        expect(gathererMock.destroy).toHaveBeenCalledTimes(1)
    })
})

describe('consumerAiCompletionProvider', () => {
    it('should decline to contribute (return null) for any request', async () => {
        const result = await consumerAiCompletionProvider(sampleRequest)

        expect(result).toBeNull()
    })
})
