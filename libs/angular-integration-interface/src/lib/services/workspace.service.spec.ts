import { TestBed } from '@angular/core/testing'
import { WorkspaceService } from './workspace.service'
import { of } from 'rxjs'
import { AppStateService } from './app-state.service'

describe('WorkspaceService', () => {
  let service: WorkspaceService
  let mockAppStateService: any
  const params: Record<string, unknown> = {
    "id": 5,
    "key":"xy"
  };

  const paramsWrong: Record<string, unknown> = {
    "idx": 5
  };

  beforeEach(() => {
    mockAppStateService = {
      currentWorkspace$: of({
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

  //Testcases
  //1 Best case scenario
  //2 workspace baseUrl not there
  //3 workspace baseUrl is empty
  //4 workspace has no routes
  //5 workspace has emtpy routes
  //6 route was not found by appId and productName
  //7 workspace.route baseUrl not there
  //8 workspace.route baseUrl is empty
  //9 endpoints are empty
  //10 endpoint with name was not found
  //11 test endpoint with 1 alias
  //12 test endpoint with 2 alias
  //13 test endpoint with wrong alias
  //14 param was not found
  //15 no params given as param of getUrl
  //16 2 params
  //17 no endpoints available
  //18 test getUrl with double //

  //1
  it('should find endpoint and return an observable that emits correct url ', (done) => {
    service
    .getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', params)
    .subscribe((url) => {
      expect(url).toBe('http://example.com/workspace/baseurl/details/5');
      done();
    });
  });

  //2
  it('should return empty string when workspace baseUrl is not set"', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      routes: []
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('');
        done();
      })
  })

  //3
  it('should return empty string when workspace baseUrl is not set"', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      baseUrl: '',
      routes: []
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('');
        done();
      })
  })

  //4
  it('should return workspace baseUrl when workspace has no routes at all"', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      baseUrl: 'http://example.com'
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com');
        done();
      })
  })

  //5
  it('should return workspace baseUrl when workspace.routes is empty"', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      baseUrl: 'http://example.com',
      routes: []
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com');
        done();
      })
  })

  //6
  it('should return workspace baseUrl when route for appId and productName was not found"', (done) => {
    service
    .getUrl('onecx-workspace-uix', 'onecx-workspace', 'details', {})
    .subscribe((url) => {
      expect(url).toBe('http://example.com');
      done();
    });
  });

  //7
  it('should return workspace baseUrl when route has no baseUrl', (done) => {
    mockAppStateService.currentWorkspace$ = of({
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
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/details/5');
        done();
      })
  })

  //8
  it('should return workspace baseUrl when route has empty baseUrl', (done) => {
    mockAppStateService.currentWorkspace$ = of({
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
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/details/5');
        done();
      })
  })

  //9
  it('should return route.baseUrl when endpoints are empty"', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      baseUrl: 'http://example.com',
      routes: [
        {
          appId: 'onecx-workspace-ui',
          productName: 'onecx-workspace',
          baseUrl: 'http://example.com/workspace/baseurl',
          endpoints: [],
        },
      ],
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl');
        done();
      })
  })

  //10
  it('should find only app and return route.baseUrl', (done) => {
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl');
        done();
      })
  })

  //11
  it('should return well formed url for endpoint with 1 alias', (done) => {
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'edit', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5');
        done();
      })
  })

  //12
  it('should return well formed url for endpoint with 2 alias', (done) => {
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'change', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5');
        done();
      })
  })

  //13
  it('should return well formed url for endpoint with wrong alias', (done) => {
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'changexy', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl');
        done();
      })
  })

  //14
  it('should find endpoint and return correct url despite of wrong params"', (done) => {
    service
    .getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', paramsWrong)
    .subscribe((url) => {
      expect(url).toBe('http://example.com/workspace/baseurl');
      done();
    });
  });

  //15
  it('should find endpoint and return expected url despite of empty params"', (done) => {
    service
    .getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', {})
    .subscribe((url) => {
      expect(url).toBe('http://example.com/workspace/baseurl');
      done();
    });
  });

  //16
  it('should return well formed url with 2 params in endpoint', (done) => {
    mockAppStateService.currentWorkspace$ = of({
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
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5/xy');
        done();
      })
  })

  //17
  it('should return route.baseUrl when no endpoints are available"', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      baseUrl: 'http://example.com',
      routes: [
        {
          appId: 'onecx-workspace-ui',
          productName: 'onecx-workspace',
          baseUrl: 'http://example.com/workspace/baseurl',
        },
      ],
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'detailswrong', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl');
        done();
      })
  })

  //18
  it('should return well formed url although double / are retrieved', (done) => {
    mockAppStateService.currentWorkspace$ = of({
      baseUrl: 'http://example.com',
      routes: [
        {
          appId: 'onecx-workspace-ui',
          productName: 'onecx-workspace',
          baseUrl: 'http://example.com/workspace/baseurl/',
          endpoints: [
            { name: 'details', path: '//details/{id}' },
            { name: 'edit', path: '[[details]]' },
            { name: 'change', path: '[[edit]]' },
          ],
        },
      ],
    });
    
    service.getUrl('onecx-workspace-ui', 'onecx-workspace', 'details', params)
      .subscribe((url) => {
        expect(url).toBe('http://example.com/workspace/baseurl/details/5');
        done();
      })
  })

  it('it should return correct Endpoint with alias "', () => {
    const endpoint = { name: 'edit', path: '[[details]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
    ]

    const resultEndpoint = service['dissolveEndpoint'](endpoint.name, endpoints)

    expect(resultEndpoint?.path).toBe('/details/{id}')
  })
  

  it('it should return unchanged Endpoint without alias "', () => {
    const endpoint = { name: 'details', path: '/details/{id}' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
    ]

    const resultEndpoint = service['dissolveEndpoint'](endpoint.name, endpoints)

    expect(resultEndpoint?.path).toBe('/details/{id}')
  })

  it('it should return correct Endpoint for given two aliases "', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
      { name: 'change', path: '[[edit]]' },
    ]

    const resultEndpoint = service['dissolveEndpoint'](endpoint.name, endpoints)

    expect(resultEndpoint?.path).toBe('/details/{id}')
  })

  it('it should return undefined for wrong endpoint name"', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'detailsx', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
      { name: 'change', path: '[[edit]]' },
    ]

    const resultEndpoint = service['dissolveEndpoint'](endpoint.name, endpoints)

    expect(resultEndpoint).toBe(undefined)
  })

  it('it should return undefined when alias was not found "', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'change', path: '[[edit]]' },
    ]

    const resultEndpoint = service['dissolveEndpoint'](endpoint.name, endpoints)

    expect(resultEndpoint).toBe(undefined)
  })

  it('it should return undefined when endpoint does not exists "', () => {
    const endpoint = { name: 'change', path: '[[edit]]' }
    const endpoints = [
      { name: 'details', path: '/details/{id}' },
      { name: 'edit', path: '[[details]]' },
    ]

    const resultEndpoint = service['dissolveEndpoint'](endpoint.name, endpoints)

    expect(resultEndpoint).toBe(undefined)
  })

  it('it should return url with filled params from Map "', () => {
    const path = 'details/{id}'
    const params: Record<string, unknown> = {
      "id": 5,
      "name": "xy"
  };

    const resultPath = service['fillParamsForPath'](path, params)

    expect(resultPath).toBe('details/5')
  })

  it('it should return url with filled params from Map with two params"', () => {
    const path = 'details/{name}/{id}'
    const params: Record<string, unknown> = {
      "id": 5,
      "name": "xy"
  };

    const resultPath = service['fillParamsForPath'](path, params)

    expect(resultPath).toBe('details/xy/5')
  })

  it('should concat two strings with one / and leave :// as it is', () => {
    let result1 = service['joinWithSlashAndDoubleCheck']("a", "b");
    let result2 = service['joinWithSlashAndDoubleCheck']("a/", "b");
    let result3 = service['joinWithSlashAndDoubleCheck']("a/", "/b");
    let result4 = service['joinWithSlashAndDoubleCheck']("/a/", "b/");
    let result5 = service['joinWithSlashAndDoubleCheck']("a", "");
    let result6 = service['joinWithSlashAndDoubleCheck']("", "b");
    let result7 = service['joinWithSlashAndDoubleCheck']("https://a", "b");

    expect(result1).toBe('a/b')
    expect(result2).toBe('a/b')
    expect(result3).toBe('a/b')
    expect(result4).toBe('/a/b/')
    expect(result5).toBe('a')
    expect(result6).toBe('b')
    expect(result7).toBe('https://a/b')
  })

})
