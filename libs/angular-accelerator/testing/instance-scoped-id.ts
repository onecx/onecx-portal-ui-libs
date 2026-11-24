/**
 * Matches an element id of an OneCX component regardless of the instance suffix.
 * The first instance of a component on a page keeps the legacy id (e.g. `searchButton`), further instances
 * get a suffix (`searchButton-1`, `searchButton-2`, ...) so that ids stay unique per page.
 *
 * @param id legacy id of the element
 * @returns a pattern matching the legacy id and its instance-scoped variants
 *
 * @example
 * PButtonHarness.with({ id: instanceScopedId('searchButton') })
 */
export function instanceScopedId(id: string): RegExp {
  return new RegExp(`^${id.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)}(-\\d+)?$`)
}

/**
 * CSS selector for an element id of an OneCX component regardless of the instance suffix.
 *
 * @param id legacy id of the element
 * @returns a selector matching `#<id>` and `[id^="<id>-"]`
 */
export function instanceScopedIdSelector(id: string): string {
  return `[id="${id}"], [id^="${id}-"]`
}

/** Attributes whose value is a list of element ids. */
const ID_REFERENCE_ATTRIBUTES = [
  'for',
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant',
  'aria-errormessage',
  'aria-details',
  'aria-flowto',
]

/** Axe rules that check id uniqueness and id references (`duplicate-id` is deprecated in axe but still runnable). */
export const INSTANCE_ID_AXE_RULES: readonly string[] = ['duplicate-id', 'duplicate-id-aria', 'aria-valid-attr-value']

/**
 * Asserts that several instances of a component on one page keep their id associations:
 * no id is used by more than one instance, and no `for`/`aria-*` id reference of an instance points at an element
 * of another instance. References to elements outside all instances (e.g. overlays appended to the body) are not
 * checked here; `aria-valid-attr-value` of {@link INSTANCE_ID_AXE_RULES} reports references that do not resolve.
 *
 * @param roots the root element of every instance (e.g. `fixture.nativeElement` of each fixture)
 * @throws Error listing the duplicated ids and the references that point into another instance
 */
export function expectInstanceScopedIds(roots: Element[]): void {
  const owner = new Map<string, number>()
  const problems: string[] = []
  roots.forEach((root, index) => {
    for (const element of Array.from(root.querySelectorAll('[id]'))) {
      const id = element.id
      const first = owner.get(id)
      if (first === undefined) {
        owner.set(id, index)
      } else if (first !== index) {
        problems.push(`id "${id}" is used by instance ${first} and instance ${index}`)
      }
    }
    for (const attribute of ID_REFERENCE_ATTRIBUTES) {
      for (const element of Array.from(root.querySelectorAll(`[${attribute}]`))) {
        for (const id of (element.getAttribute(attribute) ?? '').split(/\s+/).filter(Boolean)) {
          const resolvesInOtherInstance = roots.some((other) => other !== root && other.querySelector(`[id="${id}"]`))
          if (resolvesInOtherInstance && !root.querySelector(`[id="${id}"]`)) {
            problems.push(`${attribute}="${id}" of instance ${index} points into another instance`)
          }
        }
      }
    }
  })
  if (problems.length > 0) {
    throw new Error(`Instance-scoped id check failed:\n${problems.join('\n')}`)
  }
}
