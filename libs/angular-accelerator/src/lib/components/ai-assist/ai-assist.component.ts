import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import {
  AiAgentResponse,
  AiProviderError,
  isAiProviderError,
  OneCXAiAgentService,
  OneCXAiCompletionService,
} from '@onecx/integration-interface'
import { take, timeout } from 'rxjs'
import {
  AiAssistActionDefinition,
  AiAssistLoadState,
  AiAssistRunState,
  AiAssistTextResult,
  DEFAULT_AI_ASSIST_ACTIONS,
} from './ai-assist.model'

const UNKNOWN_ERROR_CODE = 'UNKNOWN'
const NO_CONTEXT_ERROR_CODE = 'NO_CONTEXT'
const MFE_CONTEXT_TIMEOUT_MS = 5000
const AGENT_CACHE_TTL_MS = 60000
const AGENT_LOOKUP_TIMEOUT_MS = 15000

const agentCache = new Map<string, { agents: Promise<AiAgentResponse[]>; expiresAt: number }>()
let sharedAgentService: OneCXAiAgentService | undefined

export function resetAiAssistAgentCache(): void {
  agentCache.clear()
}

function getSharedAgentService(): OneCXAiAgentService {
  sharedAgentService ??= new OneCXAiAgentService()
  return sharedAgentService
}

/**
 * Returns the agents for `appId` from a cache shared by all instances on the page. Concurrent callers share one
 * request, failed requests are not cached, and `force` bypasses a cached result.
 */
function getAgentsCached(appId: string | undefined, force: boolean): Promise<AiAgentResponse[]> {
  const key = appId ?? ''
  const cached = agentCache.get(key)
  if (!force && cached && cached.expiresAt > Date.now()) {
    return cached.agents
  }
  const agents = withTimeout(getSharedAgentService().getAgents({ appId }), AGENT_LOOKUP_TIMEOUT_MS)
  const entry = { agents, expiresAt: Date.now() + AGENT_CACHE_TTL_MS }
  agentCache.set(key, entry)
  const discard = (): void => {
    if (agentCache.get(key) === entry) {
      agentCache.delete(key)
    }
  }
  agents.then((list) => {
    if (list.length === 0) {
      discard()
    }
  }, discard)
  return agents
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const expired = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new AiProviderError('TIMEOUT', 'AI agent lookup timed out')), ms)
  })
  return Promise.race([promise, expired]).finally(() => clearTimeout(timer))
}

let instanceCount = 0

/**
 * Inline AI assistant for a text field.
 *
 * Renders a toggle button that opens a panel where the user picks an AI agent and an action
 * (Translate, Summarize, Generate, or a host-defined action), runs it on `inputText` and reviews
 * the suggestion. The suggestion is applied only when the user chooses Replace text, which emits
 * it through `replaceText`.
 *
 * Agents are loaded for `appId`, or for the current MFE when `appId` is not set. When no agent is
 * available, the panel shows an empty state and the action cannot run.
 *
 * @example
 * ```html
 * <ocx-ai-assist [inputText]="description" (replaceText)="description = $event"></ocx-ai-assist>
 * ```
 */
@Component({
  standalone: false,
  selector: 'ocx-ai-assist',
  templateUrl: './ai-assist.component.html',
  styleUrls: ['./ai-assist.component.scss'],
})
export class AiAssistComponent implements OnChanges, OnInit, OnDestroy {
  /** Actions offered by default. Hosts can replace the built-in Translate, Summarize and Generate set. */
  @Input() defaultActions: AiAssistActionDefinition<unknown>[] = DEFAULT_AI_ASSIST_ACTIONS
  /** Optional actions offered in addition to the default ones. */
  @Input() additionalActions: AiAssistActionDefinition<unknown>[] = []
  /** Application id used to load agents. Defaults to the appId of the current MFE. */
  @Input() appId?: string

  /** Text of the field the assistant works on. The result is offered back through replaceText. */
  @Input()
  set inputText(value: string | null | undefined) {
    this.inputTextValue = value ?? ''
  }
  get inputText(): string {
    return this.inputTextValue
  }
  /** Emits the accepted AI suggestion when the user chooses Replace text. */
  @Output() replaceText = new EventEmitter<string>()

