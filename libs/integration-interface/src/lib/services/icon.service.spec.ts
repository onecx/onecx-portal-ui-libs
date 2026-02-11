/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { ensureIconCache, generateClassName, IconService } from './icon.service'
import { IconCache, IconClassType } from '../topics/icons/v1/icon.model'
import { FakeTopic } from '@onecx/accelerator'

jest.mock('../topics/icons/v1/icon.topic', () => {
  const actual = jest.requireActual('../topics/icons/v1/icon.topic')
  const { FakeTopic } = jest.requireActual('@onecx/accelerator')
  return {
    ...actual,
    IconTopic: jest.fn().mockImplementation(() => new FakeTopic()),
  }
})

describe('IconService', () => {
  let iconService: IconService

  beforeEach(() => {
    ; (window as any).onecxIcons = {}
    iconService = new IconService()
  })

  afterEach(() => {
    ; (window as any).onecxIcons = {}
    jest.clearAllMocks()
  })

  it('initializes global icon cache', () => {
    expect((window as any).onecxIcons).toBeDefined()
    expect(typeof (window as any).onecxIcons).toBe('object')
  })

  describe('requestIcon', () => {
    it('should return normalized class and publish IconRequested on first request', () => {
      const name = 'mdi:home-battery'
      const classType: IconClassType = 'background-before'
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')

      const cls = iconService.requestIcon(name, classType)

      expect((window as any).onecxIcons[name]).toBeUndefined()
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name })
      expect(cls).toBe('onecx-theme-icon-background-before-mdi-home-battery')
    })

    it('should not publish IconRequested when icon already present in cache (object or null)', () => {
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')

        ; (window as any).onecxIcons['prime:user'] = { name: 'prime:user' } as IconCache
      iconService.requestIcon('prime:user', 'background')
      expect(publishSpy).not.toHaveBeenCalled()

      publishSpy.mockClear()
        ; (window as any).onecxIcons['mdi:missing'] = null
      iconService.requestIcon('mdi:missing')
      expect(publishSpy).not.toHaveBeenCalled()
    })

    it('should use default classType when none provided', () => {
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')
      iconService.requestIcon('mdi:settings')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name: 'mdi:settings' })
    })
  })

  describe('requestIconAsync', () => {
    it('should return null immediately when cached null', async () => {
      const name = 'mdi:ghost'
        ; (window as any).onecxIcons[name] = null
      const res = await iconService.requestIconAsync(name)
      expect(res).toBeNull()
    })

    it('should return class immediately when cached icon exists', async () => {
      const name = 'mdi:car'
        ; (window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      const res = await iconService.requestIconAsync(name, 'svg')
      expect(res).toBe('onecx-theme-icon-svg-mdi-car')
    })

    it('should resolve with class after IconsReceived when icon becomes available', async () => {
      const name = 'prime:check'
      const promise = iconService.requestIconAsync(name, 'background')
        ; (window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBe('onecx-theme-icon-background-prime-check')
    })

    it('should resolve null after IconsReceived when icon resolved to null', async () => {
      const name = 'mdi:unknown'
      const promise = iconService.requestIconAsync(name)
        ; (window as any).onecxIcons[name] = null
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBeNull()
    })
  })

  it('should call topic.destroy when destroy is called', () => {
    const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
    const spy = jest.spyOn(topic, 'destroy')
    iconService.destroy()
    expect(spy).toHaveBeenCalled()
  })

  describe('icon-cache utilities', () => {
    beforeEach(() => {
      delete (window as any).onecxIcons
    })

    describe('ensureIconCache', () => {
      it('should initialize window.onecxIcons if not present', () => {
        expect(window.onecxIcons).toBeUndefined()

        ensureIconCache()

        expect(window.onecxIcons).toBeDefined()
        expect(window.onecxIcons).toEqual({})
      })

      it('should not overwrite existing icon cache', () => {
        const existing: Record<string, IconCache | null | undefined> = {
          'mdi:home': undefined,
          'prime:user': null
        }

        window.onecxIcons = existing

        ensureIconCache()

        expect(window.onecxIcons).toBe(existing)
        expect(window.onecxIcons['mdi:home']).toBeUndefined()
        expect(window.onecxIcons['prime:user']).toBeNull()
      })
    })

    describe('generateClassName', () => {
      it('should generate correct class name for mdi icon (svg)', () => {
        const result = generateClassName('mdi:car-tire-alert', 'svg')

        expect(result).toBe(
          'onecx-theme-icon-svg-mdi-car-tire-alert'
        )
      })

      it('should generate correct class name for prime icon (background)', () => {
        const result = generateClassName('prime:check-circle', 'background')

        expect(result).toBe(
          'onecx-theme-icon-background-prime-check-circle'
        )
      })

      it('should generate correct class name for background-before', () => {
        const result = generateClassName(
          'mdi:settings-remote',
          'background-before'
        )

        expect(result).toBe(
          'onecx-theme-icon-background-before-mdi-settings-remote'
        )
      })

      it('should normalize icon name internally', () => {
        const result = generateClassName(
          'mdi:home@battery!',
          'svg'
        )

        expect(result).toBe(
          'onecx-theme-icon-svg-mdi-home-battery-'
        )
      })
    })
  })


})
