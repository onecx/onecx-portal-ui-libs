import { CommonModule } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { TranslateModule } from '@ngx-translate/core'
import { provideTranslateTestingService } from '@onecx/angular-testing'
import { ColumnType } from '../../model/column-type.model'
import { DataTableColumn } from '../../model/data-table-column.model'
import { AngularAcceleratorPrimeNgModule } from '../../angular-accelerator-primeng.module'
import { Select } from 'primeng/select'
import { ColumnGroupSelectionComponent } from './column-group-selection.component'

describe('ColumnGroupSelectionComponent', () => {
  let component: ColumnGroupSelectionComponent
  let fixture: ComponentFixture<ColumnGroupSelectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColumnGroupSelectionComponent],
      // CommonModule provides the AsyncPipe used by the template's `(allGroupKeys$ | async)`.
      imports: [CommonModule, AngularAcceleratorPrimeNgModule, FormsModule, TranslateModule.forRoot()],
      providers: [provideTranslateTestingService({})],
    }).compileComponents()

    fixture = TestBed.createComponent(ColumnGroupSelectionComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    component.columns = []
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should NOT autofocus the group selection p-select when rendered', () => {
    // Supply a column with predefinedGroupKeys so allGroupKeys$ emits non-empty
    // and the @if guard renders the <p-select>.
    const column: DataTableColumn = {
      columnType: ColumnType.STRING,
      nameKey: 'GROUP_A_COLUMN',
      id: 'col-1',
      predefinedGroupKeys: ['GROUP_A'],
    }
    component.columns = [column]
    fixture.detectChanges()

    // PrimeNG's Select exposes autofocus as an @Input (NOT a host attribute) with a
    // booleanAttribute transform, so the static attribute autofocus="false" is coerced
    // to the boolean false and verified on the Select component instance.
    const pSelect = fixture.debugElement.query(By.css('p-select'))
    expect(pSelect).toBeTruthy()
    const select = pSelect.componentInstance as Select
    expect(select.autofocus).toBe(false)
  })
})
