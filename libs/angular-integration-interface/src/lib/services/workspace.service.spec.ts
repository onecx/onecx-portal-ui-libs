import { TestBed } from '@angular/core/testing'
import { WorkspaceService } from './workspace.service'
import { of } from 'rxjs'
import { AppStateService } from './app-state.service'

describe('WorkspaceService', () => {
  let service: WorkspaceService
  let mockAppStateService: any
  const params = new Map<string, string>([
    ['id', '5']
  ])

  beforeEach(() => {
    mockAppStateService = {
      currentWorkspace$: of({
        baseUrl: 'http://example.com',
        routes: [
          {
            appId: 'onecx-workspace-ui',
            productName: 'onecx-workspace',
            baseUrl: '/workspace/baseurl',
            endpoints: [
              { name: 'details', path: '/details/{id}' },
              { name: 'edit', path: '[[details]]' },
              { name: 'change', path: '[[edit]]' },
            ],
          },
        ],
      }),
    }

    TestBed.configureTestingModule({
      providers: [WorkspaceService, { provide: AppStateService, useValue: mockAppStateService }],
    })

    service = TestBed.inject(WorkspaceService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should find endpoint and return an observable that emits "/workspace/baseurl/details/{5}"', (done) => {
    service
    .getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', params)
    .subscribe((url) => {
      expect(url).toBe('http://example.com/workspace/baseurl/details/5');
      done();
    });
  });

  it('should find only app and return an observable that emits "/workspace/baseurl"', (done) => {
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl');
        done();
      })
  })

  it('it should return correct Endpoint with alias "', () => {
    const endpoint = { name: 'edit', path: '[[details]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
    ]

    const resultEndpoint = service.dissolveEndpoint(endpoint.name, endpoints)

    expect(resultEndpoint?.path).toBe('/details/{id}')
  })

  it('it should return unchanged Endpoint without alias "', () => {
    const endpoint = { name: 'details', path: '/details/{id}' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
    ]

    const resultEndpoint = service.dissolveEndpoint(endpoint.name, endpoints)

    expect(resultEndpoint?.path).toBe('/details/{id}')
  })

  it('it should return correct Endpoint for given two aliases "', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
      { name: 'change', path: '[[edit]]' },
    ]

    const resultEndpoint = service.dissolveEndpoint(endpoint.name, endpoints)

    expect(resultEndpoint?.path).toBe('/details/{id}')
  })

  it('it should return undefined when alias was not found "', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'change', path: '[[edit]]' },
    ]

    const resultEndpoint = service.dissolveEndpoint(endpoint.name, endpoints)

    expect(resultEndpoint).toBe(undefined)
  })

  it('it should return undefined when endpoint does not exists "', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
    ]

    const resultEndpoint = service.dissolveEndpoint(endpoint.name, endpoints)

    expect(resultEndpoint).toBe(undefined)
  })

  it('it should return url with filled params from Map "', () => {
    const path = 'details/{id}'
    const params = new Map<string, string>([
      ['id', '5'],
      ['name', 'xy'],
    ])

    const resultPath = service.fillParamsForPath(path, params)

    expect(resultPath).toBe('details/5')
  })

  it('it should return url with filled params from Map with two params"', () => {
    const path = 'details/{name}/{id}'
    const params = new Map<string, string>([
      ['id', '5'],
      ['name', 'xy'],
    ])

    const resultPath = service.fillParamsForPath(path, params)

    expect(resultPath).toBe('details/xy/5')
  })
})
