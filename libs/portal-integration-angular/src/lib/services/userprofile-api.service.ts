import { PlatformLocation } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { UserProfile } from '../model/user-profile.model'

@Injectable({ providedIn: 'root' })
export class UserProfileAPIService {
  private http = inject(HttpClient)
  private platformLoc = inject(PlatformLocation)

  private url = './portal-api/v1/userProfile/me'
  private personUrl = './portal-api/v1/userProfile/me/userPerson'
  private avatarUrl = './portal-api/v1/userProfile/me/avatar'
  private settingsUrl = './portal-api/v1/userProfile/me/settings'
  private changePasswordUrl = './portal-api/v1/userProfile/me/change-password'

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.platformLoc.getBaseHrefFromDOM() + this.url)
  }
}
