import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AiAgentResponse,
  AiProviderError,
  OneCXAiAgentService,
  OneCXAiCompletionService,
} from '@onecx/integration-interface'
import { of, throwError } from 'rxjs'
import { TranslateTestingModule } from 'ngx-translate-testing'
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
      imports: [
        TranslateTestingModule.withTranslations({
          en: require('../../../../assets/i18n/en.json'),
          de: require('../../../../assets/i18n/de.json'),
        }),
        AngularAcceleratorModule,
      ],
      providers: [
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

  it('should map an agent-not-found error to its own message key', async () => {
    getAgents.mockRejectedValue(new AiProviderError('AGENT_NOT_FOUND', 'none'))

    await createComponent()

    expect(component.errorMessageKey).toBe('OCX_AI_ASSIST.ERRORS.AGENT_NOT_FOUND')
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

  it('should select no action when there are no actions to offer', async () => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.defaultActions = []
    component.additionalActions = []
    fixture.detectChanges()
    await fixture.whenStable()

    expect(component.actions).toEqual([])
    expect(component.selectedActionId).toBeUndefined()
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

  it('should keep the panel closed by default and toggle it', async () => {
    await createComponent()

    expect(component.open).toBe(false)
    expect(fixture.nativeElement.querySelector('#ocxAiAssistPanel')).toBeNull()

    component.toggle()
    fixture.detectChanges()
    expect(component.open).toBe(true)
    expect(fixture.nativeElement.querySelector('#ocxAiAssistPanel')).not.toBeNull()

    component.close()
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('#ocxAiAssistPanel')).toBeNull()
  })

  it('should render the review state with the replace and try again actions', async () => {
    await createComponent()
    component.open = true
    component.selectAction('translate')
    component.inputText = 'Hello'
    await component.run()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    const suggestion = fixture.nativeElement.querySelector('#ocxAiAssistSuggestion') as HTMLTextAreaElement
    expect(suggestion.value).toBe('Hallo')
    expect(fixture.nativeElement.textContent).toContain('Replace text')
    expect(fixture.nativeElement.textContent).toContain('Try again')
  })

  it('should offer the completion as an editable suggestion and emit it on replace', async () => {
    const replaced = jest.fn()
    await createComponent()
    component.replaceText.subscribe(replaced)
    component.open = true
    component.selectAction('translate')
    component.inputText = 'Hello'

    await component.run()
    expect(component.isReviewReady).toBe(true)
    expect(component.suggestion).toBe('Hallo')

    component.suggestion = 'Hallo Welt'
    component.replace()

    expect(replaced).toHaveBeenCalledWith('Hallo Welt')
    expect(component.open).toBe(false)
    expect(component.runState).toBe('idle')
    expect(component.suggestion).toBe('')
  })

  it('should run the action again when the user asks to try again', async () => {
    await createComponent()
    component.selectAction('translate')
    component.inputText = 'Hello'
    await component.run()

    getCompletion.mockResolvedValueOnce({ text: 'Hallo Welt' })
    await component.tryAgain()

    expect(getCompletion).toHaveBeenCalledTimes(2)
    expect(component.suggestion).toBe('Hallo Welt')
  })

  it('should derive agent initials from the first two words of the name', async () => {
    await createComponent()

    expect(component.initials('Event Management AI Agent')).toBe('EM')
    expect(component.initials('translator')).toBe('T')
    expect(component.initials(undefined)).toBe('')
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

  it('should return to the settings when the user edits the request after a result', async () => {
    await createComponent()
    component.selectAction('translate')
    component.inputText = 'Hello'
    await component.run()
    expect(component.isReviewReady).toBe(true)

    component.editSettings()

    expect(component.isReviewReady).toBe(false)
    expect(component.runState).toBe('idle')
    expect(component.resultText).toBeUndefined()
    expect(component.inputText).toBe('Hello')
  })

  it('should reset to the starting state when the panel is closed', async () => {
    getAgents.mockResolvedValue([agent, { id: 'agent-2', name: 'Second partner', appId: 'app-1' }])
    await createComponent()
    component.selectAction('translate')
    component.selectAgent('agent-2')
    component.inputText = 'Hello'
    await component.run()
    expect(component.isReviewReady).toBe(true)

    component.close()

    expect(component.open).toBe(false)
    expect(component.selectedActionId).toBe(component.actions[0].id)
    expect(component.selectedAgentId).toBe(component.agents[0].id)
    expect(component.runState).toBe('idle')
    expect(component.resultText).toBeUndefined()
  })

  it('should discard a late completion when the user changes the action while it runs', async () => {
    let resolveCompletion: (value: { text: string }) => void = () => undefined
    getCompletion.mockReturnValueOnce(new Promise((resolve) => (resolveCompletion = resolve)))
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    const running = component.run()
    component.selectAction('translate')
    resolveCompletion({ text: 'Late summary' })
    await running

    expect(component.selectedActionId).toBe('translate')
    expect(component.runState).toBe('idle')
    expect(component.resultText).toBeUndefined()
    expect(component.suggestion).toBe('')
  })

  it('should discard a late completion when the user changes the agent while it runs', async () => {
    let resolveCompletion: (value: { text: string }) => void = () => undefined
    getCompletion.mockReturnValueOnce(new Promise((resolve) => (resolveCompletion = resolve)))
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    const running = component.run()
    component.selectAgent('agent-2')
    resolveCompletion({ text: 'Late summary' })
    await running

    expect(component.selectedAgentId).toBe('agent-2')
    expect(component.runState).toBe('idle')
    expect(component.resultText).toBeUndefined()
  })

  it('should discard a late error when the user changes the action while it runs', async () => {
    let rejectCompletion: (reason: unknown) => void = () => undefined
    getCompletion.mockReturnValueOnce(new Promise((_, reject) => (rejectCompletion = reject)))
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    const running = component.run()
    component.selectAction('translate')
    rejectCompletion(new AiProviderError('TIMEOUT', 'timeout', { retryable: true }))
    await running

    expect(component.runState).toBe('idle')
    expect(component.errorCode).toBeUndefined()
  })

  it('should not expose the raw response envelope when no text is returned', async () => {
    await createComponent()
    component.result = { conversationId: null, message: '{}' } as never

    expect(component.resultText).toBeUndefined()
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

  it('should show an empty suggestion when a successful completion contains no text', async () => {
    getCompletion.mockResolvedValueOnce({ conversationId: null, message: '{}' })
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    await component.run()

    expect(component.runState).toBe('success')
    expect(component.suggestion).toBe('')
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
})
