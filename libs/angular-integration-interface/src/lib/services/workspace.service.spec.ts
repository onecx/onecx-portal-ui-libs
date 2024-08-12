import { TestBed } from '@angular/core/testing'
import { WorkspaceService } from './workspace.service'
import { AppStateServiceMock, provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('WorkspaceService', () => {
  let service: WorkspaceService
  let mockAppStateService: AppStateServiceMock
  const endpointParameters: Record<string, unknown> = {
    id: 5,
    key: 'xy',
  }

  const endpointParametersWrong: Record<string, unknown> = {
    idx: 5,
  }

  const appId = 'onecx-workspace-ui'
  const productName = 'onecx-workspace'

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAppStateServiceMock()],
    })

    service = TestBed.inject(WorkspaceService)
    mockAppStateService = TestBed.inject(AppStateServiceMock)

    mockAppStateService.currentWorkspace$.publish({
      portalName: 'test-portal',
      workspaceName: 'test-workspace',
      microfrontendRegistrations: [],
      baseUrl: 'http://example.com',
      routes: [
        {
          appId: 'onecx-workspace-ui',
          productName: 'onecx-workspace',
          baseUrl: 'http://example.com/workspace/baseurl',
          endpoints: [
            { name: 'details', path: '/details/{id}' },
            { name: 'edit', path: '[[details]]' },
            { name: 'change', path: '[[edit]]' },
          ],
        },
      ],
    })
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getUrl', () => {
    it('should find endpoint and return correct url from route and endpoint ', (done) => {
      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })

    it('should return empty string when workspace baseUrl is empty string"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: '',
        routes: [],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('')
        done()
      })
    })

    it('should return workspace baseUrl when workspace has no routes at all"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com')
        done()
      })
    })

    it('should return workspace baseUrl when workspace.routes is empty"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com')
        done()
      })
    })

    it('should return workspace baseUrl when route for productName and appId was not found"', (done) => {
      service.getUrl('wrong-productname', appId, 'details', {}).subscribe((url) => {
        expect(url).toBe('http://example.com')
        done()
      })
    })

    it('should return workspace baseUrl and endpoints when route has no baseUrl', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/details/5')
        done()
      })
    })

    it('should return workspace baseUrl with endpoints when route has empty baseUrl', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/details/5')
        done()
      })
    })

    it('should return route.baseUrl when endpoints are empty"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [],
          },
        ],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return route.baseUrl when endpoint was not found', (done) => {
      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return well formed url for endpoint with 1 alias', (done) => {
      service.getUrl(productName, appId, 'edit', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })

    it('should return well formed url for endpoint with 2 alias ', (done) => {
      service.getUrl(productName, appId, 'change', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })

    it('should return baseurl when endpoint was not found', (done) => {
      service.getUrl(productName, appId, 'changexy', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return baseurl when endpoint has wrong alias', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details/{id}/{key}' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'change', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return baseurl + endpoint with no endpointparameters', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details').subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details')
        done()
      })
    })

    it('should return baseurl + endpoint with no endpointparameters', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', undefined).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details')
        done()
      })
    })

    it('should return baseurl when param was not found"', (done) => {
      service.getUrl(productName, appId, 'details', endpointParametersWrong).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return baseurl when no endpointName and endpointParameters are given"', (done) => {
      service.getUrl(productName, appId).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should baseurl without endpoint when endpointParameters are empty"', (done) => {
      service.getUrl(productName, appId, 'details', {}).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return well formed url with 2 endpointParameters in endpoint', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
            endpoints: [
              { name: 'details', path: '/details/{id}/{key}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5/xy')
        done()
      })
    })

    it('should return route.baseUrl when no endpoints are available"', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl',
          },
        ],
      })

      service.getUrl(productName, appId, 'detailswrong', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl')
        done()
      })
    })

    it('should return well formed url although double / are retrieved', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      })

      service.getUrl(productName, appId, 'details', endpointParameters).subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5')
        done()
      })
    })
  })

  describe('doesUrlExistFor', () => {
    it('should find endpoint by name and return true', (done) => {
      service.doesUrlExistFor(productName, appId, 'details').subscribe((result) => {
        expect(result).toBe(true)
        done()
      })
    })
    it('should find no endpoint by name and return false', (done) => {
      service.doesUrlExistFor(productName, appId, 'detailsx').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should find empty endpoint list in route and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
            endpoints: [],
          },
        ],
      })
      service.doesUrlExistFor(productName, appId, 'details').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should find no endpoint in route and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: 'http://example.com/workspace/baseurl/',
          },
        ],
      })
      service.doesUrlExistFor(productName, appId, 'details').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should check existing route baseUrl and return true', (done) => {
      service.doesUrlExistFor(productName, appId).subscribe((result) => {
        expect(result).toBe(true)
        done()
      })
    })
    it('should check empty route baseUrl and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '',
          },
        ],
      })
      service.doesUrlExistFor(productName, appId).subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should check route with no baseUrl and return false', (done) => {
      mockAppStateService.currentWorkspace$.publish({
        portalName: 'test-portal',
        workspaceName: 'test-workspace',
        microfrontendRegistrations: [],
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '',
          },
        ],
      })
      service.doesUrlExistFor(productName, appId).subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should check not existing route baseUrl and return false', (done) => {
      service.doesUrlExistFor(productName, 'wrongappId').subscribe((result) => {
        expect(result).toBe(false)
        done()
      })
    })
  })
})
