import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { TranslateService } from '@ngx-translate/core'
import 'jest-canvas-mock'
import { provideTranslateTestingService } from '../../../../testing'
import { AngularAcceleratorModule } from '../../angular-accelerator.module'
import { OcxTooltipDirective } from '../../directives/tooltip.directive'
import { ColumnType } from '../../model/column-type.model'
import { DiagramComponent } from '../diagram/diagram.component'
import { GroupByCountDiagramComponent } from './group-by-count-diagram.component'

describe('GroupByCountDiagramComponent wiring', () => {
  let fixture: ComponentFixture<GroupByCountDiagramComponent>
  let translateService: TranslateService

  const sourceData = [{ testNumber: 'test0' }, { testNumber: 'test1' }]

  const inputColumn = { columnType: ColumnType.STRING, id: 'testNumber' }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupByCountDiagramComponent, DiagramComponent],
      imports: [AngularAcceleratorModule, OcxTooltipDirective],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideTranslateTestingService({
          en: require('./../../../../assets/i18n/en.json'),
          de: require('./../../../../assets/i18n/de.json'),
        }),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(GroupByCountDiagramComponent)
    fixture.componentRef.setInput('data', sourceData)
    fixture.componentRef.setInput('column', inputColumn)
    fixture.componentRef.setInput('sumKey', 'Total')

    translateService = TestBed.inject(TranslateService)
    translateService.setFallbackLang('en')
    translateService.use('en')

    fixture.detectChanges()
    fixture.detectChanges()
  })

  it('given an ocx-group-by-count-diagram, when the embedded diagram emits dataSelected, then the component emits dataSelected with the same value', () => {
    const component = fixture.componentInstance
    let selectedValue: number | undefined

    component.dataSelected.subscribe((value) => (selectedValue = value))

    fixture.debugElement.query(By.css('p-chart')).triggerEventHandler('onDataSelect', [{}, {}])

    expect(selectedValue).toBe(2)
  })

  it('given an ocx-group-by-count-diagram with customLegends enabled, when the pie diagram renders, then the embedded diagram shows the custom legend', () => {
    fixture.componentRef.setInput('customLegends', true)
    fixture.detectChanges()
    fixture.detectChanges()

    const customLegend = fixture.nativeElement.querySelector('.custom-legends-container')

    expect(customLegend).not.toBeNull()
    expect(customLegend.textContent).toContain('test0')
    expect(customLegend.textContent).toContain('test1')
  })
})
