import { z, type ZodType } from 'zod'

export interface AiAssistActionParameter {
  key: string
  labelKey: string
  defaultValue: string
}

export interface AiAssistActionDefinition<T = unknown> {
  id: string
  labelKey: string
  /** Builds the system instruction; receives the parameter values chosen by the user. */
  buildInstruction: (parameters: Record<string, string>) => string
  /** Human-readable description of the expected JSON shape, appended to the instruction. */
  outputDescription: string
  outputSchema: ZodType<T>
  parameters?: AiAssistActionParameter[]
}

export interface AiAssistTextResult {
  text: string
}

const textOutputSchema = z.object({ text: z.string() })

export const DEFAULT_AI_ASSIST_ACTIONS: AiAssistActionDefinition<AiAssistTextResult>[] = [
  {
    id: 'translate',
    labelKey: 'OCX_AI_ASSIST.ACTIONS.TRANSLATE',
    buildInstruction: (parameters) =>
      `Translate the user's text into the language with code "${parameters['targetLanguage'] ?? 'en'}". Keep the meaning and formatting.`,
    outputDescription: '{"text": string} containing the translated text',
    outputSchema: textOutputSchema,
    parameters: [{ key: 'targetLanguage', labelKey: 'OCX_AI_ASSIST.PARAMETERS.TARGET_LANGUAGE', defaultValue: 'en' }],
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

export type AiAssistLoadState = 'loading' | 'ready' | 'empty' | 'error'

export type AiAssistRunState = 'idle' | 'running' | 'success' | 'error'
