import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core'
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
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AiAssistComponent implements OnInit, OnDestroy {
  /** Additional actions appended to the default Translate, Summarize and Generate actions. */
  @Input() customActions: AiAssistActionDefinition<unknown>[] = []
  /** Ids of default or custom actions that must not be offered. */
  @Input() disabledActionIds: string[] = []
  /** Application id used to load agents. Defaults to the appId of the current MFE. */
  @Input() appId?: string

  loadState: AiAssistLoadState = 'loading'
  agents: AiAgentResponse[] = []
  selectedAgentId?: string
  selectedActionId?: string
  parameterValues: Record<string, string> = {}
  inputText = ''
  runState: AiAssistRunState = 'idle'
  result?: unknown
  errorCode?: string

  private readonly agentService = new OneCXAiAgentService()
  private readonly completionService = new OneCXAiCompletionService()

  constructor(private readonly appStateService: AppStateService) {}

  ngOnInit(): void {
    this.loadAgents()
  }

  ngOnDestroy(): void {
    this.agentService.destroy()
    this.completionService.destroy()
  }

  get availableActions(): AiAssistActionDefinition<unknown>[] {
    const all: AiAssistActionDefinition<unknown>[] = [...DEFAULT_AI_ASSIST_ACTIONS, ...this.customActions]
    return all.filter((action) => !this.disabledActionIds.includes(action.id))
  }

  get selectedAction(): AiAssistActionDefinition<unknown> | undefined {
    return this.availableActions.find((action) => action.id === this.selectedActionId)
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

  get canRun(): boolean {
    return (
      this.runState !== 'running' &&
      !!this.selectedAction &&
      !!this.selectedAgent &&
      this.inputText.trim().length > 0
    )
  }

  get errorMessageKey(): string {
    return this.errorCode === 'NO_PROVIDER' ? 'OCX_AI_ASSIST.ERRORS.NO_PROVIDER' : 'OCX_AI_ASSIST.ERRORS.GENERIC'
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
      this.runState = 'success'
    } catch (error) {
      this.errorCode = isAiProviderError(error) ? error.code : UNKNOWN_ERROR_CODE
      this.runState = 'error'
    }
  }

  retry(): Promise<void> {
    return this.runState === 'error' ? this.run() : Promise.resolve()
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
    this.runState = 'idle'
    this.errorCode = undefined
  }
}
