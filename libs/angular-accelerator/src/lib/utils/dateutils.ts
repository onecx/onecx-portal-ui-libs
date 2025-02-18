import { Injectable, LOCALE_ID, inject } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class DateUtils {
  protected locale = inject(LOCALE_ID)

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

/**
 * @deprecated Will be removed. Please use isValidDate() from @onecx/accelerator
 */
export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value as any)
}
