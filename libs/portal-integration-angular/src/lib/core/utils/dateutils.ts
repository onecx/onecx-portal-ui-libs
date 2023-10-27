import { TranslateService } from '@ngx-translate/core'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  constructor(private translateService: TranslateService) {}

  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }

  localizedDate(date: string | number | Date | undefined): string {
    return date
      ? new Intl.DateTimeFormat(this.translateService.getBrowserLang(), this.options).format(
          date instanceof Date ? date : new Date(date)
        )
      : ''
  }
}
