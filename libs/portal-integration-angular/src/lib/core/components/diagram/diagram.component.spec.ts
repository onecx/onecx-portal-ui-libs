import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DiagramComponent } from './diagram.component'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ChartModule } from 'primeng/chart'
import { MessageModule } from 'primeng/message'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { MFE_INFO } from '../../../api/injection-tokens'

describe('DiagramComponent', () => {
  let component: DiagramComponent
  let fixture: ComponentFixture<DiagramComponent>

  const definedSumKey = 'Total'

  // Use the power of 2 (2^n) to identify the error of a possibly failed test more quickly
  const diagramData: { label: string; value: number }[] = [
    { label: 'test0', value: 1 },
    { label: 'test1', value: 2 },
    { label: 'test2', value: 4 },
    { label: 'test3', value: 8 },
    { label: 'test4', value: 16 },
    { label: 'test5', value: 32 },
    { label: 'test6', value: 64 },
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagramComponent],
      imports: [
        NoopAnimationsModule,
        ChartModule,
        MessageModule,
        MockAuthModule,
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: MFE_INFO,
          useValue: {
            baseHref: '/base/path',
            mountPath: '/base/path',
            remoteBaseUrl: 'http://localhost:4200',
            shellName: 'shell',
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(DiagramComponent)
    component = fixture.componentInstance

    component.data = diagramData
    component.sumKey = definedSumKey
  })

  it('should create the diagram component', async () => {
    expect(component).toBeTruthy()
  })

  it('should display the sumkey', async () => {
    expect(definedSumKey).toEqual(component.sumKey)
  })
  it('should display the diagramData', async () => {
    expect(diagramData).toEqual(component.data)
  })

  it('should display the amountOfData on the diagram component', async () => {
    fixture.detectChanges()
    const numberOfResults = diagramData.reduce((acc: any, current: any) => acc + current.value, 0)
    expect(numberOfResults).toEqual(component.amountOfData)
  })
})
