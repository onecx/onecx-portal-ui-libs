import { Component } from '@angular/core'
import { catchError, map, Observable, of, switchMap, tap, throwError, EMPTY } from 'rxjs'
import { AnnouncementItem, AnnouncementPriorityType } from '../../../model/announcement-item'
import { AnnouncementsApiService } from '../../../services/announcements-api.service'
import { ConfigurationService } from '../../../services/configuration.service'

@Component({
  selector: 'ocx-announcement-banner',
  templateUrl: './announcement-banner.component.html',
  styleUrls: ['./announcement-banner.component.css'],
})
export class AnnouncementBannerComponent {
  private currentDate = new Date().toISOString()
  shouldShow = false
  prioItem$: Observable<AnnouncementItem>
  constructor(private api: AnnouncementsApiService, private configService: ConfigurationService) {
    this.prioItem$ = this.api
      .getAnnouncements(this.configService.getPortal().id || '', this.currentDate, this.currentDate)
      .pipe(
        map((results) => results.filter((a) => a.priority === AnnouncementPriorityType.Important)),
        switchMap((data) => {
          if (data[0] == undefined) {
            return EMPTY
          }
          return this.api.getAnnouncementById(data[0].id)
        }),
        tap((firstHighPrio) => {
          this.shouldShow = firstHighPrio.id !== localStorage.getItem('onecx_messages_read_lastid')
        }),
        catchError((error) => {
          return this.configService.areWeRunningAsMFE()
            ? throwError(() => error)
            : of({ id: 'ignore-the-error-in-standalone-mode' })
        })
      )
  }

  hide(id: string) {
    localStorage.setItem('onecx_messages_read_lastid', id)
    this.shouldShow = false
  }
}
