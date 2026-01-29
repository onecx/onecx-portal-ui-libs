import { FakeTopic, Topic } from '@onecx/accelerator'
import {
  provideAppStateServiceMock,
  provideShellCapabilityServiceMock,
  ShellCapabilityServiceMock,
} from '@onecx/angular-integration-interface/mocks'
import { ParametersService } from './parameters.service'
import { Capability } from './shell-capability.service'
import { ParametersTopicPayload } from '@onecx/integration-interface'
import { TestBed } from '@angular/core/testing'

describe('ParametersService', () => {
  let parametersService: ParametersService
  let parametersTopic: Topic<ParametersTopicPayload>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideShellCapabilityServiceMock(), provideAppStateServiceMock()],
    })
    parametersService = TestBed.inject(ParametersService)
    parametersTopic = FakeTopic.create<ParametersTopicPayload>()
    parametersService.parameters$ = parametersTopic
  })

  it('should be created', () => {
    expect(parametersService).toBeTruthy()
  })

  it('should return the default value if capability is not available', async () => {
    ShellCapabilityServiceMock.setCapabilities([])

    const defaultValue = 'default'
    const result = await parametersService.get('key', defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return the parameter value if capability is available', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    const value = 'value'
    await parametersTopic.publish({
      parameters: [{ productName: 'test', appId: 'test', parameters: { [key]: value } }],
    })

    const result = await parametersService.get(key, 'default')

    expect(result).toBe(value)
  })

  it('should return the default value if parameter value is undefined', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    await parametersTopic.publish({ parameters: [{ productName: 'test', appId: 'test', parameters: {} }] })

    const defaultValue = 'default'
    const result = await parametersService.get(key, defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return the default value if no parameters for the app are in payload', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    await parametersTopic.publish({
      parameters: [{ productName: 'test', appId: 'test2', parameters: { [key]: 'test' } }],
    })

    const defaultValue = 'default'
    const result = await parametersService.get(key, defaultValue)

    expect(result).toBe(defaultValue)
  })

  it('should return the value of the promise provided as default value if parameter value is undefined', async () => {
    ShellCapabilityServiceMock.setCapabilities([Capability.PARAMETERS_TOPIC])

    const key = 'key'
    await parametersTopic.publish({ parameters: [] })

    const defaultValue = 'default'
    const result = await parametersService.get(key, Promise.resolve(defaultValue))

    expect(result).toBe(defaultValue)
  })
})
