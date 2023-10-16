import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { Observable, of } from 'rxjs'

import { API_PREFIX } from '../../../api/constants'
import { UserProfile } from '../../../model/user-profile.model'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ocx-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Input() user$: Observable<UserProfile> | undefined
  @Input() user: UserProfile | undefined

  public apiPrefix = API_PREFIX
  public placeHolderPath = 'onecx-portal-lib/assets/images/default_avatar.png'

  ngOnInit(): void {
    if (this.user) {
      this.user$ = of(this.user)
    }

    //if the imageUrl start with a "http", then it is not from the backend. We do not add a prefix.
    if (this.user?.avatar?.smallImageUrl && this.user?.avatar?.smallImageUrl.match(/^(http|https)/g)) {
      this.apiPrefix = ''
    }
  }
}
