import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'

@Pipe({
  name: 'timeago',
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/use-pipe-transform-interface
export class OcxTimeAgoPipe extends TranslatePipe implements OnDestroy, PipeTransform {
  private readonly changeDetectorRef: ChangeDetectorRef
  private readonly ngZone = inject(NgZone)

  private timer: number | undefined | null

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef)

    super()

    this.changeDetectorRef = changeDetectorRef
  }
  override transform(value: string) {
    this.removeTimer()
    const d = new Date(value)
    const now = new Date()
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000))
    const timeToUpdate = Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck())
        }, timeToUpdate)
      }
      return null
    })
    const minutes = Math.round(Math.abs(seconds / 60))
    const hours = Math.round(Math.abs(minutes / 60))
    const days = Math.round(Math.abs(hours / 24))
    const months = Math.round(Math.abs(days / 30.416))
    const years = Math.round(Math.abs(days / 365))
    let translationKey = 'UNKNOWN'
    if (Number.isNaN(seconds)) {
      translationKey = 'NAN'
    } else if (seconds <= 45) {
      translationKey = 'A_FEW_SECONDS_AGO'
    } else if (seconds <= 90) {
      translationKey = 'A_MINUTE_AGO'
    } else if (minutes <= 45) {
      translationKey = 'MINUTES_AGO'
    } else if (minutes <= 90) {
      translationKey = 'AN_HOUR_AGO'
    } else if (hours <= 22) {
      translationKey = 'HOURS_AGO'
    } else if (hours <= 36) {
      translationKey = 'A_DAY_AGO'
    } else if (days <= 25) {
      translationKey = 'DAYS_AGO'
    } else if (days <= 45) {
      translationKey = 'A_MONTH_AGO'
    } else if (days <= 345) {
      translationKey = 'MONTHS_AGO'
    } else if (days <= 545) {
      translationKey = 'A_YEAR_AGO'
    } else {
      translationKey = 'YEARS_AGO'
    }
    return super.transform('OCX_TIMEAGO.' + translationKey, { minutes, hours, days, months, years })
  }
  override ngOnDestroy(): void {
    this.removeTimer()
    super.ngOnDestroy()
  }
  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }
  private getSecondsUntilUpdate(seconds: number) {
    const min = 60
    const hr = min * 60
    const day = hr * 24
    if (seconds < min) {
      return 2
    } else if (seconds < hr) {
      return 30
    } else if (seconds < day) {
      return 300
    } else {
      return 3600
    }
  }
}
