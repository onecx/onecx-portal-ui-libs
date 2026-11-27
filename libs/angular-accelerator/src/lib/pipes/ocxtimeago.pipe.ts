import { ChangeDetectorRef, NgZone, OnDestroy, Pipe, PipeTransform, inject } from '@angular/core'
import { TranslatePipe } from '@ngx-translate/core'

interface TimeAgoTimes {
  seconds: number
  minutes: number
  hours: number
  days: number
}

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
    const seconds = this.getDistanceInSeconds(value)
    this.scheduleNextUpdate(seconds)
    if (Number.isNaN(seconds)) {
      return ''
    }
    return this.translateSecondsAgo(seconds)
  }
  override ngOnDestroy(): void {
    this.removeTimer()
    super.ngOnDestroy()
  }
  private getDistanceInSeconds(value: string) {
    const d = new Date(value)
    const now = new Date()
    return Math.round(Math.abs((now.getTime() - d.getTime()) / 1000))
  }
  private scheduleNextUpdate(seconds: number) {
    const timeToUpdate = Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck())
        }, timeToUpdate)
      }
      return null
    })
  }
  private translateSecondsAgo(seconds: number) {
    const minutes = Math.round(Math.abs(seconds / 60))
    const hours = Math.round(Math.abs(minutes / 60))
    const days = Math.round(Math.abs(hours / 24))
    const months = Math.round(Math.abs(days / 30.416))
    const years = Math.round(Math.abs(days / 365))
    const translationKey = this.getTranslationKey({ seconds, minutes, hours, days })
    return super.transform('OCX_TIMEAGO.' + translationKey, { minutes, hours, days, months, years })
  }
  private getTranslationKey(times: TimeAgoTimes) {
    if (times.hours > 36) {
      return this.getDayKey(times)
    }
    return this.getSubDayKey(times)
  }
  private getSubDayKey(times: TimeAgoTimes) {
    if (times.seconds <= 45) {
      return 'A_FEW_SECONDS_AGO'
    } else if (times.seconds <= 90) {
      return 'A_MINUTE_AGO'
    } else if (times.minutes <= 45) {
      return 'MINUTES_AGO'
    } else if (times.minutes <= 90) {
      return 'AN_HOUR_AGO'
    } else if (times.hours <= 22) {
      return 'HOURS_AGO'
    }
    return 'A_DAY_AGO'
  }
  private getDayKey(times: TimeAgoTimes) {
    if (times.days <= 25) {
      return 'DAYS_AGO'
    } else if (times.days <= 45) {
      return 'A_MONTH_AGO'
    } else if (times.days <= 345) {
      return 'MONTHS_AGO'
    } else if (times.days <= 545) {
      return 'A_YEAR_AGO'
    }
    return 'YEARS_AGO'
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
