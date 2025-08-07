import { Component, Input } from '@angular/core'
import { BehaviorSubject, first, map, Observable } from 'rxjs'

import { API_PREFIX } from '../../../api/constants'
import { UserProfile } from '../../../model/user-profile.model'

/**
 * TODO: deprecate this before core apps are migrated to v6
 * deprecated Replace with onecx-avatar-image slot
 */
@Component({
  selector: 'ocx-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent {
  @Input() set user$(value: Observable<UserProfile | undefined> | undefined) {
    value?.pipe(first()).subscribe((user) => (this.user = user))
  }
  @Input() set user(value: UserProfile | undefined) {
    this.imagePath$.next(value?.avatar?.smallImageUrl ?? this.placeHolderPath)
  }

  public placeHolderPath = 'onecx-portal-lib/assets/images/default_avatar.png'
  imagePath$ = new BehaviorSubject<string>(this.placeHolderPath)
  apiPrefix$ = this.imagePath$.pipe(
    map((path) => {
      if (path.match(/^(http|https)/g)) {
        return ''
      }
      return API_PREFIX
    })
  )
}
