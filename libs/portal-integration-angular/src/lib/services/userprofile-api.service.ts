import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { UserProfile } from '../model/user-profile.model'
import { PlatformLocation } from '@angular/common'

@Injectable({ providedIn: 'root' })
export class UserProfileAPIService {
  private url = './portal-api/v1/userProfile/me'
  private personUrl = './portal-api/v1/userProfile/me/userPerson'
  private avatarUrl = './portal-api/v1/userProfile/me/avatar'
  private settingsUrl = './portal-api/v1/userProfile/me/settings'
  private changePasswordUrl = './portal-api/v1/userProfile/me/change-password'

  constructor(private http: HttpClient, private platformLoc: PlatformLocation) {}

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.platformLoc.getBaseHrefFromDOM() + this.url)
  }
}