  /** State of the agent list: `loading`, `ready`, `empty`, or `error`. */
  loadState: AiAssistLoadState = 'loading'
  /** Whether the assistant panel is visible. */
  open = false
  agents: AiAgentResponse[] = []
  selectedAgentId?: string
  selectedActionId?: string
  parameterValues: Record<string, string> = {}
  /** State of the current run: `idle`, `running`, `success`, or `error`. */
  runState: AiAssistRunState = 'idle'
  /** Raw result returned by the completion service for the last successful run. */
  result?: unknown
  /** Text offered for replacement. Empty until a run produces a suggestion. */
  suggestion = ''
  /** Whether the last successful run produced a suggestion that can be reviewed. */
  hasSuggestion = false
  /** Error code of the last failed request, such as `NO_PROVIDER` or `AGENT_NOT_FOUND`. */
  errorCode?: string

  /** Prefix of the element ids in this instance, so several assistants can share a page. */
  readonly uid = `ocx-ai-assist-${++instanceCount}`

  private completionService?: OneCXAiCompletionService
  private inputTextValue = ''
  private readonly appStateService = inject(AppStateService)
  // Incremented whenever the action, agent, or result is reset, so a late completion can detect it is stale.
  private runCounter = 0
  private agentsLoadCounter = 0
  private agentsRequested = false
  private actionsCache?: { defaults: unknown; additions: unknown; actions: AiAssistActionDefinition<unknown>[] }

