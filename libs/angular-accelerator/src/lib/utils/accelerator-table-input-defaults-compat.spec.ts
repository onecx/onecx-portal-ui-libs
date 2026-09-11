import { mapAcceleratorTableSettings } from '@onecx/angular-utils'
import { DataTableComponent } from '../components/data-table/data-table.component'
import { DataViewComponent } from '../components/data-view/data-view.component'
import { InteractiveDataViewComponent } from '../components/interactive-data-view/interactive-data-view.component'

/**
 * Safeguard for `AcceleratorTableInputDefaults`, which lives in `@onecx/angular-utils` while the
 * consuming components live here in `@onecx/angular-accelerator`. Because `angular-accelerator`
 * depends on `angular-utils` (not the reverse), the defaults interface cannot structurally derive
 * from the component input types without a circular library dependency, so the two shapes are
 * kept in sync by convention. This test enforces that convention at runtime: the mapper's target
 * keys are checked against the input names each component actually declares, so a rename in either
 * place fails here.
 */
function declaredInputNames(component: { ɵcmp?: { inputs?: Record<string, unknown> } }): string[] {
  const inputs = component.ɵcmp?.inputs
  return inputs ? Object.keys(inputs) : []
}

const tableComponents = [DataTableComponent, DataViewComponent, InteractiveDataViewComponent] as const

describe('AcceleratorTableInputDefaults structural compatibility', () => {
  it('should only map settings to keys the table-family components declare as inputs', () => {
    const declaredInputNamesUnion = new Set<string>(
      tableComponents.flatMap((component) => declaredInputNames(component))
    )
    const missing = mapAcceleratorTableSettings.targetKeys.filter(
      (key) => !declaredInputNamesUnion.has(key)
    )

    expect(missing).toEqual([])
  })
})
