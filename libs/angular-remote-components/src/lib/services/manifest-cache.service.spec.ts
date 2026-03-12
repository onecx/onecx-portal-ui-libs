import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ManifestCacheService } from './manifest-cache.service'
import { FakeTopic } from '@onecx/accelerator'
import { Manifest } from '../model/manifest'
import { provideHttpClient } from '@angular/common/http'

describe('ManifestCacheService', () => {
  let manifestCache: ManifestCacheService
  let httpMock: HttpTestingController
  const mockManifest = { id: 'test' } as Manifest

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManifestCacheService, provideHttpClient(), provideHttpClientTesting()],
    })
    manifestCache = TestBed.inject(ManifestCacheService)
    httpMock = TestBed.inject(HttpTestingController)
    ;(manifestCache as any).manifestTopic$ = new FakeTopic<string>()
    window['onecxManifests'] = {}
  })

  afterEach(() => {
    httpMock.verify()
    window['onecxManifests'] = {}
  })

  it('should be created', () => {
    expect(manifestCache).toBeTruthy()
  })

  describe('getManifest', () => {
    it('should return cached manifest if available', (done) => {
      window['onecxManifests']['testUrl'] = mockManifest

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual(mockManifest)
        done()
      })
    })

    it('should load and cache manifest if not available', (done) => {
      const mockManifest = { id: 'test' }

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual(mockManifest)
        expect(window['onecxManifests']['testUrl']).toEqual(mockManifest)
        done()
      })

      const req = httpMock.expectOne('testUrl')
      expect(req.request.method).toBe('GET')
      req.flush(mockManifest)
    })

    it('should wait for manifest if it is currently loading', (done) => {
      window['onecxManifests']['testUrl'] = null

      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual(mockManifest)
        done()
      })

      // Simulate other instance finishing download and publishing
      window['onecxManifests']['testUrl'] = mockManifest
      ;(manifestCache.manifestTopic$ as any).publish('testUrl')
    })

    it('should handle error and return empty object', (done) => {
      manifestCache.getManifest('testUrl').subscribe((result) => {
        expect(result).toEqual({})
        expect(window['onecxManifests']['testUrl']).toBeUndefined()
        done()
      })

      const req = httpMock.expectOne('testUrl')
      req.error(new ErrorEvent('Network error'))
    })
  })
})
