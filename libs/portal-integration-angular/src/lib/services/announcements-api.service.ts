import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { AnnouncementItem } from '../model/announcement-item'

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsApiService {
  private http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  public getAnnouncements(
    appId: string,
    startDateTo: string,
    endDateFrom: string
  ): Observable<Array<AnnouncementItem>> {
    return this.http.get<Array<AnnouncementItem>>(`./ahm-api/internal/announcements`, {
      params: { appId: appId, status: 'ACTIVE', startDateTo: startDateTo, endDateFrom: endDateFrom },
      headers: { Accept: 'application/json' },
    })
  }

  public getAnnouncementById(id: string): Observable<AnnouncementItem> {
    return this.http.get<AnnouncementItem>(`./ahm-api/internal/announcements/${id}`)
  }
}
