import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { SearchConfigComponent } from './search-config.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateService } from '@ngx-translate/core'
import { MessageModule } from 'primeng/message'
import { MockAuthModule } from '../../../mock-auth/mock-auth.module'
import { SearchConfigPrimitive, SearchConfig } from '../../../model/search-config'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { SearchConfigHarness } from '../../../../../testing'
import { PrimeNgModule } from '../../primeng.module'
import { ReactiveFormsModule } from '@angular/forms'

describe('SearchConfigComponent', () => {
  let translateService: TranslateService
  let component: SearchConfigComponent
  let fixture: ComponentFixture<SearchConfigComponent>

  const searchConfigurations: Record<string, SearchConfigPrimitive>[] = [
    {
      name: 'test',
      startDate: undefined,
      endDate: undefined,
    },
    {
      name: 'example',
      startDate: new Date(2023, 0, 15, 12, 30, 45),
      endDate: new Date(2023, 0, 19, 12, 30, 45),
    },
  ]

  const searchConfigsEntries: SearchConfig[] = [
    {
      id: '01',
      name: 'Basic search config',
      version: 1,
      readonly: true,
      isAdvanced: true,
      values: searchConfigurations[0],
    },
    {
      id: '02',
      name: 'Adapted search config',
      version: 1,
      readonly: true,
      isAdvanced: true,
      values: searchConfigurations[1],
    },
  ]

  const emptySearchConfigEntry: SearchConfig[] = []

  const placeholderKey = 'OCX_SEARCH_HEADER.OCX_SEARCH_CONFIG.DROPDOWN_DEFAULT'

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchConfigComponent],
      imports: [
        NoopAnimationsModule,
        MessageModule,
        MockAuthModule,
        TranslateTestingModule.withTranslations({
          en: require('./../../../../../assets/i18n/en.json'),
          de: require('./../../../../../assets/i18n/de.json'),
        }),
        HttpClientTestingModule,
        PrimeNgModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          useValue: {
            baseHref: '/base/path',
            mountPath: '/base/path',
            remoteBaseUrl: 'http://localhost:4200',
            shellName: 'shell',
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SearchConfigComponent)
    component = fixture.componentInstance
    component.searchConfigs = searchConfigsEntries
    translateService = TestBed.inject(TranslateService)
    translateService.setDefaultLang('en')
    translateService.use('en')
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load the PDropdownHarness', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    expect(dropdown).toBeTruthy()
  })

  it('should open the dropdown', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    await dropdown?.open()
    expect(await dropdown?.isOpen()).toBeTruthy()
  })

  it('should display a dropdown with a hard coded search config', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    const items = await dropdown?.getDropdownItems()
    expect(items?.length).toEqual(searchConfigsEntries.length)
  })

  it('should display no dropdown if the search config is empty', async () => {
    component.searchConfigs = emptySearchConfigEntry
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    expect(dropdown).toBeFalsy()
  })

  it('should display the values in the fields after selecting the fist hard coded search config', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    const selectedDropdownItem = await dropdown?.selectedDropdownItemText(0)
    expect(selectedDropdownItem).toEqual(searchConfigsEntries[0].name)
  })

  it('should display the values in the fields after selecting the fist hard coded search config', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    const selectedDropdownItem = await dropdown?.selectedDropdownItemText(1)
    expect(selectedDropdownItem).toEqual(searchConfigsEntries[1].name)
  })

  it('should display the values in the fields correctly after selecting the fist search config and then selecting the second search config', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    let selectedDropdownItem = await dropdown?.selectedDropdownItemText(0)
    selectedDropdownItem = await dropdown?.selectedDropdownItemText(1)
    expect(selectedDropdownItem).toEqual(searchConfigsEntries[1].name)
  })

  it('should have the option to remove the selection', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    expect(await dropdown?.hasClearOption()).toBeTruthy()
  })

  it('should display the right default message', async () => {
    const searchConfigHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SearchConfigHarness)
    const dropdown = await searchConfigHarness.getSearchConfigDropdown()
    const definedDefaultKeyTranslation = translateService.instant(placeholderKey)
    expect(await dropdown?.getDefaultText()).toEqual(definedDefaultKeyTranslation)
  })
})
