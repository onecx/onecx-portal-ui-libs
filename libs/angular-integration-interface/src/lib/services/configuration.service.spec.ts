import { TestBed } from '@angular/core/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ConfigurationService } from './configuration.service'
import { FakeTopic } from '@onecx/accelerator'
import { CONFIG_KEY } from '../model/config-key.model'
import { Config } from '@onecx/integration-interface'

describe('ConfigurationService', () => {
  let configuration: ConfigurationService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()
    configuration = TestBed.inject(ConfigurationService)
    ;(configuration as any).config$ = new FakeTopic<Config>()
    ;(configuration as any).config$.publish({ [CONFIG_KEY.IS_SHELL]: 'true' })
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
      console.error = jest.fn()
      await configuration.getProperty('invalidKey' as unknown as CONFIG_KEY)
      expect(console.error).toHaveBeenCalledWith('Invalid config key ', 'invalidKey')
    })
  })
})
