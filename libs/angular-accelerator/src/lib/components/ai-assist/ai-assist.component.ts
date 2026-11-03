import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AiAgentResponse,
  isAiProviderError,
  OneCXAiAgentService,
  OneCXAiCompletionService,
} from '@onecx/integration-interface'
import { take } from 'rxjs'
import {
  AiAssistActionDefinition,
  AiAssistLoadState,
  AiAssistRunState,
  AiAssistTextResult,
  DEFAULT_AI_ASSIST_ACTIONS,
} from './ai-assist.model'

const UNKNOWN_ERROR_CODE = 'UNKNOWN'

@Component({
  standalone: false,
  selector: 'ocx-ai-assist',
  templateUrl: './ai-assist.component.html',
  styleUrls: ['./ai-assist.component.scss'],
})
export class AiAssistComponent implements OnInit, OnDestroy {
  /** Actions offered by default. Hosts can replace the built-in Translate, Summarize and Generate set. */
  @Input() defaultActions: AiAssistActionDefinition<unknown>[] = DEFAULT_AI_ASSIST_ACTIONS
  /** Optional actions offered in addition to the default ones. */
  @Input() additionalActions: AiAssistActionDefinition<unknown>[] = []
  /** Application id used to load agents. Defaults to the appId of the current MFE. */
  @Input() appId?: string

  /** Text of the field the assistant works on. The result is offered back through replaceText. */
  @Input() inputText = ''
  /** Emits the accepted AI suggestion when the user chooses Replace text. */
  @Output() replaceText = new EventEmitter<string>()

  loadState: AiAssistLoadState = 'loading'
  open = false
  agents: AiAgentResponse[] = []
  selectedAgentId?: string
  selectedActionId?: string
  parameterValues: Record<string, string> = {}
  runState: AiAssistRunState = 'idle'
  result?: unknown
  suggestion = ''
  errorCode?: string

  private readonly agentService = new OneCXAiAgentService()
  private readonly completionService = new OneCXAiCompletionService()
  private readonly appStateService = inject(AppStateService)

  ngOnInit(): void {
    this.loadAgents()
  }

  ngOnDestroy(): void {
    this.agentService.destroy()
    this.completionService.destroy()
  }

  get actions(): AiAssistActionDefinition<unknown>[] {
    return [...this.defaultActions, ...this.additionalActions]
  }

  get selectedAction(): AiAssistActionDefinition<unknown> | undefined {
    return this.actions.find((action) => action.id === this.selectedActionId)
  }

  get selectedAgent(): AiAgentResponse | undefined {
    return this.agents.find((agent) => agent.id === this.selectedAgentId)
  }

  get resultText(): string | undefined {
    const text = (this.result as Partial<AiAssistTextResult> | undefined)?.text
    return typeof text === 'string' ? text : undefined
  }

  get resultJson(): string {
    return JSON.stringify(this.result, null, 2)
  }

  get isReviewReady(): boolean {
    return this.runState === 'success' && this.resultText !== undefined
  }

  get canRun(): boolean {
    return (
      this.runState !== 'running' && !!this.selectedAction && !!this.selectedAgent && this.inputText.trim().length > 0
    )
  }

  get errorMessageKey(): string {
    return this.errorCode === 'NO_PROVIDER' ? 'OCX_AI_ASSIST.ERRORS.NO_PROVIDER' : 'OCX_AI_ASSIST.ERRORS.GENERIC'
  }

  toggle(): void {
    this.open = !this.open
  }

  close(): void {
    this.open = false
  }

  initials(name: string | undefined): string {
    return (name ?? '')
      .split(/\s+/)
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }

  loadAgents(): void {
    this.loadState = 'loading'
    this.errorCode = undefined
    this.appStateService.currentMfe$.pipe(take(1)).subscribe({
      next: (mfe) => this.fetchAgents(this.appId ?? mfe?.appId),
      error: () => this.fetchAgents(this.appId),
    })
  }

  selectAgent(agentId: string | undefined): void {
    this.selectedAgentId = agentId
  }

  selectAction(actionId: string | undefined): void {
    this.selectedActionId = actionId
    this.parameterValues = {}
    for (const parameter of this.selectedAction?.parameters ?? []) {
      this.parameterValues[parameter.key] = parameter.defaultValue
    }
    this.resetResult()
  }

  async run(): Promise<void> {
    const action = this.selectedAction
    const agent = this.selectedAgent
    if (!action || !agent || this.inputText.trim().length === 0) {
      return
    }
    this.runState = 'running'
    this.errorCode = undefined
    this.result = undefined
    this.suggestion = ''
    const systemPrompt = [
      action.buildInstruction(this.parameterValues),
      `Respond only with JSON matching ${action.outputDescription}. Do not write anything outside the JSON.`,
    ].join('\n')
    try {
      this.result = await this.completionService.getCompletion({
        agentId: agent.id,
        agentName: agent.name,
        systemPrompt,
        aiContext: [],
        message: this.inputText,
        outputSchema: action.outputSchema,
      })
      this.suggestion = this.resultText ?? ''
      this.runState = 'success'
    } catch (error) {
      this.errorCode = isAiProviderError(error) ? error.code : UNKNOWN_ERROR_CODE
      this.runState = 'error'
    }
  }

  retry(): Promise<void> {
    return this.runState === 'error' ? this.run() : Promise.resolve()
  }

  tryAgain(): Promise<void> {
    return this.run()
  }

  replace(): void {
    this.replaceText.emit(this.suggestion)
    this.resetResult()
    this.open = false
  }

  private async fetchAgents(appId: string | undefined): Promise<void> {
    try {
      this.agents = await this.agentService.getAgents({ appId })
      this.selectedAgentId = this.agents[0]?.id
      this.loadState = this.agents.length > 0 ? 'ready' : 'empty'
    } catch (error) {
      this.agents = []
      this.errorCode = isAiProviderError(error) ? error.code : UNKNOWN_ERROR_CODE
      this.loadState = 'error'
    }
  }

  private resetResult(): void {
    this.result = undefined
    this.suggestion = ''
    this.runState = 'idle'
    this.errorCode = undefined
  }
}
