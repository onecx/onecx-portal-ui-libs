import { GuardsGatherer } from './guards-gatherer'
import type { GuardResultRequest } from './guards-gatherer'

const destroyMock = jest.fn()

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')

  return {
    ...actual,
    Gatherer: jest.fn().mockImplementation((_name, _count, callback) => ({
      gather: (request: GuardResultRequest) => callback(request),
      destroy: destroyMock,
      callback,
    })),
  }
})

describe('GuardsGatherer deactivate', () => {
  const navigate = jest.fn()

  beforeEach(() => {
    destroyMock.mockReset()
    navigate.mockReset()
  })

  it('given an activated gatherer when deactivated then gather throws not active', () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()
    gatherer.deactivate()

    expect(() => gatherer.gather({ url: 'a' })).toThrow('Guards gatherer is not active')
  })

  it('given a pending guard check when deactivated then the check resolves false', async () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()

    const promise = gatherer.gather({ url: 'a' })
    gatherer.deactivate()

    await expect(promise).resolves.toBe(false)
  })

  it('given an inactive gatherer when resolveRoute is called after deactivate then it throws not active', () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()
    gatherer.deactivate()

    expect(() => gatherer.resolveRoute('a', true)).toThrow('Guards gatherer is not active')
  })

  it('given a never activated gatherer when deactivated then it does not throw', () => {
    const gatherer = new GuardsGatherer(navigate)

    expect(() => gatherer.deactivate()).not.toThrow()
  })
})
