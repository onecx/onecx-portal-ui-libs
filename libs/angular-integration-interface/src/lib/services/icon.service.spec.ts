/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { TestBed } from '@angular/core/testing';
import { FakeTopic, ensureProperty } from '@onecx/accelerator';
import { IconService } from './icon.service';
import { Icon, IconService as IconServiceInterface} from '@onecx/integration-interface';
import {IconCache} from "@onecx/integration-interface";


describe('IconService', () => {
  let iconService: IconService
  let iconServiceInterface: IconServiceInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [IconService] });
    globalThis.onecxIcons = {}
    iconService = TestBed.inject(IconService)
    iconServiceInterface = (iconService as any).iconServiceInterface;
    iconServiceInterface.iconTopic = FakeTopic.create<Icon>();
  })

  afterEach(() => {
    globalThis.onecxIcons = {}
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(iconService).toBeTruthy()
  })


  it('should return the underlying iconTopic', () => {
    const topic = iconServiceInterface.iconTopic

    expect(iconService.iconTopic).toBe(topic);
  });


  describe('requestIcon', () => {
    it('should return normalized class and publish IconRequested on first request', () => {
      const topic = iconServiceInterface.iconTopic
      const name = 'mdi:home-battery'
      const publishSpy = jest.spyOn(topic, 'publish')

      const result = iconService.requestIcon(name)

      expect(result).toBe('onecx-theme-icon-background-before-mdi-home-battery')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name })
    })

    it('should honor explicit IconClassType', () => {

      const result = iconService.requestIcon('prime:check-circle', 'svg')

      expect(result).toBe('onecx-theme-icon-svg-prime-check-circle')
    })

    it('should not publish when icon already present in cache', () => {
      const topic = FakeTopic.create<any>()
      const publishSpy = jest.spyOn(topic, 'publish')
      ensureProperty(globalThis, ['onecxIcons', 'mdi:cached'], { name: 'mdi:cached', type: 'svg', body: '' } as IconCache)

      const result = iconService.requestIcon('mdi:cached')

      expect(result).toBe('onecx-theme-icon-background-before-mdi-cached')
      expect(publishSpy).not.toHaveBeenCalled()
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
      const topic = iconServiceInterface.iconTopic
      const name = 'mdi:star'

      const promise = iconService.requestIconAsync(name) // default background-before
      ensureProperty(globalThis, ['onecxIcons', name], { name, type: 'svg', body: '' } as IconCache)

      await topic.publish({ type: 'IconsReceived' })
      const res = await promise

      expect(res).toBe('onecx-theme-icon-background-before-mdi-star')
    })

    it('should resolve null after IconsReceived when icon resolved to null', async () => {
      const topic = iconServiceInterface.iconTopic
      const name = 'mdi:unknown'

      const promise = iconService.requestIconAsync(name, 'svg')
      ensureProperty(globalThis, ['onecxIcons', name], null)

      await topic.publish({ type: 'IconsReceived' })
      const res = await promise

      expect(res).toBeNull()
    })
  })

  describe('ngOnDestroy', () => {
    it('should destroy the underlying topic', () => {
      const spyDestroy = jest.spyOn(iconServiceInterface, 'destroy');
      const spy = jest.spyOn(iconServiceInterface.iconTopic, 'destroy')

      iconService.ngOnDestroy();

      expect(spy).toHaveBeenCalled()
      expect(spyDestroy).toHaveBeenCalled();
    })
  })
})
