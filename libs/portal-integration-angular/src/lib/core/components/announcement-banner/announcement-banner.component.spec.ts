/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'

import { AnnouncementBannerComponent } from './announcement-banner.component'
import { ConfigurationService } from '../../../services/configuration.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AnnouncementsApiService } from '../../../services/announcements-api.service'
import { Subject } from 'rxjs'
import { AnnouncementItem, AnnouncementPriorityType } from '../../../model/announcement-item'

describe('AnnouncementBannerComponent', () => {
  let component: AnnouncementBannerComponent
  let fixture: ComponentFixture<AnnouncementBannerComponent>
  let announcementsApiService: AnnouncementsApiService
  const getAnnouncementByIdMock = new Subject<AnnouncementItem>()
  const getAnnouncementsMock = new Subject<Array<AnnouncementItem>>()

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnouncementBannerComponent],
      imports: [HttpClientTestingModule],
      providers: [ConfigurationService, AnnouncementsApiService],
    }).compileComponents()

    const configurationService = getTestBed().inject(ConfigurationService)
    configurationService.setPortal({ id: 'i-am-test-portal', portalName: 'test', baseUrl: '', microfrontendRegistrations: [] })

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
