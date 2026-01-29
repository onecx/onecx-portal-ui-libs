import { TestBed } from '@angular/core/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ConfigurationService } from './configuration.service'
import { FakeTopic } from '@onecx/accelerator'
import { CONFIG_KEY } from '../model/config-key.model'
import { Config } from '@onecx/integration-interface'
import * as loggerUtils from '../utils/logger.utils'

describe('ConfigurationService', () => {
  let configuration: ConfigurationService

  const loggerErrorFn = jest.fn()

  beforeEach(async () => {
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue({
      debug: jest.fn() as any,
      info: jest.fn() as any,
      warn: jest.fn() as any,
      error: loggerErrorFn as any,
    })

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()
    configuration = TestBed.inject(ConfigurationService)
    ;(configuration as any).config$ = new FakeTopic<Config>()
    ;(configuration as any).config$.publish({ [CONFIG_KEY.IS_SHELL]: 'true' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    loggerErrorFn.mockClear()
  })

  it('should be created', () => {
    expect(configuration).toBeTruthy()
  })

  describe('getProperty', () => {
    it('should return the property value for a valid key that was set before', async () => {
      const expectedValue = '1.x.0'
      await configuration.setProperty(CONFIG_KEY.APP_VERSION, expectedValue)
      const value = await configuration.getProperty(CONFIG_KEY.APP_VERSION)

      expect(value).toBe(expectedValue)
    })

    it('should log an error for an invalid key', async () => {
      await configuration.getProperty('invalidKey' as unknown as CONFIG_KEY)
      expect(loggerErrorFn).toHaveBeenCalledWith('Invalid config key ', 'invalidKey')
    })
  })
})
