import { DEFAULT_AI_ASSIST_ACTIONS } from './ai-assist.model'

describe('DEFAULT_AI_ASSIST_ACTIONS', () => {
  const [translate, summarize, generate] = DEFAULT_AI_ASSIST_ACTIONS

  it('should define translate, summarize and generate actions', () => {
    expect(DEFAULT_AI_ASSIST_ACTIONS.map((action) => action.id)).toEqual(['translate', 'summarize', 'generate'])
  })

  it('should build the translate instruction with the chosen target language', () => {
    expect(translate.buildInstruction({ targetLanguage: 'de' })).toContain('"de"')
  })

  it('should fall back to English when the translate target language is missing', () => {
    expect(translate.buildInstruction({})).toContain('"en"')
  })

  it('should expose the target language parameter with its default value', () => {
    expect(translate.parameters).toEqual([
      { key: 'targetLanguage', labelKey: 'OCX_AI_ASSIST.PARAMETERS.TARGET_LANGUAGE', defaultValue: 'en' },
    ])
  })

  it('should build the summarize instruction', () => {
    expect(summarize.buildInstruction({})).toContain('Summarize')
    expect(summarize.parameters).toBeUndefined()
  })

  it('should build the generate instruction', () => {
    expect(generate.buildInstruction({})).toContain('Generate')
    expect(generate.parameters).toBeUndefined()
  })

  it('should accept a text output and reject a missing text field for every action', () => {
    for (const action of DEFAULT_AI_ASSIST_ACTIONS) {
      expect(action.outputSchema.safeParse({ text: 'result' }).success).toBe(true)
      expect(action.outputSchema.safeParse({}).success).toBe(false)
    }
  })
})