  ngOnInit(): void {
    this.selectAction(this.actions[0]?.id)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appId'] && !changes['appId'].firstChange && this.agentsRequested) {
      this.loadAgents()
    }
  }

  ngOnDestroy(): void {
    this.runCounter++
    this.agentsLoadCounter++
    this.completionService?.destroy()
  }

  private getCompletionService(): OneCXAiCompletionService {
    this.completionService ??= new OneCXAiCompletionService()
    return this.completionService
  }

  /** All offered actions: `defaultActions` followed by `additionalActions`. */
  get actions(): AiAssistActionDefinition<unknown>[] {
    const cache = this.actionsCache
    if (cache?.defaults === this.defaultActions && cache.additions === this.additionalActions) {
      return cache.actions
    }
    const actions = [...this.defaultActions, ...this.additionalActions]
    this.actionsCache = { defaults: this.defaultActions, additions: this.additionalActions, actions }
    return actions
  }

  get selectedAction(): AiAssistActionDefinition<unknown> | undefined {
    return this.actions.find((action) => action.id === this.selectedActionId)
  }

  get selectedAgent(): AiAgentResponse | undefined {
    return this.agents.find((agent) => agent.id === this.selectedAgentId)
  }

  /** Text of the current suggestion, or `undefined` when there is none to review. */
  get resultText(): string | undefined {
    return this.hasSuggestion ? this.suggestion : undefined
  }

  get isReviewReady(): boolean {
    return this.runState === 'success' && this.hasSuggestion
  }

  get canRun(): boolean {
    return (
      this.runState !== 'running' && !!this.selectedAction && !!this.selectedAgent && this.inputText.trim().length > 0
    )
  }

  get errorMessageKey(): string {
    switch (this.errorCode) {
      case 'NO_PROVIDER':
        return 'OCX_AI_ASSIST.ERRORS.NO_PROVIDER'
      case 'AGENT_NOT_FOUND':
        return 'OCX_AI_ASSIST.ERRORS.AGENT_NOT_FOUND'
      case NO_CONTEXT_ERROR_CODE:
        return 'OCX_AI_ASSIST.ERRORS.NO_CONTEXT'
      case 'TIMEOUT':
        return 'OCX_AI_ASSIST.ERRORS.TIMEOUT'
      case 'PROVIDER_ERROR':
      case 'RETRIES_EXHAUSTED':
        return 'OCX_AI_ASSIST.ERRORS.PROVIDER'
      default:
        return 'OCX_AI_ASSIST.ERRORS.GENERIC'
    }
  }

  /**
   * Opens the panel if it is closed, and closes it if it is open.
   */
  toggle(): void {
    this.open = !this.open
    if (this.open && !this.agentsRequested) {
      this.loadAgents()
    }
  }

  /** Closes the panel and resets the action and agent selection to the first options. */
  close(): void {
    this.open = false
    this.selectAction(this.actions[0]?.id)
    this.selectAgent(this.agents[0]?.id)
  }

  /** Returns up to two uppercase initials of a name, used for the agent avatar. */
  initials(name: string | undefined): string {
    return (name ?? '')
      .split(/\s+/)
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }

  /** Reloads the agent list for `appId`, or for the current MFE when `appId` is not set. */
  loadAgents(force = false): void {
    this.agentsRequested = true
    this.loadState = 'loading'
    const loadId = ++this.agentsLoadCounter
    if (this.appId) {
      void this.fetchAgents(this.appId, force, loadId)
      return
    }
    // The current MFE topic emits only after the shell initialises it. Without a result in time, the panel
    // shows a retryable error instead of staying in the loading state.
    this.appStateService.currentMfe$.pipe(take(1), timeout(MFE_CONTEXT_TIMEOUT_MS)).subscribe({
      next: (mfe) => void this.fetchAgents(mfe?.appId, force, loadId),
      error: () => {
        if (loadId !== this.agentsLoadCounter) {
          return
        }
        this.agents = []
        this.errorCode = NO_CONTEXT_ERROR_CODE
        this.loadState = 'error'
      },
    })
  }

  /** Selects the agent used for the next run. Clears any previous result. */
  selectAgent(agentId: string | undefined): void {
    this.selectedAgentId = agentId
    this.resetResult()
  }

  /** Selects the action, resets its parameters to their defaults and clears any previous result. */
  selectAction(actionId: string | undefined): void {
    this.selectedActionId = actionId
    this.parameterValues = {}
    for (const parameter of this.selectedAction?.parameters ?? []) {
      this.parameterValues[parameter.key] = parameter.defaultValue
    }
    this.resetResult()
  }

  /**
   * Runs the selected action with the selected agent on `inputText`.
   * Does nothing when no action or agent is selected, or when `inputText` is blank.
   * A run whose selection was changed while it was in flight is discarded.
   */
  async run(): Promise<void> {
    const action = this.selectedAction
    const agent = this.selectedAgent
    if (!action || !agent || this.inputText.trim().length === 0) {
      return
    }
    const runId = ++this.runCounter
    this.runState = 'running'
    this.errorCode = undefined
    this.result = undefined
    this.suggestion = ''
    this.hasSuggestion = false
    const systemPrompt = [
      action.buildInstruction(this.parameterValues),
      `Respond only with JSON matching ${action.outputDescription}. Do not write anything outside the JSON.`,
    ].join('\n')
    try {
      const result = await this.getCompletionService().getCompletion({
        agentId: agent.id,
        agentName: agent.name,
        systemPrompt,
        aiContext: [],
        message: this.inputText,
        outputSchema: action.outputSchema,
      })
      if (runId !== this.runCounter) {
        return
      }
      this.result = result
      const suggestion = this.toSuggestionText(action, result)
      this.suggestion = suggestion ?? ''
      this.hasSuggestion = suggestion !== undefined
      this.runState = 'success'
    } catch (error) {
      if (runId !== this.runCounter) {
        return
      }
      this.errorCode = isAiProviderError(error) ? error.code : UNKNOWN_ERROR_CODE
      this.runState = 'error'
    }
  }

  /** Runs again after a failed run. Does nothing in other states. */
  retry(): Promise<void> {
    return this.runState === 'error' ? this.run() : Promise.resolve()
  }

  /** Runs again from the review state with the current selection and input. */
  tryAgain(): Promise<void> {
    return this.run()
  }

  /** Returns from the review state to the selection state, keeping the chosen action and agent. */
  editSettings(): void {
    this.resetResult()
  }

  /** Emits `suggestion` through `replaceText`, clears the result and closes the panel. */
  replace(): void {
    if (this.suggestion.trim().length === 0) {
      return
    }
    this.replaceText.emit(this.suggestion)
    this.resetResult()
    this.open = false
  }

  private async fetchAgents(appId: string | undefined, force: boolean, loadId: number): Promise<void> {
    try {
      const agents = await getAgentsCached(appId, force)
      if (loadId !== this.agentsLoadCounter) {
        return
      }
      this.agents = agents
      this.selectAgent(this.agents[0]?.id)
      this.loadState = this.agents.length > 0 ? 'ready' : 'empty'
    } catch (error) {
      if (loadId !== this.agentsLoadCounter) {
        return
      }
      this.agents = []
      this.errorCode = isAiProviderError(error) ? error.code : UNKNOWN_ERROR_CODE
      this.loadState = 'error'
    }
  }

  private resetResult(): void {
    this.runCounter++
    this.result = undefined
    this.suggestion = ''
    this.hasSuggestion = false
    this.runState = 'idle'
    this.errorCode = undefined
  }

  /** Uses the action's `toSuggestion`, or the `text` field of a text result. */
  private toSuggestionText(action: AiAssistActionDefinition<unknown>, result: unknown): string | undefined {
    if (action.toSuggestion) {
      return action.toSuggestion(result)
    }
    const text = (result as Partial<AiAssistTextResult> | undefined)?.text
    return typeof text === 'string' ? text : undefined
  }
}
