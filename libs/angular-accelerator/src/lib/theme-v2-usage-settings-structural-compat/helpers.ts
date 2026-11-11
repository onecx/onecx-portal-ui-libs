/**
 * Shared helpers for structural-compatibility specs.
 *
 * These specs enforce a convention that cannot be captured by the type system: theme-usage
 * settings mappers live in `@onecx/angular-utils`, while the components that consume their
 * output live in `@onecx/angular-accelerator`. Because `angular-accelerator` depends on
 * `angular-utils` (not the reverse), a mapper's target type cannot be structurally derived from
 * the component's `input()` declarations without a circular library dependency. The two shapes
 * are therefore kept in sync by convention, and a rename on either side is silent at compile
 * time (the theme value is computed but never applied). These specs make that drift fail loudly
 * at runtime.
 */

/** The compilation metadata shape we read; `input()`-declared names surface under `ɵcmp.inputs`. */
type ComponentWithInputs = { readonly ɵcmp?: { readonly inputs?: Record<string, unknown> } }

/**
 * Reads the input names an Angular component declares, via its `ɵcmp` compilation metadata.
 * A component that declares no `input()` yields an empty list.
 */
export function declaredInputNames(component: ComponentWithInputs): string[] {
  return Object.keys(component.ɵcmp?.inputs ?? {})
}

/**
 * Asserts that every key a settings mapper writes is declared as an input on at least one of the
 * given components. A key that no component declares is dead — the mapper produces a value that
 * nothing reads — and a rename on the mapper or on a component's `input()` surfaces here.
 *
 * Intended to be called from a spec body so failures land on the caller's test.
 */
export function assertMapperTargetsCoverInputs(
  targetKeys: readonly string[],
  components: readonly ComponentWithInputs[],
): void {
  const declared = new Set(components.flatMap(declaredInputNames))
  const missing = targetKeys.filter((key) => !declared.has(key))
  // A non-empty `missing` means the mapper produced a value no component input reads (a rename
  // on either side) — `toEqual([])` surfaces exactly which keys drifted.
  expect(missing).toEqual([])
}
