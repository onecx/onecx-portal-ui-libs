import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppStateService } from '@onecx/angular-integration-interface'
import { AiAgentResponse, AiProviderError, OneCXAiAgentService, OneCXAiCompletionService } from '@onecx/integration-interface'
import { of, throwError } from 'rxjs'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { AiAssistComponent } from './ai-assist.component'
import { DEFAULT_AI_ASSIST_ACTIONS } from './ai-assist.model'
import { z } from 'zod'

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
      providers: [
        provideTranslateTestingService({}),
        provideNoopAnimations(),
        { provide: AppStateService, useValue: { currentMfe$: of({ appId: 'app-1' }) } },
      ],
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

  it('should offer the default actions and append the optional additional actions', async () => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.defaultActions = DEFAULT_AI_ASSIST_ACTIONS.filter((action) => action.id !== 'summarize')
    component.additionalActions = [
      {
        id: 'extractKeywords',
        labelKey: 'Extract keywords',
        buildInstruction: () => 'Extract keywords.',
        outputDescription: '{"keywords": string[]}',
        outputSchema: z.object({ keywords: z.array(z.string()) }),
      },
    ]
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.actions.map((action) => action.id)).toEqual(['translate', 'generate', 'extractKeywords'])
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

  it('should map an unexpected completion error to the UNKNOWN error code and use the generic message', async () => {
    getCompletion.mockRejectedValueOnce(new Error('boom'))
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    await component.run()

    expect(component.runState).toBe('error')
    expect(component.errorCode).toBe('UNKNOWN')
    expect(component.errorMessageKey).toBe('OCX_AI_ASSIST.ERRORS.GENERIC')
  })

  it('should not run again when retry is called without a previous error', async () => {
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    await component.retry()

    expect(getCompletion).not.toHaveBeenCalled()
  })

  it('should map an unexpected agent loading error to the UNKNOWN error code', async () => {
    getAgents.mockRejectedValue(new Error('network down'))

    await createComponent()

    expect(component.loadState).toBe('error')
    expect(component.errorCode).toBe('UNKNOWN')
    expect(component.agents).toEqual([])
  })

  it('should prefer the configured appId over the appId of the current MFE', async () => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.appId = 'app-3'
    fixture.detectChanges()
    await fixture.whenStable()

    expect(getAgents).toHaveBeenCalledWith({ appId: 'app-3' })
  })

  it('should return no text when the result does not contain a text field', () => {
    component.result = { summary: 'no text here' }

    expect(component.resultText).toBeUndefined()
  })

  it('should return no text when there is no result yet', async () => {
    await createComponent()

    expect(component.resultText).toBeUndefined()
  })

  it('should load agents without an appId when the current MFE is empty', async () => {
    const appStateService = TestBed.inject(AppStateService) as unknown as { currentMfe$: unknown }
    appStateService.currentMfe$ = of(undefined)
    fixture = TestBed.createComponent(AiAssistComponent)
    fixture.detectChanges()
    await fixture.whenStable()

    expect(getAgents).toHaveBeenCalledWith({ appId: undefined })
  })

  it('should clear parameter values when selecting an unknown action', async () => {
    await createComponent()
    component.selectAction('unknown-action')

    expect(component.parameterValues).toEqual({})
    expect(component.selectedAction).toBeUndefined()
  })

  it('should load agents for the configured appId when the current MFE cannot be read', async () => {
    const appStateService = TestBed.inject(AppStateService) as unknown as { currentMfe$: unknown }
    appStateService.currentMfe$ = throwError(() => new Error('no current MFE'))
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.appId = 'app-2'
    fixture.detectChanges()
    await fixture.whenStable()

    expect(getAgents).toHaveBeenCalledWith({ appId: 'app-2' })
  })

  it('should select the agent chosen by the user', async () => {
    await createComponent()

    component.selectAgent('agent-2')

    expect(component.selectedAgentId).toBe('agent-2')
  })

  it('should render the full result as formatted JSON', async () => {
    await createComponent()
    component.result = { text: 'Hallo' } as never

    expect(component.resultJson).toBe(JSON.stringify({ text: 'Hallo' }, null, 2))
  })
})
