/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { TestBed } from '@angular/core/testing'
import { IconService } from './icon.service'
import { FakeTopic } from '@onecx/angular-integration-interface/mocks'

describe('IconService', () => {
  let service: IconService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [IconService] })
    ;(window as any).onecxIcons = {}
    service = TestBed.inject(IconService)
  })

  afterEach(() => {
    ;(window as any).onecxIcons = {}
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(service).toBeTruthy()
  })

  describe('getIcon', () => {
    it('should return normalized class and publish IconRequested', () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:home-battery'
      const publishSpy = jest.spyOn(topic, 'publish')

      const result = service.getIcon(name)

      expect(result).toBe('onecx-theme-icon-background-before-mdi-home-battery')
      expect(publishSpy).toHaveBeenCalledWith({ type: 'IconRequested', name, classType: 'background-before' })
    })

    it('should honor explicit IconClassType', () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const result = service.getIcon('prime:check-circle', 'svg')
      expect(result).toBe('onecx-theme-icon-svg-prime-check-circle')
    })
  })

  describe('getIconAsync', () => {
    it('should return null immediately when cached null', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:ghost'
      ;(window as any).onecxIcons[name] = null
      const res = await service.getIconAsync(name)
      expect(res).toBeNull()
    })

    it('should return class immediately when cached icon exists', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:car'
      ;(window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      const res = await service.getIconAsync(name, 'svg')
      expect(res).toBe('onecx-theme-icon-svg-mdi-car')
    })

    it('should resolve with class after IconsReceived when icon becomes available', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:star'
      const promise = service.getIconAsync(name) // default background-before
      ;(window as any).onecxIcons[name] = { name, type: 'svg', body: '' }
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBe('onecx-theme-icon-background-before-mdi-star')
    })

    it('should resolve null after IconsReceived when icon resolved to null', async () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any

      const name = 'mdi:unknown'
      const promise = service.getIconAsync(name, 'svg')
      ;(window as any).onecxIcons[name] = null
      await topic.publish({ type: 'IconsReceived' })
      const res = await promise
      expect(res).toBeNull()
    })
  })

  describe('ngOnDestroy', () => {
    it('should destroy the underlying topic', () => {
      const topic = FakeTopic.create<any>()
      service.iconLoaderTopic = topic as any
      const spy = jest.spyOn(topic, 'destroy')
      service.ngOnDestroy()
      expect(spy).toHaveBeenCalled()
    })
  })
})
