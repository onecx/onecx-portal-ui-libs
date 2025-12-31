/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { Subject } from 'rxjs'

import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { AnnouncementBannerComponent } from './announcement-banner.component'
import { AnnouncementsApiService } from '../../../services/announcements-api.service'
import { AnnouncementItem, AnnouncementPriorityType } from '../../../model/announcement-item'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('AnnouncementBannerComponent', () => {
  let component: AnnouncementBannerComponent
  let fixture: ComponentFixture<AnnouncementBannerComponent>
  let announcementsApiService: AnnouncementsApiService
  const getAnnouncementByIdMock = new Subject<AnnouncementItem>()
  const getAnnouncementsMock = new Subject<Array<AnnouncementItem>>()

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AnnouncementBannerComponent],
      imports: [],
      providers: [
        ConfigurationService,
        AnnouncementsApiService,
        AppStateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents()

    const appStateService = getTestBed().inject(AppStateService)
    await appStateService.currentPortal$.publish({
      id: 'i-am-test-portal',
      portalName: 'test',
      workspaceName: 'test',
      baseUrl: '',
      microfrontendRegistrations: [],
    })

    announcementsApiService = getTestBed().inject(AnnouncementsApiService)
    jest.spyOn(announcementsApiService, 'getAnnouncementById').mockReturnValue(getAnnouncementByIdMock)
    jest.spyOn(announcementsApiService, 'getAnnouncements').mockReturnValue(getAnnouncementsMock)

    fixture = TestBed.createComponent(AnnouncementBannerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should request announcement for portal', () => {
    getAnnouncementsMock.next([{ id: 'announcment-id', priority: AnnouncementPriorityType.Important }])
    getAnnouncementByIdMock.next({ id: 'announcment-id', title: 'Announcment title' })

    fixture.detectChanges()

    const bannerElement: HTMLElement = fixture.nativeElement
    const p = bannerElement?.querySelector('.pb-1')
    expect(p?.textContent).toEqual('Announcment title')

    expect(announcementsApiService.getAnnouncementById).toBeCalledWith('announcment-id')
  })
})
