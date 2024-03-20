import { Component } from '@angular/core'
import { catchError, map, Observable, of, switchMap, tap, throwError, EMPTY, mergeMap } from 'rxjs'
import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { AnnouncementItem, AnnouncementPriorityType } from '../../../model/announcement-item'
import { AnnouncementsApiService } from '../../../services/announcements-api.service'

@Component({
  selector: 'ocx-announcement-banner',
  templateUrl: './announcement-banner.component.html',
  styleUrls: ['./announcement-banner.component.css'],
})
export class AnnouncementBannerComponent {
  private currentDate = new Date().toISOString()
  shouldShow = false
  prioItem$: Observable<AnnouncementItem>
  constructor(
    private api: AnnouncementsApiService,
    private configService: ConfigurationService,
    private appStateService: AppStateService
  ) {
    this.prioItem$ = this.appStateService.currentPortal$.pipe(
      mergeMap((portal) =>
        this.api.getAnnouncements(portal.id || '', this.currentDate, this.currentDate).pipe(
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
            return this.appStateService.currentMfe$.pipe(
              mergeMap((mfe) => (mfe ? throwError(() => error) : of({ id: 'ignore-the-error-in-standalone-mode' })))
            )
          })
        )
      )
    )
  }

  hide(id: string) {
    localStorage.setItem('onecx_messages_read_lastid', id)
    this.shouldShow = false
  }
}
