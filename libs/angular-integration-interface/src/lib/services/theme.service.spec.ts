import { ThemeService } from './theme.service'

const createTopic = () => ({ destroy: jest.fn() })

jest.mock('@onecx/integration-interface', () => ({
  CurrentThemeTopic: jest.fn(() => createTopic()),
}))

describe('ThemeService', () => {
  let service: ThemeService

  beforeEach(() => {
    service = new ThemeService()
  })

  it('should lazily initialize currentTheme$', () => {
    expect(service.currentTheme$).toBeTruthy()
    expect(service.currentTheme$).toBe(service.currentTheme$)
  })

  it('should allow overriding currentTheme$ through setter', () => {
    const topic = createTopic() as any
    service.currentTheme$ = topic

    expect(service.currentTheme$).toBe(topic)
  })

  it('should destroy topic on destroy', () => {
    const topic = createTopic() as any
    service.currentTheme$ = topic

    service.ngOnDestroy()

    expect(topic.destroy).toHaveBeenCalledTimes(1)
  })

  it('should not fail when destroy is called before initialization', () => {
    expect(() => service.ngOnDestroy()).not.toThrow()
  })
})
