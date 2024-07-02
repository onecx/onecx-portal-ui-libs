import { Inject, Injectable, LOCALE_ID } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  constructor(@Inject(LOCALE_ID) protected locale: string) {}

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
      ? new Intl.DateTimeFormat(this.locale, this.options).format(date instanceof Date ? date : new Date(date))
      : ''
  }
}

export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value as any);
}
