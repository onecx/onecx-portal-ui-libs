import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SelectModule } from '@openng/optimus-ui/select'
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { ColumnGroupSelectionComponent } from './column-group-selection.component'
import type { DataTableColumn } from '../../model/data-table-column.model'
import { DataViewStateService } from '../../services/data-view-state.service'

describe('ColumnGroupSelectionComponent selected group display', () => {
  let fixture: ComponentFixture<ColumnGroupSelectionComponent>

  const makeColumn = (id: string, predefinedGroupKeys?: string[]): DataTableColumn =>
    ({
      id,
      nameKey: `name-${id}`,
      predefinedGroupKeys,
    }) as DataTableColumn

  const selectedLabel = (): string => {
    const label = fixture.nativeElement.querySelector('.p-select-label') as HTMLElement
    expect(label).not.toBeNull()
    return (label.textContent ?? '').trim()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnGroupSelectionComponent],
      imports: [CommonModule, FormsModule, SelectModule, FloatLabelModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({}), DataViewStateService],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnGroupSelectionComponent)
  })

  describe('dropdown display', () => {
    it('given columns offering groups g1 and g2 and selectedGroupKey g2, when rendered, then the dropdown shows g2', async () => {
      fixture.componentRef.setInput('columns', [makeColumn('c1', ['g1', 'g2'])])
      fixture.componentRef.setInput('selectedGroupKey', 'g2')
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(selectedLabel()).toBe('g2')
    })

    it('given columns offering groups g1 and g2 and no selected group, when rendered, then the dropdown shows the placeholder', async () => {
      fixture.componentRef.setInput('columns', [makeColumn('c1', ['g1', 'g2'])])
      fixture.componentRef.setInput('placeholderKey', 'noGroupPlaceholder')
      fixture.detectChanges()
      await fixture.whenStable()
      fixture.detectChanges()

      expect(selectedLabel()).toBe('noGroupPlaceholder')
    })
  })
})
