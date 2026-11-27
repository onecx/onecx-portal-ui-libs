import { SimpleChange } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AiAgentResponse,
  AiProviderError,
  OneCXAiAgentService,
  OneCXAiCompletionService,
} from '@onecx/integration-interface'
import { NEVER, of } from 'rxjs'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { provideNoopAnimations } from '@angular/platform-browser/animations'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { AiAssistComponent, resetAiAssistAgentCache } from './ai-assist.component'
import { AiAssistActionDefinition, DEFAULT_AI_ASSIST_ACTIONS } from './ai-assist.model'
import { z } from 'zod'

const agent: AiAgentResponse = { id: 'agent-1', name: 'Content partner', appId: 'app-1' }

const extractKeywordsAction = (
  toSuggestion?: (result: { keywords: string[] }) => string | undefined
): AiAssistActionDefinition<{ keywords: string[] }> => ({
  id: 'extractKeywords',
  labelKey: 'Extract keywords',
  buildInstruction: () => 'Extract keywords.',
  outputDescription: '{"keywords": string[]}',
  outputSchema: z.object({ keywords: z.array(z.string()) }),
  toSuggestion,
})

describe('AiAssistComponent', () => {
  let fixture: ComponentFixture<AiAssistComponent>
  let component: AiAssistComponent
  let getAgents: jest.SpyInstance
  let getCompletion: jest.SpyInstance

  const openPanel = async (): Promise<void> => {
    component.toggle()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }

  const createComponent = async (open = true): Promise<void> => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    if (open) {
      await openPanel()
    }
  }

  beforeEach(async () => {
    resetAiAssistAgentCache()
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
    await createComponent(false)
    const panelSelector = `#${component.uid}-panel`

    expect(component.open).toBe(false)
    expect(fixture.nativeElement.querySelector(panelSelector)).toBeNull()

    component.toggle()
    fixture.detectChanges()
    expect(component.open).toBe(true)
    expect(fixture.nativeElement.querySelector(panelSelector)).not.toBeNull()

    component.close()
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector(panelSelector)).toBeNull()
  })

  it('should load agents on the first open and reuse them when the panel reopens', async () => {
    await createComponent(false)
    expect(getAgents).not.toHaveBeenCalled()

    await openPanel()
    component.close()
    await openPanel()

    expect(getAgents).toHaveBeenCalledTimes(1)
    expect(component.selectedAgentId).toBe('agent-1')
  })

  it('should not start an agent lookup for an instance that is never opened', async () => {
    await createComponent(false)

    expect(getAgents).not.toHaveBeenCalled()
  })

  it('should not load agents when appId changes before the panel is first opened', async () => {
    await createComponent(false)

    component.appId = 'app-2'
    component.ngOnChanges({ appId: new SimpleChange(undefined, 'app-2', false) })
    await fixture.whenStable()

    expect(getAgents).not.toHaveBeenCalled()
  })

  it('should expose aria-expanded and aria-controls on the real toggle button', async () => {
    await createComponent(false)
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '.ocx-ai-assist__toggle button'
    ) as HTMLButtonElement

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe(component.uid + '-panel')

    await openPanel()
    const openButton = (fixture.nativeElement as HTMLElement).querySelector(
      '.ocx-ai-assist__toggle button'
    ) as HTMLButtonElement
    expect(openButton.getAttribute('aria-expanded')).toBe('true')
  })

  it('should share one agent request between instances with the same appId', async () => {
    const instances = Array.from({ length: 10 }, () => TestBed.createComponent(AiAssistComponent))
    for (const instance of instances) {
      instance.detectChanges()
      instance.componentInstance.toggle()
      await instance.whenStable()
    }

    expect(getAgents).toHaveBeenCalledTimes(1)
    expect(instances.every((instance) => instance.componentInstance.loadState === 'ready')).toBe(true)
  })

  it('should request agents separately for another appId', async () => {
    await createComponent()
    const other = TestBed.createComponent(AiAssistComponent)
    other.componentInstance.appId = 'app-2'
    other.detectChanges()
    other.componentInstance.toggle()
    await other.whenStable()

    expect(getAgents).toHaveBeenCalledTimes(2)
    expect(getAgents).toHaveBeenLastCalledWith({ appId: 'app-2' })
  })

  it('should not cache a failed agent request', async () => {
    getAgents.mockRejectedValueOnce(new Error('network down'))
    await createComponent()
    expect(component.loadState).toBe('error')

    await createComponent()

    expect(getAgents).toHaveBeenCalledTimes(2)
    expect(component.loadState).toBe('ready')
  })

  it('should bypass the cache when Try again is used', async () => {
    await createComponent()
    component.loadAgents(true)
    await fixture.whenStable()

    expect(getAgents).toHaveBeenCalledTimes(2)
  })

  it('should request agents again after the cache time to live has passed', async () => {
    let now = 0
    jest.spyOn(Date, 'now').mockImplementation(() => now)
    await createComponent()
    now = 60001
    await createComponent()

    expect(getAgents).toHaveBeenCalledTimes(2)
  })

  it('should ignore the timeout of a load that a newer load has superseded', fakeAsync(() => {
    const appStateService = TestBed.inject(AppStateService) as unknown as { currentMfe$: unknown }
    appStateService.currentMfe$ = NEVER
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    component.toggle()

    component.appId = 'app-2'
    component.loadAgents(true)
    tick(5000)

    expect(getAgents).toHaveBeenCalledWith({ appId: 'app-2' })
    expect(component.loadState).toBe('ready')
    expect(component.errorCode).toBeUndefined()
  }))

  it('should ignore a failure of a load that a newer load has superseded', async () => {
    let rejectStale: (reason: unknown) => void = () => undefined
    getAgents.mockImplementationOnce(() => new Promise((_, reject) => (rejectStale = reject)))
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    component.loadAgents()
    component.loadAgents(true)
    await fixture.whenStable()
    rejectStale(new Error('stale failure'))
    await fixture.whenStable()

    expect(component.loadState).toBe('ready')
    expect(component.agents).toEqual([agent])
    expect(component.errorCode).toBeUndefined()
  })

  it('should show a retryable error when the current MFE does not publish in time', fakeAsync(() => {
    const appStateService = TestBed.inject(AppStateService) as unknown as { currentMfe$: unknown }
    appStateService.currentMfe$ = NEVER
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    component.toggle()
    expect(component.loadState).toBe('loading')

    tick(5000)

    expect(component.loadState).toBe('error')
    expect(component.errorMessageKey).toBe('OCX_AI_ASSIST.ERRORS.NO_CONTEXT')
    expect(getAgents).not.toHaveBeenCalled()
  }))

  it('should close without an agent selected when no agents are available', async () => {
    getAgents.mockResolvedValue([])
    await createComponent()

    component.close()

    expect(component.open).toBe(false)
    expect(component.selectedAgentId).toBeUndefined()
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

    const suggestion = fixture.nativeElement.querySelector(`#${component.uid}-suggestion`) as HTMLTextAreaElement
    expect(suggestion.value).toBe('Hallo')
    expect(fixture.nativeElement.textContent).toContain('Replace text')
    expect(fixture.nativeElement.textContent).toContain('Try again')
  })

  it('should render review labels above the fields and align the low-emphasis retry before replace', async () => {
    await createComponent()
    component.open = true
    component.selectAction('translate')
    component.inputText = 'Hello'
    await component.run()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    const before = fixture.nativeElement.querySelector(`#${component.uid}-before`) as HTMLTextAreaElement
    const beforeLabel = fixture.nativeElement.querySelector(`label[for="${component.uid}-before"]`) as HTMLLabelElement
    const suggestion = fixture.nativeElement.querySelector(`#${component.uid}-suggestion`) as HTMLTextAreaElement
    const suggestionLabel = fixture.nativeElement.querySelector(
      `label[for="${component.uid}-suggestion"]`
    ) as HTMLLabelElement
    const statusIcon = fixture.nativeElement.querySelector('.ocx-ai-assist__review-status i') as HTMLElement
    const actionsRow = fixture.nativeElement.querySelector('.ocx-ai-assist__actions') as HTMLElement
    const rightActions = fixture.nativeElement.querySelector('.ocx-ai-assist__review-secondary-actions') as HTMLElement
    const retryButton = fixture.debugElement.query(By.css('.ocx-ai-assist__try-again'))
    const replaceButton = fixture.debugElement.query(By.css('.ocx-ai-assist__replace'))
    const editSettingsButton = fixture.debugElement.query(By.css('.ocx-ai-assist__edit-settings'))

    expect(beforeLabel.textContent?.trim()).toBe('Before')
    expect(beforeLabel.parentElement).toBe(before.parentElement)
    expect(beforeLabel.parentElement?.classList).not.toContain('p-floatlabel')
    expect(suggestionLabel.textContent?.trim()).toBe('AI suggestion · editable')
    expect(suggestionLabel.parentElement).toBe(suggestion.parentElement)
    expect(suggestionLabel.parentElement?.classList).not.toContain('p-floatlabel')
    expect(statusIcon.classList).toContain('pi-check')
    expect(statusIcon.classList).not.toContain('pi-check-circle')
    expect(actionsRow.firstElementChild).toBe(retryButton.nativeElement)
    expect(rightActions.contains(editSettingsButton.nativeElement)).toBe(true)
    expect(rightActions.contains(replaceButton.nativeElement)).toBe(true)
    expect(editSettingsButton.nativeElement.compareDocumentPosition(replaceButton.nativeElement)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    )
    expect(retryButton.componentInstance.text).toBe(true)
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

  it('should load agents for the configured appId without waiting for the current MFE', async () => {
    const appStateService = TestBed.inject(AppStateService) as unknown as { currentMfe$: unknown }
    appStateService.currentMfe$ = NEVER
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.appId = 'app-2'
    fixture.detectChanges()
    await fixture.whenStable()
    await openPanel()

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

  it('should offer a suggestion mapped from a custom result shape by toSuggestion', async () => {
    getCompletion.mockResolvedValueOnce({ keywords: ['alpha', 'beta'] })
    await createComponent()
    component.additionalActions = [extractKeywordsAction((result) => result.keywords.join(', '))]
    component.selectAction('extractKeywords')
    component.inputText = 'Alpha and beta'

    await component.run()

    expect(component.isReviewReady).toBe(true)
    expect(component.suggestion).toBe('alpha, beta')
  })

  it('should show the generic warning when toSuggestion returns no suggestion', async () => {
    getCompletion.mockResolvedValueOnce({ keywords: [] })
    await createComponent()
    component.additionalActions = [extractKeywordsAction(() => undefined)]
    component.selectAction('extractKeywords')
    component.inputText = 'Nothing here'

    await component.run()

    expect(component.runState).toBe('success')
    expect(component.isReviewReady).toBe(false)
    expect(component.resultText).toBeUndefined()
  })

  it('should show the generic warning for a custom result without toSuggestion', async () => {
    getCompletion.mockResolvedValueOnce({ keywords: ['alpha'] })
    await createComponent()
    component.additionalActions = [extractKeywordsAction()]
    component.selectAction('extractKeywords')
    component.inputText = 'Alpha'

    await component.run()

    expect(component.isReviewReady).toBe(false)
    expect(component.resultText).toBeUndefined()
  })

  it('should show the generic warning for an empty custom result without toSuggestion', async () => {
    getCompletion.mockResolvedValueOnce(null)
    await createComponent()
    component.additionalActions = [{ ...extractKeywordsAction(), outputSchema: z.null() }]
    component.selectAction('extractKeywords')
    component.inputText = 'Empty'

    await component.run()

    expect(component.runState).toBe('success')
    expect(component.isReviewReady).toBe(false)
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

    fixture.detectChanges()
    const tryAgainButton = fixture.debugElement.query(By.css('.ocx-ai-assist__try-again'))
    expect(tryAgainButton.componentInstance.label).toBe('Try again')
    expect(tryAgainButton.componentInstance.icon).toBe('pi pi-refresh')
    expect(tryAgainButton.componentInstance.text).toBe(true)

    await component.retry()

    expect(getCompletion).toHaveBeenCalledTimes(2)
    expect(component.runState).toBe('success')
  })

  it('should not emit a blank suggestion', async () => {
    await createComponent()
    const replaced = jest.fn()
    component.replaceText.subscribe(replaced)

    component.suggestion = '   '
    component.replace()

    expect(replaced).not.toHaveBeenCalled()
  })

  it('should reload agents when the appId input changes after init', async () => {
    await createComponent()

    component.appId = 'app-2'
    component.ngOnChanges({ appId: new SimpleChange('app-1', 'app-2', false) })
    await fixture.whenStable()

    expect(getAgents).toHaveBeenLastCalledWith({ appId: 'app-2' })
  })

  it('should clear a previous suggestion when the agent list is reloaded for a new appId', async () => {
    await createComponent()
    component.selectAction('translate')
    component.inputText = 'Hallo'
    await component.run()
    expect(component.hasSuggestion).toBe(true)

    component.appId = 'app-2'
    component.ngOnChanges({ appId: new SimpleChange('app-1', 'app-2', false) })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(component.hasSuggestion).toBe(false)
    expect(component.suggestion).toBe('')
  })

  it('should show a retryable timeout error when the agent lookup times out', async () => {
    getAgents.mockRejectedValueOnce(new AiProviderError('TIMEOUT', 'AI agent lookup timed out'))
    await createComponent()

    expect(component.loadState).toBe('error')
    expect(component.errorCode).toBe('TIMEOUT')
    expect(component.errorMessageKey).toBe('OCX_AI_ASSIST.ERRORS.TIMEOUT')
  })

  it('should not cache an empty agent list', async () => {
    getAgents.mockResolvedValueOnce([])
    await createComponent()
    expect(component.loadState).toBe('empty')

    await createComponent()

    expect(getAgents).toHaveBeenCalledTimes(2)
    expect(component.loadState).toBe('ready')
  })

  it('should treat a null or undefined inputText as an empty text', async () => {
    await createComponent(false)

    component.inputText = null as unknown as string
    expect(component.inputText).toBe('')
    expect(component.canRun).toBe(false)

    component.inputText = undefined as unknown as string
    expect(component.inputText).toBe('')
  })

  it('should keep the same actions array between change detection passes', async () => {
    await createComponent(false)

    expect(component.actions).toBe(component.actions)
  })

  it('should discard the result of a load that was superseded by a newer one', async () => {
    let resolveStale: (value: unknown) => void = () => undefined
    getAgents.mockImplementationOnce(() => new Promise((resolve) => (resolveStale = resolve)))
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    component.loadAgents()
    component.loadAgents(true)
    await fixture.whenStable()
    resolveStale([{ ...agent, id: 'stale-agent', name: 'Stale' }])
    await fixture.whenStable()

    expect(component.agents).toEqual([agent])
    expect(component.selectedAgentId).toBe('agent-1')
  })

  it.each([
    ['PROVIDER_ERROR', 'OCX_AI_ASSIST.ERRORS.PROVIDER'],
    ['RETRIES_EXHAUSTED', 'OCX_AI_ASSIST.ERRORS.PROVIDER'],
    ['TIMEOUT', 'OCX_AI_ASSIST.ERRORS.TIMEOUT'],
    ['NO_PROVIDER', 'OCX_AI_ASSIST.ERRORS.NO_PROVIDER'],
    ['NO_CONTEXT', 'OCX_AI_ASSIST.ERRORS.NO_CONTEXT'],
    ['SOMETHING_ELSE', 'OCX_AI_ASSIST.ERRORS.GENERIC'],
  ])('should map error code %s to %s', async (code, expectedKey) => {
    await createComponent()

    component.errorCode = code
    expect(component.errorMessageKey).toBe(expectedKey)
  })

  it('should recognize provider errors from another federated package copy', async () => {
    getCompletion.mockRejectedValueOnce({ name: 'AiProviderError', code: 'TIMEOUT' })
    await createComponent()
    component.selectAction('summarize')
    component.inputText = 'Long text'

    await component.run()

    expect(component.runState).toBe('error')
    expect(component.errorCode).toBe('TIMEOUT')
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
    await openPanel()

    expect(getAgents).toHaveBeenCalledWith({ appId: 'app-3' })
  })

  it('should close safely when no actions are offered', async () => {
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    component.defaultActions = []
    component.additionalActions = []
    fixture.detectChanges()
    await fixture.whenStable()
    await openPanel()

    expect(() => component.close()).not.toThrow()
    expect(component.open).toBe(false)
    expect(component.selectedActionId).toBeUndefined()
  })

  it('should return no text when there is no result yet', async () => {
    await createComponent()

    expect(component.resultText).toBeUndefined()
  })

  it('should load agents without an appId when the current MFE is empty', async () => {
    const appStateService = TestBed.inject(AppStateService) as unknown as { currentMfe$: unknown }
    appStateService.currentMfe$ = of(undefined)
    fixture = TestBed.createComponent(AiAssistComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    await fixture.whenStable()
    await openPanel()

    expect(getAgents).toHaveBeenCalledWith({ appId: undefined })
  })

  it('should clear parameter values when selecting an unknown action', async () => {
    await createComponent()
    component.selectAction('unknown-action')

    expect(component.parameterValues).toEqual({})
    expect(component.selectedAction).toBeUndefined()
  })
})
