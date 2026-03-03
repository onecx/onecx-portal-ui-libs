import { HttpClient } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { AppConfigService } from './app-config-service'

describe('AppConfigService', () => {
  let service: AppConfigService
  let httpClientMock: { get: jest.Mock }

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
    }

    TestBed.configureTestingModule({
      providers: [AppConfigService, { provide: HttpClient, useValue: httpClientMock }],
    })

    service = TestBed.inject(AppConfigService)
  })

  it('should initialize config from env.json', async () => {
    httpClientMock.get.mockReturnValue(of({ API_URL: 'http://localhost' }))

    await expect(service.init('http://base')).resolves.toBeUndefined()

    expect(httpClientMock.get).toHaveBeenCalledWith('http://base/assets/env.json')
    expect(service.getConfig()).toEqual({ API_URL: 'http://localhost' })
  })

  it('should reject init when loading config fails', async () => {
    const error = new Error('network')
    httpClientMock.get.mockReturnValue(throwError(() => error))

    await expect(service.init('http://base')).rejects.toThrow('network')
  })

  it('should get and set config properties', () => {
    expect(service.getProperty('missing')).toBeUndefined()

    service.setProperty('A', '1')
    expect(service.getProperty('A')).toBe('1')
    expect(service.getConfig()).toEqual({ A: '1' })

    service.setProperty('B', '2')
    expect(service.getConfig()).toEqual({ A: '1', B: '2' })
  })
})
