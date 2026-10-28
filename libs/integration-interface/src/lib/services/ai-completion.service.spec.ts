import { z } from 'zod'

import { OneCXAiCompletionService, consumerAiCompletionProvider } from './ai-completion.service'
import type { AiCompletionResponse } from '../gatherers/ai-completion/v1/ai-completion.model'
import { AiProviderError } from '../errors/ai-provider-error'

const createGathererMock = () => {
    const gather = jest.fn()
    const destroy = jest.fn()
    return { gather, destroy }
}

jest.mock('../gatherers/ai-completion/v1/ai-completion.gatherer', () => ({
    AiCompletionGatherer: jest.fn().mockImplementation(() => createGathererMock()),
}))

const outputSchema = z.object({ answer: z.string() })

const sampleInput = {
    agentId: 'agent-1',
    agentName: 'Sample Agent',
    systemPrompt: 'System prompt',
    aiContext: ['context-1'],
    message: 'Hello',
    outputSchema,
}

const expectedRequest = {
    agent: { id: 'agent-1', name: 'Sample Agent' },
    aiContext: ['context-1'],
    message: 'Hello',
    systemPrompt: 'System prompt',
}

const jsonResponse = (message: string): AiCompletionResponse => ({ message })

describe('OneCXAiCompletionService', () => {
    let service: OneCXAiCompletionService
    let gathererMock: { gather: jest.Mock; destroy: jest.Mock }

    const getGathererMock = (instance: OneCXAiCompletionService) =>
        (instance as unknown as { aiCompletionGatherer: { gather: jest.Mock; destroy: jest.Mock } }).aiCompletionGatherer

    beforeEach(() => {
        service = new OneCXAiCompletionService()
        gathererMock = getGathererMock(service)
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('should create the aiCompletionGatherer during construction', () => {
        expect(gathererMock).toBeTruthy()
        expect(getGathererMock(new OneCXAiCompletionService())).not.toBe(gathererMock)
    })

    it('should map the input to the request and never send the output schema', async () => {
        gathererMock.gather.mockResolvedValue([jsonResponse('{"answer":"yes"}')])

        await service.getCompletion(sampleInput)

        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
        expect(gathererMock.gather).toHaveBeenCalledWith(expectedRequest)
        expect(gathererMock.gather.mock.calls[0][0]).not.toHaveProperty('outputSchema')
    })

    it('should return the parsed and validated value typed by the schema', async () => {
        gathererMock.gather.mockResolvedValue([null, jsonResponse('{"answer":"yes"}')])

        const result = await service.getCompletion(sampleInput)

        expect(result).toEqual({ answer: 'yes' })
    })

    it('should fail with INVALID_JSON without retrying when the message is not JSON', async () => {
        gathererMock.gather.mockResolvedValue([jsonResponse('not json')])

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'INVALID_JSON', retryable: false })
        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    })

    it('should fail with SCHEMA_MISMATCH without retrying when the JSON does not match the schema', async () => {
        gathererMock.gather.mockResolvedValue([jsonResponse('{"answer":42}')])

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'SCHEMA_MISMATCH', retryable: false })
        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    })

    it('should retry retryable provider errors and succeed on a later attempt', async () => {
        const retryable = () => new AiProviderError('PROVIDER_ERROR', 'busy', { status: 503, retryable: true })
        gathererMock.gather
            .mockResolvedValueOnce([retryable()])
            .mockResolvedValueOnce([retryable()])
            .mockResolvedValueOnce([jsonResponse('{"answer":"ok"}')])

        const result = await service.getCompletion(sampleInput)

        expect(result).toEqual({ answer: 'ok' })
        expect(gathererMock.gather).toHaveBeenCalledTimes(3)
    })

    it('should stop after two retries and throw RETRIES_EXHAUSTED', async () => {
        gathererMock.gather.mockResolvedValue([new AiProviderError('PROVIDER_ERROR', 'busy', { retryable: true })])

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'RETRIES_EXHAUSTED' })
        expect(gathererMock.gather).toHaveBeenCalledTimes(3)
    })

    it('should not retry non-retryable provider errors', async () => {
        gathererMock.gather.mockResolvedValue([new AiProviderError('PROVIDER_ERROR', 'bad request', { status: 400 })])

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'PROVIDER_ERROR', status: 400 })
        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    })

    it('should throw NO_PROVIDER when no provider responds', async () => {
        gathererMock.gather.mockResolvedValue([null, null])

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'NO_PROVIDER', retryable: false })
        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    })

    it('should throw NO_PROVIDER when the gatherer returns no responses at all', async () => {
        gathererMock.gather.mockResolvedValue([])

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'NO_PROVIDER' })
    })

    it('should map a rejected provider callback to PROVIDER_ERROR without retrying', async () => {
        gathererMock.gather.mockRejectedValue(new Error('callback exploded'))

        await expect(service.getCompletion(sampleInput)).rejects.toMatchObject({ code: 'PROVIDER_ERROR', retryable: false })
        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    })

    it('should fail with TIMEOUT when the provider does not answer in time and not retry it', async () => {
        jest.useFakeTimers()
        gathererMock.gather.mockReturnValue(new Promise(() => undefined))

        const result = service.getCompletion(sampleInput)
        const assertion = expect(result).rejects.toMatchObject({ code: 'TIMEOUT', retryable: false })
        await jest.advanceTimersByTimeAsync(60000)

        await assertion
        expect(gathererMock.gather).toHaveBeenCalledTimes(1)
    })

    it('should destroy the gatherer on destroy', () => {
        service.destroy()

        expect(gathererMock.destroy).toHaveBeenCalledTimes(1)
    })
})

describe('consumerAiCompletionProvider', () => {
    it('should decline to contribute (return null) for any request', async () => {
        const result = await consumerAiCompletionProvider(expectedRequest)

        expect(result).toBeNull()
    })
})
