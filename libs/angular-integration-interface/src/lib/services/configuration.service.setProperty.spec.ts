import { TestBed } from '@angular/core/testing'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ConfigurationService } from './configuration.service'
import { FakeTopic } from '@onecx/accelerator'
import { Config } from '@onecx/integration-interface'
import * as loggerUtils from '../utils/logger.utils'

describe('ConfigurationService setProperty', () => {
  let configuration: ConfigurationService

  beforeEach(async () => {
    jest.spyOn(loggerUtils, 'createLogger').mockReturnValue({
      debug: jest.fn() as any,
      info: jest.fn() as any,
      warn: jest.fn() as any,
      error: jest.fn() as any,
    })

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [ConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents()
    configuration = TestBed.inject(ConfigurationService)
    ;(configuration as any).config$ = new FakeTopic<Config>()
    ;(configuration as any).config$.publish({ a: '1' })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('given a consumer holding the published config, when setProperty adds a new key, then the held object is unchanged and the new config contains the new key', async () => {
    const held = await configuration.getConfig()

    await configuration.setProperty('b', '2')

    expect(held).toEqual({ a: '1' })
    expect(await configuration.getConfig()).toEqual({ a: '1', b: '2' })
  })

  it('given the held config object is frozen, when setProperty adds a new key, then setProperty succeeds and getProperty returns the new value', async () => {
    const held = await configuration.getConfig()
    Object.freeze(held)

    await configuration.setProperty('b', '2')

    expect(await configuration.getProperty('b')).toBe('2')
  })

  it('given a published config, when setProperty updates an existing key, then getProperty returns the new value', async () => {
    await configuration.setProperty('a', 'x')

    expect(await configuration.getProperty('a')).toBe('x')
  })

  it('given two sequential setProperty calls, when both have completed, then the published config contains both keys', async () => {
    await configuration.setProperty('b', '2')
    await configuration.setProperty('c', '3')

    expect(await configuration.getConfig()).toEqual({ a: '1', b: '2', c: '3' })
  })
})
