import { RemoteComponentsService } from './remote-components.service'

const createTopic = () => ({ destroy: jest.fn() })

jest.mock('@onecx/integration-interface', () => ({
  RemoteComponentsTopic: jest.fn(() => createTopic()),
}))

describe('RemoteComponentsService', () => {
  let service: RemoteComponentsService

  beforeEach(() => {
    service = new RemoteComponentsService()
  })

  it('should lazily initialize remoteComponents$', () => {
    expect(service.remoteComponents$).toBeTruthy()
    expect(service.remoteComponents$).toBe(service.remoteComponents$)
  })

  it('should allow overriding remoteComponents$ through setter', () => {
    const topic = createTopic() as any
    service.remoteComponents$ = topic

    expect(service.remoteComponents$).toBe(topic)
  })

  it('should destroy topic on destroy', () => {
    const topic = createTopic() as any
    service.remoteComponents$ = topic

    service.ngOnDestroy()

    expect(topic.destroy).toHaveBeenCalledTimes(1)
  })

  it('should not fail when destroy is called before initialization', () => {
    expect(() => service.ngOnDestroy()).not.toThrow()
  })
})
