import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AnnouncementItem } from '../model/announcement-item'

@Injectable({
  providedIn: 'root',
})
export class AnnouncementsApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  constructor(private http: HttpClient) {}

  public getAnnouncements(
    appId: string,
    startDateTo: string,
    endDateFrom: string
  ): Observable<Array<AnnouncementItem>> {
    return this.http.get<Array<AnnouncementItem>>(`./ahm-api/announcement-help-management-rs/internal/announcements`, {
      params: { appId: appId, status: 'ACTIVE', startDateTo: startDateTo, endDateFrom: endDateFrom },
      headers: { Accept: 'application/json' },
    })
  }

  public getAnnouncementById(id: string): Observable<AnnouncementItem> {
    return this.http.get<AnnouncementItem>(`./ahm-api/announcement-help-management-rs/internal/announcements/${id}`)
  }
}
