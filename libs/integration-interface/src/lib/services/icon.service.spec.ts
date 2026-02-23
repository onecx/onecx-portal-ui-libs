/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { FakeTopic, ensureProperty } from '@onecx/accelerator';
import { IconCache, IconClassType } from '../topics/icons/v1/icon.model';
import { ensureIconCache, generateClassName, IconService } from './icon.service';
import '../declarations';

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
    globalThis.onecxIcons = {}
    iconService = new IconService()
  })

  afterEach(() => {
    globalThis.onecxIcons = {}
    jest.clearAllMocks()
  })

  it('initializes global icon cache', () => {
    expect(globalThis.onecxIcons).toBeDefined()
    expect(typeof globalThis.onecxIcons).toBe('object')
  })



  describe('iconTopic getter & setter', () => {
    it('should set the iconTopic via setter', () => {
      const { IconTopic: MockIconTopic } = jest.requireActual('../topics/icons/v1/icon.topic');
      const mockTopic = new MockIconTopic()

      iconService.iconTopic = mockTopic;

      expect(iconService.iconTopic).toBe(mockTopic);
    });


    it('should create IconTopic once and return the same instance', () => {
      const t1 = iconService.iconTopic;
      const t2 = iconService.iconTopic;

      expect(t1).toBe(t2);
    });
  });

  describe('requestIcon', () => {
    it('should return normalized class and publish IconRequested on first request', () => {
      const name = 'mdi:home-battery'
      const classType: IconClassType = 'background-before'
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')

      const cls = iconService.requestIcon(name, classType)

      expect(globalThis.onecxIcons?.[name]).toBeUndefined()
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name })
      expect(cls).toBe('onecx-theme-icon-background-before-mdi-home-battery')
    })

    it('should not publish IconRequested when icon already present in cache (object or null)', () => {
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>
      const publishSpy = jest.spyOn(topic, 'publish')

      ensureProperty(globalThis, ['onecxIcons', 'prime:user'], { name: 'prime:user' } as IconCache )
      iconService.requestIcon('prime:user', 'background')

      expect(publishSpy).not.toHaveBeenCalled()

      publishSpy.mockClear()
      ensureProperty(globalThis, ['onecxIcons', 'mdi:missing'], null)
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
      ensureProperty(globalThis, ['onecxIcons', name], null)

      const res = await iconService.requestIconAsync(name)

      expect(res).toBeNull()
    })

    it('should return class immediately when cached icon exists', async () => {
      const name = 'mdi:car'
      ensureProperty(globalThis, ['onecxIcons', name], { name, type: 'svg', body: '' } as IconCache)

      const res = await iconService.requestIconAsync(name, 'svg')

      expect(res).toBe('onecx-theme-icon-svg-mdi-car')
    })

    it('should resolve with class after IconsReceived when icon becomes available', async () => {
      const name = 'prime:check'
      const promise = iconService.requestIconAsync(name, 'background')
      ensureProperty(globalThis, ['onecxIcons', name], { name, type: 'svg', body: '' } as IconCache)
      const topic = (iconService.iconTopic as unknown) as FakeTopic<any>

      await topic.publish({ type: 'IconsReceived' })
      const res = await promise

      expect(res).toBe('onecx-theme-icon-background-prime-check')
    })

    it('should resolve null after IconsReceived when icon resolved to null', async () => {
      const name = 'mdi:unknown'
      const promise = iconService.requestIconAsync(name)
      ensureProperty(globalThis, ['onecxIcons', name], null)
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



  describe('icon-service utilities', () => {
    beforeEach(() => {
      delete globalThis.onecxIcons
    })

    describe('ensureIconCache', () => {
      it('should initialize globalThis.onecxIcons if not present', () => {
        expect(globalThis.onecxIcons).toBeUndefined()

        ensureIconCache()

        expect(globalThis.onecxIcons).toBeDefined()
        expect(globalThis.onecxIcons).toEqual({})
      })

      it('should not overwrite existing icon cache', () => {
        const existing: Record<string, IconCache | null | undefined> = {
          'mdi:home': undefined,
          'prime:user': null
        }

        ensureProperty(globalThis, ['onecxIcons'], existing)

        ensureIconCache()

        expect(globalThis.onecxIcons).toBe(existing)
        expect(globalThis.onecxIcons!['mdi:home']).toBeUndefined()
        expect(globalThis.onecxIcons!['prime:user']).toBeNull()
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
