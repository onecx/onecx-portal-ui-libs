import { z, type ZodType } from 'zod'

/** A selectable option of an action parameter. */
export interface AiAssistParameterOption {
  value: string
  label: string
}

/** A user-adjustable input of an action, such as the target language for Translate. */
export interface AiAssistActionParameter {
  key: string
  labelKey: string
  defaultValue: string
  /** When set, the parameter is chosen from these options instead of typed. */
  options?: AiAssistParameterOption[]
}

/**
 * Describes an action offered by `ocx-ai-assist`. Hosts can pass custom actions through the
 * `defaultActions` or `additionalActions` inputs.
 *
 * @example
 * ```ts
 * const shorten: AiAssistActionDefinition<{ text: string }> = {
 *   id: 'shorten',
 *   labelKey: 'MY_APP.AI.SHORTEN',
 *   buildInstruction: () => 'Shorten the user text without losing its meaning.',
 *   outputDescription: '{"text": string} containing the shortened text',
 *   outputSchema: z.object({ text: z.string() }),
 * }
 * ```
 */
export interface AiAssistActionDefinition<T = unknown> {
  /** Unique id of the action. */
  id: string
  /** Translation key of the action label. */
  labelKey: string
  /** Builds the system instruction; receives the parameter values chosen by the user. */
  buildInstruction: (parameters: Record<string, string>) => string
  /** Human-readable description of the expected JSON shape, appended to the instruction. */
  outputDescription: string
  /** Zod schema that validates the JSON returned by the agent. */
  outputSchema: ZodType<T>
  /** Optional user-adjustable parameters shown before the action runs. */
  parameters?: AiAssistActionParameter[]
}

/** Result shape of the built-in actions: a single text value. */
export interface AiAssistTextResult {
  text: string
}

const textOutputSchema = z.object({ text: z.string() })

/** Built-in actions: Translate, Summarize and Generate. */
export const DEFAULT_AI_ASSIST_ACTIONS: AiAssistActionDefinition<AiAssistTextResult>[] = [
  {
    id: 'translate',
    labelKey: 'OCX_AI_ASSIST.ACTIONS.TRANSLATE',
    buildInstruction: (parameters) =>
      `Translate the user's text into the language with code "${parameters['targetLanguage'] ?? 'en'}". Keep the meaning and formatting.`,
    outputDescription: '{"text": string} containing the translated text',
    outputSchema: textOutputSchema,
    parameters: [
      {
        key: 'targetLanguage',
        labelKey: 'OCX_AI_ASSIST.PARAMETERS.TARGET_LANGUAGE',
        defaultValue: 'en',
        options: [
          { value: 'en', label: 'English' },
          { value: 'de', label: 'German' },
          { value: 'pl', label: 'Polish' },
          { value: 'fr', label: 'French' },
          { value: 'es', label: 'Spanish' },
          { value: 'it', label: 'Italian' },
        ],
      },
    ],
  },
  {
    id: 'summarize',
    labelKey: 'OCX_AI_ASSIST.ACTIONS.SUMMARIZE',
    buildInstruction: () => 'Summarize the user text in a few concise sentences.',
    outputDescription: '{"text": string} containing the summary',
    outputSchema: textOutputSchema,
  },
  {
    id: 'generate',
    labelKey: 'OCX_AI_ASSIST.ACTIONS.GENERATE',
    buildInstruction: () => 'Generate new content based on the user text, following its intent.',
    outputDescription: '{"text": string} containing the generated text',
    outputSchema: textOutputSchema,
  },
]

/** Loading state of the agent list shown in the panel. */
export type AiAssistLoadState = 'loading' | 'ready' | 'empty' | 'error'

/** State of a single run: `running` while the request is in flight, `success` or `error` after it. */
export type AiAssistRunState = 'idle' | 'running' | 'success' | 'error'
