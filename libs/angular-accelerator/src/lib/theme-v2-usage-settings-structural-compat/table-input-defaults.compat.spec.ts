import { mapAcceleratorTableSettings } from '@onecx/angular-utils'
import { DataTableComponent } from '../components/data-table/data-table.component'
import { DataViewComponent } from '../components/data-view/data-view.component'
import { InteractiveDataViewComponent } from '../components/interactive-data-view/interactive-data-view.component'
import { assertMapperTargetsCoverInputs } from './index'

/**
 * `mapAcceleratorTableSettings` (in `@onecx/angular-utils`) writes the three table-family
 * settings, applied by these components when the matching `input()` isn't set. The mapper's
 * target type cannot be derived from the components' `input()` declarations without a circular
 * library dependency, so the keys are kept in sync by convention — and this spec catches a
 * rename on either side at runtime.
 *
 * To cover a new component/theme pair, import its mapper and component(s) and call
 * `assertMapperTargetsCoverInputs(mapper.targetKeys, [components...])` below.
 */
describe('AcceleratorTableInputDefaults structural compatibility', () => {
  it('should only map table settings to keys the table-family components declare as inputs', () => {
    assertMapperTargetsCoverInputs(mapAcceleratorTableSettings.targetKeys, [
      DataTableComponent,
      DataViewComponent,
      InteractiveDataViewComponent,
    ])
  })
})
