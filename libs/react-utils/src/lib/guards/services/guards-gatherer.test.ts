import { GuardsNavigationStateController } from './guards-navigation-controller'
import { GuardsGatherer } from './guards-gatherer'
import { GUARD_CHECK, GUARD_CHECK_KEY } from '../model/guard-navigation.model'

const gatherMock = jest.fn()
const destroyMock = jest.fn()

jest.mock('@onecx/accelerator', () => {
  const actual = jest.requireActual('@onecx/accelerator')

  return {
    ...actual,
    Gatherer: jest.fn().mockImplementation((_name, _count, callback) => ({
      gather: gatherMock,
      destroy: destroyMock,
      callback,
    })),
  }
})

describe('GuardsGatherer', () => {
  const navigate = jest.fn()

  beforeEach(() => {
    gatherMock.mockReset()
    destroyMock.mockReset()
    navigate.mockReset()
  })

  it('throws when gather called before activation', () => {
    const gatherer = new GuardsGatherer(navigate)
    expect(() => gatherer.gather({ url: '/test' })).toThrow('Guards gatherer is not active')
  })

  it('normalizes urls when gathering', () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()
    gatherMock.mockResolvedValue(true)

    gatherer.gather({ url: 'test/' })

    expect(gatherMock).toHaveBeenCalledWith({ url: '/test' })
  })

  it('creates guard check navigation state on gather callback', async () => {
    const gatherer = new GuardsGatherer(navigate, new GuardsNavigationStateController())
    gatherer.activate()

    const promise = (gatherer as any).executeGuardsCallback({ url: '/test' })

    expect(navigate).toHaveBeenCalledWith('/test', expect.objectContaining({ replace: true }))
    const state = navigate.mock.calls[0][1].state
    expect(state[GUARD_CHECK]).toBe(true)
    expect(state[GUARD_CHECK_KEY]).toBeDefined()

    gatherer.resolveRoute('/test', true)
    await expect(promise).resolves.toBe(true)
  })

  it('deactivates gatherer', () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()
    gatherer.deactivate()

    expect(destroyMock).toHaveBeenCalled()
  })

  it('destroy() calls destroyMock on the internal gatherer', () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()
    gatherer.destroy()

    expect(destroyMock).toHaveBeenCalled()
  })

  it('throws when resolveRoute called before activation', () => {
    const gatherer = new GuardsGatherer(navigate)
    expect(() => gatherer.resolveRoute('/test', true)).toThrow('Guards gatherer is not active')
  })

  it('resolveRoute with unknown URL does not throw (no resolver registered)', () => {
    const gatherer = new GuardsGatherer(navigate)
    gatherer.activate()
    expect(() => gatherer.resolveRoute('/unknown', true)).not.toThrow()
  })

  it('does not throw when deactivating before activating', () => {
    const gatherer = new GuardsGatherer(navigate)
    expect(() => gatherer.deactivate()).not.toThrow()
  })
})
