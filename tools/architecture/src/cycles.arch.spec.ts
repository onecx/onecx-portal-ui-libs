import { dependencyGraph, findCycleGroups } from './dependency-graph'
import { libraries } from './workspace'

/**
 * Import cycles that existed when the architecture tests were introduced, per library (paths relative to libs/<lib>/).
 * Each entry is one group of files that import each other (strongly connected component), libraries not listed here
 * must not have any cycle.
 *
 * The list may only shrink: a new cycle or a file joining a group fails the test. When you break up a cycle, remove the
 * group here, the test fails until the baseline is tightened.
 */
const knownCycles: Record<string, string[][]> = {
  'angular-accelerator': [
    ['src/lib/components/page-header/page-header.component.ts', 'src/lib/utils/action-router.utils.ts'],
    [
      'src/lib/components/data-list-grid/data-list-grid.component.ts',
      'src/lib/components/data-sort-base/data-sort-base.ts',
      'src/lib/components/data-table/data-table.component.ts',
      'src/lib/model/data-table-row-grouping.model.ts',
      'src/lib/model/row-list-grid-data.model.ts',
      'src/lib/model/view-layout.model.ts',
      'src/lib/services/data-view-state.service.ts',
      'src/lib/utils/row-grouping-planner.ts',
    ],
    [
      'src/lib/components/dialog/dialog-content/dialog-content.component.ts',
      'src/lib/components/dialog/dialog-footer/dialog-footer.component.ts',
      'src/lib/model/button-dialog.ts',
      'src/lib/services/portal-dialog.service.ts',
    ],
  ],
  'angular-utils': [
    ['src/lib/utils/has-permission-checker-factory.ts', 'src/lib/utils/has-permission-checker.ts'],
    // The utils import '../index', which re-exports them.
    [
      'style/src/index.ts',
      'style/src/utils/app-styles-lifecycle.utils.ts',
      'style/src/utils/app-styles-scope.utils.ts',
      'style/src/utils/app-styles-usage.utils.ts',
      'style/src/utils/dom-style.utils.ts',
    ],
    [
      'theme/optimus/src/services/custom-use-style.service.ts',
      'theme/optimus/src/services/theme-config.service.ts',
      'theme/optimus/src/utils/application-config.ts',
    ],
  ],
  'angular-webcomponents': [
    ['src/lib/utils/webcomponent-bootstrap.utils.ts', 'src/lib/utils/webcomponent-connector.utils.ts'],
  ],
}

const normalize = (groups: string[][]) =>
  groups.map((group) => [...group].sort()).sort((a, b) => a[0].localeCompare(b[0]))

// ArchUnitTS haveNoCycles() only follows import declarations (no `export ... from`, which is how barrel cycles form) and
// enumerates every single cycle, which does not terminate for angular-accelerator. Compare the groups of cyclic files
// of the complete dependency graph against the baseline instead.
describe('Import cycles', () => {
  it.each(libraries)('should not have new import cycles: %s', (lib) => {
    const prefix = `libs/${lib}/`
    const edges = [...dependencyGraph()]
      .filter(([file]) => file.startsWith(prefix))
      .flatMap(([source, { files }]) =>
        files.filter((target) => target.startsWith(prefix)).map((target) => ({ source, target }))
      )
    const groups = findCycleGroups(edges).map((group) => group.map((file) => file.slice(prefix.length)))

    expect(normalize(groups)).toEqual(normalize(knownCycles[lib] ?? []))
  })
})
