import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
]

@Pipe({
  name: 'relativeDate',
})
export class RelativeDatePipe implements PipeTransform {
  rtf: Intl.RelativeTimeFormat

  constructor(private translateService: TranslateService) {
    this.rtf = new Intl.RelativeTimeFormat(this.translateService.currentLang, {
      style: 'long',
    })
  }

  transform(value: any): any {
    let date: Date = new Date()
    switch (typeof value) {
      case 'string':
        date = new Date(value)
        break
      case 'object':
        date = value
        break
      default:
        break
    }

    let duration = (date.getTime() - new Date().getTime()) / 1000
    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i]
      if (Math.abs(duration) < division.amount) {
        return this.rtf.format(Math.round(duration), division.name)
      }
      duration /= division.amount
    }
  }
}
