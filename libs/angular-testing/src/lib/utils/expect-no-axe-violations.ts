import * as axe from 'axe-core'

/**
 * Axe rules that are enforced by {@link expectNoAxeViolations}. Only these rules run, which keeps the
 * unit test gate deterministic. Rules that need real layout or rendering (color-contrast, target-size,
 * scrollable-region-focusable) are not reliable in jsdom/happy-dom and are covered by the Storybook a11y check.
 */
export const ENFORCED_AXE_RULES: readonly string[] = [
  'button-name',
  'aria-allowed-attr',
  'aria-prohibited-attr',
  'label',
  'duplicate-id-aria',
  'aria-input-field-name',
  'aria-dialog-name',
  'heading-order',
  'label-content-name-mismatch',
]

export interface ExpectNoAxeViolationsOptions {
  /**
   * Rule ids that are known to be violated and tracked by a follow-up story. Violations of these rules are
   * ignored. Keep this list per test and remove an entry as soon as the corresponding fix has landed.
   */
  allow?: string[]
  /** Overrides the set of enforced rules. Defaults to {@link ENFORCED_AXE_RULES}. */
  rules?: string[]
}

export class AxeViolationsError extends Error {
  constructor(
    message: string,
    readonly violations: axe.Result[]
  ) {
    super(message)
    this.name = 'AxeViolationsError'
  }
}

function formatViolations(violations: axe.Result[]): string {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `    - ${node.target.join(' ')}\n      ${node.html.replace(/\s+/g, ' ').slice(0, 200)}`)
        .join('\n')
      return `[${violation.id}] ${violation.help} (${violation.impact ?? 'n/a'})\n${nodes}`
    })
    .join('\n\n')
}

/**
 * Runs axe-core on the given element and fails if a violation of an enforced rule is found.
 *
 * @param element element (or fixture native element) to check; it must be attached to the document
 * @param options allow-list of known violations and optional rule override
 *
 * @example
 * await expectNoAxeViolations(fixture.nativeElement)
 * await expectNoAxeViolations(fixture.nativeElement, { allow: ['button-name'] }) // tracked in #1234
 */
export async function expectNoAxeViolations(
  element: Element | Document,
  options: ExpectNoAxeViolationsOptions = {}
): Promise<void> {
  const allow = new Set(options.allow ?? [])
  const rules = (options.rules ?? [...ENFORCED_AXE_RULES]).filter((rule) => !allow.has(rule))
  if (rules.length === 0) {
    return
  }
  const runOnly = { type: 'rule' as const, values: rules }
  const results = await axe.run(element as axe.ElementContext, { runOnly, resultTypes: ['violations'] })
  if (results.violations.length > 0) {
    throw new AxeViolationsError(
      `Expected no axe violations, but found ${results.violations.length}:\n\n${formatViolations(results.violations)}`,
      results.violations
    )
  }
}
