import { TestBed } from '@angular/core/testing'
import { firstValueFrom, of } from 'rxjs'
import { ThemeService } from './theme.service'
import { ShellCapabilityService } from './shell-capability.service'

const createTopic = () => ({ destroy: jest.fn() })

jest.mock('@onecx/integration-interface', () => ({
  CurrentThemeTopic: jest.fn(() => createTopic()),
  CurrentThemesTopic: jest.fn(() => createTopic()),
  ShellCapability: {
    CURRENT_THEMES_TOPIC: 'currentThemesTopic',
  },
}))

describe('ThemeService', () => {
  let service: ThemeService
  let hasCapabilityMock: jest.Mock

  beforeEach(() => {
    hasCapabilityMock = jest.fn().mockReturnValue(true)
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: ShellCapabilityService, useValue: { hasCapability: hasCapabilityMock } },
      ],
    })
    service = TestBed.inject(ThemeService)
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

  describe('currentThemes$', () => {
    it('should lazily initialize currentThemes$ when capability is present', () => {
      hasCapabilityMock.mockReturnValue(true)

      expect(service.currentThemes$).toBeTruthy()
      expect(service.currentThemes$).toBe(service.currentThemes$)
    })

    it('should destroy currentThemes$ topic on destroy', () => {
      hasCapabilityMock.mockReturnValue(true)

      const topic = service.currentThemes$ as any

      service.ngOnDestroy()

      expect(topic.destroy).toHaveBeenCalledTimes(1)
    })

    it('should fall back to currentTheme$ mapped to v1 when capability is missing', async () => {
      hasCapabilityMock.mockReturnValue(false)
      const loggerErrorSpy = jest.spyOn(service.logger, 'error').mockImplementation(() => undefined)
      const theme = { name: 'theme-a', properties: { foo: 'bar' } }
      service.currentTheme$ = Object.assign(of(theme), { destroy: jest.fn() }) as any

      const result = await firstValueFrom(service.currentThemes$ as any)

      expect(loggerErrorSpy).toHaveBeenCalled()
      expect(result).toEqual({
        ...theme,
        properties: { v1: theme.properties },
        versions: [1],
      })
    })

    it('should default missing properties to an empty object in the fallback mapping', async () => {
      hasCapabilityMock.mockReturnValue(false)
      jest.spyOn(service.logger, 'error').mockImplementation(() => undefined)
      const theme = { name: 'theme-b' }
      service.currentTheme$ = Object.assign(of(theme), { destroy: jest.fn() }) as any

      const result = await firstValueFrom(service.currentThemes$ as any)

      expect(result).toEqual({
        ...theme,
        properties: { v1: {} },
        versions: [1],
      })
    })
  })
})
