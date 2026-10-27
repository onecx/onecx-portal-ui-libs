import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppStateService } from '@onecx/angular-integration-interface'
import { AiAgentResponse, AiProviderError, OneCXAiAgentService, OneCXAiCompletionService } from '@onecx/integration-interface'
import { of } from 'rxjs'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { AiAssistComponent } from './ai-assist.component'

const agent: AiAgentResponse = { id: 'agent-1', name: 'Content partner', appId: 'app-1' }

describe('AiAssistComponent', () => {
  let fixture: ComponentFixture<AiAssistComponent>
  let component: AiAssistComponent
  let getAgents: jest.SpyInstance
  let getCompletion: jest.SpyInstance

  const createComponent = async (): Promise<void> => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }

  beforeEach(async () => {
    getAgents = jest.spyOn(OneCXAiAgentService.prototype, 'getAgents').mockResolvedValue([agent])
    getCompletion = jest.spyOn(OneCXAiCompletionService.prototype, 'getCompletion').mockResolvedValue({ text: 'Hallo' })

    await TestBed.configureTestingModule({
      imports: [AngularAcceleratorModule],
      providers: [provideTranslateTestingService(), { provide: AppStateService, useValue: { currentMfe$: of({ appId: 'app-1' }) } }],
    }).compileComponents()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should load agents for the appId of the current MFE and select the first one', async () => {
    await createComponent()

    expect(getAgents).toHaveBeenCalledWith({ appId: 'app-1' })
    expect(component.loadState).toBe('ready')
    expect(component.selectedAgentId).toBe('agent-1')
  })

  it('should show the empty state when no agent is returned', async () => {
    getAgents.mockResolvedValue([])

    await createComponent()

    expect(component.loadState).toBe('empty')
  })

  it('should show the error state with the provider error code when agent loading fails', async () => {
    getAgents.mockRejectedValue(new AiProviderError('NO_PROVIDER', 'none'))

    await createComponent()

    expect(component.loadState).toBe('error')
    expect(component.errorMessageKey).toBe('OCX_AI_ASSIST.ERRORS.NO_PROVIDER')
  })

  it('should offer default actions and hide actions disabled by the host', async () => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.disabledActionIds = ['summarize']
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.availableActions.map((action) => action.id)).toEqual(['translate', 'generate'])
  })

  it('should run the selected action with an instruction that requires JSON and show the text result', async () => {
    await createComponent()
    component.selectAction('translate')
    component.inputText = 'Hello'

    await component.run()
    fixture.detectChanges()

    expect(getCompletion).toHaveBeenCalledTimes(1)
    const input = getCompletion.mock.calls[0][0]
    expect(input.agentId).toBe('agent-1')
    expect(input.message).toBe('Hello')
    expect(input.systemPrompt).toContain('"en"')
    expect(input.systemPrompt).toContain('Respond only with JSON')
    expect(component.resultText).toBe('Hallo')
    expect(component.runState).toBe('success')
  })

  it('should not run without input text', async () => {
    await createComponent()
    component.selectAction('summarize')

    await component.run()

    expect(getCompletion).not.toHaveBeenCalled()
    expect(component.canRun).toBe(false)
  })

  it('should show the error state and retry explicitly on a failed completion', async () => {
    getCompletion.mockRejectedValueOnce(new AiProviderError('TIMEOUT', 'timeout', { retryable: true }))
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    await component.run()
    expect(component.runState).toBe('error')
    expect(component.errorCode).toBe('TIMEOUT')
    expect(getCompletion).toHaveBeenCalledTimes(1)

    await component.retry()

    expect(getCompletion).toHaveBeenCalledTimes(2)
    expect(component.runState).toBe('success')
  })
})
