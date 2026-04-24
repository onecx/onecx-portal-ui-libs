import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ManifestCacheService } from './manifest-cache.service'
import { ensureProperty, FakeTopic } from '@onecx/accelerator'
import { Manifest } from '../model/manifest'
import { provideHttpClient } from '@angular/common/http'

describe('ManifestCacheService', () => {
  let manifestCache: ManifestCacheService
  let httpMock: HttpTestingController
  let onecxManifests: Record<string, Manifest | undefined | null>
  const mockManifest = { id: 'test' } as Manifest

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManifestCacheService, provideHttpClient(), provideHttpClientTesting()],
    })
    manifestCache = TestBed.inject(ManifestCacheService)
    httpMock = TestBed.inject(HttpTestingController)
    ;(manifestCache as any).manifestTopic$ = new FakeTopic<{ url: string }>()
    onecxManifests = ensureProperty(globalThis, ['onecxManifests'], {} as Record<string, Manifest | undefined | null>)[
      'onecxManifests'
    ]
  })

  afterEach(() => {
    httpMock.verify()
    delete (globalThis as { onecxManifests?: Record<string, Manifest | undefined | null> }).onecxManifests
  })

  it('should be created', () => {
    expect(manifestCache).toBeTruthy()
  })

  describe('manifestTopic$', () => {
    it('should lazily create and reuse topic instance', () => {
      ;(manifestCache as any)._manifestTopic$ = undefined

      const firstTopic = manifestCache.manifestTopic$
      const secondTopic = manifestCache.manifestTopic$

      expect(firstTopic).toBeTruthy()
      expect(secondTopic).toBe(firstTopic)
    })

    it('should destroy created topic on ngOnDestroy', () => {
      ;(manifestCache as any)._manifestTopic$ = undefined
      const topic = manifestCache.manifestTopic$
      const destroySpy = jest.spyOn(topic, 'destroy')

      manifestCache.ngOnDestroy()

      expect(destroySpy).toHaveBeenCalledTimes(1)
    })

    it('should not fail on ngOnDestroy when no topic exists', () => {
      ;(manifestCache as any)._manifestTopic$ = undefined

      expect(() => manifestCache.ngOnDestroy()).not.toThrow()
    })
  })

  describe('getManifest', () => {
    it('should return cached manifest if available', (done) => {
      onecxManifests['testUrl'] = mockManifest

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual(mockManifest)
        done()
      })
    })

    it('should return empty object when cached value is null', (done) => {
      onecxManifests['testUrl'] = null

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual({})
        done()
      })
    })

    it('should load and cache manifest if not available', (done) => {
      const mockManifest = { id: 'test' }

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual(mockManifest)
        expect(onecxManifests['testUrl']).toEqual(mockManifest)
        done()
      })

      const req = httpMock.expectOne('testUrl')
      expect(req.request.method).toBe('GET')
      req.flush(mockManifest)
    })

    it('should wait for manifest if it is currently loading', (done) => {
      onecxManifests['testUrl'] = undefined

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual(mockManifest)
        done()
      })

      // Simulate other instance finishing download and publishing
      onecxManifests['testUrl'] = mockManifest
      ;(manifestCache.manifestTopic$ as any).publish({ url: 'testUrl' })
    })

    it('should return empty object after waiting when cache remains undefined', (done) => {
      onecxManifests['testUrl'] = undefined

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual({})
        done()
      })

      ;(manifestCache.manifestTopic$ as any).publish({ url: 'otherUrl' })
      ;(manifestCache.manifestTopic$ as any).publish({ url: 'testUrl' })
    })

    it('should handle error and return empty object', (done) => {
      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual({})
        expect(onecxManifests['testUrl']).toBeNull()
        done()
      })

      const req = httpMock.expectOne('testUrl')
      req.error(new ErrorEvent('Network error'))
    })
  })
})
